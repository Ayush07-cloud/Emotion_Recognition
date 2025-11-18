import React, { useRef, useEffect } from 'react';

interface AudioVisualizerProps {
    audioData: React.MutableRefObject<{ analyser: AnalyserNode | null; dataArray: Uint8Array | null }>;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioData }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const canvasCtx = canvas.getContext('2d');
        let animationFrameId: number;

        const draw = () => {
            if (!audioData.current.analyser || !audioData.current.dataArray || !canvasCtx) {
                return;
            }
            const { analyser, dataArray } = audioData.current;
            const bufferLength = analyser.frequencyBinCount;
            
            analyser.getByteTimeDomainData(dataArray);

            // Clear the canvas completely for a crisp waveform that works on both light and dark themes
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            
            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = 'rgb(139, 92, 246)'; // Indigo-500
            canvasCtx.beginPath();
            
            const sliceWidth = canvas.width * 1.0 / bufferLength;
            let x = 0;
            
            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * canvas.height / 2;
                
                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }
                
                x += sliceWidth;
            }
            
            canvasCtx.lineTo(canvas.width, canvas.height / 2);
            canvasCtx.stroke();
            
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [audioData]);

    return (
        <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10">
             <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Audio Waveform</h3>
            <canvas ref={canvasRef} width="600" height="100" className="w-full rounded-lg"></canvas>
        </div>
    );
};

export default AudioVisualizer;