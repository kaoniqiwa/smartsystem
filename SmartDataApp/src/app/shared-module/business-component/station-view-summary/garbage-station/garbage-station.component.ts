import { Component, OnInit,Input ,Output,EventEmitter} from '@angular/core'; 
import {  BusinessService} from "./business/garbage-station-table";
import {  OtherViewEnum } from "../view-helper"; 
@Component({
  selector: 'hw-garbage-station',
  templateUrl: './garbage-station.component.html',
  providers: [BusinessService]
})
export class GarbageStationComponent implements OnInit {
  @Output() OtherViewEvent = new EventEmitter<OtherViewEnum>();
  @Input() divisionsId = '';
  otherView = OtherViewEnum;
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
  videoClose = () => {
    this.businessService.playVideo = null;
  }
  constructor(private businessService:BusinessService) { }

  async ngOnInit() {
   this.businessService.divisionsId=this.divisionsId;
   this.businessService.cameras=await this.businessService.resourceCameraDao.allResourceCameras();
    this.businessService.garbageStationTypes = await this.businessService.requestGarbageStationType();
    this.businessService.divisions = await this.businessService.requestDivisions();
    await this.businessService.requestData(1, (page) => {
      this.businessService.table.initPagination(page, async (index) => {
        await this.businessService.requestData(index);
      });
    });   
  }
  changeOtherView(val: OtherViewEnum) {
    setTimeout(() => {
      this.OtherViewEvent.emit(val);
    },240);
  }
}
 