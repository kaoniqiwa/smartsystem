import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { GarbageStationType } from "../../../data-core/model/waste-regulation/garbage-station-type";
import { GarbageStationFormService } from "./service/garbage-station-form.service";
import { FormControl, FormGroup } from "@angular/forms";
import {
  CameraTableField,
  FormField,
  FormOperate,
  FormResult,
} from "./model/garbage-station-form.model";
import { Validators } from "@angular/forms";
import { MessageBar } from "src/app/common/tool/message-bar";
import { Camera } from "../../../data-core/model/aiop/camera.model";
import {
  CustomTableArgs,
  TableIconTextTagAttr,
} from "src/app/shared-module/custom-table/custom-table-model";
import { Language } from "src/app/common/tool/language";
import { EncodeDevice } from "../../../data-core/model/aiop/encoded-device.model";
import { CameraTable } from "./service/camera-table";
import { CameraParams } from "src/app/data-core/params/camera.params";
import { EncodedDeviceParams } from "src/app/data-core/params/encoded-device.params";
import { GarbageStationCamera } from "src/app/data-core/model/aiop/garbage-station-camera.model";
import { HWPaginationOptions } from "src/app/common/directive/pagination-directive";

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

  private _cameraTable = new CameraTable();

  // 摄像机列表请求参数
  private _cameraParams: CameraParams = {
    PageIndex: 1,
    PageSize: 10,
    RegionIdNullable: true,
  };

  // 编码设备请求参数
  private _encodedDeviceParams: EncodedDeviceParams = {
    PageIndex: 1,
    PageSize: 10,
  };

  // 编码设备列表
  private _encodedDeviceArr: EncodeDevice[] = [];

  // 未绑定的摄像机
  private _cameras: Camera[] = [];

  private _selectedCameraIds: string[] = [];

  title: string = "添加垃圾厢房";

  // 垃圾厢房类型
  stationType: GarbageStationType[];

  @Output() formOperateEvent: EventEmitter<FormResult> = new EventEmitter();

  garbageStationFormGroup = new FormGroup({
    Name: new FormControl("", Validators.required),
    StationType: new FormControl(1, Validators.required),
    SearchText: new FormControl(""),
  });

  dataSource: CustomTableArgs<CameraTableField> = this._cameraTable.dataSource;

  constructor(private garbageStationFormService: GarbageStationFormService) {}

  async ngOnInit() {
    this._encodedDeviceArr =
      await this.garbageStationFormService.listEncodeDevices(
        this._encodedDeviceParams
      );
    console.log("编码设备", this._encodedDeviceArr);
    this._cameraTable.encodedDeviceArr = this._encodedDeviceArr;

    this.stationType =
      await this.garbageStationFormService.listGarbageStationTypes();
    console.log("垃圾厢房类型", this.stationType);

    let page = await this._createCameraTable();
    this._cameraTable.dataSource.paginationOptions = new HWPaginationOptions(
      page.PageCount,
      (pageIndex) => {
        console.log("回调", pageIndex);
        // if (pageIndex == this._cameraParams.PageIndex) return;
        // this._cameraParams.PageIndex = pageIndex;
        // this._createCameraTable();
      }
    );
  }
  private async _createCameraTable() {
    // 先加载摄像机列表数据

    let res = await this.garbageStationFormService.listCamers(
      this._cameraParams
    );
    console.log("摄像机列表", res.Data);

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
  // 使用Output()将pageIndex抛给form,而不是使用回调函数
  changePage(pageIndex: number) {
    if (pageIndex == this._cameraParams.PageIndex) return;
    this._cameraParams.PageIndex = pageIndex;
    this._createCameraTable();
  }

  onSubmit(e: Event) {
    if (this._checkForm()) {
      // 找到选中的 Item
      let selectedCameras = this._selectedCameraIds.map((cameraId) => {
        return this._cameras.find((camera) => camera.Id == cameraId);
      });

      const formField = this.garbageStationFormGroup.value as FormField;
      const formResult: FormResult = {
        data: formField,
        operate: FormOperate.submit,
        cameras: selectedCameras,
      };
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
  search() {}

  selectTableItem(data: string[]) {
    this._selectedCameraIds = data;
  }
}
