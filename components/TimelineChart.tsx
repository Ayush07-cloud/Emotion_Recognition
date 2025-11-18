import React from 'react';
import type { EmotionData } from '../types';
import { EMOTIONS, EMOTION_CONFIG } from '../constants';

interface TimelineChartProps {
    data: EmotionData[];
}

const TimelineChart: React.FC<TimelineChartProps> = ({ data }) => {
    const Recharts = (window as any).Recharts;
    if (!Recharts) {
        return <div className="flex items-center justify-center h-full text-gray-400">Loading Chart...</div>;
    }
    const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

    const chartData = data.slice(-30).map(d => ({
        time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        ...Object.fromEntries(EMOTIONS.map(emotion => [emotion, (d.scores[emotion] ?? 0) * 100]))
    }));
    
    const axisColor = 'rgba(255, 255, 255, 0.7)';

    return (
        <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                    <XAxis dataKey="time" stroke={axisColor} tick={{ fontSize: 12, fill: axisColor }} />
                    <YAxis stroke={axisColor} tick={{ fontSize: 12, fill: axisColor }} unit="%" domain={[0, 100]} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(30, 30, 30, 0.8)',
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            borderRadius: '10px'
                        }}
                        labelStyle={{ color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Legend wrapperStyle={{fontSize: "12px", color: axisColor}}/>
                    {Object.entries(EMOTION_CONFIG).map(([emotion, config]) => (
                         <Line key={emotion} type="monotone" dataKey={emotion} stroke={config.color} strokeWidth={2} dot={false} />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TimelineChart;