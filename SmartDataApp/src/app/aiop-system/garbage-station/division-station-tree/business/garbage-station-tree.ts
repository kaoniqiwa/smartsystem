
import { GarbageStationMini ,GarbageStations,Divisions,DivisionMini,TreeService, NodeTypeEnum}from "../../../common/tree.service";  
import { GarbageStation} from "../../../../data-core/model/waste-regulation/garbage-station"; 
import { Division} from "../../../../data-core/model/waste-regulation/division";  
import { TreeListMode, TreeNode } from "../../../../shared-module/custom-tree/custom-tree";
import { Injectable } from "@angular/core"; 

@Injectable()
export class StationTreeService extends TreeService{

    treeNode:TreeNode[] = new Array();
    garbageStations = new GarbageStations();
    divisions = new Divisions();
   
     
    constructor(){
        super();
        this.garbageStations.items = new Array();
        this.divisions.items=new Array();
       
    }

    set garbageStationModel(models:GarbageStation[]){
        const dao =new  GarbageStationDao();
        dao.items=models;  
        this.convert(dao);
        
    }

    set divisionModel(models:Division[]){
        const dao =new  RegionDao();
        dao.items=models;  
        this.convert(dao);
    }

    set cityDivisionModel(models:Division[]){
        const dao =new  CityRegionDao();
        dao.items=models;  
        this.convert(dao);
    }

    convertStationTreeNode(){ 
       const nodeA= this.convertTreeNode(this.garbageStations),
       nodeB= this.convertTreeNode(this.divisions); 
        this.dataSource = [...nodeA,...nodeB];         
    }

    loadStationTree(){
        this.treeNode=this.loadTree(this.dataSource); 
    }


    convert<GarbageStationDao>(input:GarbageStationDao):void;
    convert<RegionDao>(input:RegionDao):void;
    convert<CityRegionDao>(input:CityRegionDao):void;
    convert(input:GarbageStationDao|RegionDao|CityRegionDao){    
      
        if(input instanceof GarbageStationDao){          
            for (const item of input.items) {
                const mini = new GarbageStationMini();   
                mini.id=item.Id;
                mini.name=item.Name;
                mini.divisionId=item.DivisionId;
                mini.stationType=item.StationType;  
                this.garbageStations.items.push(mini);
            }
        }
       else if(input instanceof RegionDao){           
            for (const item of input.items) {
                const mini = new DivisionMini();   
                mini.id=item.Id;
                mini.name=item.Name;
                mini.isLeaf=item.IsLeaf;
                mini.parentId=item.ParentId;    
                this.divisions.items.push(mini);
            }
        }  
        else if(input instanceof CityRegionDao){
           
            for (const item of input.items) {
                const mini = new DivisionMini();   
                mini.id=item.Id;
                mini.name=item.Name;
                mini.isLeaf=item.IsLeaf;
                mini.parentId=item.ParentId;    
                mini.divisionType=item.DivisionType;
                this.divisions.items.push(mini);
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

export class GarbageStationDao{
    items:GarbageStation[];
}

export class RegionDao{
    items:Division[];
}

export class CityRegionDao{
    items:Division[];
}