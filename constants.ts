
import React from 'react';
import { HappyIcon, SadIcon, AngryIcon, FearfulIcon, DisgustedIcon, SurprisedIcon, NeutralIcon } from './components/icons';
import type { Emotion } from './types';

export const EMOTIONS: Emotion[] = ['Neutral', 'Happy', 'Sad', 'Angry', 'Fearful', 'Disgusted', 'Surprised'];

export const EMOTION_CONFIG: Record<Emotion, { color: string; bgClass: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }> = {
    Neutral: {
        color: '#a0aec0', // gray-500
        bgClass: 'bg-gray-800',
        icon: NeutralIcon,
    },
    Happy: {
        color: '#f6e05e', // yellow-400
        bgClass: 'bg-yellow-800',
        icon: HappyIcon,
    },
    Sad: {
        color: '#63b3ed', // blue-400
        bgClass: 'bg-blue-800',
        icon: SadIcon,
    },
    Angry: {
        color: '#f56565', // red-500
        bgClass: 'bg-red-800',
        icon: AngryIcon,
    },
    Fearful: {
        color: '#b794f4', // purple-400
        bgClass: 'bg-purple-800',
        icon: FearfulIcon,
    },
    Disgusted: {
        color: '#48bb78', // green-500
        bgClass: 'bg-green-800',
        icon: DisgustedIcon,
    },
    Surprised: {
        color: '#f6ad55', // orange-400
        bgClass: 'bg-orange-800',
        icon: SurprisedIcon,
    },
};
