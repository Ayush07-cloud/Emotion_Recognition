
import React from 'react';

interface VideoFeedProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ videoRef, canvasRef }) => {
    return (
        <>
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
            />
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
                style={{ transform: 'scaleX(-1)' }}
            />
        </>
    );
};

export default VideoFeed;
