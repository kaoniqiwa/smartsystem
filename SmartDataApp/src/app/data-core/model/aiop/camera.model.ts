import { Resource } from "./resource.model";

// 摄像机类型
enum CameraType {
  /**枪机 */
  Gun = 1,

  /**球机 */
  Ball = 2,

  /**半球 */
  HalfBall = 3,

  /** 一体机 */
  AIO = 4,
}

// 摄像机状态
enum CameraState {
  /** 设备故障 */
  DeviceError = 1,

  /**平台故障 */
  PlatformError = 2,
}

// 在线状态
enum OnlineStatus {
  /**在线 */
  Online = 0,

  /**离线 */
  Offline = 1,
}

/**
 *
 *  CameraAIModel 相关接口
 *
 */

//模型数据类型
enum CameraAIModeType {
  detect = 1, //检测数据
  classify = 2, //分类数据
}
//标签值类型
enum LabelDataType {
  None = "None",
  Int = "Int",
  String = "String",
  Enum = "Enum",
}

/**枚举类型数值 */
class EnumValue {
  /**值 */
  Value: number;

  /**模型给出的值 */
  ModelValue: number;

  /**描述 */
  Description: string;
}

/**AI摄像机模型DTO标签 */
interface CameraAIModelDTOLabel {
  /**模型数据ID */
  ModelId: string;

  /**模型数据类型 */
  ModelType?: CameraAIModeType;

  /**标签ID */
  LabelId: string;

  /**标签数值 */
  LabelValue?: string;

  /**模型标签值 */
  LabelModelValue?: string;

  /**标签名称 */
  LabelName: string;

  /**标签值的单位 */
  Unit?: string;

  /**标签值类型 */
  DataType: LabelDataType;

  /**数值 */
  DataValue?: string;

  /**是否为叶节点 */
  IsLeaf?: boolean;

  /**枚举类型数值列表 */
  EnumValues?: EnumValue[];

  /**子标签、子属性 */
  Labels?: CameraAIModelDTOLabel[];
}

//AI摄像机模型DTO
interface CameraAIModelDTO {
  /**模型数据ID */
  ModelId: string;

  /**模型数据类型：1:检测数据，2:分类数据 */
  ModelType?: CameraAIModeType;

  /**模型数据标签 */
  Labels?: CameraAIModelDTOLabel[];
}

//监控点AI模型
interface CameraAIModel {
  /**ID */
  Id: string;

  /**模型ID */
  ModelId?: string;

  /**模型标签图标0-n */
  Label: number;

  /**数据集ID*/
  DataSetId?: string;

  /**版本 */
  Version?: string;

  /**应用类型，一般是设备型号 */
  TransformType?: string;

  /**模型类型：AIOP */
  ModelType?: string;

  /**模型名称 */
  ModelName?: string;

  /**模型数据传输对象的格式 */
  ModelDTO?: CameraAIModelDTO;

  /**JSON文件的BASE64， 创建时必须填写 */
  ModelJSON: string;

  /**创建时间 */
  CreateTime: Date | string;

  /**更新事件 */
  UpdateTime: Date | string;
}

//监控点扩展信息
interface Camera extends Resource {
  /**摄像机用途 */
  CameraUsage: number;

  /**摄像机类型 */
  CameraType: CameraType;

  /**摄像机状态 */
  CameraState: CameraState;

  /**对应设备的通道编号[1-n] */
  ChannelNo: number;

  /**编码设备ID */
  EncodeDeviceId: string;

  /* 在线状态 */
  OnlineStatus?: OnlineStatus;

  /* 伪码，键盘码 */
  KeyBoardCode?: number;

  /**存储路径 */
  StorageLocation?: string;

  /* 安装位置 */
  InstallLocation?: string;

  /**是否PTZ可控 */
  PTZControllable?: boolean;

  /**是否可存储的 */
  Storable?: boolean;

  /**最大支持的AI模型数量,如果没有该设置，表示不支持AI模型灌入 */
  MaxAIModel?: number;

  /** 最近一次的抓图照片地址 */
  ImageUrl?: string;

  /**最近一次的抓图时间 */
  ImageTime?: Date;

  /**AI模型列表 */
  AIModels?: CameraAIModel[];

  /* 流媒体ID */
  SRSId?: string;

  /* 流媒体服务器ID */
  SRServerId?: string;
}

export { Camera };
