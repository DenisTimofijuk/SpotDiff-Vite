interface ThemeJSON {
    "piano": string[];
    "numbers": string[];
    "vortex": string[];
    "difficulty":{
        [K in DifficultyName]: Difficulty;
    }
}

type DifficultyName = 'Normal' | 'Hard'
interface Difficulty{
    "levels": string[];
    "init-helps": number;
    "max-available-helps": number;
}
interface Level_Config_JSON {
    "level-index": string;
    "name": string;
    "images": string[];
    "background-audio":{
        "url":string;
        "volume": number
    }[];
    "audio": JSON_audio;
    "pins": string[];
    "totalDiffs": number;
    // "animations": string[];
    "indication":{
        "x": number;
        "y": number;
        "size": number;
        "globalCompositeOperation": GlobalCompositeOperation;
        "globalAlpha": number;
    }
}

interface JSON_audio {
    [key: string]: string
}

interface GameScreenInterface {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    buffer: HTMLCanvasElement;
    bufferCtx: CanvasRenderingContext2D;
    clear(): void;
    drawBuffer(): void;
    saveBuffer(): void;
}
interface GameCompositor {
    screeenA: GameScreenInterface;
    screeenB: GameScreenInterface;
    // drawScreens(images: HTMLImageElement[]): void;
    // saveAllBuffers(): void;
    initBuffers(images: HTMLImageElement[]): void;
    draw(): void;
    redrawSegment([x, y, w, h]: number[]): void;
}

interface PinsHandlerClass {
    bufferPins: Array<number | string>;
    searchablePins: Array<number | string>;
    find(mouseX: number, mouseY: number): number[];
}

type UpdateAnimation = (deltaTime: number) => void;
type AnimationFunction = (levelData: {
    init: number;
    diffs: number;
}, images: HTMLImageElement[], compositor: GameCompositor, pinsHandler: PinsHandlerClass) => Promise<UpdateAnimation>;