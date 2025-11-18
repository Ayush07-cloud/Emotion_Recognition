
import React from 'react';
import type { Settings } from '../types';

interface SettingsPanelProps {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void }> = ({ label, checked, onChange }) => (
    <label className="flex items-center justify-between cursor-pointer">
        <span className="text-gray-900 dark:text-white">{label}</span>
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <div className={`block w-14 h-8 rounded-full ${checked ? 'bg-indigo-600' : 'bg-gray-400 dark:bg-gray-600'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'translate-x-6' : ''}`}></div>
        </div>
    </label>
);


const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, setSettings }) => {
    const handleSettingChange = <K extends keyof Settings,>(key: K, value: Settings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Settings</h3>
            <div className="space-y-4">
                <Toggle
                    label="Show Facial Landmarks"
                    checked={settings.showLandmarks}
                    onChange={(val) => handleSettingChange('showLandmarks', val)}
                />
                 <Toggle
                    label="Show Audio Visualizer"
                    checked={settings.showAudioVisualizer}
                    onChange={(val) => handleSettingChange('showAudioVisualizer', val)}
                />
                 <Toggle
                    label="Privacy Mode (No Storage)"
                    checked={settings.privacyMode}
                    onChange={(val) => handleSettingChange('privacyMode', val)}
                />
                <div>
                    <label className="flex justify-between items-center text-gray-900 dark:text-white mb-2">
                        <span>Audio/Visual Weight</span>
                        <span className="font-mono">{settings.audioWeight}% Audio</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.audioWeight}
                        onChange={(e) => handleSettingChange('audioWeight', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;