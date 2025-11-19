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
    // Doğru cevabı rastgele belirle (0, 1 veya 2)
    const [correctIndex] = useState(() => Math.floor(Math.random() * 3))

    const boxes = ['Bir', 'İki', 'Üç']
    const isGameOver = selected !== null

    const handleSelect = (index: number) => {
        if (!isGameOver) {
            setSelected(index)
        }
    }

    return (
        <div style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: 24 }}>
            <h2 style={{ marginBottom: 12 }}>Bir kutuya tıkla</h2>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                {boxes.map((label, i) => {
                    // Renk Mantığı:
                    // Seçim yapıldıysa: Doğru kutu YEŞİL, Yanlış kutular KIRMIZI
                    // Seçim yapılmadıysa: Standart GRİ
                    let bgColor = '#f5f5f5'
                    let borderColor = 'transparent'
                    let textColor = 'black'

                    if (isGameOver) {
                        if (i === correctIndex) {
                            bgColor = '#d4edda' // Yeşil (Doğru)
                            borderColor = '#28a745'
                            textColor = '#155724'
                        } else {
                            bgColor = '#f8d7da' // Kırmızı (Yanlış)
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
                        opacity: (isGameOver && i !== selected && i !== correctIndex) ? 0.6 : 1, // Seçilmeyen yanlışları biraz soluk yap
                        cursor: isGameOver ? 'default' : 'pointer'
                    }

                    const onKeyDown = (e: React.KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleSelect(i)
                        }
                    }

                    return (
                        <div
                            key={i}
                            role="button"
                            tabIndex={isGameOver ? -1 : 0}
                            onClick={() => handleSelect(i)}
                            onKeyDown={onKeyDown}
                            style={style}
                        >
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 20, fontWeight: 600 }}>{label}</div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div style={{ marginTop: 30, fontSize: 24, fontWeight: 'bold' }}>
                {isGameOver ? (
                    selected === correctIndex ? (
                        <span style={{ color: '#28a745' }}>Doğru! 🎉</span>
                    ) : (
                        <span style={{ color: '#dc3545' }}>Yanlış! 😔</span>
                    )
                ) : (
                    <span style={{ fontSize: 16, color: '#666' }}>Şansını dene...</span>
                )}
            </div>
        </div>
    )
}