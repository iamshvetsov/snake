export enum Directions {
    Left = 'ArrowLeft',
    Up = 'ArrowUp',
    Right = 'ArrowRight',
    Down = 'ArrowDown'
}

export type GridProps = {
    gameIsOver: boolean;
    gameIsPaused: boolean;
    finishGame: () => void;
    updateScore: () => void;
    width: number;
    height: number;
    cellSize: number;
    speed: number;
    direction: Directions;
};

type ContextArgs = {
    context: CanvasRenderingContext2D;
    cellSize: number;
};

export type CellArgs = {
    x: number;
    y: number;
};

type CellsPerType = {
    cellsPerRow: number;
    cellsPerColumn: number;
};

export type DrawCellArgs = ContextArgs & CellArgs;

export type DrawCellsArgs = ContextArgs & CellsPerType;

type SnakeType = {
    snake: CellArgs[];
};

export type DrawSnakeArgs = ContextArgs & SnakeType;

export type GetFoodArgs = SnakeType & CellsPerType;

type FoodType = {
    food: CellArgs;
};

export type DrawFoodArgs = ContextArgs & FoodType;

export type MoveSnakeArgs = CellsPerType & SnakeType & {
    direction: Directions;
};

export type SnakeMeetsFoodArgs = SnakeType & FoodType;
