import { Component, OnInit,ViewChild } from '@angular/core';
import {  DataService } from "./business/data-service";
import {RegionCameraTree  } from "./business/region-camera-tree";
import { CustomTreeComponent } from "../../../shared-module/custom-tree/custom-tree.component";

@Component({
  selector: 'hw-region-camera-tree',
  templateUrl: './region-camera-tree.component.html',  
  providers:[DataService,RegionCameraTree]
})
export class RegionCameraTreeComponent implements OnInit {

 @ViewChild('cameraTree')
  cameraTree:CustomTreeComponent;
  constructor(private regionCameraTree: RegionCameraTree
    , private dataService: DataService) { }

  async ngOnInit() {
    this.dataService.regions = await this.dataService.requestRegion();
    this.dataService.cameras=   await  this.dataService.allCamera(this.dataService.regions);
    this.regionCameraTree.regionModel = this.dataService.regions;
    this.regionCameraTree.cameraModel = this.dataService.cameras;
    this.regionCameraTree.convertCameraTreeNode();
    this.regionCameraTree.loadCameraTree();
    this.cameraTree.dataSource.data = this.regionCameraTree.treeNode; 

  }

}