import { Component, OnInit, ViewChild } from "@angular/core";
import { CustomTableEvent } from "../../../shared-module/custom-table/custom-table-event";
import { BusinessService } from "./business/garbage-station-table";
import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
import { DataService as DivisionStationDataService } from "../division-station-tree/business/data-service";
import { DataService } from "./business/data.service";
import { FlatNode } from "../../../shared-module/custom-tree/custom-tree";
import { DataService as StationTypeDataService } from "../garbage-station/business/data.service";
import { GarbageStationFormComponent } from "../garbage-station-form/garbage-station-form.component";
import { CustomTableComponent } from "../../../shared-module/custom-table/custom-table.component";
import { MessageBar } from "../../../common/tool/message-bar";
import { Camera as CameraModel } from "src/app/data-core/model/aiop/camera";

import {
  FormField,
  FormResult,
  FormState,
} from "../garbage-station-form/model/garbage-station-form.model";
import {
  CameraRequestService,
  GarbageStationRequestService,
} from "src/app/data-core/repuest/garbage-station.service";
@Component({
  selector: "app-garbage-station-mgr",
  templateUrl: "./garbage-station-mgr.component.html",
  styleUrls: ["./garbage-station-mgr.component.styl"],
  providers: [
    DivisionStationDataService,
    StationTypeDataService,
    DataService,
    BusinessService,
  ],
})
export class GarbageStationMgrComponent implements OnInit {
  @ViewChild("table")
  tableComponent: CustomTableComponent;

  // 当前点击的区划节点
  selectedDivisionId = "";

  selectDivisionClick = async (item: FlatNode, lastNode: boolean) => {
    console.log("点击", item);
    if (lastNode) {
      this.selectedDivisionId = item.id;

      // 当前区划下的厢房
      this.divisionStationDataService.garbageStations =
        await this.divisionStationDataService.requestGarbageStation(
          null,
          this.selectedDivisionId
        );
      console.log("厢房", this.divisionStationDataService.garbageStations);

      this.businessService.loadTableData(
        this.divisionStationDataService.garbageStations
      );
      console.log("table datasource", this.businessService.table.dataSource);
    } else {
      this.selectedDivisionId = "";
      this.tableComponent.selectCancel();
      this.businessService.table.clearItems();
    }
  };

  searchList = (val: string) => {
    const filter = this.divisionStationDataService.garbageStations.filter(
      (x) => x.Name.indexOf(val) > -1
    );
    this.businessService.loadTableData(filter);
  };

  /**
   *
   * pmx 2021-06-06
   *
   */

  showForm: boolean = false;
  formState: FormState = FormState.none;

  constructor(
    private divisionStationDataService: DivisionStationDataService,
    private dataService: DataService,
    private stationTypeDataService: StationTypeDataService, //处理厢房类型
    private businessService: BusinessService,
    private garbageStationRequestService: GarbageStationRequestService,
    private _CameraRequestService: CameraRequestService
  ) {
    this.businessService.stationTypeDataService = stationTypeDataService;
    this.businessService.divisionStationDataService =
      this.divisionStationDataService;
  }

  async ngOnInit() {
    this.stationTypeDataService.types =
      await this.stationTypeDataService.requestGarbageStationType();
    console.log("厢房类型", this.stationTypeDataService.types);
  }

  get tableSelectIds() {
    return this.tableComponent.selectedId;
  }

  get selectItems() {
    return this.tableComponent.selectedId.length;
  }

  async delBtnClick() {
    if (this.tableSelectIds.length)
      this.businessService.table.setConfirmDialog(
        `删除${this.tableSelectIds.length}个选择项`,
        async () => {
          const ids = Array.from(this.tableSelectIds);
          for (const id of ids) {
            await this.dataService.delGarbageStation(id);
            this.delDataItem(id);
          }
          this.businessService.table.confirmDialog_ = null;
          MessageBar.response_success();
        }
      );
  }

  delDataItem(id: string) {
    const index = this.divisionStationDataService.garbageStations.findIndex(
      (x) => x.Id == id
    );
    if (index > -1)
      this.divisionStationDataService.garbageStations.splice(index, 1);
    this.tableComponent.deleteListItem(id);
    this.businessService.table.dataSource.footArgs.totalRecordCount -= 1;
  }
  /**
   *
   *  pmx  2021-08-06
   */
  async formOperate(result: FormResult) {
    console.log("form operate");
    if (result.data) {
      let garbageStation = new GarbageStation();
      garbageStation.Id = "";
      garbageStation.Name = result.data.Name;
      garbageStation.StationType = result.data.StationType;
      garbageStation.DivisionId = this.selectedDivisionId;
      garbageStation.UpdateTime = new Date().toISOString();
      garbageStation.CreateTime = new Date().toISOString();
      garbageStation.MaxDryVolume = 0;
      garbageStation.MaxWetVolume = 0;
      let res = await this.dataService.addGarbageStation(garbageStation);
      if (res) {
        console.log(res);
        let camera = result.cameras[0];
        camera.CameraUsage = 9;
        camera.UpdateTime = new Date().toISOString();
        camera.GarbageStationId = res.Id;
        console.log(camera);
        this._CameraRequestService
          .create(camera as any)
          .then((res) => console.log(res));
      }
    } else {
    }
    this.closeForm();
  }
  selectTableItem(data) {
    console.log("selecte table", data);
  }
  closeForm() {
    this.formState = FormState.none;
    this.showForm = false;
  }
  openForm() {
    if (this.selectedDivisionId) {
      this.showForm = true;
      this.formState = FormState.create;
    }
  }
}
