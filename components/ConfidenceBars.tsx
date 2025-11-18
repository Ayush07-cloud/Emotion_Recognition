
import React from 'react';
import type { EmotionScores } from '../types';
import { EMOTIONS, EMOTION_CONFIG } from '../constants';

interface ConfidenceBarsProps {
    scores: EmotionScores;
    minimal?: boolean;
}

const ConfidenceBars: React.FC<ConfidenceBarsProps> = ({ scores, minimal = false }) => {
    return (
        <div className={`space-y-2 ${minimal ? '' : 'p-4 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10'}`}>
            {!minimal && <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Emotion Scores</h3>}
            {EMOTIONS.map(emotion => {
                const score = (scores[emotion] ?? 0) * 100;
                const config = EMOTION_CONFIG[emotion];
                const Icon = config.icon;
                return (
                    <div key={emotion} className="flex items-center gap-3">
                        {!minimal && <Icon className="w-6 h-6 flex-shrink-0" style={{ color: config.color }} />}
                        <span className="w-24 text-sm font-semibold text-gray-600 dark:text-gray-300 truncate">{emotion}</span>
                        <div className="w-full bg-gray-200 dark:bg-black/30 rounded-full h-4">
                            <div
                                className="h-4 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${score}%`, backgroundColor: config.color }}
                            ></div>
                        </div>
                        <span className="w-12 text-right text-sm font-mono text-gray-800 dark:text-white">{score.toFixed(1)}%</span>
                    </div>
                );
            })}
        </div>
    );
};

export default ConfidenceBars;