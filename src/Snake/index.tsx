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

            setGameIsPaused((prevGameIsPaused) => !prevGameIsPaused);

            return;
        }

        switch (code) {
            case Directions.Left:
                if (direction !== Directions.Left && direction !== Directions.Right) setDirection(Directions.Left);
                break;
            case Directions.Up:
                if (direction !== Directions.Up && direction !== Directions.Down) setDirection(Directions.Up);
                break;
            case Directions.Right:
                if (direction !== Directions.Right && direction !== Directions.Left) setDirection(Directions.Right);
                break;
            case Directions.Down:
                if (direction !== Directions.Down && direction !== Directions.Up) setDirection(Directions.Down);
                break;
            default:
                return;
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', keydownHandler);

        return () => window.removeEventListener('keydown', keydownHandler);
    }, [gameIsOver, direction]);

    const finishGame = (): void => {
        setGameIsOver(true);
        setGameIsPaused(true);
    };

    const updateScore = (): void => setScore((prevScore) => prevScore + speed);

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
