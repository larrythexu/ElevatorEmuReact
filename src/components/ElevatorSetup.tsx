import { useState } from 'react';
import type { Elevator } from '../types.ts';

interface ElevatorSetupProps {
    onInitialized: () => void;
}

export function ElevatorSetup({ onInitialized }: ElevatorSetupProps) {
    const [numberOfElevators, setNumberOfElevators] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);

        if (numberOfElevators < 1 || numberOfElevators > 8) {
            setError('Please enter a number between 1 and 8.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/elevators/add-elevator/${numberOfElevators}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(`Failed to initialize elevators: ${response.statusText}`);
            }

            // Verify we have elevators
            const data = await response.json() as Elevator[];
            console.log(data);
            if (Array.isArray(data) && data.length > 0) {
                onInitialized();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="elevator-setup">
            <h1>Welcome to the Elevator Emulator!</h1>
            <h2>Please choose how many elevators you want to initialize:</h2>

            <input
                id="numElevators"
                type="number"
                min="1"
                max="8"
                value={numberOfElevators}
                onChange={(e) => setNumberOfElevators(parseInt(e.target.value))}
                disabled={loading}
            />

            <br /> <br />

            <button onClick={() => { void handleSubmit(); }} disabled={loading}>
                {loading ? 'Initializing...' : 'Initialize Elevators'}
            </button>

            {error && <div style={{ color: "red" }}>{error}</div>}
        </div>
    );
}
