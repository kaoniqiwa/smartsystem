import { ResourceLabel } from "./single-result";
import { PlatformAssociation } from "./iplatform-access";
import { GisPoint } from "./igis-point";

    /**
     * 
     */
export class Resource {
    Id: string;
    Name: string;
    ResourceType: string;
    /**
     * 
     */
    ParentResourceId: string;
    Description: string;
    CreateTime: string;
    UpdateTime: string;
    /**
     * 
     */
    RegionPath: string;
    /**
     * 
     */
    RegionPathName: string;
    /**
     * 
     */
    Labels: ResourceLabel[];
    GisPoint: GisPoint;
    MapElementId: string;
    /**
     * 
     */
    PlatformAssociation: PlatformAssociation;
}