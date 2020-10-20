import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DataService } from "./business/data-service";
import { RegionCameraTree } from "./business/region-camera-tree";
import { CustomTreeComponent } from "../../../shared-module/custom-tree/custom-tree.component";
import { NodeTypeEnum } from '../../common/tree.service';
import { ColorEnum, FlatNode } from '../../../shared-module/custom-tree/custom-tree';
import { DataService as  StationCameraDataService} from "../deploy-camera/business/data.service";
import { Camera, GetGarbageStationCamerasParams } from "../../../data-core/model/waste-regulation/camera";
@Component({
  selector: 'hw-region-camera-tree',
  templateUrl: './region-camera-tree.component.html',
  providers: [DataService, RegionCameraTree,StationCameraDataService]
})
export class RegionCameraTreeComponent implements OnInit {

  @ViewChild('cameraTree')
  cameraTree: CustomTreeComponent;

  @Input()
  selectedItemFn: (item: FlatNode) => void;

  selectedItemClick = (item: FlatNode) => {
    if (this.selectedItemFn) this.selectedItemFn(item);
  }  
  @Input()
  reloadStateFn:()=>void;

  searchTree = (text: string) => {
    const dataSource = this.regionCameraTree.filterNodes(text, NodeTypeEnum.camera);
    this.cameraTree.clearNestedNode();
    this.cameraTree.dataSource.data = dataSource;
    this.cameraTree.treeControl.expandAll();
    if(this.reloadStateFn)this.reloadStateFn();
  }

  constructor(private regionCameraTree: RegionCameraTree
    ,private stationCameraDataService:StationCameraDataService
    , public dataService: DataService) { }

  async ngOnInit() {
    this.dataService.regions = await this.dataService.requestRegion();
    this.dataService.cameras = await this.dataService.allCamera(this.dataService.regions);
    this.regionCameraTree.regionModel = this.dataService.regions;
    this.regionCameraTree.cameraModel = this.dataService.cameras;
    this.regionCameraTree.convertCameraTreeNode();
    this.regionCameraTree.loadCameraTree();
    this.cameraTree.dataSource.data = this.regionCameraTree.treeNode;

    const cameras=await this.stationCameraDataService.getCamera(null,null);
this.fillCameraTreeState(cameras);
  }

  fillCameraTreeState(cameras: Camera[]) {
    const nodes = this.findBindCameraNode(false);
    if (cameras) {
        for (const c of cameras) {
            const node = nodes.find(x => x.id == c.Id);
            if (node && c.PositionNo) {
                node.labelColor = ColorEnum.green;
                node.rightClassBtn = new Array();
            }
        }
    }
}

  findNode(id: string) {
    for (let key of this.cameraTree.flatNodeMap.keys())
      if (key.id == id)
        return key;
  }

  findBindCameraNode(use: boolean) {
    const nodes = new Array<FlatNode>();
    for (let key of this.cameraTree.flatNodeMap.keys())
     {
      if (key.iconClass == "howell-icon-video" && key.rightClassBtn.length == 0 && use)
      nodes.push(key);
    else if (key.iconClass == "howell-icon-video" && key.rightClassBtn.length > 0 && use == false)
      nodes.push(key);
      
     }
    return nodes;
  }
}
