declare class WSPlayer {
    constructor(args?: {
        width?: string,
        height?: string,
        elementId: string,
        path?: string,
        mode?: string,
        url?: string
    })
    FullScreen: boolean;
    url: string;
    clientWidth: number;
    clientHeight: number;
    name: string;
    status: number;
    playback_time: {
        begin: Date,
        end: Date,
        current: Date
    }
    play(): void;
    seek(value: number): void;
    // 快进
    fast(): void;
    // 慢放
    slow(): void;
    // 截图
    capturePicture(): void;
    // 暂停
    pause(): void;
    speedResume(): void;
    // 恢复
    resume(): void;
    // 单帧
    frame(): void;
    // 停止
    stop(): Promise<void>;
    // 全屏
    fullScreen(): void;
    resize(width: number, height: number): void;
    download(filename: string, type: string): void;


}
