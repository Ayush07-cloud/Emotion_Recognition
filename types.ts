
export type Emotion = 'Neutral' | 'Happy' | 'Sad' | 'Angry' | 'Fearful' | 'Disgusted' | 'Surprised';

export type EmotionScores = {
    [key in Emotion]?: number;
};

export interface EmotionData {
    timestamp: number;
    dominantEmotion: Emotion;
    confidence: number;
    scores: EmotionScores;
    visualScores: EmotionScores;
    audioScores: EmotionScores;
}

export interface Settings {
    showLandmarks: boolean;
    audioWeight: number; // Percentage (0-100)
    showAudioVisualizer: boolean;
    privacyMode: boolean;
}
