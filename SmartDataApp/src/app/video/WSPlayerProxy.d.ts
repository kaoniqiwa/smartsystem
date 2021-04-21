
declare var base64encode: (str: string) => string;
declare var utf16to8: (str: string) => string;
declare class WSPlayerProxy{
    constructor(iframe:string|HTMLIFrameElement)
    /** 全屏状态 */
    FullScreen: boolean;
    download(filename: string, type: string) :void;
    resize(width: number, height: number) :void;
    fullScreen() :void;
    stop(): Promise<void>;
    frame() :void;
    resume() :void;
    speedResume() :void;
    pause() :void;
    capturePicture() :void;
    slow() :void;
    fast() :void;
    seek(value: number) :void;
    onStoping: () => void;    
    /** 获取已播放未知 */
    getPosition: (value:number) => void;
    onButtonClicked: (btn: ButtonName) => void;
    /** 双击全屏 返回值：是否触发全屏 */
    onViewerDoubleClicked: () => boolean;
}