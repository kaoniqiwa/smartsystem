/**
 *
 */
export class GetAIModelsParams {
  PageIndex?: number;
  PageSize?: number;
  ModelIds: string[];
  DataSetIds: string[];
  TransformType: string;
  ModelType: string;
  ModelName: string;
}

/**
 *
 */
export class GetCameraAIEventRecordsParams {
  PageIndex?: number;
  PageSize?: number;
  BeginTime: string;
  EndTime: string;
  EventTypes: number[];
  /**
   *
   */
  ResourceIds: string[];
  /**
   *
   */
  ResourceTypes: string[];
  /**
   *
   */
  ResourceName: string;
  ModelIds: string[];
  ModelName: string;
  /**
   * 目标标签参数(可选)
   */
  ObjectLabels: ObjectLabelsParams[];
}

/**
 *
 */
export class ObjectLabelsParams {
  LabelId: string;
  LabelName: string;
  /**
   * 置信度最小值(可选)：0-100
   */
  MinConfidence?: number;
  /**
   *  置信度最大值(可选)：0-100
   */
  MaxConfidence?: number;
}
