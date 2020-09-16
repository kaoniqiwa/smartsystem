import { Resource } from './Resource';
import { CameraAIModel } from './camera-ai-model';


/**
 * 监控点信息
 */
export class Camera extends Resource {
    /**
     * 摄像机类型
     */
    CameraType: number;
    /**
     * 摄像机状态
     */
    CameraState: number;
    /**
     * 对应设备的通道编号[1-n]
     */
    ChannelNo: number;
    /**
     * 编码设备ID
     */
    EncodeDeviceId: string;
    /**
     * 在线状态(可选)
     */
    OnlineStatus: number | null;
    /**
     * 伪码，键盘码(可选)
     */
    KeyBoardCode: number | null;
    /**
     * 存储路径(可选)
     */
    StorageLocation: string;
    /**
     *  安装位置(可选)
     */
    InstallLocation: string;
    /**
     * 是否PTZ可控(可选)
     */
    PTZControllable: boolean | null;
    /**
     * 是否可存储的(可选)
     */
    Storable: boolean | null;
    /**
     * 最大支持的AI模型数量(可选)
     * 如果没有该设置，表示不支持AI模型灌入
     */
    MaxAIModel: number | null;
    /**
     *  AI模型列表(可选)
     */
    AIModels: CameraAIModel[];
    // 最近一次的抓图照片地址
    ImageUrl: string;
    // 最近一次的抓图时间
    ImageTime: Date;
    // 流媒体ID
    SRSId: string;
    // 流媒体服务器ID
    SRServerId: string;
}
