import React, { useState, useEffect, ReactElement, ChangeEvent } from 'react';
import { Directions } from '../types';
import { Grid } from './Grid';
import css from './Snake.css';

export const SnakeApp = (): ReactElement => {
    const width: number = 400;
    const height: number = 400;

    const [gameIsOver, setGameIsOver] = useState<boolean>(false);
    const [gameIsPaused, setGameIsPaused] = useState<boolean>(true);
    const [score, setScore] = useState<number>(0);
    const [cellSize, setCellSize] = useState<number>(50);
    const [speed, setSpeed] = useState<number>(5);
    const [direction, setDirection] = useState<Directions>(Directions.Left);

    const keydownHandler = ({ code }: any): void => {
        if (code === 'Space') {
            if (gameIsOver) {
                setGameIsOver(false);
                setScore(0);
                setDirection(Directions.Left);
            }

            setGameIsPaused(prevGameIsPaused => !prevGameIsPaused);

            return;
        }

        if (
            (code === Directions.Left && direction === Directions.Right) ||
            (code === Directions.Up && direction === Directions.Down) ||
            (code === Directions.Right && direction === Directions.Left) ||
            (code === Directions.Down && direction === Directions.Up)
        ) return;

        setDirection(code);
    };

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        const throttle = (func: Function, delay: number): Function => (...args: any): void => {
            timeout = setTimeout(() => func(...args), delay);
        };

        const throttledKeydownHandler: any = throttle(keydownHandler, 1000 / speed);

        window.addEventListener('keydown', throttledKeydownHandler);

        return () => {
            window.removeEventListener('keydown', throttledKeydownHandler);
            clearTimeout(timeout);
        };
    }, [gameIsOver, direction]);

    const finishGame = (): void => {
        setGameIsOver(true);
        setGameIsPaused(true);
    };

    const updateScore = (): void => setScore(prevScore => prevScore + speed);

    const cellSizeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
        const cellSize: number = +e.target.value;

        if (width % cellSize) return;

        setCellSize(cellSize);
    };

    const speedHandler = (e: ChangeEvent<HTMLInputElement>): void => {
        const speed: number = +e.target.value;

        setSpeed(speed);
    };

    return <>
        <div className={css.score}>score {score}</div>

        <Grid
            gameIsOver={gameIsOver}
            gameIsPaused={gameIsPaused}
            finishGame={finishGame}
            updateScore={updateScore}
            width={width}
            height={height}
            cellSize={cellSize}
            speed={speed}
            direction={direction}
        />

        <div className={css.controls}>
            <div className={css.control}>
                <div className={css.controlBadge}>
                    <span className={css.controlLabel}>size</span>
                    <span className={css.controlValue}>{cellSize}</span>
                </div>
                <input
                    type="range"
                    disabled={!gameIsPaused}
                    min={10}
                    max={100}
                    step={10}
                    value={cellSize}
                    onChange={cellSizeHandler}
                />
            </div>

            <div className={css.control}>
                <div className={css.controlBadge}>
                    <span className={css.controlLabel}>speed</span>
                    <span className={css.controlValue}>{speed}</span>
                </div>
                <input
                    type="range"
                    min={1}
                    max={10}
                    value={speed}
                    onChange={speedHandler}
                />
            </div>
        </div>
    </>;
};
