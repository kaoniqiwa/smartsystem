import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { GarbageStationType } from "../../../data-core/model/waste-regulation/garbage-station-type";
import { GarbageStationFormService } from "./business/garbage-station-form.service";
import { FormControl, FormGroup } from "@angular/forms";
import {
  CameraTableField,
  FormDatas,
  FormField,
  FormOperate,
  FormResult,
  FormState,
} from "./model/garbage-station-form.model";
import { Validators } from "@angular/forms";
import { MessageBar } from "src/app/common/tool/message-bar";
import {
  CustomTableArgs,
  FootArgs,
  TableAttr,
} from "src/app/shared-module/custom-table/custom-table-model";
import { CameraTable } from "./business/camera-table";
import { EncodedDeviceParams } from "src/app/data-core/params/encoded-device.params";
import { HWPaginationOptions } from "src/app/common/directive/pagination-directive";
import { EncodeDevice } from "src/app/data-core/model/aiop/encode-device";
import { SearchControl } from "./business/search";

import { Camera as CameraModel } from "src/app/data-core/model/waste-regulation/camera";
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import { Page, PagedList } from "src/app/data-core/model/page";
import { HowellResponse } from "src/app/data-core/model/response";
import { AiopCamera } from "src/app/data-core/model/aiop/camera";

@Component({
  selector: "garbage-station-form",
  templateUrl: "./garbage-station-form.component.html",
  styleUrls: ["./garbage-station-form.component.less"],
  providers: [GarbageStationFormService],
})
export class GarbageStationFormComponent implements OnInit {
  /**
   * pmx 2021-08-06
   */

  /******** private ***********/

  private _cameraTable = new CameraTable();

  private pageIndex: number = 1;

  private staionPageIndex: number = 1;
  private stationPageSize: number = 2;

  // 编码设备列表
  private _encodedDeviceArr: EncodeDevice[] = [];

  // 未绑定的摄像机
  private _cameras: AiopCamera[] = [];

  private _stationCameras: CameraModel[] = [];

  private _selectedCameraIds: string[] = [];

  /******** public ***********/

  @Input() formState: FormState = FormState.none;
  @Input() garbageStationId: string = "";
  @Input() divisionId: string = "";

  @Output() formOperateEvent: EventEmitter<FormResult> = new EventEmitter();

  title: string = "";

  garbageStation: GarbageStation | null = null;

  // 垃圾厢房类型
  stationType: GarbageStationType[];

  garbageStationFormGroup = new FormGroup({
    Name: new FormControl("", Validators.required),
    StationType: new FormControl(1, Validators.required),
    SearchText: new FormControl(""),
  });

  dataSource: CustomTableArgs<CameraTableField> = this._cameraTable.dataSource;

  searchText: string = "";

  constructor(private _garbageStationFormService: GarbageStationFormService) {
    this._cameraTable.dataSource.footArgs = new FootArgs({
      hasSelectBtn: false,
    });
  }

  async ngOnInit() {
    this._encodedDeviceArr =
      await this._garbageStationFormService.listEncodeDevices();
    console.log("编码设备", this._encodedDeviceArr);

    this.stationType =
      await this._garbageStationFormService.listGarbageStationTypes();
    console.log("垃圾厢房类型", this.stationType);

    if (this.formState == FormState.create) {
      this.title = "添加垃圾厢房";
      this._cameraTable.encodedDeviceArr = this._encodedDeviceArr;
      this._cameraTable.dataSource.footArgs = new FootArgs({
        hasSelectBtn: true,
      });

      let page = await this._createCameraTable();
      this._cameraTable.dataSource.paginationOptions = new HWPaginationOptions(
        page.PageCount,
        (pageIndex) => {
          console.log("回调", pageIndex);
        }
      );
    } else if (this.formState == FormState.edit) {
      this.title = "编辑垃圾厢房";
      if (this.garbageStationId) {
        this.garbageStation =
          await this._garbageStationFormService.getGarbageStation(
            this.garbageStationId
          );
        this._stationCameras = this.garbageStation.Cameras;
        this.garbageStationFormGroup.patchValue({
          Name: this.garbageStation.Name,
          StationType: this.garbageStation.StationType,
        });

        this._cameraTable.dataSource.tableAttrs = [
          new TableAttr({
            HeadTitleName: "名称",
            tdWidth: "25%",
            tdInnerAttrName: "name",
          }),
          new TableAttr({
            HeadTitleName: "在线状态",
            tdWidth: "25%",
            tdInnerAttrName: "onlineStatus",
          }),
          new TableAttr({
            HeadTitleName: "用途",
            tdWidth: "25%",
            tdInnerAttrName: "cameraUsage",
          }),
        ];

        let page = this._createLocalTable(this._stationCameras);
        this._cameraTable.dataSource.paginationOptions =
          new HWPaginationOptions(page.PageCount, (pageIndex) => {
            console.log("回调", pageIndex);
          });
      }
      console.log(this.garbageStation);
    }
  }
  private async _createCameraTable() {
    // 先加载摄像机列表数据
    let res = await this._garbageStationFormService.listCamers(
      this.pageIndex,
      this.searchText
    );
    console.log("摄像机列表", res);
    let data = res.Data.Data;
    let page = res.Data.Page;
    data.sort((a, b) => {
      return "".naturalCompare(a.Name, b.Name);
    });
    this._cameras = [...data];
    this._cameraTable.clearItems();
    this._cameraTable.cameraToTableField(
      this._cameras,
      this._cameraTable.dataSource
    );
    this._cameraTable.totalCount = page.TotalRecordCount;
    return page;
  }
  private _createLocalTable(stationCameras: CameraModel[]) {
    let totalCount = this._stationCameras.length;
    let pageCount = (totalCount / this.stationPageSize) | 0;

    let page: Page = {
      PageIndex: this.staionPageIndex,
      PageCount: pageCount,
      PageSize: this.stationPageSize,
      RecordCount: 6,
      TotalRecordCount: totalCount,
    };
    this._cameraTable.clearItems();
    this._cameraTable.cameraToTableFieldLocal(
      stationCameras,
      this._cameraTable.dataSource
    );

    this._cameraTable.totalCount = page.TotalRecordCount;

    return page;
  }
  // 使用Output()将pageIndex抛给form,而不是使用回调函数
  changePage(pageIndex: number) {
    if (pageIndex == this.pageIndex) return;
    this.pageIndex = pageIndex;
    this._createCameraTable();
  }

  onSubmit(e: Event) {
    if (this._checkForm()) {
      // 表单参数
      const formField = this.garbageStationFormGroup.value as FormField;

      // 关闭表单的原因
      const formResult: FormResult = {
        operate: FormOperate.submit,
      };

      const data: FormDatas = {
        state: this.formState,
      };
      if (this.formState == FormState.create) {
        let garbageStation: GarbageStation = new GarbageStation();
        garbageStation.Id = "";
        garbageStation.Name = formField.Name;
        garbageStation.StationType = formField.StationType;
        garbageStation.DivisionId = this.divisionId;
        garbageStation.UpdateTime = new Date();
        garbageStation.CreateTime = new Date();
        garbageStation.MaxDryVolume = 0;
        garbageStation.MaxWetVolume = 0;

        // 找到选中的 Item
        let selectedCameras = this._selectedCameraIds.map((cameraId) => {
          return this._cameras.find((camera) => camera.Id == cameraId);
        });
        data.station = garbageStation;
        data.cameras = selectedCameras;
      } else if (this.formState == FormState.edit) {
        this.garbageStation.Name = formField.Name;
        this.garbageStation.StationType = formField.StationType;
        data.station = this.garbageStation;
      }
      formResult.data = data;
      this.formOperateEvent.emit(formResult);
    }
  }
  private _checkForm() {
    if (this.garbageStationFormGroup.get("Name").invalid) {
      MessageBar.response_warning("名称不能为空");
      return false;
    }
    return true;
  }

  onCancel() {
    const formResult: FormResult = {
      operate: FormOperate.cancel,
    };
    this.formOperateEvent.emit(formResult);
  }
  async searchHandler() {
    console.log(this.searchText);
    this.searchText = this.garbageStationFormGroup.get("SearchText").value;
    if (this.formState == FormState.create) {
      let page = await this._createCameraTable();
      this._cameraTable.dataSource.paginationOptions = new HWPaginationOptions(
        page.PageCount,
        (pageIndex) => {
          console.log("回调", pageIndex);
        }
      );
    } else if (this.formState == FormState.edit) {
      let stationCameras = this._stationCameras.filter((camera) =>
        camera.Name.includes(this.searchText)
      );
      this._createLocalTable(stationCameras);
    }
  }

  selectTableItem(data: string[]) {
    this._selectedCameraIds = data;
  }
}
