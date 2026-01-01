import React, { useState, useEffect } from 'react'
import type { GameMode, ScoreEntry } from './types'

type ResultScreenProps = {
    score: number
    totalRounds: number
    gameMode: GameMode
    onRestart: () => void
}

export default function ResultScreen({ score, totalRounds, gameMode, onRestart }: ResultScreenProps) {
    const [playerName, setPlayerName] = useState('')
    const [isSaved, setIsSaved] = useState(false)
    const [topScores, setTopScores] = useState<ScoreEntry[]>([])
    const [loading, setLoading] = useState(true)

    // Skorları Getir
    useEffect(() => {
        fetchScores()
    }, [])

    const fetchScores = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/scores/')
            if (res.ok) {
                const data = await res.json()
                setTopScores(data)
            }
        } catch (err) {
            console.error("Backend bağlantı hatası:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!playerName.trim()) return

        try {
            const res = await fetch('http://localhost:8000/api/save/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    player_name: playerName,
                    score: score,
                    mode: gameMode
                })
            })

            if (res.ok) {
                setIsSaved(true)
                fetchScores() // Listeyi güncelle
            }
        } catch (err) {
            alert('Kaydedilirken hata oluştu. Backend çalışıyor mu?')
        }
    }

    return (
        <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui', maxWidth: 800, margin: '0 auto' }} className="fade-in">
            <h1>Oyun Bitti! 🏁</h1>
            <div style={{ fontSize: 80, margin: '20px 0' }}>
                {score === totalRounds ? '🏆' : score > totalRounds / 2 ? '😎' : '🤔'}
            </div>
            <h2>Toplam Puan: <span style={{ color: score > 2 ? '#28a745' : '#dc3545' }}>{score}</span> / {totalRounds}</h2>
            <div style={{ margin: '20px 0', color: '#666' }}>
                Oynanan Mod: <strong>{gameMode === 'NORMAL' ? 'Normal' : 'Zor 🔥'}</strong>
            </div>

            {/* Skor Kaydetme Formu */}
            {!isSaved ? (
                <form onSubmit={handleSave} style={{ margin: '30px 0', padding: 20, background: '#f8f9fa', borderRadius: 12 }}>
                    <h3>Skorunu Kaydet 💾</h3>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                        <input
                            type="text"
                            placeholder="Adın nedir?"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            maxLength={20}
                            style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
                            required
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '10px 20px', background: '#28a745', color: 'white',
                                border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold'
                            }}
                        >
                            Kaydet
                        </button>
                    </div>
                </form>
            ) : (
                <div style={{ margin: '30px 0', color: '#28a745', fontWeight: 'bold' }}>
                    ✅ Skorun başarıyla kaydedildi!
                </div>
            )}

            {/* Liderlik Tablosu */}
            <div style={{ marginTop: 40 }}>
                <h3>🏆 En İyiler (Top 10)</h3>
                {loading ? (
                    <p>Yükleniyor...</p>
                ) : topScores.length === 0 ? (
                    <p style={{ color: '#888' }}>Henüz kayıtlı skor yok. İlk sen ol!</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                            <thead>
                                <tr style={{ background: '#333', color: 'white' }}>
                                    <th style={{ padding: 10 }}>#</th>
                                    <th style={{ padding: 10 }}>Oyuncu</th>
                                    <th style={{ padding: 10 }}>Puan</th>
                                    <th style={{ padding: 10 }}>Mod</th>
                                    <th style={{ padding: 10 }}>Tarih</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topScores.map((s, index) => (
                                    <tr key={index} style={{ background: index % 2 === 0 ? 'white' : '#f9f9f9', borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: 10 }}>{index + 1}</td>
                                        <td style={{ padding: 10, fontWeight: 'bold' }}>{s.player_name}</td>
                                        <td style={{ padding: 10, color: '#e74c3c', fontWeight: 'bold' }}>{s.score}</td>
                                        <td style={{ padding: 10 }}>{s.mode === 'NORMAL' ? 'Normal' : '🔥 Zor'}</td>
                                        <td style={{ padding: 10, fontSize: 12, color: '#666' }}>{s.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <button
                onClick={onRestart}
                style={{
                    padding: '12px 30px', fontSize: 18, background: '#007bff', color: 'white',
                    border: 'none', borderRadius: 8, cursor: 'pointer', marginTop: 30
                }}
            >
                Ana Menüye Dön
            </button>
        </div>
    )
}
