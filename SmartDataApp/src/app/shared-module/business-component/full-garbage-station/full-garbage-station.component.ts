import { Component, OnInit } from '@angular/core'; 
import {BusinessService  } from "./business/full-garbage-station-table";

@Component({
  selector: 'hw-full-garbage-station',
  templateUrl: './full-garbage-station.component.html',
  providers: [BusinessService]
})
export class FullGarbageStationComponent implements OnInit {

  searchFn =async (val: string) => {
    this.businessService.search.searchText=val;
    this.businessService.search.state = true;
    await this.businessService.requestData(1, (page) => {
      this.businessService.table.initPagination(page, async (index) => {
        await this.businessService.requestData(index);
      });
    });  
  }
  constructor(
     private businessService: BusinessService) {
      
  }

  async ngOnInit() {    
    this.businessService.statistics=await this.businessService.stationStatistic();
    await this.businessService.requestData(1, (page) => {
      this.businessService.table.initPagination(page, async (index) => {
        await this.businessService.requestData(index);
      });
    });  
  }

}
