import { Injectable } from "@angular/core";
import { PlatformRequestSerivce } from "../../../../data-core/repuest/platform.service";
import { TableSearchEnum, TableAttribute } from "../../../../common/tool/table-form-helper";
import { GetPlatformsParams } from "../../../../data-core/model/aiop/platforms-Params";
import { Platforms, PlatformTable } from "./platform-table";
import { Platform } from "../../../../data-core/model/aiop/platform";
import { DatePipe } from "@angular/common";
import { CustomTableEvent } from "../../../../shared-module/custom-table/custom-table-event";
import '../../../../common/string/hw-string';
import { SearchControl } from "./search";
import { Page } from "../../../../data-core/model/page";
@Injectable()
export class PlatformMgrService extends TableAttribute {
    dataSource_ = new Array<Platform>();
    table = new PlatformTable(this.datePipe);
    search = new SearchControl();
    constructor(private requestSerivce: PlatformRequestSerivce, private datePipe: DatePipe) {
        super();
        this.table.syncFn = async (id: string) => {
            await this.syncPlatform(id);
            this.table.msg.response_success();
        }

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

    async getPlatformData(pageIndex: number,callBack?:(page:Page)=>void) {
       if (this.search.state == false) {
            const response = await this.requestSerivce.list(this.getRequsetParam(TableSearchEnum.none, pageIndex)).toPromise();
            let data = new Platforms(); 
            data.items = response.Data.Data.sort((a, b) => {
                return ''.naturalCompare(a.Name, b.Name);
            });;
            this.table.clearItems();
            this.dataSource = [];
            this.table.Convert(data, this.table.dataSource); 
            this.table.totalCount = response.Data.Page.RecordCount;
            this.dataSource = response.Data.Data;
            if(callBack)callBack(response.Data.Page);
        }
    }

    async searchPlatformData(pageIndex: number,callBack?:(page:Page)=>void) {
        if (this.search.state) {
            const response = await this.requestSerivce.
            list(this.getRequsetParam(TableSearchEnum.search, pageIndex,this.search.searchText)).toPromise();
            let data = new Platforms();
            data.items = response.Data.Data.sort((a,b)=>{
                return ''.naturalCompare(a.Name,b.Name);
            });;
            this.table.clearItems();
            this.dataSource = [];
            this.table.Convert(data, this.table.dataSource);
            this.table.totalCount = response.Data.Page.RecordCount;           
            this.dataSource = response.Data.Data;
            if(callBack)callBack(response.Data.Page);
       }
    }

    async  syncPlatform(id:string){
        await  this.requestSerivce.sync(id).toPromise();  
    }

    
    async delPlatformsData(ids: string[]) {
        for (const id of ids) {
            await this.requestSerivce.del(id).toPromise();
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