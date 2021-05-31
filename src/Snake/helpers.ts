import {
    Directions,
    CellArgs,
    DrawCellArgs,
    DrawCellsArgs,
    DrawSnakeArgs,
    GetFoodArgs,
    DrawFoodArgs,
    MoveSnakeArgs,
    SnakeMeetsFoodArgs
} from '../types';

const drawCell = ({ context, cellSize, x, y }: DrawCellArgs): void => {
    context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
};

export const drawCells = ({ context, cellSize, cellsPerRow, cellsPerColumn }: DrawCellsArgs): void => {
    for (let x: number = 0; x < cellsPerRow; x++) {
        for (let y: number = 0; y < cellsPerColumn; y++) {
            drawCell({ context, cellSize, x, y });
        }
    }
};

const fillCell = ({ context, cellSize, x, y }: DrawCellArgs): void => {
    context.beginPath();
    context.rect(x * cellSize, y * cellSize, cellSize, cellSize);
    context.closePath();
    context.fill();
    context.stroke();
};

export const drawSnake = ({ context, cellSize, snake }: DrawSnakeArgs): void => {
    context.fillStyle = '#999';
    snake.forEach(({ x, y }: CellArgs) => fillCell({ context, cellSize, x, y }));
};

export const getFood = ({ snake, cellsPerRow, cellsPerColumn }: GetFoodArgs): CellArgs => {
    const newFood: CellArgs = {
        x: Math.round(Math.random() * (cellsPerRow - 1)),
        y: Math.round(Math.random() * (cellsPerColumn - 1))
    };

    return snake.some((snakeCell: CellArgs) => snakeCell.x === newFood.x && snakeCell.y === newFood.y)
        ? getFood({ snake, cellsPerRow, cellsPerColumn })
        : newFood;
};

export const drawFood = ({ context, cellSize, food }: DrawFoodArgs): void => {
    context.fillStyle = '#090';
    fillCell({ context, cellSize, x: food.x, y: food.y });
};

export const getMovedSnake = ({ snake, direction, cellsPerRow, cellsPerColumn }: MoveSnakeArgs): CellArgs[] => {
    const snakeHead: CellArgs = { ...snake[0] };

    switch (direction) {
        case Directions.Left:
            snakeHead.x--;
            break;
        case Directions.Up:
            snakeHead.y--;
            break;
        case Directions.Right:
            snakeHead.x++;
            break;
        case Directions.Down:
            snakeHead.y++;
            break;
    }

    if (snakeHead.x >= cellsPerRow) snakeHead.x = 0;
    if (snakeHead.y >= cellsPerColumn) snakeHead.y = 0;
    if (snakeHead.x < 0) snakeHead.x = cellsPerRow - 1;
    if (snakeHead.y < 0) snakeHead.y = cellsPerColumn - 1;

    return [snakeHead, ...snake.slice(0, snake.length - 1)];
};

export const snakeMeetsFood = ({ snake, food }: SnakeMeetsFoodArgs): boolean => {
    const snakeHead: CellArgs = snake[0];

    return Boolean(snakeHead.x === food.x && snakeHead.y === food.y);
};

export const snakeHasCollisions = (snake: CellArgs[]): boolean => {
    const snakeHead: CellArgs = snake[0];
    const snakeWithoutHead: CellArgs[] = [...snake.slice(1, snake.length)];

    return Boolean(snakeWithoutHead.find(({ x, y }: CellArgs) => x === snakeHead.x && y === snakeHead.y));
};
