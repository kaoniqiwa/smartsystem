import { Injectable } from "@angular/core";
import { RegionRequestService } from "../../../../data-core/repuest/region.service";
import { Region } from "../../../../data-core/model/region"; 
import { RegionTree } from "./region-tree";
import { MessageBar } from "../../../../common/tool/message-bar";
import { RegionTreeService } from "../../../common/region-tree.service";
@Injectable()
export class RegionMgrService extends RegionTreeService {
    regionTree = new RegionTree();
    msg = new MessageBar(); 

    constructor(public regionRequestService: RegionRequestService) {
        super(regionRequestService);
        this.regionTree.findRegion = (id: string) => {
            return this.dataSource.find(x => x.Id == id);
        }
        this.regionTree.filterNodes = (text: string) => { 
             return this.filterNodes(text);
        }
    } 

    async addDefaultRegion() {
        var region = new Region();
        region.Name = '默认区域';
        region.UpdateTime = new Date().toISOString();
        region.Id = '';
        region.IsLeaf = false;
        region.RegionType = 1;
        region.CreateTime = new Date().toISOString();
        const response = await this.regionRequestService.create(region).toPromise();
        this.dataSource = [response.Data];
    }

    async delRegionData(id: string) {
        const item = this.dataSource.find(x => x.Id == id), rootLen = this.dataSource.filter(x => x.IsLeaf == false);
        if (item.IsLeaf == false && rootLen.length == 1) {
            //this.msg.response_warning('至少有一个目录');
            return false;
        }
        const response = await this.regionRequestService.del(id).toPromise();
        if (response.FaultCode == 200) {
            this.delItem = id;
            this.msg.response_success();
            return true;
        }
    }

}
