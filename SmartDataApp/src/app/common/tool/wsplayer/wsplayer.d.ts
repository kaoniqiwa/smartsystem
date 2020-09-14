
export declare class HWSPlayer {
    player:any;
    constructor(elementId: string, url: string, name: string);
    stop(): void;
    fullScreen(): void;
    pause(): void;
    resume(): void;
    fast(): void;
    slow(): void;
    frame(): void;
    capturePicture(): void;

}