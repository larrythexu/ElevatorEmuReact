import { useEffect, useState, useRef } from "react";
import type { Elevator } from "../types.ts";
import { Client } from "@stomp/stompjs";

// Custom hook to connect to Elevator WebSocket server
export function useElevator() {
    const [elevators, setElevators] = useState<Elevator[]>([]);

    // const WS_URL = "/ws";
    const WS_TOPIC = "/topic/elevator/states";
    // For accessing client later
    const stompClientRef = useRef<Client | null>(null);

    useEffect(() => {
        // Websocket client config
        const client = new Client({
            brokerURL: "/ws",
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            // debug: () => {},
        })

        // Behavior on connection
        client.onConnect = () => {
            console.log("Connected to WebSocket server");

            client.subscribe(WS_TOPIC, (message) => {
                const elevatorList = JSON.parse(message.body) as Elevator[];
                setElevators(elevatorList);
            })
        }

        // Connect
        client.activate();
        stompClientRef.current = client;

        return () => {
            console.log("Disconnecting from WebSocket")
            void client.deactivate();
            stompClientRef.current = null;
        };
    }, []);

    return elevators;
}