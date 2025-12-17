import { useState, useEffect } from 'react'
import { ElevatorSetup } from './components/ElevatorSetup.tsx'
import { ElevatorController } from './components/ElevatorController.tsx'
import './App.css'
import type { Elevator } from './types.ts'

function App() {
  const [initialized, setInitialized] = useState(false)
  const [loading, setLoading] = useState(true)

  // const testList = [
  //   {
  //     "id": 1,
  //     "currFloor": 0,
  //     "direction": "NEUTRAL",
  //     "destinationFloors": []
  //   },
  //   {
  //     "id": 2,
  //     "currFloor": 0,
  //     "direction": "NEUTRAL",
  //     "destinationFloors": []
  //   }
  // ]

  // Check if elevators have already been initialized
  useEffect(() => {
    const checkInitialization = async () => {
      try {
        const response = await fetch('/api/elevators')
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

      {/* <div>
        <h2>Elevator States</h2>
        {testList.map(e => (
          <div key={e.id} className='elevatorPanel'>
            <h3>Elevator {e.id}</h3>
            <p className="floor">{e.currFloor}</p>
            <p>Direction: {e.direction === "UP" ? "⬆️" : e.direction === "DOWN" ? "⬇️" : "⏹️"}</p>
            <p>Destination Floors: {e.destinationFloors.join(", ")}</p>
          </div>
        ))}
      </div> */}
    </div>
  )
}

export default App
