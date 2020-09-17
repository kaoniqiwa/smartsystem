export class VideoPlayArgs {
    //链接地址
    host: string;
    // 端口号
    port: string;
    //摄像机id
    deviceId: string;
    //通道号
    slot: string;
    //用户名
    userName: string;
    //密码
    password: string;
    //模式
    mode: string;
    //开始时间
    beginTime: string;
    //结束时间
    endTime: string;
    constructor(options: {
        host?: string,
        deviceId?: string,
        slot?: string,
        userName?: string,
        password?: string,
        mode?: string,
        beginTime?: string,
        endTime?: string
    } = {}) {
        this.host = options.host || "";
        this.deviceId = options.deviceId || "";
        this.slot = options.slot || "";
        this.userName = options.userName || "";
        this.password = options.password || "";
        this.mode = options.mode || "";
        this.beginTime = options.beginTime || "";
        this.endTime = options.endTime || "";
    }
}