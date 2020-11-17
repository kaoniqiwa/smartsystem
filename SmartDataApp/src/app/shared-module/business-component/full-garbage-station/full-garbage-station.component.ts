import { Component, OnInit ,Input} from '@angular/core'; 
import {BusinessService  } from "./business/full-garbage-station-table";
@Component({
  selector: 'hw-full-garbage-station',
  templateUrl: './full-garbage-station.component.html',
  providers: [BusinessService]
})
export class FullGarbageStationComponent implements OnInit {

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

  galleryTargetFn = () => {
    this.businessService.galleryTargetView.galleryTarget = null;
  }
  videoClose = () => {
    this.businessService.playVideo = null;
  }
  constructor(
     private businessService: BusinessService) { 
  }

  async ngOnInit() {    
    this.businessService.divisionId=this.divisionsId;
    this.businessService.cameras=await this.businessService.resourceCameraDao.allResourceCameras();
    await this.businessService.requestData(1, (page) => {
      this.businessService.table.initPagination(page, async (index) => {
        await this.businessService.requestData(index);
      });
    });  
  }

}
