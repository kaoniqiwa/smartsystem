import { Injectable } from "@angular/core";
import { Region, GetRegionsParams } from "../../data-core/model/region";
import { RegionRequestService } from "../../data-core/repuest/region.service";
import { ListAttribute } from "../../common/tool/table-form-helper";
import { TreeNode } from "../../shared-module/custom-tree/custom-tree";

@Injectable()
export class  RegionTreeService extends ListAttribute{
   public dataSource = new Array<Region>();
    constructor(public regionRequestService: RegionRequestService) {
      super();      
    }

    
    async getRegionData() {
        const param = new GetRegionsParams();
        param.PageIndex = 1;
        param.PageSize = this.maxSize;
        const response = await this.regionRequestService.list(param);
        this.dataSource = response.data.Data.Data;

    }

    loadTree(items: Region[]) {
        const dataSource = new Array<TreeNode>();
        const addItems = (node: TreeNode, items: Region[]) => {
            for (const item of items) {
                if (node.id == item.ParentId) {
                    const node_ = new TreeNode();
                    node_.name = item.Name;
                    node_.checked = false;
                    node_.id = item.Id;

                    node.children = node.children || new Array<TreeNode>();
                    node.children.push(node_);
                    addItems(node_, items);
                }
            }
        }
        for (const item of items) {
            if (!item.ParentId) {
                const node = new TreeNode();
                node.name = item.Name;
                node.checked = false;
                node.id = item.Id;

                dataSource.push(node);
                addItems(node, items);
            }
        }
       return dataSource;
    }


    filterNodes (text: string) {
        const list = this.dataSource.filter(x => x.Name.indexOf(text) > -1 && x.ParentId);
        const parentList = this.dataSource.filter(x => !x.ParentId);
        return this.loadTree([...list, ...parentList]);
    }

    set addItem(item: Region) {
        this.dataSource.push(item);
    }

    set delItem(id: string) {
        const index = this.dataSource.findIndex(x => x.Id == id);
        if (index > -1)
            this.dataSource.splice(index, 1);
    }

    noChildNodes(id:string,len:number){           
        return this.dataSource.filter(x=>x.ParentId == id).length == len;   
    } 
}