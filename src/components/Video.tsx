import React from 'react';
import ReactPlayer from 'react-player';

interface VideoProps {
  url: string;
  width?: string | number;
  height?: string | number;
  controls?: boolean;
  playing?: boolean;
  volume?: number;
  muted?: boolean;
  onReady?: () => void;
  onStart?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  autoPlay?: boolean;
  loop?: boolean;
}

const Video: React.FC<VideoProps> = ({
  url,
  width = '100%',
  height = '100%',
  controls = true,
  playing = false,
  volume = 0.8,
  muted = false,
  onReady,
  onStart,
  onPause,
  onEnded,
  loop = true,
}) => {
  return (
    <div className="video-wrapper">
      <ReactPlayer
        url={url}
        width={width}
        height={height}
        controls={controls}
        playing={playing}
        volume={volume}
        muted={muted}
        onReady={onReady}
        onStart={onStart}
        onPause={onPause}
        onEnded={onEnded}
        loop={loop}
      />
    </div>
  );
};

export default Video;
