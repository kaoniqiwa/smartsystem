import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DataService } from "./business/data-service";
import { RegionCameraTree } from "./business/region-camera-tree";
import { CustomTreeComponent } from "../../../shared-module/custom-tree/custom-tree.component";
import { NodeTypeEnum } from '../../common/tree.service';
import { FlatNode } from '../../../shared-module/custom-tree/custom-tree';

@Component({
  selector: 'hw-region-camera-tree',
  templateUrl: './region-camera-tree.component.html',
  providers: [DataService, RegionCameraTree]
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
    , public dataService: DataService) { }

  async ngOnInit() {
    this.dataService.regions = await this.dataService.requestRegion();
    this.dataService.cameras = await this.dataService.allCamera(this.dataService.regions);
    this.regionCameraTree.regionModel = this.dataService.regions;
    this.regionCameraTree.cameraModel = this.dataService.cameras;
    this.regionCameraTree.convertCameraTreeNode();
    this.regionCameraTree.loadCameraTree();
    this.cameraTree.dataSource.data = this.regionCameraTree.treeNode;

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
