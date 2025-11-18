
import React from 'react';
import { PlayIcon, StopIcon, RecordIcon, ScreenshotIcon, ResetIcon } from './icons';

interface ControlsProps {
    isProcessing: boolean;
    isRecording: boolean;
    onStartStop: () => void;
    onRecord: () => void;
    onScreenshot: () => void;
    onReset: () => void;
}

const ControlButton: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string, title: string }> = ({ onClick, children, className, title }) => (
    <button
        onClick={onClick}
        title={title}
        className={`flex items-center justify-center gap-2 p-3 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-md ${className}`}
    >
        {children}
    </button>
);

const Controls: React.FC<ControlsProps> = ({ isProcessing, isRecording, onStartStop, onRecord, onScreenshot, onReset }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10">
            <ControlButton onClick={onStartStop} className={isProcessing ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} title={isProcessing ? "Stop Analysis" : "Start Analysis"}>
                {isProcessing ? <StopIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
                <span className="hidden sm:inline">{isProcessing ? 'Stop' : 'Start'}</span>
            </ControlButton>
            <ControlButton onClick={onRecord} className={` ${isRecording ? 'bg-yellow-500 hover:bg-yellow-600 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'}`} title={isRecording ? "Stop Recording" : "Record Session"}>
                <RecordIcon className="w-6 h-6" />
                <span className="hidden sm:inline">{isRecording ? 'Recording...' : 'Record'}</span>
            </ControlButton>
            <ControlButton onClick={onScreenshot} className="bg-purple-500 hover:bg-purple-600" title="Take Screenshot">
                <ScreenshotIcon className="w-6 h-6" />
                <span className="hidden sm:inline">Screenshot</span>
            </ControlButton>
            <ControlButton onClick={onReset} className="bg-gray-500 hover:bg-gray-600" title="Reset Data">
                <ResetIcon className="w-6 h-6" />
                <span className="hidden sm:inline">Reset</span>
            </ControlButton>
        </div>
    );
};

export default Controls;
