import { Component, OnInit, ViewChild } from "@angular/core";
import { BusinessService } from "./service/garbage-station-table";
import { DataService as DivisionStationDataService } from "../division-station-tree/business/data-service";
import { GarbageStationManageService } from "./service/garbage-station-manage.service";
import { FlatNode } from "../../../shared-module/custom-tree/custom-tree";
import { DataService as StationTypeDataService } from "../garbage-station/business/data.service";
import { CustomTableComponent } from "../../../shared-module/custom-table/custom-table.component";
import { MessageBar } from "../../../common/tool/message-bar";

import {
  FormResult,
  FormState,
} from "../garbage-station-form/model/garbage-station-form.model";
import { GarbageStation } from "src/app/data-core/model/aiop/garbage-station.model";
@Component({
  selector: "app-garbage-station-manage",
  templateUrl: "./garbage-station-manage.component.html",
  styleUrls: ["./garbage-station-manage.component.styl"],
  providers: [
    DivisionStationDataService,
    StationTypeDataService,
    GarbageStationManageService,
    BusinessService,
  ],
})
export class GarbageStationManageComponent implements OnInit {
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
      // console.log("table datasource", this.businessService.table.dataSource);
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
    private _garbageStationManageService: GarbageStationManageService,
    private stationTypeDataService: StationTypeDataService, //处理厢房类型
    private businessService: BusinessService
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
            await this._garbageStationManageService.delGarbageStation(id);
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
      console.log(result);
      let garbageStation: GarbageStation = {
        Id: "",
        Name: result.data.Name,
        StationType: result.data.StationType,
        DivisionId: this.selectedDivisionId,
        UpdateTime: new Date().toISOString(),
        CreateTime: new Date().toISOString(),
        MaxDryVolume: 0,
        MaxWetVolume: 0,
        StationState: 0,
      };
      // console.log(garbageStation);
      // let camera = result.cameras[0] as GarbageStationCamera;
      // camera.GarbageStationId = "";
      // garbageStation.Cameras = [camera];
      let res = await this._garbageStationManageService.createGarbageStation(
        garbageStation
      );
      if (res) {
        console.log(res);
        // let camera = result.cameras[0];
        // camera.CameraUsage = 9;
        // camera.UpdateTime = new Date().toISOString();
        // camera.GarbageStationId = res.Id;
        // console.log(camera);
        // this._CameraRequestService
        //   .create(camera as any)
        //   .then((res) => console.log(res));
      }
    } else {
    }
    this.closeForm();
  }
  // 当前表格选中的选项
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
