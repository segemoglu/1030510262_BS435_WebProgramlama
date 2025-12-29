import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import StartScreen from './StartScreen'
import ResultScreen from './ResultScreen'
import App from './App'

// 1. StartScreen Testi
describe('StartScreen Component', () => {
    it('should render mode buttons', () => {
        render(<StartScreen onStart={() => { }} />)
        expect(screen.getByText(/AI vs REAL/i)).toBeInTheDocument()
        expect(screen.getByText(/NORMAL MOD/i)).toBeInTheDocument()
        expect(screen.getByText(/ZOR MOD/i)).toBeInTheDocument()
    })

    it('should call onStart with NORMAL when clicked', () => {
        const handleStart = vi.fn()
        render(<StartScreen onStart={handleStart} />)
        fireEvent.click(screen.getByText(/NORMAL MOD/i))
        expect(handleStart).toHaveBeenCalledWith('NORMAL')
    })
})

// 2. ResultScreen Testi
describe('ResultScreen Component', () => {
    it('should display correct score', () => {
        render(<ResultScreen score={3} totalRounds={4} gameMode="NORMAL" onRestart={() => { }} />)
        expect(screen.getByText(/3/)).toBeInTheDocument() // Puan görünmeli
        expect(screen.getByText(/Normal/i)).toBeInTheDocument() // Mod görünmeli
    })
})

// 3. App Entegrasyon Testi (Basit)
describe('App Component Integration', () => {
    it('should switch from start to game screen when mode selected', () => {
        render(<App />)
        // Başlangıçta Title var mı?
        expect(screen.getByText(/AI vs REAL/i)).toBeInTheDocument()

        // Mod seç
        fireEvent.click(screen.getByText(/NORMAL MOD/i))

        // Oyun ekranı elementleri geldi mi? (Örn: Süre, Puan gibi metinler)
        expect(screen.getByText(/Süre/i)).toBeInTheDocument()
        expect(screen.getByText(/Hangisi/i)).toBeInTheDocument()
    })
})
