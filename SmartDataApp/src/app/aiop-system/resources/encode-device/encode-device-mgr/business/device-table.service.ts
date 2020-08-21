import { Injectable } from "@angular/core";
import { EncodeDeviceRequestService, LabelRequestService, ResourceLabelRequestService } from "../../../../../data-core/repuest/resources.service";
import { TableAttribute, TableSearchEnum, SearchHelper, ListAttribute } from "../../../../../common/tool/table-form-helper";
import { GetEncodeDevicesParams } from "../../../../../data-core/model/encode-devices-params";
import { DeviceTable, EncodeDevices } from "./device-table";
import { EncodeDevice } from "../../../../../data-core/model/encode-device";
import { CustomTableEvent } from "../../../../../shared-module/custom-table/custom-table-event";
import { ResourceLabel } from "../../../../../data-core/model/resource-label";
import { InputTagArea } from "../../../../../shared-module/input-tag-area/input-tag-area";
import { GetResourceLabelsParams } from "../../../../../data-core/model/resource-labels-params";
import { ResourcesRequest } from "../../../../common/resources-request";
import    "../../../../../common/string/hw-string";
@Injectable()
export class DeviceTableService extends ResourcesRequest<EncodeDevice>{
    deviceTable = new DeviceTable();
    constructor(private requestService: EncodeDeviceRequestService
        , public labelRequestService: LabelRequestService
        , public resourceLabelRequestService: ResourceLabelRequestService) {
        super(labelRequestService,resourceLabelRequestService);
        this.deviceTable.findItemFn = (id: string) => {
            return this.findDevice(id);
        }
        this.deviceTable.addItemFn = (item: EncodeDevice) => {
            this.dataSource.push(item);
        }
        this.deviceTable.updateItemFn = (item: EncodeDevice) => {
            const findItem = this.dataSource.find(x => x.Id == item.Id);
            if (findItem) {
                for (var key in item)
                    findItem[key] = item[key]

            }
        }
        this.deviceTable.scrollPageFn = (event: CustomTableEvent) => {
            this.requestData(event.data as any);
            this.searchData(event.data as any);
        }

        this.deviceTable.labels.createFn = async (item: InputTagArea, fn: (id: string) => void) => {
            const model = new ResourceLabel();
            model.Name = item.text;
            model.Id = '';
            const val = await this.createResourceLabel(model);
            fn(val.data.Data.Id);
        }

        this.deviceTable.labels.delFn = async (item: InputTagArea, fn: (success: boolean) => void) => {
            const val = await this.delResourceLabel(item.id);
            fn(val.status == 200);
        }

        this.deviceTable.labels.bind = (items: InputTagArea[]) => {
            const bind = items.filter(x => x.type == 1 && x.checked == true && x.del == false);
            const unbind = items.filter(x => x.type == 2 && x.checked == true);
            var use = false;
            this.deviceTable.tableSelectIds.map(async (id) => {
                const item = this.dataSource.find(d => d.Id == id);
                if (item) {
                    for (const x of bind) {
                        const index = item.Labels.findIndex(y => y.Id == x.id);
                        if (index == -1) {
                            const response = await this.bindResourceLabel(item.Id, x.id);
                            this.updateItemLabels(true, id, response.data.Data);
                            this.deviceTable.updateItemLabels(true, id, response.data.Data);
                        }
                    }
                    for (const x of unbind) {
                        const index = item.Labels.findIndex(y => y.Id == x.id);
                        if (index > -1){
                            const response = await this.unBindResourceLabel(item.Id, x.id);
                            this.updateItemLabels(false, id, response.data.Data);
                            this.deviceTable.updateItemLabels(false, id, response.data.Data);
                        }
                           
                    }
                    if (use == false) {
                        this.deviceTable.labels.messageBar.response_success();
                        this.deviceTable.labels.show = false;
                        this.deviceTable.labels.clearDataSource();
                        use = true;
                    }
                }
            });


        }
    }

    async requestData(pageIndex: number) {
        if (this.search.state == false) {
            const response = await this.requestService.list(this.getRequsetParam(TableSearchEnum.none, pageIndex));
            let data = new EncodeDevices();  
            data.items = response.data.Data.Data.sort((a,b)=>{
                return ''.naturalCompare(a.Name,b.Name);
            });
            this.deviceTable.Convert(data, this.deviceTable.dataSource);
            this.deviceTable.totalCount = response.data.Data.Page.TotalRecordCount;
            this.dataSource = [...this.dataSource, ...response.data.Data.Data];
        }

    }

    async requestResourceLabels() {
        const param = new GetResourceLabelsParams();
        param.PageIndex = 1;
        param.PageSize = new ListAttribute().maxSize;
        const response = await this.labelRequestService.list(param);
        this.deviceTable.labels.dataSource = response.data.Data.Data;
    }

    async searchData(pageIndex: number) {
        if (this.search.state && (pageIndex == 1 || this.deviceTable.maxPageIndex)) {
            const response = await this.requestService.list(this.getRequsetParam(TableSearchEnum.search, pageIndex, this.search.text));
            let data = new EncodeDevices();
            data.items = response.data.Data.Data.sort((a,b)=>{
                return ''.naturalCompare(a.Name,b.Name);
            });;
            if (pageIndex == 1) {
                this.deviceTable.clearItems();
                this.dataSource = [];
            }
            this.deviceTable.Convert(data, this.deviceTable.dataSource);
            this.deviceTable.totalCount = response.data.Data.Page.TotalRecordCount;

            this.dataSource = [...this.dataSource, ...response.data.Data.Data];

        }

    }

    async delDevicesData(ids: string[]) {
        for (const id of ids) {
            await this.requestService.del(id);
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

    findDevice(id: string) {
        return this.dataSource.find(x => x.Id == id);
    }


    getRequsetParam(paramType: TableSearchEnum, pageIndex: number, name?: string) {
        let param = new GetEncodeDevicesParams();
        param.PageIndex = pageIndex;
        param.PageSize = this.pageSize;
        if (paramType == TableSearchEnum.none) {

        }
        else if (paramType == TableSearchEnum.search) {
            if (name.trim()) param.Name = name;
        }
        return param;
    }
}