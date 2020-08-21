import { Injectable } from "@angular/core";
import { PlatformRequestSerivce } from "../../../../data-core/repuest/platform.service";
import { TableSearchEnum, TableAttribute, SearchHelper } from "../../../../common/tool/table-form-helper";
import { GetPlatformsParams } from "../../../../data-core/model/platforms-Params";
import { Platforms, PlatformTable } from "./platform-table";
import { Platform } from "../../../../data-core/model/platform";
import { DatePipe } from "@angular/common";
import { CustomTableEvent } from "../../../../shared-module/custom-table/custom-table-event";
import '../../../../common/string/hw-string';
@Injectable()
export class PlatformMgrService extends TableAttribute {
    dataSource_ = new Array<Platform>();
    search = new SearchHelper();
    table = new PlatformTable(this.datePipe);
    constructor(private requestSerivce: PlatformRequestSerivce, private datePipe: DatePipe) {
        super();

        this.table.findItemFn = (id: string) => {
            return this.findItem(id);
        }
        this.table.addItemFn = (item: Platform) => {
            this.dataSource.push(item);
        }
        this.table.updateItemFn = (item: Platform) => {
            const findItem = this.dataSource.find(x => x.Id == item.Id);
            if (findItem) {
                for (var key in item)
                    findItem[key] = item[key];
            }
        }
        this.table.scrollPageFn = (event: CustomTableEvent) => {
            this.getPlatformData(event.data as any);
            this.searchPlatformData(event.data as any);
        } 
    }

    set dataSource(items: Platform[]) {
        for (const x of items)
            this.dataSource_.push(x);
    }

    get dataSource() {
        return this.dataSource_;
    }

    async getPlatformData(pageIndex: number) {
        if (this.search.state == false) {
            const response = await this.requestSerivce.list(this.getRequsetParam(TableSearchEnum.none, pageIndex));
            let data = new Platforms(); 
            data.items = response.data.Data.Data.sort((a, b) => {
                return ''.naturalCompare(a.Name, b.Name);
            });;
            this.table.Convert(data, this.table.dataSource);
            this.table.totalCount = response.data.Data.Page.TotalRecordCount;
            this.dataSource = response.data.Data.Data;
        }
    }

    async searchPlatformData(pageIndex: number) {
        if (this.search.state) {
            const response = await this.requestSerivce.list(this.getRequsetParam(TableSearchEnum.search, pageIndex, this.search.text));
            let data = new Platforms();
            data.items = response.data.Data.Data.sort((a,b)=>{
                return ''.naturalCompare(a.Name,b.Name);
            });;
            if (pageIndex == 1) {
                this.table.clearItems();
                this.dataSource = [];
            }
            this.table.Convert(data, this.table.dataSource);
            this.table.totalCount = response.data.Data.Page.TotalRecordCount;
            this.dataSource = response.data.Data.Data;
        }
    }

    async  syncPlatform(id:string){
        await  this.requestSerivce.sync(id);  
    }

    
    async delPlatformsData(ids: string[]) {
        for (const id of ids) {
            await this.requestSerivce.del(id);
            this.delDataItem(id);
            this.table.msg.response_success();
        }
    }

    delDataItem(id: string) {
        const index = this.dataSource.findIndex(x => x.Id == id);
        if (index > -1)
            this.dataSource.splice(index, 1);
    }

    findItem(id: string) {
        return this.dataSource.find(x => x.Id == id);
    }

    getRequsetParam(paramType: TableSearchEnum, pageIndex: number, name?: string) {
        let param = new GetPlatformsParams();
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