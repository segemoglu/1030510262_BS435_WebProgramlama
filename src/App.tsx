import React, { useState, useEffect } from 'react'
import './App.css'

type ImageOption = {
    id: string
    url: string
    isReal: boolean
}

type RoundData = {
    id: number
    theme: string
    options: ImageOption[]
}

const GAME_DATA: RoundData[] = [
    {
        id: 1,
        theme: 'Doğa Manzarası',
        options: [
            { id: 'r1-real', isReal: true, url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&q=80' },
            { id: 'r1-ai1', isReal: false, url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&q=80' },
            { id: 'r1-ai2', isReal: false, url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80' },
        ]
    },
    {
        id: 2,
        theme: 'Portre / Model',
        options: [
            { id: 'r2-ai1', isReal: false, url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80' },
            { id: 'r2-real', isReal: true, url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
            { id: 'r2-ai2', isReal: false, url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80' },
        ]
    },
    {
        id: 3,
        theme: 'Spor Arabalar',
        options: [
            { id: 'r3-ai1', isReal: false, url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&q=80' },
            { id: 'r3-ai2', isReal: false, url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80' },
            { id: 'r3-real', isReal: true, url: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=400&q=80' },
        ]
    },
    {
        id: 4,
        theme: 'Futbolcular',
        options: [
            { id: 'r4-real', isReal: true, url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80' },
            { id: 'r4-ai1', isReal: false, url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80' },
            { id: 'r4-ai2', isReal: false, url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&q=80' },
        ]
    }
]

const boxBaseStyle: React.CSSProperties = {
    width: 220,
    height: 220,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 12,
    borderRadius: 12,
    cursor: 'pointer',
    userSelect: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease',
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
    backdropFilter: 'blur(2px)'
}

export default function App() {
    const [roundIndex, setRoundIndex] = useState(0)
    const [score, setScore] = useState(0)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [shuffledOptions, setShuffledOptions] = useState<ImageOption[]>([])

    const currentRoundData = GAME_DATA[roundIndex]
    const isGameOver = selectedId !== null
    const isGameFinished = roundIndex >= GAME_DATA.length

    useEffect(() => {
        if (currentRoundData) {
            const mixed = [...currentRoundData.options].sort(() => Math.random() - 0.5)
            setShuffledOptions(mixed)
            setSelectedId(null)
        }
    }, [roundIndex])

    const handleSelect = (option: ImageOption) => {
        if (!isGameOver) {
            setSelectedId(option.id)
            if (option.isReal) {
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
            <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui' }}>
                <h1>Oyun Bitti! 🏁</h1>
                <h2>Toplam Skor: {score} / {GAME_DATA.length}</h2>
                <button
                    onClick={restartGame}
                    style={{
                        padding: '12px 24px', fontSize: 18, background: '#007bff', color: 'white',
                        border: 'none', borderRadius: 8, cursor: 'pointer', marginTop: 20
                    }}
                >
                    Tekrar Oyna
                </button>
            </div>
        )
    }

    return (
        <div style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: 24, maxWidth: 800, margin: '0 auto' }}>
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 20, padding: '10px 20px', background: '#f8f9fa', borderRadius: 10
            }}>
        <span style={{ fontSize: 18, fontWeight: 'bold', color: '#555' }}>
          Bölüm: {roundIndex + 1} / {GAME_DATA.length}
        </span>
                <span style={{ fontSize: 20, fontWeight: 'bold', color: '#2c3e50' }}>
          Tema: <span style={{ color: '#e67e22' }}>{currentRoundData.theme}</span>
        </span>
                <span style={{ fontSize: 18, fontWeight: 'bold', color: '#28a745' }}>
          Puan: {score}
        </span>
            </div>

            <h2 style={{ marginBottom: 20, textAlign: 'center' }}>
                Hangisi <span style={{textDecoration: 'underline'}}>GERÇEK</span> fotoğraf?
            </h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                {shuffledOptions.map((option) => {
                    let borderStyle = '4px solid transparent'
                    let overlayContent = null

                    if (isGameOver) {
                        if (option.isReal) {
                            borderStyle = '4px solid #28a745'
                            overlayContent = <div style={{...overlayStyle, background: 'rgba(40, 167, 69, 0.8)'}}>GERÇEK ✅</div>
                        } else if (option.id === selectedId && !option.isReal) {
                            borderStyle = '4px solid #dc3545'
                            overlayContent = <div style={{...overlayStyle, background: 'rgba(220, 53, 69, 0.8)'}}>YAPAY ZEKA 🤖</div>
                        } else {
                            overlayContent = <div style={{...overlayStyle, background: 'rgba(0,0,0, 0.5)'}}>YAPAY ZEKA 🤖</div>
                        }
                    } else if (selectedId === option.id) {
                        borderStyle = '4px solid #007bff'
                    }

                    return (
                        <div
                            key={option.id}
                            onClick={() => handleSelect(option)}
                            style={{
                                ...boxBaseStyle,
                                border: borderStyle,
                                transform: selectedId === option.id ? 'scale(0.98)' : 'scale(1)',
                                opacity: (isGameOver && !option.isReal && option.id !== selectedId) ? 0.5 : 1
                            }}
                        >
                            <img
                                src={option.url}
                                alt="Görsel"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {isGameOver && overlayContent}
                        </div>
                    )
                })}
            </div>

            <div style={{ marginTop: 30, textAlign: 'center', height: 100 }}>
                {isGameOver ? (
                    <div style={{ animation: 'fadeIn 0.5s' }}>
                        {shuffledOptions.find(o => o.id === selectedId)?.isReal ? (
                            <h3 style={{ color: '#28a745', margin: 0 }}>Tebrikler! Doğru bildin. 🎉</h3>
                        ) : (
                            <h3 style={{ color: '#dc3545', margin: 0 }}>Maalesef... Bu bir yapay zeka çizimiydi! 🤖</h3>
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
                    <p style={{ color: '#888', fontStyle: 'italic' }}>
                        Dikkatli bak, detaylar ele verir...
                    </p>
                )}
            </div>
        </div>
    )
}