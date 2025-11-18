
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { EMOTIONS, EMOTION_CONFIG } from './constants';
import type { Emotion, EmotionData, Settings, EmotionScores } from './types';
import Header from './components/Header';
import VideoFeed from './components/VideoFeed';
import Controls from './components/Controls';
import EmotionDisplay from './components/EmotionDisplay';
import ConfidenceBars from './components/ConfidenceBars';
import TimelineChart from './components/TimelineChart';
import DistributionChart from './components/DistributionChart';
import AudioVisualizer from './components/AudioVisualizer';
import StatsPanel from './components/StatsPanel';
import SettingsPanel from './components/SettingsPanel';
import Modal from './components/Modal';
import { useMediaStreams } from './hooks/useMediaStreams';
import { useFaceApi } from './hooks/useFaceApi';
import { getCombinedPrediction, getVisualPrediction, getMockAudioPrediction } from './services/mockEmotionModel';
import { downloadJson } from './utils/helpers';

const App: React.FC = () => {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [settings, setSettings] = useState<Settings>({
        showLandmarks: true,
        audioWeight: 50,
        showAudioVisualizer: true,
        privacyMode: false,
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
    const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number | null>(null);

    const { stream, audioData, startStreams, stopStreams, mediaRecorder, startRecording, stopRecording, isRecording } = useMediaStreams({
        onPermissionsError: (err) => {
            setError(err);
            setIsLoading(false);
        }
    });
    
    const { modelsLoaded, error: faceApiError } = useFaceApi();

    useEffect(() => {
        if (faceApiError) {
            setError(`Failed to load face detection models: ${faceApiError}`);
        }
    }, [faceApiError]);

    useEffect(() => {
        if (modelsLoaded) {
            setIsLoading(false);
        }
    }, [modelsLoaded]);

    const dominantEmotion = currentEmotion?.dominantEmotion ?? 'Neutral';
    const emotionColor = EMOTION_CONFIG[dominantEmotion]?.bgClass || 'bg-gray-900';
    
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        if (theme === 'dark') {
            document.body.className = `transition-colors duration-1000 ease-in-out ${emotionColor}`;
        } else {
            document.body.className = 'transition-colors duration-1000 ease-in-out bg-gray-100';
        }
    }, [dominantEmotion, theme, emotionColor]);
    
    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    const processEmotions = useCallback(async () => {
        if (videoRef.current && videoRef.current.readyState >= 3 && modelsLoaded) {
            const detections = await (window as any).faceapi
                .detectSingleFace(videoRef.current, new (window as any).faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.3 }))
                .withFaceLandmarks()
                .withFaceExpressions();

            const audioPrediction = getMockAudioPrediction(audioData.current.dataArray);
            let visualPrediction = { scores: { Neutral: 1.0 } as EmotionScores };

            if (detections && canvasRef.current && videoRef.current) {
                if (settings.showLandmarks) {
                    const displaySize = { width: videoRef.current.clientWidth, height: videoRef.current.clientHeight };
                    (window as any).faceapi.matchDimensions(canvasRef.current, displaySize);
                    const resizedDetections = (window as any).faceapi.resizeResults(detections, displaySize);
                    canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    (window as any).faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
                } else {
                    canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                }
                visualPrediction = getVisualPrediction(detections.expressions);
            } else {
                 if (settings.showLandmarks && canvasRef.current) {
                     canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                 }
            }
            
            const combined = getCombinedPrediction(visualPrediction, audioPrediction, settings.audioWeight);

            const newEmotionData: EmotionData = {
                timestamp: Date.now(),
                dominantEmotion: combined.dominantEmotion,
                confidence: combined.confidence,
                scores: combined.scores,
                visualScores: visualPrediction.scores,
                audioScores: audioPrediction.scores,
            };

            setCurrentEmotion(newEmotionData);
            setEmotionHistory(prev => {
                const updatedHistory = [...prev, newEmotionData];
                if (!settings.privacyMode) {
                    try {
                       localStorage.setItem('emotionHistory', JSON.stringify(updatedHistory));
                    } catch (e) {
                       console.error("Could not save to localStorage, it might be full.");
                    }
                }
                return updatedHistory;
            });
        }
        animationFrameId.current = requestAnimationFrame(processEmotions);
    }, [modelsLoaded, audioData, settings.audioWeight, settings.showLandmarks, settings.privacyMode]);

    const handleStartStop = useCallback(() => {
        if (isProcessing) {
            stopStreams();
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        } else {
            startStreams();
        }
        setIsProcessing(!isProcessing);
    }, [isProcessing, startStreams, stopStreams]);

    useEffect(() => {
        if (isProcessing && stream && modelsLoaded) {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    animationFrameId.current = requestAnimationFrame(processEmotions);
                }
            }
        }
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [isProcessing, stream, modelsLoaded, processEmotions]);
    
    useEffect(() => {
        if (!settings.privacyMode) {
            const storedHistory = localStorage.getItem('emotionHistory');
            if (storedHistory) {
                try {
                    setEmotionHistory(JSON.parse(storedHistory));
                } catch(e) {
                    console.error("Failed to parse emotion history from localStorage", e);
                    localStorage.removeItem('emotionHistory');
                }
            }
        }
    }, [settings.privacyMode]);


    const handleReset = () => {
        setEmotionHistory([]);
        setCurrentEmotion(null);
        if(!settings.privacyMode) {
            localStorage.removeItem('emotionHistory');
        }
    };
    
    const handleScreenshot = () => {
        const video = videoRef.current;
        if (video) {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const link = document.createElement('a');
                link.download = `emotion_screenshot_${new Date().toISOString()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        }
    };

    if (isLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white`}>
                <div className="flex flex-col items-center">
                    <svg className="animate-spin h-10 w-10 mb-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p>Loading models and getting permissions...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
         return (
            <div className={`min-h-screen flex items-center justify-center p-4 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-white`}>
                <div className="text-center bg-white/80 dark:bg-white/10 backdrop-blur-md p-8 rounded-lg border border-white/20">
                    <h2 className="text-2xl font-bold mb-4">Error</h2>
                    <p>{error}</p>
                    <p className="mt-4 text-sm">Please check your browser permissions for camera and microphone and refresh the page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="transition-colors duration-1000">
            <div className="min-h-screen font-sans bg-cover bg-center text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-transparent">
                <main className="container mx-auto p-2 sm:p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 space-y-4">
                        <Header theme={theme} toggleTheme={toggleTheme} onOpenInfo={() => setIsModalOpen(true)} />
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-white/10 bg-black/30 backdrop-blur-xl">
                            <VideoFeed videoRef={videoRef} canvasRef={canvasRef} />
                            {currentEmotion && (
                                <div className="absolute top-4 left-4">
                                    <EmotionDisplay emotionData={currentEmotion} />
                                </div>
                            )}
                        </div>
                        <Controls
                            isProcessing={isProcessing}
                            isRecording={isRecording}
                            onStartStop={handleStartStop}
                            onRecord={() => (isRecording ? stopRecording() : startRecording())}
                            onScreenshot={handleScreenshot}
                            onReset={handleReset}
                        />
                         {currentEmotion && <ConfidenceBars scores={currentEmotion.scores} />}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10">
                                 <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Emotion Timeline (Last 30s)</h3>
                                <TimelineChart data={emotionHistory} />
                            </div>
                            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10">
                                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Emotion Distribution</h3>
                                <DistributionChart data={emotionHistory} />
                            </div>
                         </div>
                    </div>
                    <div className="lg:col-span-1 space-y-4">
                        {settings.showAudioVisualizer && isProcessing && (
                            <AudioVisualizer audioData={audioData} />
                        )}
                        <StatsPanel emotionHistory={emotionHistory} />
                        <SettingsPanel settings={settings} setSettings={setSettings} />
                        <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10">
                          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Prediction Sources</h3>
                          <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-600 dark:text-gray-300">Visual Only</h4>
                                <ConfidenceBars scores={currentEmotion?.visualScores ?? {}} minimal={true} />
                              </div>
                               <div>
                                <h4 className="font-semibold text-gray-600 dark:text-gray-300">Audio Only</h4>
                                <ConfidenceBars scores={currentEmotion?.audioScores ?? {}} minimal={true} />
                              </div>
                          </div>
                        </div>
                        <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10">
                           <button onClick={() => downloadJson(emotionHistory, 'emotion_session.json')} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                               Export Session (JSON)
                           </button>
                        </div>
                    </div>
                </main>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                 <h2 className="text-2xl font-bold mb-4">About This App</h2>
                <p className="mb-2">This is a multi-modal emotion recognition application that uses your webcam and microphone to analyze facial expressions and voice tone in real-time.</p>
                <p className="mb-2"><strong>How it works:</strong></p>
                <ul className="list-disc list-inside mb-4 space-y-1">
                    <li><strong>Visual Analysis:</strong> Uses face-api.js to detect facial landmarks and expressions. A mock model then translates these into emotion probabilities.</li>
                    <li><strong>Audio Analysis:</strong> A simple mock model estimates emotion based on the volume of your voice. Louder sounds are associated with more "active" emotions like anger or happiness.</li>
                    <li><strong>Data Fusion:</strong> The visual and audio predictions are combined using a weighted average, adjustable with the slider in the settings.</li>
                    <li><strong>Client-Side:</strong> All processing happens directly in your browser. No data is sent to any server, ensuring your privacy.</li>
                </ul>
                <p>This is a demonstration project. The emotion prediction models are simplified mocks and are not intended for scientific or diagnostic use.</p>
            </Modal>
        </div>
    );
};

export default App;
