
    /**
     * 
     */
export class GetResourcesParams {
    PageIndex: number | null;
    PageSize: number | null;
    PlatformIds: string[];
    Name: string;
    ResourceType: string;
    Labels: string[];
    /**
     * 
     */
    LabelIds: string[];
    /**
     * 
     */
    AndLabels: string[];
    /**
     * 
     */
    AndLabelIds: string[];
    /**
     * 
     */
    PlatformId: string;
}