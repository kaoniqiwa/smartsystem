import { Component, OnInit,Input } from '@angular/core'; 
import {  BusinessService} from "./business/garbage-station-table";
 
@Component({
  selector: 'hw-garbage-station',
  templateUrl: './garbage-station.component.html',
  providers: [BusinessService]
})
export class GarbageStationComponent implements OnInit {

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
  constructor(private businessService:BusinessService) { }

  async ngOnInit() {
   this.businessService.divisionsId=this.divisionsId;
    this.businessService.garbageStationTypes = await this.businessService.requestGarbageStationType();
    this.businessService.divisions = await this.businessService.requestDivisions();
    await this.businessService.requestData(1, (page) => {
      this.businessService.table.initPagination(page, async (index) => {
        await this.businessService.requestData(index);
      });
    });   
  }

}
