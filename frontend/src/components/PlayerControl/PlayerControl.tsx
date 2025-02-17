import { FC, useRef, useState } from 'react';
import styles from './PlayerControl.module.scss';
import SvgIcon from '../SvgIcon/SvgIcon';
import { PlayerControlProps } from '@/interfaces/components/PlayerControlProps';
import ReactSlider from 'react-slider';
import { convertSecondsToMinutes } from './helpers';

const PlayerControl: FC<PlayerControlProps> = ({ totalGameTime, onChangeCallback, events }) => {
    let [currentTime, setCurrentTime] = useState(0);
    let [isPlaying, setIsPlaying] = useState(false);

    const eventsTimeStamp = events?.map((x) => x.time);
    const intervalRef = useRef<any>(null);

    const play = () => {
        setIsPlaying(true);
        setCurrentTime(currentTime++);
        intervalRef.current = setInterval(() => {
            if (currentTime > totalGameTime) return;
            console.log(currentTime);
            setCurrentTime(currentTime++);
        }, 1000);
    };

    const pause = () => {
        setIsPlaying(false);
        clearInterval(intervalRef.current);
    };

    const stop = () => {
        setIsPlaying(false);
        clearInterval(intervalRef.current);
        setCurrentTime(0);
    };

    return (
        <div className={styles.playerControl}>
            <div className={styles.controls}>
                {isPlaying ? (
                    <button onClick={pause} aria-label="pause">
                        <SvgIcon svgName="pause" customClass={styles.icon} />
                    </button>
                ) : (
                    <button onClick={play} aria-label="play">
                        <SvgIcon svgName="play" customClass={styles.icon} />
                    </button>
                )}

                <button onClick={stop} aria-label="stop">
                    <SvgIcon svgName="stop" customClass={styles.icon} />
                </button>
            </div>

            <div className={styles.sliderWrapper}>
                <ReactSlider
                    value={currentTime}
                    className={styles.playerSlider}
                    thumbClassName={styles.sliderThumb}
                    trackClassName={styles.sliderTrack}
                    max={totalGameTime}
                    marks={events ? eventsTimeStamp : false}
                    onChange={(time, index) => setCurrentTime(time)}
                    onAfterChange={(time, index) => onChangeCallback(currentTime, index)}
                />
                <span>{convertSecondsToMinutes(totalGameTime)}mins</span>
            </div>
        </div>
    );
};

export default PlayerControl;
