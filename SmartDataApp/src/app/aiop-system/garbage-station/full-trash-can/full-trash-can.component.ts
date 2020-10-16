import { Component, OnInit } from '@angular/core';
import { DataService } from "./business/business.service";
import {BusinessService  } from "./business/trash-can-table";
@Component({
  selector: 'app-full-trash-can',
  templateUrl: './full-trash-can.component.html',
  styleUrls: ['./full-trash-can.component.styl'],
  providers: [DataService, BusinessService]
})
export class FullTrashCanComponent implements OnInit {

  searchFn = (val: string) => {
    const filter = this.dataService.statistics.filter(x => x.Name.indexOf(val) > -1);
    this.businessService.loadTableData(filter);
  }
  constructor(private dataService: DataService
    , private businessService: BusinessService) {
      
  }

  async ngOnInit() {
   
    this.dataService.statistics=await   this.dataService.stationStatistic();
    this.businessService.loadTableData(this.dataService.statistics);
  }
 
}
