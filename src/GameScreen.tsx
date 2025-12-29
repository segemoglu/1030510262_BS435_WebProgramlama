import React from 'react'
import type { ImageOption, RoundData, GameMode } from './types'

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

type GameScreenProps = {
    roundIndex: number
    totalRounds: number
    timeLeft: number
    score: number
    roundData: RoundData
    shuffledOptions: ImageOption[]
    selectedId: string | null
    eliminatedIds: string[]
    showHint: boolean
    gameMode: GameMode
    isRoundOver: boolean
    onSelect: (option: ImageOption) => void
    onNextRound: () => void
}

export default function GameScreen({
    roundIndex, totalRounds, timeLeft, score,
    roundData, shuffledOptions, selectedId, eliminatedIds,
    showHint, gameMode, isRoundOver, onSelect, onNextRound
}: GameScreenProps) {

    const progressPercent = (roundIndex / totalRounds) * 100

    return (
        <div style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: 24, maxWidth: 800, margin: '0 auto' }}>

            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 15, padding: '15px 20px', background: '#f8f9fa', borderRadius: 12,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>
                        {gameMode === 'NORMAL' ? 'Normal Mod' : '🔥 Zor Mod'}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>{roundIndex + 1} / {totalRounds}</div>
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
                <span style={{ color: '#6c757d', display: 'block', fontSize: '1rem', marginBottom: 5 }}>{roundData.theme}</span>
                Hangisi <span style={{ textDecoration: 'underline', textDecorationColor: '#e74c3c', color: '#e74c3c' }}>YAPAY ZEKA (AI)</span>?
            </h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                {shuffledOptions.map((option) => {
                    const isEliminated = eliminatedIds.includes(option.id)
                    const isSelected = selectedId === option.id

                    let borderStyle = '4px solid transparent'
                    let overlayContent = null
                    let opacity = 1

                    if (isRoundOver) {
                        if (!option.isReal) {
                            borderStyle = '4px solid #28a745'
                            overlayContent = <div style={{ ...overlayStyle, background: 'rgba(40, 167, 69, 0.9)' }}>YAPAY ZEKA ✅</div>
                        } else if (isSelected) {
                            borderStyle = '4px solid #dc3545'
                            overlayContent = <div style={{ ...overlayStyle, background: 'rgba(220, 53, 69, 0.9)' }}>GERÇEK 📷</div>
                        } else {
                            opacity = 0.5
                        }
                    } else {
                        if (isEliminated) {
                            opacity = 0.4
                            borderStyle = '4px solid #ccc'
                            overlayContent = <div style={{ ...overlayStyle, background: 'rgba(0,0,0,0.5)' }}>YANLIŞ ❌</div>
                        }
                    }

                    return (
                        <div
                            key={option.id}
                            onClick={() => onSelect(option)}
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

            {/* İPUCU KUTUSU (Sadece Normal Modda ve Gösterilecekse) */}
            {showHint && !isRoundOver && gameMode === 'NORMAL' && (
                <div className="fade-in" style={{
                    marginTop: 20, padding: 15, background: '#fff3cd', color: '#856404',
                    borderRadius: 8, border: '1px solid #ffeeba', maxWidth: 600, marginInline: 'auto'
                }}>
                    <strong>💡 İpucu:</strong> {roundData.hint}
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
                            onClick={onNextRound}
                            style={{
                                padding: '12px 30px', fontSize: 16, fontWeight: 'bold', cursor: 'pointer',
                                background: '#333', color: 'white', border: 'none', borderRadius: 50,
                                marginTop: 15, boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                            }}
                        >
                            {roundIndex < totalRounds - 1 ? 'Sıradaki Bölüm →' : 'Sonucu Gör →'}
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
