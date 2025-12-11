import { useElevator } from "../hooks/useElevator.tsx";
import { useState } from "react";
import type { Elevator } from "../types.ts";

export function ElevatorController() {
    const [isRunning, setIsRunning] = useState(false);
    const [floorRequest, setFloorRequest] = useState(0);
    const [assignedElevator, setAssignedElevator] = useState<Elevator | null>(null);

    // Websocket hook
    const elevators = useElevator();

    const handleStart = async () => {
        if (isRunning) { return; }

        setIsRunning(true);

        try {
            const response = await fetch('/emulator/start', { method: 'POST', });

            if (!response.ok) {
                throw new Error(`Failed to start emulator: ${response.statusText}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleStop = async () => {
        if (!isRunning) { return; }

        setIsRunning(false);

        try {
            const response = await fetch('/emulator/stop', { method: 'POST', });

            if (!response.ok) {
                throw new Error(`Failed to stop emulator: ${response.statusText}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleRequestFloor = async () => {
        try {
            const response = await fetch(`/elevators/request-floor/${floorRequest}`, { method: 'POST', });

            if (!response.ok) {
                throw new Error(`Failed to request floor: ${response.statusText}`);
            }

            // Returns which elevator assigned
            const assignedElevator = await response.json() as Elevator;
            setAssignedElevator(assignedElevator);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Elevator States</h2>

            <div style={{ margin: 'auto', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                <div style={{ margin: 'auto', width: '100%', gap: '1rem' }}>
                    <button onClick={() => { void handleStart() }}>Start</button>
                    <button onClick={() => { void handleStop() }}>Stop</button>
                </div>

                <br />

                <div style={{ margin: 'auto', width: '100%', gap: '1rem' }}>
                    <input
                        id="floorRequest"
                        type="number"
                        min="0"
                        max="20"
                        placeholder='Floor'
                        value={floorRequest || ''}
                        onChange={(e) => setFloorRequest(Number(e.target.value))}
                    />

                    <button onClick={() => { void handleRequestFloor() }}>Request Floor</button>
                </div>
            </div>


            <br /><br />
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {elevators.map(e => (
                    <div key={e.id} style={{ padding: '1rem' }}>
                        <h3 style={{ color: assignedElevator?.id === e.id ? 'green' : 'inherit' }}>Elevator {e.id}</h3>
                        <p>{e.currFloor}</p>
                        <p>Direction: {e.direction === "UP" ? "⬆️" : e.direction === "DOWN" ? "⬇️" : "⏹️"}</p>
                        <p>Destinations: {e.destinationFloors.join(", ")}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}