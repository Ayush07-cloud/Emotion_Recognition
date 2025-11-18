
import type { Emotion, EmotionScores } from '../types';
import { EMOTIONS } from '../constants';

// Helper to normalize scores
const normalizeScores = (scores: Partial<Record<string, number>>): EmotionScores => {
    const total = Object.values(scores).reduce((sum, score) => sum + (score ?? 0), 0);
    if (total === 0) {
        return { Neutral: 1.0 };
    }
    const normalized: EmotionScores = {};
    for (const key in scores) {
        normalized[key as Emotion] = (scores[key as Emotion] ?? 0) / total;
    }
    return normalized;
};

// Helper to find dominant emotion
const getDominantEmotion = (scores: EmotionScores): { dominantEmotion: Emotion, confidence: number } => {
    let dominantEmotion: Emotion = 'Neutral';
    let maxConfidence = 0;

    for (const emotion of EMOTIONS) {
        const score = scores[emotion] ?? 0;
        if (score > maxConfidence) {
            maxConfidence = score;
            dominantEmotion = emotion;
        }
    }
    return { dominantEmotion, confidence: maxConfidence };
};


// Maps face-api.js expressions to our Emotion type and normalizes them.
// face-api expressions are: neutral, happy, sad, angry, fearful, disgusted, surprised
export const getVisualPrediction = (expressions: Record<string, number>): { scores: EmotionScores } => {
    const scores: EmotionScores = {
        Neutral: expressions.neutral,
        Happy: expressions.happy,
        Sad: expressions.sad,
        Angry: expressions.angry,
        Fearful: expressions.fearful,
        Disgusted: expressions.disgusted,
        Surprised: expressions.surprised,
    };
    return { scores: normalizeScores(scores) };
};

// A simple mock function to predict emotion from audio volume.
// A more sophisticated model would analyze pitch, tone, etc.
export const getMockAudioPrediction = (audioData: Uint8Array | null): { scores: EmotionScores } => {
    if (!audioData) {
        return { scores: { Neutral: 1.0 } };
    }

    // Calculate RMS volume
    let sum = 0;
    for (let i = 0; i < audioData.length; i++) {
        const val = (audioData[i] / 128.0) - 1.0; // Normalize to -1.0 to 1.0
        sum += val * val;
    }
    const rms = Math.sqrt(sum / audioData.length);
    const volume = Math.min(rms * 5, 1.0); // Amplify and clamp

    // Simple logic: higher volume might mean more "active" emotions
    const scores: EmotionScores = {
        Neutral: 1.0 - volume,
        Happy: volume * 0.3,
        Angry: volume * 0.5,
        Surprised: volume * 0.2,
        Sad: 0,
        Fearful: 0,
        Disgusted: 0,
    };

    return { scores: normalizeScores(scores) };
};

export const getCombinedPrediction = (
    visual: { scores: EmotionScores },
    audio: { scores: EmotionScores },
    audioWeight: number // 0-100
): { dominantEmotion: Emotion, confidence: number, scores: EmotionScores } => {
    const visualWeight = 100 - audioWeight;
    const combinedScores: EmotionScores = {};

    for (const emotion of EMOTIONS) {
        const visualScore = visual.scores[emotion] ?? 0;
        const audioScore = audio.scores[emotion] ?? 0;
        combinedScores[emotion] = (visualScore * visualWeight + audioScore * audioWeight) / 100;
    }

    const normalized = normalizeScores(combinedScores);
    const { dominantEmotion, confidence } = getDominantEmotion(normalized);

    return {
        dominantEmotion,
        confidence,
        scores: normalized,
    };
};
