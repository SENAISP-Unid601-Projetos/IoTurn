import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import ApiService from "../services/ApiServices";

const RealtimeDataContext = createContext();

export const useRealtimeData = () => useContext(RealtimeDataContext);

const API_BASE_URL = import.meta.env.VITE_API_URL;
const SSE_GLOBAL_ENDPOINT = "/machines/stream/1";

export const RealtimeDataProvider = ({ children }) => {
    const [latestMachineData, setLatestMachineData] = useState({});
    const [clusterEvents, setClusterEvents] = useState([]);
    const [connectionError, setConnectionError] = useState(null);

    const processIncomingData = useCallback((data) => {
        try {
            const incoming = JSON.parse(data);

            if (!incoming || !incoming.machineId) return;

            const { machineId, ...rest } = incoming;

            const isClusterEvent =
                rest.predicted_cluster !== undefined &&
                rest.timestamp !== undefined;

            setLatestMachineData((prev) => ({
                ...prev,
                [machineId]: { ...prev[machineId], ...rest },
            }));

            if (isClusterEvent) {

                const newEvent = {
                    ...incoming,
                    id: `${machineId}-${rest.timestamp}-${rest.predicted_cluster}`
                };

                setClusterEvents((prev) => {
                    const exists = prev.some(e => e.id === newEvent.id);
                    if (!exists) {
                        return [newEvent, ...prev].slice(0, 50);
                    }
                    return prev;
                });

            }

        } catch (err) {
            console.error("Erro ao parsear ou processar mensagem SSE:", err);
        }
    }, []);

    useEffect(() => {
        const fullUrl = `${API_BASE_URL}${SSE_GLOBAL_ENDPOINT}`;
        const source = new EventSource(fullUrl);

        source.onopen = () => {
            setConnectionError(null);
            console.log("Conexão SSE estabelecida com sucesso.");
        };

        source.onmessage = (event) => {
            console.log("SSE RAW DATA:", event.data);
            processIncomingData(event.data);
        };

        source.onerror = (err) => {
            console.error("Erro na conexão SSE:", err);
            source.close();
            setConnectionError("Falha na conexão em tempo real. Tentando reconectar...");
        };

        return () => {
            console.log("Fechando conexão SSE.");
            source.close();
        };
    }, [processIncomingData]);

    const value = {
        latestMachineData,
        clusterEvents,
        connectionError,
    };

    return (
        <RealtimeDataContext.Provider value={value}>
            {children}
        </RealtimeDataContext.Provider>
    );
};