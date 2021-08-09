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
import { CameraRequestService } from "src/app/data-core/repuest/garbage-station.service";
import { GarbageStationCamera } from "src/app/data-core/model/aiop/garbage-station-camera.model";
import { Camera } from "src/app/data-core/model/waste-regulation/camera";

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
    private stationTypeDataService: StationTypeDataService,
    private businessService: BusinessService,
    private _cc: CameraRequestService
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
    console.log("表单数据", result);
    if (result.data) {
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
      let res = await this._garbageStationManageService.createGarbageStation(
        garbageStation
      );
      if (res) {
        console.log("新建厢房", res);

        this.businessService.table.addItem(res as any);

        debugger;

        let c = result.cameras[0];
        let camera = new Camera();
        camera.Id = c.Id;
        camera.Name = c.Name;
        camera.CameraUsage = 9;
        // camera.PositionNo = 6;

        camera.GarbageStationId = res.Id;

        console.log("新建摄像机", camera);

        // let stationCamera: GarbageStationCamera = {
        //   ...result.cameras[0],
        //   GarbageStationId: res.Id,
        // };
        // console.log(stationCamera);
        this._cc.create(camera);
      }
    } else {
    }
    this.closeForm();
  }
  // 当前表格选中的选项
  selectTableItem(data) {
    // console.log("selecte table", data);
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
