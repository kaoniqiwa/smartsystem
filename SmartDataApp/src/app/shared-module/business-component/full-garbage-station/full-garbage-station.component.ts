import { Component, OnInit } from '@angular/core';
import { DataService } from "./business/data.service";
import {BusinessService  } from "./business/full-garbage-station-table";

@Component({
  selector: 'hw-full-garbage-station',
  templateUrl: './full-garbage-station.component.html',
  providers: [DataService, BusinessService]
})
export class FullGarbageStationComponent implements OnInit {

  searchFn = (val: string) => {
    const filter = this.dataService.statistics.filter(x => x.Name.indexOf(val) > -1),
    filterX = this.dataService.garbageStations.filter(x => x.Name.indexOf(val) > -1);
    this.businessService.loadTableData(filter, filterX);
  }
  constructor(private dataService: DataService
    , private businessService: BusinessService) {
      
  }

  async ngOnInit() {
   
    this.dataService.statistics=await   this.dataService.stationStatistic();
    this.dataService.garbageStations=await this.dataService.requestStations();
 
    
    this.businessService.loadTableData(this.dataService.statistics, this.dataService.garbageStations);
  }

}
