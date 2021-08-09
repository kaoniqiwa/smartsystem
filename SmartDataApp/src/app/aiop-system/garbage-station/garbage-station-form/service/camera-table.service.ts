import { Injectable } from "@angular/core";
import { InputLabelService } from "src/app/aiop-system/common/input-label";
import { MessageBar } from "src/app/common/tool/message-bar";
import { ListAttribute } from "src/app/common/tool/table-form-helper";
import { EncodeDevice } from "src/app/data-core/model/aiop/encode-device";
import { GetEncodeDevicesParams } from "src/app/data-core/model/aiop/encode-devices-params";
import { ResourceLabel } from "src/app/data-core/model/aiop/resource-label";
import { Page } from "src/app/data-core/model/page";
import {
  CameraRequestService,
  EncodeDeviceRequestService,
  LabelRequestService,
  ResourceLabelRequestService,
} from "src/app/data-core/repuest/resources.service";
import { CustomTableEvent } from "src/app/shared-module/custom-table/custom-table-event";
import { InputTagArea } from "src/app/shared-module/input-tag-area/input-tag-area";
import { Camera } from "../../../../data-core/model/aiop/camera.model";
import { CameraTable } from "./camera-table";
import { SearchControl } from "./search";

@Injectable()
export class CameraTableService extends InputLabelService {
  dataSource_ = new Array<Camera>();

  set dataSource(items: Camera[]) {
    for (const x of items) this.dataSource_.push(x);
  }

  get dataSource() {
    return this.dataSource_;
  }
  cameraTable = new CameraTable();
  encodeDevices = Array<EncodeDevice>();
  search = new SearchControl();
  clearTableSelectItemFn: () => void;
  createLabelFn = async (item: InputTagArea, fn: (id: string) => void) => {
    await this.createLabel(item, (id) => fn(id));
  };
  delLabelFn = async (item: InputTagArea, fn: (success: boolean) => void) => {
    await this.delLabel(item, (success) => fn(success));
  };
  bindLabelsFn = (items: InputTagArea[]) => {
    this.bindLabel(
      this.cameraTable.tableSelectIds,
      items,
      (add, devId, label) => {
        this.updateItemLabels(add, devId, label);
      },
      (add, devId, label) => {
        this.cameraTable.updateItemLabels(add, devId, label);
      }
    );
  };
  constructor(
    private cameraRequestService: CameraRequestService,
    public labelRequestService: LabelRequestService,
    public resourceLabelRequestService: ResourceLabelRequestService,
    private encodeDeviceRequestService: EncodeDeviceRequestService
  ) {
    super(labelRequestService, resourceLabelRequestService);
    // this.cameraTable.findDeviceFn = (id: string) => {
    //   return this.findDevice(id);
    // };
    this.cameraTable.findItemFn = (id: string) => {
      return this.findCamera(id);
    };
    this.cameraTable.addItemFn = (item: Camera) => {
      this.dataSource.push(item);
    };
    this.cameraTable.updateItemFn = (item: Camera) => {
      const findItem = this.dataSource.find((x) => x.Id == item.Id);
      if (findItem) {
        for (var key in item) findItem[key] = item[key];
      }
    };

    // this.findResourceFn = (id: string) => {
    //   return this.findCamera(id);
    // };

    this.cameraTable.scrollPageFn = (event: CustomTableEvent) => {
      this.requestCamerasData(event.data as any);
      this.searchCamerasData(event.data as any);
    };

    // this.regionTree.loadRegionCameras = async (regionId: string) => {
    //   this.search.clearState();
    //   this.clearTableSelectItemFn();
    //   await this.requestCamerasData(1, (page) => {
    //     this.cameraTable.initPagination(page, async (index) => {
    //       await this.requestCamerasData(index);
    //     });
    //   });
    // };
  }

  async requestEncodeDevices() {
    const param = new GetEncodeDevicesParams();
    param.PageIndex = 1;
    param.PageSize = new ListAttribute().maxSize;
    const response = await this.encodeDeviceRequestService
      .list(param)
      .toPromise();
    this.encodeDevices = response.Data.Data;
    console.log("编码设备", this.encodeDevices);
  }

  async requestCamerasData(pageIndex: number, callBack?: (page: Page) => void) {
    // if (this.search.state == false) {
    //   const response = await this.cameraRequestService
    //     .list(this.getRequsetParam(pageIndex, this.search))
    //     .toPromise();
    //   let data = new Cameras();
    //   data.items = response.Data.Data.sort((a, b) => {
    //     return "".naturalCompare(a.Name, b.Name);
    //   });
    //   this.cameraTable.clearItems();
    //   this.dataSource = [];
    //   this.cameraTable.Convert(data, this.cameraTable.dataSource);
    //   this.cameraTable.totalCount = response.Data.Page.TotalRecordCount;
    //   this.dataSource = response.Data.Data;
    //   console.log(this.cameraTable.dataSource);
    //   console.log("摄像机", response.Data.Data);
    //   if (callBack) callBack(response.Data.Page);
    // }
  }

  async searchCamerasData(pageIndex: number, callBack?: (page: Page) => void) {
    // if (this.search.state) {
    //   const response = await this.cameraRequestService
    //     .list(this.getRequsetParam(pageIndex, this.search))
    //     .toPromise();
    //   let data = new Cameras();
    //   data.items = response.Data.Data.sort((a, b) => {
    //     return "".naturalCompare(a.Name, b.Name);
    //   });
    //   this.cameraTable.clearItems();
    //   this.dataSource = [];
    //   this.cameraTable.Convert(data, this.cameraTable.dataSource);
    //   this.cameraTable.totalCount = response.Data.Page.TotalRecordCount;
    //   this.dataSource = response.Data.Data;
    //   if (callBack) callBack(response.Data.Page);
    // }
  }

  async editCamera(camera: Camera) {
    // const response = await this.cameraRequestService.set(camera).toPromise();
    // return response.FaultCode == 0;
  }

  async delCamerasData(ids: string[]) {
    // for (const id of ids) {
    //   await this.cameraRequestService.del(id).toPromise();
    //   this.delDataItem(id);
    // }
    // MessageBar.response_success();
  }

  delDataItem(id: string) {
    const index = this.dataSource.findIndex((x) => x.Id == id);
    if (index > -1) this.dataSource.splice(index, 1);
  }

  updateItemLabels(add: boolean, devId: string, label: ResourceLabel) {
    const index = this.dataSource.findIndex((i) => i.Id == devId);
    if (add && index > -1) {
      this.dataSource[index].Labels.push(label);
    } else if (add == false && index > -1) {
      const lIndex = this.dataSource[index].Labels.findIndex(
        (x) => x.Id == label.Id
      );
      if (lIndex > -1) this.dataSource[index].Labels.splice(lIndex, 1);
    }
  }

  findCamera(id: string) {
    return this.dataSource.find((x) => x.Id == id);
  }

  findDevice(id: string) {
    return this.encodeDevices.find((x) => x.Id == id);
  }

  getRequsetParam(pageIndex: number, search: SearchControl) {
    // let param = new GetCamerasParams();
    // param.PageIndex = pageIndex;
    // param.PageSize = 10; //new TableAttribute().pageSize;
    // if (this.regionTree.selectedNodeId)
    //   param.RegionIds = [this.regionTree.selectedNodeId];
    // else param.RegionIdNullable = true;
    // const s = search.toSearchParam();
    // if (s.SearchText && search.other == false) {
    //   param.Name = s.SearchText;
    //   // param.Labels = [s.SearchText];
    // } else {
    //   if (s.Name) param.Name = s.Name;
    //   if (s.EncodeDeviceId) param.EncodeDeviceIds = [s.EncodeDeviceId];
    //   if (s.CameraType) param.CameraTypes = [Number.parseInt(s.CameraType)];
    //   if (s.AndLabelIds.length) param.AndLabelIds = s.AndLabelIds;
    // }
    // return param;
  }
}
