
import { useState, useRef, useCallback } from 'react';

interface UseMediaStreamsProps {
    onPermissionsError?: (message: string) => void;
}

export const useMediaStreams = ({ onPermissionsError }: UseMediaStreamsProps) => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const audioChunks = useRef<Blob[]>([]);

    const audioContext = useRef<AudioContext | null>(null);
    const audioData = useRef<{ analyser: AnalyserNode | null; dataArray: Uint8Array | null; }>({
        analyser: null,
        dataArray: null
    });

    const startStreams = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(mediaStream);

            // Audio processing setup
            audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            const source = audioContext.current.createMediaStreamSource(mediaStream);
            const analyser = audioContext.current.createAnalyser();
            analyser.fftSize = 2048;
            source.connect(analyser);

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            audioData.current = { analyser, dataArray };

            // Media recorder setup
            const recorder = new MediaRecorder(mediaStream);
            recorder.ondataavailable = event => {
                audioChunks.current.push(event.data);
            };
            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'video/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = audioUrl;
                a.download = `emotion_session_${new Date().toISOString()}.webm`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(audioUrl);
                audioChunks.current = [];
            };
            setMediaRecorder(recorder);

        } catch (err) {
            console.error("Error accessing media devices.", err);
            if(onPermissionsError) {
                onPermissionsError("Could not access camera and microphone. Please grant permissions in your browser settings.");
            }
        }
    }, [onPermissionsError]);

    const stopRecording = useCallback(() => {
        if (mediaRecorder && mediaRecorder.state === "recording") {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    }, [mediaRecorder]);

    const stopStreams = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if (audioContext.current && audioContext.current.state !== 'closed') {
            audioContext.current.close();
            audioContext.current = null;
        }
        if (isRecording) {
            stopRecording();
        }
    }, [stream, isRecording, stopRecording]);

    const startRecording = useCallback(() => {
        if (mediaRecorder && mediaRecorder.state === "inactive") {
            mediaRecorder.start();
            setIsRecording(true);
        }
    }, [mediaRecorder]);

    return { stream, audioData, startStreams, stopStreams, mediaRecorder, startRecording, stopRecording, isRecording };
};
