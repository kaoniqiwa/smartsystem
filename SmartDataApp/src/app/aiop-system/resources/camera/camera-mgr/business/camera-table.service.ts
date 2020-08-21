import { Injectable } from "@angular/core";
import { CameraRequestService, EncodeDeviceRequestService, LabelRequestService, ResourceLabelRequestService } from "../../../../../data-core/repuest/resources.service";
import { TableAttribute, TableSearchEnum, ListAttribute } from "../../../../../common/tool/table-form-helper";
import { CameraTable, Cameras } from "./camera-table";
import { Camera } from "../../../../../data-core/model/camera";
import { GetCamerasParams, GetEncodeDevicesParams } from "../../../../../data-core/model/encode-devices-params";
import { EncodeDevice } from "../../../../../data-core/model/encode-device";
import { CustomTableEvent } from "../../../../../shared-module/custom-table/custom-table-event";
import { GetResourceLabelsParams } from "../../../../../data-core/model/resource-labels-params";
import { ResourceLabel } from "../../../../../data-core/model/resource-label";
import { InputTagArea } from "../../../../../shared-module/input-tag-area/input-tag-area";
import { ResourcesRequest } from "../../../../common/resources-request";
import "../../../../../common/string/hw-string";
import { FormGroup } from "@angular/forms"; 
@Injectable()
export class CameraTableService extends ResourcesRequest<Camera> {
    cameraTable = new CameraTable();
    encodeDevices = Array<EncodeDevice>(); 
    constructor(private cameraRequestService: CameraRequestService
        , public labelRequestService: LabelRequestService
        , public resourceLabelRequestService: ResourceLabelRequestService
        , private encodeDeviceRequestService: EncodeDeviceRequestService) {
        super(labelRequestService, resourceLabelRequestService);
        this.cameraTable.findDeviceFn = (id: string) => {
            return this.findDevice(id);
        }
        this.cameraTable.findItemFn = (id: string) => {
            return this.findCamera(id);
        }
        this.cameraTable.addItemFn = (item: Camera) => {
            this.dataSource.push(item);
        }
        this.cameraTable.updateItemFn = (item: Camera) => {
            const findItem = this.dataSource.find(x => x.Id == item.Id);
            if (findItem) {
                for (var key in item)
                    findItem[key] = item[key]

            }
        }
        this.cameraTable.scrollPageFn = (event: CustomTableEvent) => {
            this.requestCamerasData(event.data as any);
            this.searchCamerasData(event.data as any);
        }
        this.cameraTable.labels.createFn = async (item: InputTagArea, fn: (id: string) => void) => {
            const model = new ResourceLabel();
            model.Name = item.text;
            model.Id = '';
            const val = await this.createResourceLabel(model);
            fn(val.data.Data.Id);
        }

        this.cameraTable.labels.delFn = async (item: InputTagArea, fn: (success: boolean) => void) => {
            const val = await this.delResourceLabel(item.id);
            fn(val.status == 200);
        }

        this.cameraTable.labels.bind = (items: InputTagArea[]) => {
            const bind = items.filter(x => x.type == 1 && x.checked == true && x.del == false);
            const unbind = items.filter(x => x.type == 2 && x.checked == true);
            var use = false;
            this.cameraTable.tableSelectIds.map(async (id) => {
                const item = this.dataSource.find(d => d.Id == id);
                if (item) {
                    for (const x of bind) {
                        const index = item.Labels.findIndex(y => y.Id == x.id);
                        if (index == -1) {
                            const response = await this.bindResourceLabel(item.Id, x.id);
                            this.updateItemLabels(true, id, response.data.Data);
                            this.cameraTable.updateItemLabels(true, id, response.data.Data);
                        }
                    }
                    for (const x of unbind) {
                        const index = item.Labels.findIndex(y => y.Id == x.id);
                        if (index > -1) {
                            const response = await this.unBindResourceLabel(item.Id, x.id);
                            this.updateItemLabels(false, id, response.data.Data);
                            this.cameraTable.updateItemLabels(false, id, response.data.Data);
                        }

                    }
                    if (use == false) {
                        this.cameraTable.labels.messageBar.response_success();
                        this.cameraTable.labels.show = false;
                        this.cameraTable.labels.clearDataSource();
                        use = true;
                    }
                }
            });


        }
    }


    async requestResourceLabels() {
        const param = new GetResourceLabelsParams();
        param.PageIndex = 1;
        param.PageSize = new ListAttribute().maxSize;
        const response = await this.labelRequestService.list(param);
        this.cameraTable.labels.dataSource = response.data.Data.Data;
        this.cameraTable.searchControl.toInputTagSelect( response.data.Data.Data);
    }

    async requestEncodeDevices() {
        const param = new GetEncodeDevicesParams();
        param.PageIndex = 1;
        param.PageSize = new ListAttribute().maxSize;
        const response = await this.encodeDeviceRequestService.list(param);
        this.encodeDevices = response.data.Data.Data; 
    }

    async requestCamerasData(pageIndex: number) {
        if (this.search.state == false) {
            const response = await this.cameraRequestService.list(this.getRequsetParam(TableSearchEnum.none, pageIndex));
            let data = new Cameras();

            data.items = response.data.Data.Data.sort((a, b) => {
                return ''.naturalCompare(a.Name, b.Name);
            });
            this.cameraTable.Convert(data, this.cameraTable.dataSource);
            this.cameraTable.totalCount = response.data.Data.Page.TotalRecordCount;
            this.dataSource = [...this.dataSource, ...response.data.Data.Data];
        }
    }

    async searchCamerasData(pageIndex: number) {

        if (this.search.state && (pageIndex == 1 || this.cameraTable.maxPageIndex)) {
            const response = await this.cameraRequestService.list(this.getRequsetParam(TableSearchEnum.search, pageIndex, this.cameraTable.searchform));
            let data = new Cameras();
            data.items = response.data.Data.Data.sort((a, b) => {
                return ''.naturalCompare(a.Name, b.Name);
            });
            if (pageIndex == 1) {
                this.cameraTable.clearItems();
                this.dataSource = [];
            }
            this.cameraTable.Convert(data, this.cameraTable.dataSource);
            this.cameraTable.totalCount = response.data.Data.Page.TotalRecordCount;
            this.dataSource = [...this.dataSource, ...response.data.Data.Data];
        }
    }

    async delCamerasData(ids: string[]) {
        for (const id of ids) {
            await this.cameraRequestService.del(id);
            this.delDataItem(id);
        }
    }

    delDataItem(id: string) {
        const index = this.dataSource.findIndex(x => x.Id == id);
        if (index > -1)
            this.dataSource.splice(index, 1);
    }

    updateItemLabels(add: boolean, devId: string, label: ResourceLabel) {
        const index = this.dataSource.findIndex(i => i.Id == devId);
        if (add && index > -1) {
            this.dataSource[index].Labels.push(label);
        }
        else if (add == false && index > -1) {
            const lIndex = this.dataSource[index].Labels.findIndex(x => x.Id == label.Id);
            if (lIndex > -1) this.dataSource[index].Labels.splice(lIndex, 1);
        }
    }

    findCamera(id: string) {
        return this.dataSource.find(x => x.Id == id);
    }

    findDevice(id: string) {
        return this.encodeDevices.find(x => x.Id == id);
    }

    getRequsetParam(paramType: TableSearchEnum, pageIndex: number, search?: FormGroup) {
        let param = new GetCamerasParams();
        param.PageIndex = pageIndex;
        param.PageSize = this.pageSize;
        if (paramType == TableSearchEnum.none) {

        }
        else if (paramType == TableSearchEnum.search) {
            const searchParam = this.cameraTable.searchControl.toSearchParam();
            if (searchParam.Name)
                param.Name = searchParam.Name;
            if (searchParam.CameraType)
                param.CameraTypes = [Number.parseInt(searchParam.CameraType)];
        }
        return param;
    }


}