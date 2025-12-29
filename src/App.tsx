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
        // İpucu: AI genellikle su ve karmaşık dokularda hata yapar
        hint: 'Yapay zeka genellikle su yüzeyindeki yansımaları ve ağaç yapraklarının karmaşık dokusunu tam olarak simüle edemez. Detaylara dikkat et.',
        options: [
            { id: 'r1-real1', isReal: true, url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&q=80' },
            { id: 'r1-real2', isReal: true, url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&q=80' },
            // Hedef: AI
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
            // Hedef: AI
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
            // Hedef AI (Mevcut resimlerden birini AI olarak işaretledik)
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
            // Hedef AI
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

export default function App() {
    const [roundIndex, setRoundIndex] = useState(0)
    const [score, setScore] = useState(0)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [shuffledOptions, setShuffledOptions] = useState<ImageOption[]>([])
    const [timeLeft, setTimeLeft] = useState(10) // 10 Saniye süre

    const currentRoundData = GAME_DATA[roundIndex]
    // Oyun o round için bitti mi? (Süre bitti veya seçim yapıldı)
    const isRoundOver = selectedId !== null || timeLeft === 0
    const isGameFinished = roundIndex >= GAME_DATA.length

    // Round değiştiğinde verileri hazırla
    useEffect(() => {
        if (currentRoundData) {
            const mixed = [...currentRoundData.options].sort(() => Math.random() - 0.5)
            setShuffledOptions(mixed)
            setSelectedId(null)
            setTimeLeft(10)
        }
    }, [roundIndex])

    // Geri sayım sayacı
    useEffect(() => {
        if (!isRoundOver && !isGameFinished && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [timeLeft, isRoundOver, isGameFinished])

    const handleSelect = (option: ImageOption) => {
        if (!isRoundOver) {
            setSelectedId(option.id)
            // MANTIK: Yapay Zeka (isReal: false) seçilirse puan kazanır
            // Yani option.isReal === false ise DOĞRU cevap
            if (!option.isReal) {
                setScore(prev => prev + 1)
            }
        }
    }

    const nextRound = () => {
        setRoundIndex(prev => prev + 1)
    }

    const restartGame = () => {
        setScore(0)
        setRoundIndex(0)
    }

    if (isGameFinished) {
        return (
            <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui' }} className="fade-in">
                <h1>Oyun Bitti! 🏁</h1>
                <h2>Toplam Puan: <span style={{color: score > 2 ? '#28a745' : '#dc3545'}}>{score}</span> / {GAME_DATA.length}</h2>
                <button
                    onClick={restartGame}
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

    // Progress Bar Yüzdesi
    const progressPercent = (roundIndex / GAME_DATA.length) * 100

    return (
        <div style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: 24, maxWidth: 800, margin: '0 auto' }}>

            {/* Üst Bilgi Paneli */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 15, padding: '15px 20px', background: '#f8f9fa', borderRadius: 12,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <div style={{textAlign: 'left'}}>
                    <div style={{fontSize: 12, color:'#888', textTransform:'uppercase', letterSpacing:1}}>Bölüm</div>
                    <div style={{fontSize: 18, fontWeight: 'bold', color: '#333'}}>{roundIndex + 1} / {GAME_DATA.length}</div>
                </div>

                <div style={{textAlign: 'center'}}>
                    <div style={{fontSize: 12, color:'#888', textTransform:'uppercase', letterSpacing:1}}>Süre</div>
                    <div style={{
                        fontSize: 24, fontWeight: 'bold',
                        color: timeLeft <= 3 ? '#e74c3c' : '#2c3e50',
                        fontVariantNumeric: 'tabular-nums'
                    }}>
                        {timeLeft}s
                    </div>
                </div>

                <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: 12, color:'#888', textTransform:'uppercase', letterSpacing:1}}>Puan</div>
                    <div style={{fontSize: 18, fontWeight: 'bold', color: '#27ae60'}}>{score}</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
            </div>

            <h2 style={{ marginBottom: 25, textAlign: 'center', fontSize: '1.5rem' }}>
                <span style={{color: '#6c757d', display: 'block', fontSize: '1rem', marginBottom: 5}}>{currentRoundData.theme}</span>
                Hangisi <span style={{textDecoration: 'underline', textDecorationColor: '#e74c3c', color: '#e74c3c'}}>YAPAY ZEKA (AI)</span>?
            </h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                {shuffledOptions.map((option) => {
                    let borderStyle = '4px solid transparent'
                    let overlayContent = null
                    let className = ''

                    if (isRoundOver) {
                        // AI (isReal: false) olan doğru cevaptır.
                        
                        if (!option.isReal) {
                            // Bu SEÇENEK doğru cevap (AI)
                            if (option.id === selectedId) {
                                // Kullanıcı bunu seçtiyse: YEŞİL
                                borderStyle = '4px solid #28a745'
                                overlayContent = <div style={{...overlayStyle, background: 'rgba(40, 167, 69, 0.9)'}}>YAPAY ZEKA ✅</div>
                            } else {
                                // Kullanıcı seçmedi ama doğru cevap buydu: YEŞİL GÖSTER (Görmesi için)
                                borderStyle = '4px solid #28a745'
                                overlayContent = <div style={{...overlayStyle, background: 'rgba(40, 167, 69, 0.6)'}}>YAPAY ZEKA</div>
                            }
                        } else {
                            // Bu SEÇENEK gerçek fotoğraf (Yanlış cevap)
                            if (option.id === selectedId) {
                                // Kullanıcı bunu seçtiyse: KIRMIZI ve TİTREME
                                borderStyle = '4px solid #dc3545'
                                overlayContent = <div style={{...overlayStyle, background: 'rgba(220, 53, 69, 0.9)'}}>GERÇEK FOTOĞRAF 📷</div>
                                className = 'shake-animation'
                            } else {
                                // Diğer gerçek fotolar sönükleşsin
                                overlayContent = <div style={{...overlayStyle, background: 'rgba(0,0,0, 0.4)'}}>GERÇEK</div>
                            }
                        }

                    } else if (selectedId === option.id) {
                        borderStyle = '4px solid #007bff'
                    }

                    return (
                        <div
                            key={option.id}
                            className={className}
                            onClick={() => handleSelect(option)}
                            style={{
                                ...boxBaseStyle,
                                border: borderStyle,
                                transform: selectedId === option.id ? 'scale(0.96)' : 'scale(1)',
                                opacity: (isRoundOver && option.isReal && option.id !== selectedId) ? 0.5 : 1 // Doğru cevaba odaklan (AI olanlar hariç diğerlerini sönükleştir)
                            }}
                        >
                            <img
                                src={option.url}
                                alt="Görsel"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {isRoundOver && overlayContent}
                        </div>
                    )
                })}
            </div>

            <div style={{ marginTop: 30, textAlign: 'center', minHeight: 100 }}>
                {isRoundOver ? (
                    <div className="fade-in">
                        {timeLeft === 0 && selectedId === null ? (
                            <h3 style={{ color: '#e74c3c', margin: 0 }}>⏰ Süre doldu! Bir seçim yapamadın.</h3>
                        ) : !shuffledOptions.find(o => o.id === selectedId)?.isReal ? (
                            <h3 style={{ color: '#28a745', margin: 0 }}>Tebrikler! Yapay zekayı tespit ettin. 🎯</h3>
                        ) : (
                            <h3 style={{ color: '#dc3545', margin: 0 }}>Maalesef... Bu gerçek bir fotoğraftı! 📸</h3>
                        )}
                        
                        <button
                            onClick={nextRound}
                            style={{
                                padding: '12px 30px', fontSize: 16, fontWeight: 'bold', cursor: 'pointer',
                                background: '#333', color: 'white', border: 'none', borderRadius: 50,
                                marginTop: 15, boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                            }}
                        >
                            Sıradaki Bölüm →
                        </button>
                    </div>
                ) : (
                    <p style={{ color: '#888', fontStyle: 'italic', marginTop: 20 }}>
                        3 görselden biri yapay zeka tarafından üretildi. Dikkatli bak!
                    </p>
                )}
            </div>
        </div>
    )
}