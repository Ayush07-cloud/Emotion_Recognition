
import React, { useMemo } from 'react';
import type { Emotion, EmotionData } from '../types';
import { EMOTIONS } from '../constants';

interface StatsPanelProps {
    emotionHistory: EmotionData[];
}

const StatItem: React.FC<{ label: string, value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between items-baseline">
        <span className="text-gray-500 dark:text-gray-400 text-sm">{label}</span>
        <span className="font-bold text-gray-900 dark:text-white text-lg">{value}</span>
    </div>
);


const StatsPanel: React.FC<StatsPanelProps> = ({ emotionHistory }) => {
    const stats = useMemo(() => {
        if (emotionHistory.length === 0) {
            return {
                duration: "0s",
                dominantEmotion: "N/A",
                switches: 0,
            };
        }

        const startTime = emotionHistory[0].timestamp;
        const endTime = emotionHistory[emotionHistory.length - 1].timestamp;
        const durationSeconds = Math.round((endTime - startTime) / 1000);
        const duration = `${durationSeconds}s`;

        const counts = EMOTIONS.reduce((acc, emotion) => {
            acc[emotion] = 0;
            return acc;
        }, {} as Record<Emotion, number>);
        
        let switches = 0;
        for (let i = 0; i < emotionHistory.length; i++) {
            counts[emotionHistory[i].dominantEmotion]++;
            if (i > 0 && emotionHistory[i].dominantEmotion !== emotionHistory[i-1].dominantEmotion) {
                switches++;
            }
        }
        
        const dominantEmotion = Object.keys(counts).reduce((a, b) => counts[a as Emotion] > counts[b as Emotion] ? a : b);

        return { duration, dominantEmotion, switches };

    }, [emotionHistory]);

    return (
        <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Session Statistics</h3>
            <div className="space-y-3">
                <StatItem label="Session Duration" value={stats.duration} />
                <StatItem label="Dominant Emotion" value={stats.dominantEmotion} />
                <StatItem label="Emotion Switches" value={stats.switches} />
            </div>
        </div>
    );
};

export default StatsPanel;