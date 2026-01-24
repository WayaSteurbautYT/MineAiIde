'use client'

import { useState, useEffect } from 'react'
import { WorkingIDELayout } from '@/components/ide/working-ide-layout'

export default function Home() {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize the IDE
    const initializeIDE = async () => {
      try {
        console.log('Initializing MineAI IDE Pro...')
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize IDE:', error)
        setIsInitialized(true)
      }
    }

    initializeIDE()
  }, [])

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold text-white">Initializing MineAI IDE Pro...</h2>
          <p className="text-gray-400">Setting up your development environment</p>
        </div>
      </div>
    )
  }

  return <WorkingIDELayout />
}
