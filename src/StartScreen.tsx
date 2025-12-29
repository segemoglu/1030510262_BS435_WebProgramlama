import React from 'react'
import type { GameMode } from './types'

type StartScreenProps = {
    onStart: (mode: GameMode) => void
}

export default function StartScreen({ onStart }: StartScreenProps) {
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
                    <li>Görevin AI olanı bulmak!</li>
                </ul>
            </div>

            <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
                {/* NORMAL MOD BUTONU */}
                <button
                    onClick={() => onStart('NORMAL')}
                    style={{
                        padding: '15px 30px', fontSize: 18, fontWeight: 'bold',
                        background: '#28a745', color: 'white', border: 'none',
                        borderRadius: 12, cursor: 'pointer', flex: 1,
                        boxShadow: '0 4px 10px rgba(40,167,69,0.3)'
                    }}
                >
                    NORMAL MOD
                    <div style={{ fontSize: 12, fontWeight: 'normal', marginTop: 5, opacity: 0.9 }}>
                        İpucu & İkinci Şans Var<br />
                        Süre: 20 Saniye
                    </div>
                </button>

                {/* ZOR MOD BUTONU */}
                <button
                    onClick={() => onStart('HARD')}
                    style={{
                        padding: '15px 30px', fontSize: 18, fontWeight: 'bold',
                        background: '#dc3545', color: 'white', border: 'none',
                        borderRadius: 12, cursor: 'pointer', flex: 1,
                        boxShadow: '0 4px 10px rgba(220,53,69,0.3)'
                    }}
                >
                    ZOR MOD 🔥
                    <div style={{ fontSize: 12, fontWeight: 'normal', marginTop: 5, opacity: 0.9 }}>
                        İpucu YOK<br />
                        Süre: 10 Saniye
                    </div>
                </button>
            </div>
        </div>
    )
}
