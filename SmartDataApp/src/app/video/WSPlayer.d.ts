declare class WSPlayer {
    constructor(args?: {
        width?: string,
        height?: string,
        elementId: string,
        path?: string,
        mode?: string,
        url?: string
    })
    /** 全屏状态 */
    FullScreen: boolean;
    /** 视频连接 */
    url: string;
    /** 视频原始宽度 */
    clientWidth: number;
    /** 视频原始高度 */
    clientHeight: number;
    /** 视频名称 （用于截图文件名） */
    name: string;
    /** 视频状态 */
    status: number;
    /** 回放时间参数 */
    playback_time: {
        begin: Date,
        end: Date,
        current: Date
    }
    /** 外部全屏 */
    outsidefullscreen: boolean;
    /** 播放视频 */
    play(): void;
    seek(value: number): void;
    /** 快进 */
    fast(): void;
    /** 慢放 */
    slow(): void;
    /** 截图 */
    capturePicture(): void;
    /** 暂停 */
    pause(): void;
    /** 回复播放速度 */
    speedResume(): void;
    /** 恢复 */
    resume(): void;
    /** 单帧 */
    frame(): void;
    /** 停止 */
    stop(): Promise<void>;
    /** 全屏 */
    fullScreen(): void;
    /** 设置视频尺寸 （参数不会被记录） */
    resize(width?: number, height?: number): void;
    /** 下载 */
    download(filename: string, type: string): void;
    /** 视频正在播放 */
    onPlaying: () => void;
    /** 视频正在停止 */
    onStoping: () => void;
    /** 获取已播放未知 */
    getPosition: () => void;
    onButtonClicked: (btn: ButtonName) => void;
    /** 双击全屏 返回值：是否触发全屏 */
    onViewerDoubleClicked: () => boolean;

}
declare enum ButtonName {
    /** 播放 */
    play = "play",
    /** 恢复 */
    resume = "resume",
    /** 暂停 */
    pause = "pause",
    /** 停止 */
    stop = "stop",
    /** 全屏 */
    fullscreen = "fullscreen",
    /** 截图 */
    capturepicture = "capturepicture",
    /** 慢放 */
    slow = "slow",
    /** 快放 */
    fast = "fast",
    /** 单帧 */
    forward = "forward",
    /** 回跳 */
    jump_back = "jump_back",
    /** 跳进 */
    jump_forward = "jump_forward"
}
