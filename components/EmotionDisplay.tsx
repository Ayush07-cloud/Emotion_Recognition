
import React from 'react';
import type { EmotionData } from '../types';
import { EMOTION_CONFIG } from '../constants';

interface EmotionDisplayProps {
    emotionData: EmotionData;
}

const EmotionDisplay: React.FC<EmotionDisplayProps> = ({ emotionData }) => {
    const { dominantEmotion, confidence } = emotionData;
    const config = EMOTION_CONFIG[dominantEmotion];
    const Icon = config.icon;

    return (
        <div className="p-4 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-2xl flex items-center space-x-4 shadow-lg border border-white/20">
            <Icon className="w-12 h-12" style={{ color: config.color }} />
            <div>
                <p className="text-2xl font-bold" style={{ color: config.color }}>{dominantEmotion}</p>
                <p className="text-lg text-gray-800 dark:text-white">{(confidence * 100).toFixed(1)}% Confidence</p>
            </div>
        </div>
    );
};

export default EmotionDisplay;