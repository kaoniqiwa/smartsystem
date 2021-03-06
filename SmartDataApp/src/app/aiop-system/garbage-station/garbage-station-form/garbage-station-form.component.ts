import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
} from "@angular/core";
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
import { EncodeDevice } from "src/app/data-core/model/aiop/encode-device";

import { Camera as CameraModel } from "src/app/data-core/model/waste-regulation/camera";
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import { AiopCamera } from "src/app/data-core/model/aiop/camera";
import { fromEvent } from "rxjs";
import { throttleTime } from "rxjs/operators";
import { ITableField } from "../../common/ITableField";
import { CustomTableComponent } from "src/app/shared-module/custom-table/custom-table.component";
import { ConfirmDialog } from "src/app/shared-module/confirm-dialog/confirm-dialog.component";

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

  private _aiopTableAttrs = [
    new TableAttr({
      HeadTitleName: "名称",
      tdWidth: "25%",
      tdInnerAttrName: "name",
    }),
    new TableAttr({
      HeadTitleName: "类型",
      tdWidth: "25%",
      tdInnerAttrName: "cameraType",
    }),
    new TableAttr({
      HeadTitleName: "编码设备",
      tdWidth: "25%",
      tdInnerAttrName: "encodeDevice",
    }),
  ];
  private _stationTableAttrs = [
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

  // 分页
  private pageIndex: number = 1;

  // 编码设备列表
  private _encodedDeviceArr: EncodeDevice[] = [];

  //aiop摄像机
  private _aiopCameras: AiopCamera[] = [];

  // 垃圾厢房下的摄像机
  private _stationCameras: CameraModel[] = [];

  // 选中的表格Item
  private _selectedCameraIds: string[] = [];

  /******** public ***********/

  @ViewChild("table")
  tableComponent: CustomTableComponent;

  @ViewChild("searchInput")
  searchInput?: ElementRef;

  @ViewChild("searchInput2")
  searchInput2?: ElementRef;

  @Input() formState: FormState = FormState.none;

  // 编辑状态使用
  @Input() garbageStationId: string = "";

  // 创建状态使用
  @Input() divisionId: string = "";

  // 表格关闭的原因
  @Output() formOperateEvent: EventEmitter<FormResult> = new EventEmitter();

  title: string = "";

  // 点击删除按钮更改状态
  showDialog = false;

  // 点击添加按钮更改状态
  showAddTable = false;

  confirmDialog = new ConfirmDialog();

  garbageStation!: GarbageStation;

  // 垃圾厢房类型
  stationType: GarbageStationType[];

  garbageStationFormGroup = new FormGroup({
    Name: new FormControl("", Validators.required),
    StationType: new FormControl(1, Validators.required),
    SearchText: new FormControl(""),
  });

  dataSource: CustomTableArgs<ITableField> = this._cameraTable.dataSource;

  searchText: string = "";

  constructor(private _garbageStationFormService: GarbageStationFormService) {}

  async ngOnInit() {
    // fromEvent(this.searchInput.nativeElement, "keyup")
    //   .pipe(throttleTime(500))
    //   .subscribe((e: KeyboardEvent) => {
    //     if (e.key.toLocaleLowerCase() == "enter") {
    //       console.log("enter");
    //       this.searchHandler();
    //     }
    //   });

    this._encodedDeviceArr =
      await this._garbageStationFormService.listEncodeDevices();
    // console.log("编码设备", this._encodedDeviceArr);

    this.stationType =
      await this._garbageStationFormService.listGarbageStationTypes();
    // console.log("垃圾厢房类型", this.stationType);

    if (this.formState == FormState.create) {
      this.title = "添加垃圾厢房";
      this._cameraTable.dataSource.tableAttrs = this._aiopTableAttrs;

      this._cameraTable.encodedDeviceArr = this._encodedDeviceArr;
      await this._createAiopCameraTable();
    } else if (this.formState == FormState.edit) {
      this.title = "编辑垃圾厢房";
      if (this.garbageStationId) {
        this._cameraTable.dataSource.tableAttrs = this._stationTableAttrs;
        // this._cameraTable.dataSource.footArgs = new FootArgs({
        //   hasSelectBtn: false,
        //   hasCount: false,
        //   hasSelectCount: false,
        // });

        // 当前垃圾厢房信息
        this.garbageStation =
          await this._garbageStationFormService.getGarbageStation(
            this.garbageStationId
          );
        this.garbageStationFormGroup.patchValue({
          Name: this.garbageStation.Name,
          StationType: this.garbageStation.StationType,
        });
        await this._createStationCameraTable();
      }
    }
  }
  private async _createAiopCameraTable() {
    // 先加载摄像机列表数据
    let res = await this._garbageStationFormService.listAiopCamers(
      this.pageIndex,
      this.searchText
    );
    // console.log("摄像机列表", res);
    let data = res.Data.Data;
    data.sort((a, b) => {
      return "".naturalCompare(a.Name, b.Name);
    });
    this._aiopCameras = [...data];
    this._cameraTable.clearItems();
    this.tableComponent.selectCancel(); // 拉取新数据时,要重置按钮的选中状态
    this._cameraTable.aiopCameraToTableField(
      this._aiopCameras,
      this._cameraTable.dataSource
    );
  }
  private async _createStationCameraTable() {
    let data = await this._garbageStationFormService.listStationCameras(
      this.garbageStation.Id,
      this.searchText
    );
    data.sort((a, b) => {
      return "".naturalCompare(a.Name, b.Name);
    });

    this._stationCameras = data;
    this._cameraTable.clearItems();
    this.tableComponent.selectCancel();
    this._cameraTable.stationCameraToTableField(
      this._stationCameras,
      this._cameraTable.dataSource
    );
  }
  // 使用Output()将pageIndex抛给form,而不是使用回调函数
  changePage(pageIndex: number) {
    if (pageIndex == this.pageIndex) return;
    this.pageIndex = pageIndex;
    this._createAiopCameraTable();
  }

  onSubmit(e: Event) {
    if (this._checkForm()) {
      // console.log(this._selectedCameraIds);
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
          return this._aiopCameras.find((camera) => camera.Id == cameraId);
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
    this.searchText = this.garbageStationFormGroup.get("SearchText").value;
    // console.log("搜索内容", this.searchText);

    if (this.formState == FormState.create) {
      await this._createAiopCameraTable();
    } else if (this.formState == FormState.edit) {
      await this._createStationCameraTable();
    }
  }
  async searchHandler2() {
    this._createAiopCameraTable();
    // console.log(this.searchInput2);
    // console.log(this.searchText);
  }

  selectTableItem(data: string[]) {
    this._selectedCameraIds = data;
    console.log("items", this._selectedCameraIds);
  }
  async delBtnClick() {
    this.showDialog = true;
  }
  async dialogMsg(msg: string) {
    console.log(msg);
    this.showDialog = false;
    if (msg == "ok") {
      let cameraIds = Array.from(this._selectedCameraIds);
      for (let i = 0; i < cameraIds.length; i++) {
        let id = cameraIds[i];
        await this._garbageStationFormService.deleteStationCamera(
          this.garbageStationId,
          id
        );
        this.tableComponent.deleteListItem(id);
      }
      MessageBar.response_success();
    } else if (msg == "cancel") {
    }
  }
  async addBtnClick() {
    console.log("add");
    this.showAddTable = true;
    this.searchText = "";
    this.garbageStationFormGroup.patchValue({
      SearchText: "",
    });
    this._cameraTable.dataSource.tableAttrs = this._aiopTableAttrs;

    await this._createAiopCameraTable();
  }
  async addAiopCamera() {
    let selectedCameras = this._selectedCameraIds.map((cameraId) => {
      return this._aiopCameras.find((camera) => camera.Id == cameraId);
    });
    console.log(selectedCameras);
    let arr = selectedCameras.map((item) => {
      let aiopCamera: AiopCamera = item;
      let camera = new CameraModel();
      camera.Id = aiopCamera.Id;
      camera.Name = aiopCamera.Name;
      camera.GarbageStationId = this.garbageStationId;
      // console.log("新建摄像机", camera);

      return this._garbageStationFormService.addCameraToGarbageStation(camera);
    });
    Promise.all(arr).then((res) => {
      console.log(res);
      console.log(this.searchText);
      this.showAddTable = false;
      this.searchText = "";
      this.garbageStationFormGroup.patchValue({
        SearchText: "",
      });
      this._cameraTable.dataSource.tableAttrs = this._stationTableAttrs;
      this._createStationCameraTable();
      MessageBar.response_success();
    });
  }
  cancelAiopCamera() {
    this.showAddTable = false;
    this.searchText = "";
    this.garbageStationFormGroup.patchValue({
      SearchText: "",
    });
    this._cameraTable.dataSource.tableAttrs = this._stationTableAttrs;
    this._createStationCameraTable();
  }
}
