import { TableAttribute, SearchHelper } from "../../common/tool/table-form-helper";
import { Injectable } from "@angular/core";
import { LabelRequestService, ResourceLabelRequestService } from "../../data-core/repuest/resources.service";
import { ResourceLabel } from "../../data-core/model/resource-label";
@Injectable()
export class ResourcesRequest<T> extends TableAttribute {
    dataSource_ = new Array<T>();
    search = new SearchHelper();
    constructor(public labelRequestService: LabelRequestService
        , public resourceLabelRequestService: ResourceLabelRequestService) {
        super();
    }

    set dataSource(items: T[]) {
        for (const x of items)
            this.dataSource_.push(x);
    }

    get dataSource() {
        return this.dataSource_;
    }

    async createResourceLabel(item: ResourceLabel) {
        return await this.labelRequestService.create(item);
    }

    async delResourceLabel(labelId: string) {
        return await this.labelRequestService.del(labelId);
    }

    async bindResourceLabel(sourceId: string, labelId: string) {
        return await this.resourceLabelRequestService.create(sourceId, labelId);
    }

    async unBindResourceLabel(sourceId: string, labelId: string) {
        return await this.resourceLabelRequestService.del(sourceId, labelId);
    }
}