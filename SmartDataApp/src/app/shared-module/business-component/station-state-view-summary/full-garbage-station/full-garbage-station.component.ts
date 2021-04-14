import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {BusinessService  } from "./business/full-garbage-station-table";
import { HWVideoService } from "../../../../data-core/dao/video-dao";
@Component({
  selector: 'hw-full-garbage-station',
  templateUrl: './full-garbage-station.component.html',
  providers: [BusinessService,HWVideoService]
})
export class FullGarbageStationComponent implements OnInit {

  @Output() OtherViewEvent = new EventEmitter<OtherViewEnum>();
  @Input() divisionsId = '';
  searchFn =async (val: string) => {
    this.businessService.search.searchText=val;
    this.businessService.search.state = true;
    await this.businessService.requestData(1, (page) => {
      this.businessService.table.initPagination(page, async (index) => {
        await this.businessService.requestData(index);
      });
    });  
  }
  otherView = OtherViewEnum;
  galleryTargetFn = () => {
    this.businessService.galleryTargetView.galleryTarget = null;
  }
  videoClose = () => {
    this.businessService.playVideo = null;
  }
  constructor(
    videoService:HWVideoService
    , private businessService: BusinessService) { 
      this.businessService.videoService=videoService;
  }

  async ngOnInit() {    
    this.businessService.divisionId=this.divisionsId;
    this.businessService.divisions=await this.businessService.divisionDao.allDivisions();
    this.businessService.cameras=await this.businessService.resourceCameraDao.allResourceCameras();
    await this.businessService.requestData(1, (page) => {
      this.businessService.table.initPagination(page, async (index) => {
        await this.businessService.requestData(index);
      });
    });  
  }

  changeOtherView(val: OtherViewEnum) {
    setTimeout(() => {
      this.OtherViewEvent.emit(val);
    }, 50);
  }
}


export enum OtherViewEnum {
  event,
  info
}