import React from 'react'
import type { GameMode } from './types'

type ResultScreenProps = {
    score: number
    totalRounds: number
    gameMode: GameMode
    onRestart: () => void
}

export default function ResultScreen({ score, totalRounds, gameMode, onRestart }: ResultScreenProps) {
    return (
        <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui' }} className="fade-in">
            <h1>Oyun Bitti! 🏁</h1>
            <div style={{ fontSize: 80, margin: '20px 0' }}>
                {score === totalRounds ? '🏆' : score > totalRounds / 2 ? '😎' : '🤔'}
            </div>
            <h2>Toplam Puan: <span style={{ color: score > 2 ? '#28a745' : '#dc3545' }}>{score}</span> / {totalRounds}</h2>
            <div style={{ margin: '20px 0', color: '#666' }}>
                Oynanan Mod: <strong>{gameMode === 'NORMAL' ? 'Normal' : 'Zor 🔥'}</strong>
            </div>

            <button
                onClick={onRestart}
                style={{
                    padding: '12px 30px', fontSize: 18, background: '#007bff', color: 'white',
                    border: 'none', borderRadius: 8, cursor: 'pointer', marginTop: 20
                }}
            >
                Ana Menüye Dön
            </button>
        </div>
    )
}
