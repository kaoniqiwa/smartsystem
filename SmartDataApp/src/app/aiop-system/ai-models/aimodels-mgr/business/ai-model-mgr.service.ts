import { Injectable } from "@angular/core";
import { CameraAIModel, } from "../../../../data-core/model/aiop/camera-ai-model";
import { TableAttribute } from "../../../../common/tool/table-form-helper";
import { GetAIModelsParams } from "../../../../data-core/model/aiop/camera-ai-event-records-params";
import { AIModelRequestService } from "../../../../data-core/repuest/ai-model.service";
import { CameraAIModels } from "./ai-model-table";
import '../../../../common/string/hw-string';
import { AIModelsTable } from "./ai-model-table";
import { DatePipe } from "@angular/common";
import { CustomTableEvent } from "../../../../shared-module/custom-table/custom-table-event";
import { ConfigRequestService } from "../../../../data-core/repuest/config.service"; 
import { SearchControl } from "./search";
import { Page } from "../../../../data-core/model/page";
@Injectable()
export class AIModelsMgrService extends TableAttribute {
    dataSource_ = new Array<CameraAIModel>();
    table = new AIModelsTable(this.datePipe);
    search =  new SearchControl();
    constructor(private requestSerivce: AIModelRequestService, private datePipe: DatePipe
        , private configService: ConfigRequestService) {
        super();

        this.table.findItemFn = (id: string) => {
            return this.findItem(id);
        }
        this.table.addItemFn = (item: CameraAIModel) => {
            this.dataSource.push(item);
        }
        this.table.updateItemFn = (item: CameraAIModel) => {
            const findItem = this.dataSource.find(x => x.Id == item.Id);
            if (findItem) {
                for (var key in item)
                    findItem[key] = item[key];
            }
        }
        this.table.scrollPageFn = (event: CustomTableEvent) => {
            this.getAIModelData(event.data as any);
            this.searchAIModelData(event.data as any);
        }        
    }

    async getAIIcons() { 
       this.table.ai_icon = await this.configService.getAIIcons().toPromise();
    }


    set dataSource(items: CameraAIModel[]) {
        for (const x of items)
            this.dataSource_.push(x);
    }

    get dataSource() {
        return this.dataSource_;
    }

    async getAIModelData(pageIndex: number,callBack?:(page:Page)=>void) {
       if (this.search.state == false) {
        const response = await this.requestSerivce.list(this.getRequsetParam(pageIndex,this.search.searchText)).toPromise();
        let data = new CameraAIModels();  
        data.items = response.Data.Data.sort((a, b) => {
            return ''.naturalCompare(a.ModelName, b.ModelName);
        });;
        this.table.clearItems();
        this.dataSource = [];
        this.table.Convert(data, this.table.dataSource);
        this.table.totalCount = response.Data.Page.RecordCount;
        this.dataSource = response.Data.Data;
        if(callBack)callBack(response.Data.Page);
        }
    }

    async searchAIModelData(pageIndex: number,callBack?:(page:Page)=>void) {
     if (this.search.state) {
        const response = await this.requestSerivce.list(this.getRequsetParam(pageIndex, this.search.searchText)).toPromise();
        let data = new CameraAIModels();
        data.items = response.Data.Data.sort((a, b) => {
            return ''.naturalCompare(a.ModelName, b.ModelName);
        });;
        this.table.clearItems();
        this.dataSource = [];
        this.table.Convert(data, this.table.dataSource);
        this.table.totalCount = response.Data.Page.RecordCount;
        this.dataSource = response.Data.Data;
        if(callBack)callBack(response.Data.Page);
        }
    }


    async delAIModelsData(ids: string[]) {
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

    getRequsetParam(pageIndex: number, name?: string) {
        let param = new GetAIModelsParams();
        param.PageIndex = pageIndex;
        param.PageSize = this.pageSize;
        if(name)param.ModelName=name;
        return param;
    }
}