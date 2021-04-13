import { Component, OnInit,Input} from '@angular/core';
import { BusinessService } from "./business/business.service";
import { DivisionDao } from "../../../../data-core/dao/division-dao";
import {GarbageStationDao  } from "../../../../data-core/dao/garbage-station-dao"; 
import { GarbageStationCameraDao } from "../../../../data-core/dao/garbage-station-camera-dao";
// import { HWVideoService } from "../../../../data-core/dao/video-dao";
@Component({
  selector: 'hw-station-stranded',
  templateUrl: './station-stranded.component.html',
  styleUrls: ['./station-stranded.component.styl'],
  providers:[DivisionDao,GarbageStationDao,BusinessService,GarbageStationCameraDao]
})
export class StationStrandedComponent implements OnInit {

  
  @Input() divisionId = '';
  
  searchFn =async (val: string) => {
    this.businessService.search.searchText=val;
    this.businessService.search.state = true;
    await this.businessService.requestData(1, (page) => {
      this.businessService.table.initPagination(page, async (index) => {
        await this.businessService.requestData(index);
      });
    });  
  }

  galleryTargetFn = () => {
    this.businessService.galleryTargetView.galleryTarget = null;
  }
  // videoClose = () => {
  //   this.businessService.playVideo = null;
  // }

  
  
  constructor(private businessService:BusinessService
    // ,private  videoService:HWVideoService
    ,private garbageStationCameraDao:GarbageStationCameraDao
    ,private divisionDao:DivisionDao
    ,private garbageStationDao:GarbageStationDao
    ) { }

  async ngOnInit() {
  //  this.businessService.divisionsId=this.divisionId;
   
    this.businessService.cameras=await this.garbageStationCameraDao.garbageStationCameras();
    this.businessService.stations = await this.garbageStationDao.allGarbageStations();
    this.businessService.divisions = await this.divisionDao.allDivisions();
    await this.businessService.requestData(1, (page) => {
      this.businessService.table.initPagination(page, async (index) => {
        await this.businessService.requestData(index);
      });
    });   
  
    
  } 
}
