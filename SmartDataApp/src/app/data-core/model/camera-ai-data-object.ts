import { Point } from "./Point";


    /**
     * AI摄像机识别的目标
     */
export class CameraAIDataObject {
    Id: string;
    /**
     * 目标所在的归一化多边形
     */
    Polygon: Point[];
    /**
     * 置信度：0-100
     */
    Confidence: number;
    /**
     * 是否有效(可选)
     */
    Valid: boolean | null;
    /**
     * 是否可见(可选)
     */
    Visible: boolean | null;
    ObjectImageUrl: string;
    /**
     *  标签信息，包括所有子标签 (可选)
     */
    Labels: CameraAIDataObjectLabel[];
}

    /**
     * 
     */
export class CameraAIDataObjectLabel {
    ModelId: string;
    LabelId: string;
    LabelName: string;
    /**
     * 
     */
    Confidence: number;
    Unit: string;
    /**
     * 
     */
    DataType: string;
    /**
     * 
     */
    DataValue: string;
    /**
     * 
     */
    IsLeaf: boolean | null;
    /**
     * 
     */
    ParentLabelId: string;
}