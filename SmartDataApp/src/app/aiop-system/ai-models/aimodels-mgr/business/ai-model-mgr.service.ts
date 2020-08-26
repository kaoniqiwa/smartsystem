import { Injectable } from "@angular/core";
import { CameraAIModel, } from "../../../../data-core/model/camera-ai-model";
import { TableSearchEnum, TableAttribute } from "../../../../common/tool/table-form-helper";
import { GetAIModelsParams } from "../../../../data-core/model/camera-ai-event-records-params";
import { AIModelRequestService } from "../../../../data-core/repuest/ai-model.service";
import { CameraAIModels } from "./ai-model-table";
import '../../../../common/string/hw-string';
import { AIModelsTable } from "./ai-model-table";
import { DatePipe } from "@angular/common";
import { CustomTableEvent } from "../../../../shared-module/custom-table/custom-table-event";
import { ConfigRequestService } from "../../../../data-core/repuest/config.service"; 

@Injectable()
export class AIModelsMgrService extends TableAttribute {
    dataSource_ = new Array<CameraAIModel>();
    table = new AIModelsTable(this.datePipe);
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
       this.table.ai_icon = await this.configService.getAIIcons();
    }


    set dataSource(items: CameraAIModel[]) {
        for (const x of items)
            this.dataSource_.push(x);
    }

    get dataSource() {
        return this.dataSource_;
    }

    async getAIModelData(pageIndex: number) {
        //if (this.search.state == false) {
        const response = await this.requestSerivce.list(this.getRequsetParam(TableSearchEnum.none, pageIndex));
        let data = new CameraAIModels();  
        data.items = response.data.Data.Data.sort((a, b) => {
            return ''.naturalCompare(a.ModelName, b.ModelName);
        });;
        this.table.Convert(data, this.table.dataSource);
        this.table.totalCount = response.data.Data.Page.TotalRecordCount;
        this.dataSource = response.data.Data.Data;
        // }
    }

    async searchAIModelData(pageIndex: number) {
        // if (this.search.state) {
        const response = await this.requestSerivce.list(this.getRequsetParam(TableSearchEnum.search, pageIndex, 'param'));
        let data = new CameraAIModels();
        data.items = response.data.Data.Data.sort((a, b) => {
            return ''.naturalCompare(a.ModelName, b.ModelName);
        });;
        if (pageIndex == 1) {
            this.table.clearItems();
            this.dataSource = [];
        }
        this.table.Convert(data, this.table.dataSource);
        this.table.totalCount = response.data.Data.Page.TotalRecordCount;
        this.dataSource = response.data.Data.Data;
        // }
    }


    async delAIModelsData(ids: string[]) {
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
        let param = new GetAIModelsParams();
        param.PageIndex = pageIndex;
        param.PageSize = this.pageSize;
        if (paramType == TableSearchEnum.none) {

        }
        else if (paramType == TableSearchEnum.search) {

        }
        return param;
    }
}