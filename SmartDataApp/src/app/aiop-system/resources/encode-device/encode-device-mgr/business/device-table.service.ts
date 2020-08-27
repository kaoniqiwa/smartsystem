import { Injectable } from "@angular/core";
import { EncodeDeviceRequestService, LabelRequestService, ResourceLabelRequestService } from "../../../../../data-core/repuest/resources.service";
import { TableAttribute, TableSearchEnum, ListAttribute } from "../../../../../common/tool/table-form-helper";
import { GetEncodeDevicesParams } from "../../../../../data-core/model/encode-devices-params";
import { DeviceTable, EncodeDevices } from "./device-table";
import { EncodeDevice } from "../../../../../data-core/model/encode-device";
import { CustomTableEvent } from "../../../../../shared-module/custom-table/custom-table-event";
import { ResourceLabel } from "../../../../../data-core/model/resource-label";
import { InputTagArea } from "../../../../../shared-module/input-tag-area/input-tag-area";
import    "../../../../../common/string/hw-string";
import { InputLabelService } from "../../../../common/input-label";
import { SearchControl } from "./search";
@Injectable()
export class DeviceTableService  extends InputLabelService {
    dataSource_ = new Array<EncodeDevice>();

    set dataSource(items: EncodeDevice[]) {
        for (const x of items)
            this.dataSource_.push(x);
    }

    get dataSource() {
        return this.dataSource_;
    }

    deviceTable = new DeviceTable();
    search = new SearchControl();
    createLabelFn = async (item: InputTagArea, fn: (id: string) => void) => {
        await this.createLabel(item, (id) => fn(id));
    }
    delLabelFn = async (item: InputTagArea, fn: (success: boolean) => void) => {
        await this.delLabel(item, (success) => fn(success));
    }
    bindLabelsFn = (items: InputTagArea[]) => {
        this.bindLabel(this.deviceTable.tableSelectIds, items, (add, devId, label) => {
            this.updateItemLabels(add, devId, label);
        }, (add, devId, label) => {
            this.deviceTable.updateItemLabels(add, devId, label);
        });
    }
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
        
        this.findResourceFn = (id: string) => {
            return this.findDevice(id);
        }
    }

    async requestData(pageIndex: number) {
        if (this.search.state == false) {
            const response = await this.requestService.list(this.getRequsetParam(pageIndex,this.search));
            let data = new EncodeDevices();  
            data.items = response.data.Data.Data.sort((a,b)=>{
                return ''.naturalCompare(a.Name,b.Name);
            }); 

            this.deviceTable.clearItems();
            this.dataSource = [];
            this.deviceTable.Convert(data, this.deviceTable.dataSource);
            this.deviceTable.totalCount = response.data.Data.Page.TotalRecordCount;
            this.dataSource = response.data.Data.Data;
        }

    } 

    async searchData(pageIndex: number) {
       if (this.search.state) {
            const response = await this.requestService.list(this.getRequsetParam(pageIndex,this.search));
            let data = new EncodeDevices();
            data.items = response.data.Data.Data.sort((a,b)=>{
                return ''.naturalCompare(a.Name,b.Name);
            });
            this.deviceTable.clearItems();
            this.dataSource = [];
            this.deviceTable.Convert(data, this.deviceTable.dataSource);
            this.deviceTable.totalCount = response.data.Data.Page.TotalRecordCount;
            this.dataSource = response.data.Data.Data;
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


    getRequsetParam(pageIndex: number, search: SearchControl) { 

        let param = new GetEncodeDevicesParams();
        param.PageIndex = pageIndex;
        param.PageSize = new TableAttribute().pageSize; 
        const s = search.toSearchParam();
        if (s.SearchText&&search.other==false) {
            param.Name = s.SearchText;
            //param.Labels = [s.SearchText];

        }
        else {           
            if(s.Name)param.Name = s.Name;
            if(s.Url) param.IPAddress=s.Url;
            if(s.OnlineStatus)param.OnlineStatus=Number.parseInt(s.OnlineStatus);
            if(s.AndLabelIds.length){
                param.AndLabelIds = s.AndLabelIds;
            }
        } 
        return param;
    }
}