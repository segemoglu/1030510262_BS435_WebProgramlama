import React, { useState } from 'react'
import './App.css'

const boxBaseStyle: React.CSSProperties = {
    width: 160,
    height: 120,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 12,
    borderRadius: 8,
    cursor: 'pointer',
    userSelect: 'none',
    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
    transition: 'all 0.3s ease',
}

export default function App() {
    const [selected, setSelected] = useState<number | null>(null)
    // Doğru cevabı state içinde tutuyoruz ki değiştirebilelim
    const [correctIndex, setCorrectIndex] = useState(() => Math.floor(Math.random() * 3))

    // Yeni eklenen state'ler
    const [score, setScore] = useState(0)
    const [round, setRound] = useState(1)

    const boxes = ['Bir', 'İki', 'Üç']
    const isGameOver = selected !== null

    const handleSelect = (index: number) => {
        if (!isGameOver) {
            setSelected(index)

            // Puan hesaplama mantığı
            if (index === correctIndex) {
                setScore(prev => prev + 1)
            }
            // Yanlışsa puan değişmiyor
        }
    }

    // Yeni bölüme geçiş fonksiyonu
    const nextRound = () => {
        setSelected(null) // Seçimi sıfırla
        setCorrectIndex(Math.floor(Math.random() * 3)) // Yeni doğru cevap belirle
        setRound(prev => prev + 1) // Bölümü artır
    }

    return (
        <div style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: 24 }}>
            {/* Skor Tablosu */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 20,
                fontSize: 18,
                fontWeight: 'bold',
                color: '#444'
            }}>
                <span>Bölüm: {round}</span>
                <span>Puan: {score}</span>
            </div>

            <h2 style={{ marginBottom: 12, textAlign: 'center' }}>Bir kutuya tıkla</h2>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                {boxes.map((label, i) => {
                    let bgColor = '#f5f5f5'
                    let borderColor = 'transparent'
                    let textColor = 'black'

                    if (isGameOver) {
                        if (i === correctIndex) {
                            bgColor = '#d4edda'
                            borderColor = '#28a745'
                            textColor = '#155724'
                        } else {
                            bgColor = '#f8d7da'
                            borderColor = '#dc3545'
                            textColor = '#721c24'
                        }
                    } else if (selected === i) {
                        bgColor = '#e6f0ff'
                        borderColor = '#2b6cff'
                    }

                    const style: React.CSSProperties = {
                        ...boxBaseStyle,
                        background: bgColor,
                        border: `2px solid ${borderColor}`,
                        color: textColor,
                        transform: selected === i ? 'scale(1.05)' : undefined,
                        opacity: (isGameOver && i !== selected && i !== correctIndex) ? 0.6 : 1,
                        cursor: isGameOver ? 'default' : 'pointer'
                    }

                    return (
                        <div
                            key={i}
                            onClick={() => handleSelect(i)}
                            style={style}
                        >
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 20, fontWeight: 600 }}>{label}</div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div style={{ marginTop: 30, fontSize: 24, fontWeight: 'bold', textAlign: 'center', height: 80 }}>
                {isGameOver ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                        {selected === correctIndex ? (
                            <span style={{ color: '#28a745' }}>Doğru! 🎉</span>
                        ) : (
                            <span style={{ color: '#dc3545' }}>Yanlış! 😔</span>
                        )}

                        {/* Sonraki Bölüm Butonu */}
                        <button
                            onClick={nextRound}
                            style={{
                                padding: '10px 20px',
                                fontSize: 16,
                                cursor: 'pointer',
                                background: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: 5,
                                marginTop: 10
                            }}
                        >
                            Sıradaki Bölüm →
                        </button>
                    </div>
                ) : (
                    <span style={{ fontSize: 16, color: '#666' }}>Şansını dene...</span>
                )}
            </div>
        </div>
    )
}