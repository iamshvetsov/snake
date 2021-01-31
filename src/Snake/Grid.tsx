import React, { useState, useEffect, useRef, ReactElement, RefObject } from 'react';
import { drawCells, drawSnake, drawFood, getMovedSnake, snakeMeetsFood, snakeHasCollisions } from './helpers';
import { GridProps, CellArgs } from '../types';
import css from './Snake.css';

export const Grid = ({
    gameIsOver,
    gameIsPaused,
    finishGame,
    updateScore,
    width,
    height,
    cellSize,
    speed,
    direction
}: GridProps): ReactElement => {
    const cellsPerRow: number = width / cellSize;
    const cellsPerColumn: number = height / cellSize;
    const canvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement | null>(null);

    const [snake, setSnake] = useState<CellArgs[]>([]);
    const [food, setFood] = useState<CellArgs>(null);

    useEffect(() => {
        if (gameIsOver || gameIsPaused) return;

        if (!snake.length) {
            const startX: number = cellsPerRow / 2;
            const newSnake: CellArgs[] = [startX, startX + 1].map(x => ({
                x: Math.round(x),
                y: Math.round(cellsPerColumn / 2)
            }));

            setSnake(newSnake);
        }

        if (food === null && snake.length) {
            let newFood: CellArgs;

            do {
                newFood = {
                    x: Math.round(Math.random() * (cellsPerRow - 1)),
                    y: Math.round(Math.random() * (cellsPerColumn - 1))
                };
            } while (snake.some((snakeCell: CellArgs) =>
                snakeCell.x === newFood.x && snakeCell.y === newFood.y)
            );

            setFood(newFood);
        }

        const context: CanvasRenderingContext2D = canvasRef.current.getContext('2d');
        const interval: ReturnType<typeof setInterval> = setInterval(updateGrid, 1000 / speed);

        drawGrid(context);

        return () => clearInterval(interval);
    });

    const updateGrid = (): void => {
        const movedSnake: CellArgs[] = getMovedSnake({ snake, direction, cellsPerRow, cellsPerColumn });

        if (snakeHasCollisions(movedSnake)) {
            finishGame();
            setSnake([]);
            setFood(null);

            return;
        }

        if (snakeMeetsFood({ snake: movedSnake, food })) {
            setSnake(prevSnake => [food, ...prevSnake]);
            setFood(null);
            updateScore();

            return;
        }

        setSnake(movedSnake);
    };

    const drawGrid = (context: CanvasRenderingContext2D): void => {
        context.clearRect(0, 0, width, height);
        drawCells({ context, cellSize, cellsPerRow, cellsPerColumn });
        drawSnake({ context, cellSize, snake });
        drawFood({ context, cellSize, food });
    };

    if (gameIsOver) {
        return <div className={`${css.canvas} ${css.pausedCanvas}`} style={{ width, height }}>
            game is over <br /> press space key
        </div>;
    }

    if (gameIsPaused) {
        return <div className={`${css.canvas} ${css.pausedCanvas}`} style={{ width, height }}>
            press space key
        </div>;
    }

    return <canvas ref={canvasRef} className={css.canvas} width={width} height={height} />;
};
