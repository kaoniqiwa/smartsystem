
    /**
     * AI模型信息
     */
export class CameraAIModel {
    Id: string;
    /**
     * 数据集ID(可选)
     */
    DataSetId: string;
    Version: string;
    /**
     * 应用类型，一般是设备型号(可选)
     */
    TransformType: string;
    ModelType: string;
    ModelName: string;
    /**
     * 模型数据传输对象的格式(可选)
     */
    ModelDTO: CameraAIModelDTO|string; 
    /**
     *  JSON文件的BASE64， 创建时必须填写
     */
    ModelJSON:string;
    CreateTime: string;
    UpdateTime: string;
}

    /**
     * 模型数据传输对象的格式
     */
export class CameraAIModelDTO {
    ModelId: string;
    ModelType: number | null;
    /**
     * 模型数据标签(可选)
     */
    Labels: CameraAIModelDTOLabel[];
}

    /**
     * AI摄像机模型DTO标签
     */
export class CameraAIModelDTOLabel {
    ModelId: string;
    ModelType: number | null;
    LabelId: string;
    LabelName: string;
    Unit: string;
    DataType: string;
    DataValue: string;
    EnumValues: EnumValue[];
    /**
     * 子标签、子属性(可选)
     */
    Labels: CameraAIModelDTOLabel[];
}

export class EnumValue {
    Value: number;
    Description: string;
}