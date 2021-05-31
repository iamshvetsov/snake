import React, { useMemo, useRef, useState, useEffect, ReactElement, RefObject } from 'react';
import { drawCells, drawSnake, getFood, drawFood, getMovedSnake, snakeMeetsFood, snakeHasCollisions } from './helpers';
import { Directions, GridProps, CellArgs } from '../types';
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
    const cellsPerRow: number = useMemo(() => width / cellSize, [width, cellSize]);
    const cellsPerColumn: number = useMemo(() => height / cellSize, [height, cellSize]);
    const startX: number = useMemo(() => cellsPerRow / 2, [cellsPerRow]);
    const newSnake: CellArgs[] = useMemo(() => [startX, startX + 1].map((x) => ({
        x: Math.round(x),
        y: Math.round(cellsPerColumn / 2)
    })), [startX, cellsPerColumn]);
    const canvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement | null>(null);
    let context: CanvasRenderingContext2D;

    const [snake, setSnake] = useState<CellArgs[]>(newSnake);
    const [food, setFood] = useState<CellArgs>(null);
    const [timestamp, setTimestamp] = useState<number>(0);
    const [previousDirection, setPreviousDirection] = useState<Directions>(direction);

    useEffect(() => {
        if (!gameIsOver && !gameIsPaused) {
            context = canvasRef.current.getContext('2d');
            context.scale(2, 2); // retina display fix
        }
    }, [gameIsOver, gameIsPaused]);

    useEffect(() => {
        if (!gameIsOver && !gameIsPaused) {
            let requestId: number;

            const tick = (requestTimestamp: number) => {
                requestId = requestAnimationFrame(tick);

                if (requestTimestamp - timestamp > 1000 * (1 / speed)) {
                    context = canvasRef.current.getContext('2d');
                    let nextDirection: Directions = previousDirection;

                    if (
                        (direction === Directions.Left && previousDirection !== Directions.Right) ||
                        (direction === Directions.Up && previousDirection !== Directions.Down) ||
                        (direction === Directions.Right && previousDirection !== Directions.Left) ||
                        (direction === Directions.Down && previousDirection !== Directions.Up)
                    ) {
                        nextDirection = direction;
                        setPreviousDirection(direction);
                    }

                    updateGrid(nextDirection);
                    drawGrid(context);
                    setTimestamp(requestTimestamp);
                }
            };

            requestId = requestAnimationFrame(tick);

            return () => cancelAnimationFrame(requestId);
        }
    }, [gameIsOver, gameIsPaused, cellSize, speed, direction, snake, food, timestamp, previousDirection]);

    const updateGrid = (direction: Directions): void => {
        const movedSnake: CellArgs[] = getMovedSnake({ snake, direction, cellsPerRow, cellsPerColumn });

        if (food === null) {
            const newFood: CellArgs = getFood({ snake: movedSnake, cellsPerRow, cellsPerColumn });

            if (snake !== newSnake) updateScore();
            setFood(newFood);
        } else {
            if (snakeHasCollisions(movedSnake)) {
                finishGame();
                setSnake(newSnake);
                setFood(null);

                return;
            }

            if (snakeMeetsFood({ snake: movedSnake, food })) {
                setSnake((prevSnake) => [food, ...prevSnake]);
                setFood(null);

                return;
            }

            setSnake(movedSnake);
        }
    };

    const drawGrid = (context: CanvasRenderingContext2D): void => {
        context.clearRect(0, 0, width, height);
        drawCells({ context, cellSize, cellsPerRow, cellsPerColumn });
        drawSnake({ context, cellSize, snake });
        food && drawFood({ context, cellSize, food });
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

    return <canvas ref={canvasRef} className={css.canvas} width={width * 2} height={height * 2} />;
};
