import { useElevator } from "../hooks/useElevator.tsx";
import { useState } from "react";
import type { Elevator, SelectorType } from "../types.ts";

export function ElevatorController() {
    const [isRunning, setIsRunning] = useState(false);
    const [floorRequest, setFloorRequest] = useState(0);
    const [requestSelectorType, setRequestSelectorType] = useState<SelectorType>("SimpleSelector")
    const [currentSelector, setCurrentSelector] = useState<SelectorType>("SimpleSelector")
    const [elevatorSpeed, setElevatorSpeed] = useState(4000);
    const [assignedElevator, setAssignedElevator] = useState<Elevator | null>(null);

    // Websocket hook
    const elevators = useElevator();

    const handleStart = async () => {
        if (isRunning) { return; }

        setIsRunning(true);

        try {
            const response = await fetch('/api/emulator/start', { method: 'POST', });

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
            const response = await fetch('/api/emulator/stop', { method: 'POST', });

            if (!response.ok) {
                throw new Error(`Failed to stop emulator: ${response.statusText}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleRequestFloor = async () => {
        try {
            const response = await fetch(`/api/elevators/request-floor/${floorRequest}`, { method: 'POST', });

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

    const handleSelectorType = async () => {
        if (currentSelector === requestSelectorType) { return; }

        try {
            const response = await fetch(`/api/strategy/${requestSelectorType}`, { method: 'POST', });

            if (!response.ok) {
                throw new Error(`Failed to set selector type: ${response.statusText}`);
            }

            setCurrentSelector(requestSelectorType);
        } catch (err) {
            console.error(err);
        }
    };

    const handleElevatorSpeed = async () => {
        if (elevatorSpeed < 1000) {
            setElevatorSpeed(1000);
        } else if (elevatorSpeed > 10000) {
            setElevatorSpeed(10000);
        }

        try {
            const response = await fetch(`/api/emulator/delay/${elevatorSpeed}`, { method: 'POST', });

            if (!response.ok) {
                throw new Error(`Failed to set elevator speed: ${response.statusText}`);
            }
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
                        max="100"
                        placeholder='Floor'
                        value={floorRequest ?? ''}
                        onChange={(e) => setFloorRequest(Number(e.target.value))}
                    />
                    <button onClick={() => { void handleRequestFloor() }}>Request Floor</button>
                </div>

                <div style={{ margin: 'auto', width: '100%', gap: '1rem' }}>
                    <select name="selectorType" id="selector" value={requestSelectorType}
                        onChange={(selector) => setRequestSelectorType(selector.target.value as SelectorType)}>
                        <option value="SimpleSelector">Simple Selector</option>
                        <option value="ProximitySelector">Proximity Selector</option>
                    </select>
                    <button onClick={() => { void handleSelectorType() }}>Set Selector Strategy</button>

                    <input
                        id="elevatorSpeed"
                        type="number"
                        min="1000"
                        max="10000"
                        step="500"
                        placeholder='(ms)'
                        value={elevatorSpeed ?? ''}
                        onChange={(speed) => setElevatorSpeed(Number(speed.target.value))}
                    />
                    <button onClick={() => { void handleElevatorSpeed() }}>Set Elevator Speed (ms)</button>
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