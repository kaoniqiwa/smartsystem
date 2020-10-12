
import { Regions,RegionMini,Cameras,CameraMini,TreeService} from "../../../common/tree.service";  
import {Region  } from "../../../../data-core/model/aiop/region";
import { Camera } from "../../../../data-core/model/aiop/camera"; 
import { TreeListMode, TreeNode } from "../../../../shared-module/custom-tree/custom-tree";
export class RegionCameraTree extends   TreeService{
    treeNode:TreeNode[] = new Array();

    regions = new Regions();
    cameras = new Cameras();
    treeListMode = TreeListMode.rightBtn;
    constructor(){
        super();
        this.regions.items = new Array();
        this.cameras.items=new Array();
    }

    set regionModel(models:Region[]){
        const dao =new  RegionDao();
        dao.items=models; 
        this.convert(dao);
    }

    set cameraModel(models:Camera[]){
        const dao =new  CameraDao();
        dao.items=models; 
        this.convert(dao);
    } 

    convertCameraTreeNode(){ 
       const nodeA=  this.convertTreeNode(this.regions),
        nodeB=this.convertTreeNode(this.cameras); 
        this.dataSource = [...nodeA,...nodeB]; 
    }

    loadCameraTree(){
        this.treeNode=this.loadTree(this.dataSource);
    }

    convert<CameraDao>(input:CameraDao):void;
    convert<RegionDao>(input:RegionDao):void;
    convert(input:CameraDao|RegionDao){    
      
        if(input instanceof CameraDao){          
            for (const item of input.items) {
                const mini = new CameraMini();   
                mini.id=item.Id;
                mini.name=item.Name;
                mini.regionId=item.RegionId; 
                this.cameras.items.push(mini);
            }
        }
       else if(input instanceof RegionDao){
          
            for (const item of input.items) {
                const mini = new RegionMini();   
                mini.id=item.Id;
                mini.name=item.Name;
                mini.isLeaf=item.IsLeaf;
                mini.parentId=item.ParentId;    
                this.regions.items.push(mini);
            }
        }
    }

    isLastNode(nodeId:string) {
        var is = false; 
        const nodes = this.allLastChilds(this.treeNode);
        for (const n of nodes)
            if (n.id == nodeId)
                is = true;
        return is;
    }
}

export class CameraDao{
    items:Camera[];
}

export class RegionDao{
    items:Region[];
}