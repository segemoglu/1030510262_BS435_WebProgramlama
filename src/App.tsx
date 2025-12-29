import React, { useState, useEffect } from 'react'
import './App.css'

type ImageOption = {
    id: string
    url: string
    isReal: boolean // true: Gerçek Fotoğraf, false: Yapay Zeka (AI)
}

type RoundData = {
    id: number
    theme: string
    hint: string // İpucu metni
    options: ImageOption[]
}

const GAME_DATA: RoundData[] = [
    {
        id: 1,
        theme: 'Doğa Manzarası',
        hint: 'Yapay zeka genellikle su yüzeyindeki yansımaları ve ağaç yapraklarının karmaşık dokusunu tam olarak simüle edemez. Detaylara dikkat et.',
        options: [
            { id: 'r1-real1', isReal: true, url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&q=80' },
            { id: 'r1-real2', isReal: true, url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&q=80' },
            { id: 'r1-ai', isReal: false, url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80' },
        ]
    },
    {
        id: 2,
        theme: 'Portre / Model',
        hint: 'Göz bebeklerindeki yansımaların simetrisi, dişlerin yapısı ve cilt dokusunun aşırı pürüzsüzlüğü yapay zekayı ele verebilir.',
        options: [
            { id: 'r2-real1', isReal: true, url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80' },
            { id: 'r2-real2', isReal: true, url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
            { id: 'r2-ai', isReal: false, url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80' },
        ]
    },
    {
        id: 3,
        theme: 'Spor Arabalar',
        hint: 'Araba logosundaki bozulmalar, yazılardaki anlamsızlıklar veya arka plandaki objelerin (yol çizgileri vb.) tutarsızlığına bak.',
        options: [
            { id: 'r3-real1', isReal: true, url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&q=80' },
            { id: 'r3-real2', isReal: true, url: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=400&q=80' },
            { id: 'r3-ai', isReal: false, url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80' },
        ]
    },
    {
        id: 4,
        theme: 'Futbolcular',
        hint: 'Formalardaki logolar, sponsor yazıları veya stadyum seyircilerinin yüzlerindeki bozulmalar en büyük ipuçlarıdır.',
        options: [
            { id: 'r4-real1', isReal: true, url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80' },
            { id: 'r4-real2', isReal: true, url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80' },
            { id: 'r4-ai', isReal: false, url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&q=80' },
        ]
    }
]

// Sabit stiller
const boxBaseStyle: React.CSSProperties = {
    width: 220,
    height: 220,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderRadius: 12,
    cursor: 'pointer',
    userSelect: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'transform 0.2s ease, opacity 0.3s ease',
    overflow: 'hidden',
    position: 'relative',
    background: '#fff'
}

const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '8px',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
    backdropFilter: 'blur(4px)'
}

type GameState = 'START' | 'PLAY' | 'FINISHED'

export default function App() {
    const [gameState, setGameState] = useState<GameState>('START')
    const [roundIndex, setRoundIndex] = useState(0)
    const [score, setScore] = useState(0)

    // Oyun içi state
    const [selectedId, setSelectedId] = useState<string | null>(null) // En son seçilen (Oyun sonlanan)
    const [shuffledOptions, setShuffledOptions] = useState<ImageOption[]>([])
    const [timeLeft, setTimeLeft] = useState(20) // Süreyi biraz artırdık (20sn) ipucu okunabilsin diye

    // Yeni eklenenler (İpucu ve İkinci Şans için)
    const [eliminatedIds, setEliminatedIds] = useState<string[]>([]) // Yanlış seçilip elenenler
    const [showHint, setShowHint] = useState(false) // İpucu gösterilsin mi?

    const currentRoundData = GAME_DATA[roundIndex]

    // Tur Bitiş Kontrolü: 
    // Süre biterse VEYA Doğru Cevap (AI) seçilirse VEYA İkinci yanlış yapılırsa
    const isRoundOver = selectedId !== null || timeLeft === 0

    useEffect(() => {
        if (gameState === 'PLAY' && currentRoundData) {
            const mixed = [...currentRoundData.options].sort(() => Math.random() - 0.5)
            setShuffledOptions(mixed)
            setSelectedId(null)
            setEliminatedIds([]) // Sıfırla
            setShowHint(false) // Sıfırla
            setTimeLeft(20)
        }
    }, [gameState, roundIndex])

    useEffect(() => {
        if (gameState === 'PLAY' && !isRoundOver && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [gameState, timeLeft, isRoundOver])

    const handleStartGame = () => {
        setScore(0)
        setRoundIndex(0)
        setGameState('PLAY')
    }

    const handleSelect = (option: ImageOption) => {
        if (isRoundOver) return
        if (eliminatedIds.includes(option.id)) return // Zaten elenmişe tıklanamaz

        if (!option.isReal) {
            // DOĞRU CEVAP (Yapay Zeka)
            setSelectedId(option.id)
            setScore(prev => prev + 1)
        } else {
            // YANLIŞ CEVAP (Gerçek Fotoğraf)
            if (eliminatedIds.length === 0) {
                // İLK HATA -> İpucu Göster, Seçeneği Ele
                setEliminatedIds(prev => [...prev, option.id])
                setShowHint(true)
            } else {
                // İKİNCİ HATA -> Oyun Biter
                setSelectedId(option.id)
                // Puan yok
            }
        }
    }

    const nextRound = () => {
        if (roundIndex < GAME_DATA.length - 1) {
            setRoundIndex(prev => prev + 1)
        } else {
            setGameState('FINISHED')
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                                EKRANLAR                                    */
    /* -------------------------------------------------------------------------- */

    if (gameState === 'START') {
        return (
            <div style={{
                fontFamily: 'system-ui', maxWidth: 600, margin: '50px auto',
                padding: 40, textAlign: 'center', background: 'white',
                borderRadius: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: 10 }}>🤖 AI vs REAL 📸</h1>
                <p style={{ fontSize: '1.2rem', color: '#666' }}>
                    Yapay zeka ile gerçek dünyayı ayırt edebilir misin?
                </p>

                <div style={{ textAlign: 'left', background: '#f8f9fa', padding: 20, borderRadius: 10, margin: '30px 0' }}>
                    <h3 style={{ marginTop: 0 }}>Nasıl Oynanır?</h3>
                    <ul style={{ lineHeight: '1.6', color: '#444' }}>
                        <li>Her bölümde karşına <strong>3 görsel</strong> çıkacak.</li>
                        <li><strong>1 tanesi Yapay Zeka (AI)</strong>, diğerleri gerçek.</li>
                        <li>Yanlış yaparsan üzülme! <strong>Bir ipucu</strong> ve <strong>ikinci şans</strong> seni bekliyor.</li>
                        <li>Süren kısıtlı, dikkatli bak! 👀</li>
                    </ul>
                </div>

                <button
                    onClick={handleStartGame}
                    style={{
                        padding: '15px 40px', fontSize: 20, fontWeight: 'bold',
                        background: '#007bff', color: 'white', border: 'none',
                        borderRadius: 50, cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,123,255,0.3)',
                        transition: 'transform 0.1s'
                    }}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    OYUNA BAŞLA
                </button>
            </div>
        )
    }

    if (gameState === 'FINISHED') {
        return (
            <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui' }} className="fade-in">
                <h1>Oyun Bitti! 🏁</h1>
                <div style={{ fontSize: 80, margin: '20px 0' }}>
                    {score === GAME_DATA.length ? '🏆' : score > GAME_DATA.length / 2 ? '😎' : '🤔'}
                </div>
                <h2>Toplam Puan: <span style={{ color: score > 2 ? '#28a745' : '#dc3545' }}>{score}</span> / {GAME_DATA.length}</h2>
                <button
                    onClick={handleStartGame}
                    style={{
                        padding: '12px 30px', fontSize: 18, background: '#007bff', color: 'white',
                        border: 'none', borderRadius: 8, cursor: 'pointer', marginTop: 20
                    }}
                >
                    Tekrar Oyna
                </button>
            </div>
        )
    }

    const progressPercent = (roundIndex / GAME_DATA.length) * 100

    return (
        <div style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: 24, maxWidth: 800, margin: '0 auto' }}>

            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 15, padding: '15px 20px', background: '#f8f9fa', borderRadius: 12,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Bölüm</div>
                    <div style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>{roundIndex + 1} / {GAME_DATA.length}</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Süre</div>
                    <div style={{
                        fontSize: 24, fontWeight: 'bold',
                        color: timeLeft <= 5 ? '#e74c3c' : '#2c3e50',
                        fontVariantNumeric: 'tabular-nums'
                    }}>
                        {timeLeft}s
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Puan</div>
                    <div style={{ fontSize: 18, fontWeight: 'bold', color: '#27ae60' }}>{score}</div>
                </div>
            </div>

            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
            </div>

            <h2 style={{ marginBottom: 25, textAlign: 'center', fontSize: '1.5rem' }}>
                <span style={{ color: '#6c757d', display: 'block', fontSize: '1rem', marginBottom: 5 }}>{currentRoundData.theme}</span>
                Hangisi <span style={{ textDecoration: 'underline', textDecorationColor: '#e74c3c', color: '#e74c3c' }}>YAPAY ZEKA (AI)</span>?
            </h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                {shuffledOptions.map((option) => {
                    // Durum Kontrolleri
                    const isEliminated = eliminatedIds.includes(option.id)
                    const isSelected = selectedId === option.id

                    let borderStyle = '4px solid transparent'
                    let overlayContent = null
                    let opacity = 1

                    if (isRoundOver) {
                        // Oyun Bittiğinde Her Şeyi Açıkla
                        if (!option.isReal) {
                            // Doğru Cevap (AI)
                            borderStyle = '4px solid #28a745'
                            overlayContent = <div style={{ ...overlayStyle, background: 'rgba(40, 167, 69, 0.9)' }}>YAPAY ZEKA ✅</div>
                        } else if (isSelected) {
                            // Yanlış Seçim (Son yapılan yanlış seçim)
                            borderStyle = '4px solid #dc3545'
                            overlayContent = <div style={{ ...overlayStyle, background: 'rgba(220, 53, 69, 0.9)' }}>GERÇEK 📷</div>
                        } else {
                            opacity = 0.5
                        }
                    } else {
                        // Oyun Devam Ediyor
                        if (isEliminated) {
                            // Elenen şık (İlk yanlış)
                            opacity = 0.4
                            borderStyle = '4px solid #ccc'
                            overlayContent = <div style={{ ...overlayStyle, background: 'rgba(0,0,0,0.5)' }}>YANLIŞ ❌</div>
                        }
                    }

                    return (
                        <div
                            key={option.id}
                            onClick={() => handleSelect(option)}
                            style={{
                                ...boxBaseStyle,
                                border: borderStyle,
                                opacity: opacity,
                                transform: isSelected ? 'scale(0.98)' : 'scale(1)',
                                cursor: (isRoundOver || isEliminated) ? 'default' : 'pointer'
                            }}
                        >
                            <img
                                src={option.url}
                                alt="Görsel"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {overlayContent}
                        </div>
                    )
                })}
            </div>

            {/* İPUCU KUTUSU */}
            {showHint && !isRoundOver && (
                <div className="fade-in" style={{
                    marginTop: 20, padding: 15, background: '#fff3cd', color: '#856404',
                    borderRadius: 8, border: '1px solid #ffeeba', maxWidth: 600, marginInline: 'auto'
                }}>
                    <strong>💡 İpucu:</strong> {currentRoundData.hint}
                </div>
            )}

            <div style={{ marginTop: 30, textAlign: 'center', minHeight: 100 }}>
                {isRoundOver ? (
                    <div className="fade-in">
                        {timeLeft === 0 && selectedId === null ? (
                            <h3 style={{ color: '#e74c3c' }}>⏰ Süre doldu!</h3>
                        ) : !shuffledOptions.find(o => o.id === selectedId)?.isReal ? (
                            <h3 style={{ color: '#28a745' }}>Tebrikler! Doğru Bildin. 🎯</h3>
                        ) : (
                            <h3 style={{ color: '#dc3545' }}>Maalesef... Bilemedin. 😔</h3>
                        )}

                        <button
                            onClick={nextRound}
                            style={{
                                padding: '12px 30px', fontSize: 16, fontWeight: 'bold', cursor: 'pointer',
                                background: '#333', color: 'white', border: 'none', borderRadius: 50,
                                marginTop: 15, boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                            }}
                        >
                            {roundIndex < GAME_DATA.length - 1 ? 'Sıradaki Bölüm →' : 'Sonucu Gör →'}
                        </button>
                    </div>
                ) : (
                    <p style={{ color: '#888', fontStyle: 'italic', marginTop: 20 }}>
                        {showHint ? 'İpucuna bakıp tekrar dene!' : '3 görselden biri yapay zeka.'}
                    </p>
                )}
            </div>
        </div>
    )
}