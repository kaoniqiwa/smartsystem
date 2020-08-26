import { Injectable } from "@angular/core";
import { SRServiceRequestSerivce } from "../../../../data-core/repuest/sr-service.service";
import { TableSearchEnum, TableAttribute } from "../../../../common/tool/table-form-helper";
import { SRServers, SRServiceTable } from "./srservers-table";
import { SRServer } from "../../../../data-core/model/sr-server";
import { CustomTableEvent } from "../../../../shared-module/custom-table/custom-table-event";
import '../../../../common/string/hw-string';
import { SearchControl } from "./search";
@Injectable()
export class SRServersService extends TableAttribute {
    dataSource_ = new Array<SRServer>();
    table = new SRServiceTable();
    search = new SearchControl();
    constructor(private requestSerivce: SRServiceRequestSerivce) {
        super();
        this.table.syncFn = async (id: string) => {
            await this.syncSRService(id);
            this.table.msg.response_success();
        }

        this.table.findItemFn = (id: string) => {
            return this.findItem(id);
        }
        this.table.addItemFn = (item: SRServer) => {
            this.dataSource.push(item);
        }
        this.table.updateItemFn = (item: SRServer) => {
            const findItem = this.dataSource.find(x => x.Id == item.Id);
            if (findItem) {
                for (var key in item)
                    findItem[key] = item[key];
            }
        }
        this.table.scrollPageFn = (event: CustomTableEvent) => {
            this.getSRServerData();
        }
    }

    set dataSource(items: SRServer[]) {
        for (const x of items)
            this.dataSource_.push(x);
    }

    get dataSource() {
        return this.dataSource_;
    }

    async getSRServerData() {
        if (this.search.state == false) {
            const response = await this.requestSerivce.list();
            let data = new SRServers();
            data.items = response.data.Data.sort((a, b) => {
                return ''.naturalCompare(a.Name, b.Name);
            });
            this.table.Convert(data, this.table.dataSource);
            this.table.totalCount = response.data.Data.length;
            this.dataSource = response.data.Data;
        }
    }

    searchSRServerData() {
        if (this.search.state) { 
            const flterItems = this.dataSource.filter(x => x.Name.indexOf(this.search.searchText) > -1);
            this.table.clearItems();
            let data = new SRServers();
            data.items = flterItems.sort((a, b) => {
                return ''.naturalCompare(a.Name, b.Name);
            });
            this.table.Convert(data, this.table.dataSource);
            this.table.totalCount = flterItems.length;
        }
    }

    async syncSRService(id: string) {
        await this.requestSerivce.sync(id);
    }


    async delSRServersData(ids: string[]) {
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
}