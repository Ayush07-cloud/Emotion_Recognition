import React, { useMemo } from 'react';
import type { EmotionData, Emotion } from '../types';
import { EMOTIONS, EMOTION_CONFIG } from '../constants';

interface DistributionChartProps {
    data: EmotionData[];
}

const DistributionChart: React.FC<DistributionChartProps> = ({ data }) => {
    const Recharts = (window as any).Recharts;
    if (!Recharts) {
        return <div className="flex items-center justify-center h-full text-gray-400">Loading Chart...</div>;
    }
    const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } = Recharts;

    const distribution = useMemo(() => {
        const counts = EMOTIONS.reduce((acc, emotion) => {
            acc[emotion] = 0;
            return acc;
        }, {} as Record<Emotion, number>);

        data.forEach(d => {
            counts[d.dominantEmotion]++;
        });

        const total = data.length;
        if (total === 0) return [];
        
        return EMOTIONS.map(emotion => ({
            name: emotion,
            value: counts[emotion],
        })).filter(item => item.value > 0);
    }, [data]);
    
    if (data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-400">No data yet.</div>;
    }

    return (
        <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={distribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                    >
                        {distribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={EMOTION_CONFIG[entry.name as Emotion].color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(30, 30, 30, 0.8)',
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            borderRadius: '10px'
                        }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Legend wrapperStyle={{fontSize: "12px", color: 'rgba(255, 255, 255, 0.7)'}}/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DistributionChart;