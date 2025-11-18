
import { useState, useEffect } from 'react';

export const useFaceApi = () => {
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
            try {
                // This is a workaround for face-api.js being in the global scope
                const faceapi = (window as any).faceapi;
                if (!faceapi) {
                   throw new Error("face-api.js not loaded");
                }
                
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
                ]);
                setModelsLoaded(true);
            } catch (e: any) {
                console.error("Error loading face-api models", e);
                setError(e.message || "Unknown error loading models.");
            }
        };

        loadModels();
    }, []);

    return { modelsLoaded, error };
};
