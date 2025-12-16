
export interface Elevator {
    id: number;
    currFloor: number;
    direction: "NEUTRAL" | "UP" | "DOWN";
    destinationFloors: number[];
}

export type SelectorType = "SimpleSelector" | "ProximitySelector";