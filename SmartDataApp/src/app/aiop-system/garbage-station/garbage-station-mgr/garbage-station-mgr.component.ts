import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomTableEvent } from '../../../shared-module/custom-table/custom-table-event';
import { BusinessService } from "./business/garbage-station-table";
import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
import { DataService as DivisionStationDataService } from "../division-station-tree/business/data-service";
import { DataService } from "./business/data.service";
import { FlatNode } from '../../../shared-module/custom-tree/custom-tree';
import { DataService as StationTypeDataService } from "../garbage-station/business/data.service";
import { GarbageStationFormComponent } from "../garbage-station-form/garbage-station-form.component";
import { CustomTableComponent } from '../../../shared-module/custom-table/custom-table.component';
@Component({
  selector: 'app-garbage-station-mgr',
  templateUrl: './garbage-station-mgr.component.html',
  styleUrls: ['./garbage-station-mgr.component.styl'],
  providers: [DivisionStationDataService, StationTypeDataService, DataService, BusinessService]
})
export class GarbageStationMgrComponent implements OnInit {

  @ViewChild('table')
  tableComponent: CustomTableComponent;

  selectedDivisionId = '';
  selectDivisionClick = async (item: FlatNode, lastNode: boolean) => {
    if (lastNode) {
      this.selectedDivisionId = item.id;
      this.divisionStationDataService.garbageStations =
        await this.divisionStationDataService.requestGarbageStation(null, this.selectedDivisionId);
      this.businessService.loadTableData(this.divisionStationDataService.garbageStations);
    }
    else {
      this.selectedDivisionId = '';
      this.tableComponent.selectCancel();
      this.businessService.table.clearItems();
    }
  }

  searchList = (val: string) => {
    const filter = this.divisionStationDataService.garbageStations.filter(x => x.Name.indexOf(val) > -1);
    this.businessService.loadTableData(filter);
  }
  constructor(private divisionStationDataService: DivisionStationDataService
    , private dataService: DataService
    , private stationTypeDataService: StationTypeDataService
    , private businessService: BusinessService) {
    this.businessService.divisionStationDataService = this.divisionStationDataService;
  }

  async ngOnInit() {
    this.stationTypeDataService.types = await this.stationTypeDataService.requestGarbageStationType();

  }

  get tableSelectIds() {
    return this.tableComponent.selectedId;
  }

  get selectItems() {
    return this.tableComponent.selectedId.length;
  }

  async delBtnClick() {
    if (this.tableSelectIds.length)
      this.businessService.table.setConfirmDialog(`删除${this.tableSelectIds.length}个选择项`, async () => {
        for (const id of this.tableSelectIds) {
          await this.dataService.delGarbageStation(id);
          this.delDataItem(id);
        }
        this.businessService.table.confirmDialog_ = null;
        this.businessService.table.msg.response_success();
      });

  }

  delDataItem(id: string) {
    const index = this.divisionStationDataService.garbageStations.findIndex(x => x.Id == id);
    if (index > -1)
      this.divisionStationDataService.garbageStations.splice(index, 1);
    this.tableComponent.deleteListItem(id);
    this.businessService.table.dataSource.footArgs.totalRecordCount-=1;
  
  }

}
