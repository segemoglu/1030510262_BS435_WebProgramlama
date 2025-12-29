import React, { useState, useEffect } from 'react'
import './App.css'
import StartScreen from './StartScreen'
import GameScreen from './GameScreen'
import ResultScreen from './ResultScreen'
import type { GameState, GameMode, ImageOption, RoundData } from './types'

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

export default function App() {
    const [gameState, setGameState] = useState<GameState>('START')
    const [gameMode, setGameMode] = useState<GameMode>('NORMAL')

    const [roundIndex, setRoundIndex] = useState(0)
    const [score, setScore] = useState(0)

    // Oyun içi state
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [shuffledOptions, setShuffledOptions] = useState<ImageOption[]>([])
    const [timeLeft, setTimeLeft] = useState(20)

    // Normal Mod yardımcı stateleri
    const [eliminatedIds, setEliminatedIds] = useState<string[]>([])
    const [showHint, setShowHint] = useState(false)

    const currentRoundData = GAME_DATA[roundIndex]

    const isRoundOver = selectedId !== null || timeLeft === 0

    useEffect(() => {
        if (gameState === 'PLAY' && currentRoundData) {
            const mixed = [...currentRoundData.options].sort(() => Math.random() - 0.5)
            setShuffledOptions(mixed)
            setSelectedId(null)
            setEliminatedIds([])
            setShowHint(false)

            if (gameMode === 'NORMAL') {
                setTimeLeft(20)
            } else {
                setTimeLeft(10)
            }
        }
    }, [gameState, roundIndex, gameMode])

    useEffect(() => {
        if (gameState === 'PLAY' && !isRoundOver && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [gameState, timeLeft, isRoundOver])

    const handleStartGame = (mode: GameMode) => {
        setGameMode(mode)
        setScore(0)
        setRoundIndex(0)
        setGameState('PLAY')
    }

    const handleSelect = (option: ImageOption) => {
        if (isRoundOver) return
        if (eliminatedIds.includes(option.id)) return

        if (!option.isReal) {
            setSelectedId(option.id)
            setScore(prev => prev + 1)
        } else {
            if (gameMode === 'NORMAL') {
                if (eliminatedIds.length === 0) {
                    setEliminatedIds(prev => [...prev, option.id])
                    setShowHint(true)
                } else {
                    setSelectedId(option.id)
                }
            } else {
                setSelectedId(option.id)
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
    /*                                RENDER                                      */
    /* -------------------------------------------------------------------------- */

    if (gameState === 'START') {
        return <StartScreen onStart={handleStartGame} />
    }

    if (gameState === 'FINISHED') {
        return <ResultScreen
            score={score}
            totalRounds={GAME_DATA.length}
            gameMode={gameMode}
            onRestart={() => setGameState('START')}
        />
    }

    return <GameScreen
        roundIndex={roundIndex}
        totalRounds={GAME_DATA.length}
        timeLeft={timeLeft}
        score={score}
        roundData={currentRoundData}
        shuffledOptions={shuffledOptions}
        selectedId={selectedId}
        eliminatedIds={eliminatedIds}
        showHint={showHint}
        gameMode={gameMode}
        isRoundOver={isRoundOver}
        onSelect={handleSelect}
        onNextRound={nextRound}
    />
}