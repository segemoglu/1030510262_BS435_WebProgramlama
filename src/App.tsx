// App.tsx
import React, { useState } from 'react'

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
}

export default function App() {
    const [selected, setSelected] = useState<number | null>(null)

    const boxes = ['Bir', 'İki', 'Üç']

    return (
        <div style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: 24 }}>
            <h2 style={{ marginBottom: 12 }}>Bir kutuya tıkla</h2>

            <div style={{ display: 'flex', gap: 8 }}>
                {boxes.map((label, i) => {
                    const isSelected = selected === i
                    const style: React.CSSProperties = {
                        ...boxBaseStyle,
                        background: isSelected ? '#e6f0ff' : '#f5f5f5',
                        border: isSelected ? '2px solid #2b6cff' : '2px solid transparent',
                        transform: isSelected ? 'translateY(-2px)' : undefined,
                    }

                    // accessible keyboard interaction: Enter ve Space ile seç
                    const onKeyDown = (e: React.KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setSelected(i)
                        }
                    }

                    return (
                        <div
                            key={i}
                            role="button"
                            tabIndex={0}
                            aria-pressed={isSelected}
                            onClick={() => setSelected(i)}
                            onKeyDown={onKeyDown}
                            style={style}
                        >
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 20, fontWeight: 600 }}>{label}</div>
                                <div style={{ marginTop: 6, fontSize: 12, color: '#444' }}>
                                    {isSelected ? 'Seçili' : 'Seçmek için tıkla'}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div style={{ marginTop: 20 }}>
                {selected === null ? (
                    <div>Henüz bir kutu seçilmedi.</div>
                ) : (
                    <div>
                        <strong>{boxes[selected]}</strong> kutusunu seçtiniz.
                    </div>
                )}
            </div>
        </div>
    )
}
