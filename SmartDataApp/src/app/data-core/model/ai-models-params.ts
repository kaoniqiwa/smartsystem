
/**
 * 获取资源标签列表请求参数
 */
export class GetAIModelsParams {
    
    PageIndex: number | null;
    PageSize: number | null;
    /**
     * 
     */
    ModelIds: string[];
    /**
     * 数据集ID(可选)
     */
    DataSetIds: string[];
    /**
     *  应用类型，支持LIKE(可选)
     */
    TransformType: string;
    /**
     * 
     */
    ModelType: string;
    /**
     * 
     */
    ModelName: string;
}