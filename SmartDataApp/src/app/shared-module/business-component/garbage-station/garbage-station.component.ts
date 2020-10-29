import { Component, OnInit } from '@angular/core';
import { DataService } from "./business/data.service";
import {  BusinessService,BusinessData} from "./business/garbage-station-table";
 
@Component({
  selector: 'hw-garbage-station',
  templateUrl: './garbage-station.component.html',
  providers: [DataService,BusinessService]
})
export class GarbageStationComponent implements OnInit {
  searchFn = (val: string) => {
    const filter = this.dataService.garbageStations.filter(x => x.Name.indexOf(val) > -1);
    this.businessService.loadTableData(new BusinessData(this.dataService.garbageStationTypes
      ,filter
      ,this.dataService.divisions));
  }
  constructor(private dataService: DataService
    ,private businessService:BusinessService) { }

  async ngOnInit() {
    this.dataService.garbageStations = await this.dataService.requestStations();
    this.dataService.garbageStationTypes = await this.dataService.requestGarbageStationType();
    this.dataService.divisions = await this.dataService.requestDivisions();
    this.businessService.loadTableData(new BusinessData(this.dataService.garbageStationTypes
      ,this.dataService.garbageStations
      ,this.dataService.divisions));
  }

}
