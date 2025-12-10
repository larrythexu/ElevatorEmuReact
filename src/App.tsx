import { useState, useEffect } from 'react'
import { ElevatorSetup } from './components/ElevatorSetup.tsx'
import { ElevatorController } from './components/ElevatorController.tsx'
import './App.css'
import type { Elevator } from './types.ts'

function App() {
  const [initialized, setInitialized] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check if elevators have already been initialized
  useEffect(() => {
    const checkInitialization = async () => {
      try {
        const response = await fetch('/elevators')
        if (response.ok) {
          const data = await response.json() as Elevator[]
          if (Array.isArray(data) && data.length > 0) {
            setInitialized(true)
          }
        }
      } catch (error) {
        console.error('Failed to check initialization status:', error)
      } finally {
        setLoading(false)
      }
    }

    void checkInitialization()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {!initialized && (
        <ElevatorSetup onInitialized={() => setInitialized(true)} />
      )}

      {initialized && <ElevatorController />}

    </div>
  )
}

export default App
