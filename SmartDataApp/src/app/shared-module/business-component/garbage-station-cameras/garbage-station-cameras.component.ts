import { Component, OnInit ,Input} from '@angular/core'; 
import { CameraTableService ,CameraStateTableEnum} from "./business/camera-table.service";

@Component({
  selector: 'hw-garbage-station-cameras',
  templateUrl: './garbage-station-cameras.component.html',
  providers: [CameraTableService]
})
export class GarbageStationCamerasComponent implements OnInit {

  @Input() cameraStateTable  =CameraStateTableEnum.none;

  searchFn =async (text:string)=>{  
    this.tableService.search.state=true;
    this.tableService.search.searchText = text; 
    await this.tableService.requestData(1, (page) => {
      this.tableService.table.initPagination(page, async (index) => {
        await this.tableService.requestData(index);
      });
    });
 }
  constructor(private tableService: CameraTableService) { 
  }

  async ngOnInit() {
    this.tableService.cameraStateTable = this.cameraStateTable;
    await this.tableService.getGarbageStations();  
    await this.tableService.requestData(1, (page) => {
      this.tableService.table.initPagination(page, async (index) => {
        await this.tableService.requestData(index);
      });
    });
  }



   
}
