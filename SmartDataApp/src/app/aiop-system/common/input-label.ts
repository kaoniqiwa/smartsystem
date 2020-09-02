import { Injectable } from "@angular/core";
import { InputTagArea } from "../../shared-module/input-tag-area/input-tag-area";
import { ListAttribute } from "../../common/tool/table-form-helper";
import { GetResourceLabelsParams } from "../../data-core/model/resource-labels-params";
import { LabelRequestService, ResourceLabelRequestService } from "../../data-core/repuest/resources.service";
import { ResourceLabel } from "../../data-core/model/resource-label";
import { Labels } from "./label";
import { MessageBar } from "../../common/tool/message-bar";
import { Camera } from "../../data-core/model/camera";
import { Resource } from "../../data-core/model/resource";
@Injectable()
export class InputLabelService {
    tagSource_ = new Array<InputTagArea>();
    viewShow = false;
    messageBar = new MessageBar();
    /**
     * 获取camera
     */
    findResourceFn: (id: string) => Resource;
    set tagSource(items: Partial<ResourceLabel>[]) {
        for (const x of items) {
            if (x.hasOwnProperty("type"))
                this.tagSource_.push(new InputTagArea(x.Id, x.Name, false, 2));
            else this.tagSource_.push(new InputTagArea(x.Id, x.Name, false, 1));
        }
    }

    get _tagSource() {
        return this.tagSource_;
    }


    clearDataSource() {
        this.tagSource_ = this.tagSource_.filter(c => c.type == 1);
        this.tagSource_.map(x => x.checked = false);
    }
    constructor(public labelRequestService: LabelRequestService,
        public resourceLabelRequestService: ResourceLabelRequestService) {

    }

    set addLabel2(items: ResourceLabel[]) {
        var newItems = new Array<ResourceLabel>();
        items.map(label => {
            const label_ = { ...label, type: 2 };
            newItems.push(label_);
        });
        this.tagSource = newItems;
    }

    getSelectItemsLabels(tableSelectIds: string[]) {
        if (tableSelectIds) {
            var items = new Array<ResourceLabel>();
            tableSelectIds.map(id => {
                const camera = this.findResourceFn(id);
                camera.Labels.map(label => {
                    const findItem = items.find(i => i.Id == label.Id);
                    const label_ = { ...label, type: 2 };
                    if (findItem == null) items.push(label_);
                });
            });
            this.tagSource = items;
        }
    }

    async requestResourceLabels(callBack?: (items: ResourceLabel[]) => void) {
        const param = new GetResourceLabelsParams();
        param.PageIndex = 1;
        param.PageSize = new ListAttribute().maxSize;
        const response = await this.labelRequestService.list(param).toPromise(); 
        this.tagSource = response.Data.Data;
        if (callBack) callBack(response.Data.Data);
    }

    async createLabel(item: InputTagArea, callBack: (id: string) => void) {
        const model = new ResourceLabel();
        model.Name = item.text;
        model.Id = '';
        const val = await this.labelRequestService.create(model).toPromise();
        callBack(val.Data.Id);
    }

    async delLabel(item: InputTagArea, callBack: (success: boolean) => void) {
        const val = await this.labelRequestService.del(item.id).toPromise();
        callBack(val.FaultCode == 0);
    }

    bindLabel(tableSelectIds: string[]
        , items: InputTagArea[]
        , updateItemLabelsFn1: (add: boolean, devId: string, label: ResourceLabel) => void
        , updateItemLabelsFn2: (add: boolean, devId: string, label: ResourceLabel) => void) {

        const bind = items.filter(x => x.type == 1 && x.checked == true && x.del == false);
        const unbind = items.filter(x => x.type == 2 && x.checked == true);
        var use = false;
        tableSelectIds.map(async (id) => {
            const item = this.findResourceFn(id);
            if (item) {
                for (const x of bind) {
                    const index = item.Labels.findIndex(y => y.Id == x.id);
                    if (index == -1) {
                        const response = await this.resourceLabelRequestService.create(item.Id, x.id).toPromise();;
                        updateItemLabelsFn1(true, id, response.Data);
                        updateItemLabelsFn2(true, id, response.Data);
                    }
                }
                for (const x of unbind) {
                    const index = item.Labels.findIndex(y => y.Id == x.id);
                    if (index > -1) {
                        const response = await this.resourceLabelRequestService.del(item.Id, x.id).toPromise();
                        updateItemLabelsFn1(false, id, response.Data);
                        updateItemLabelsFn2(false, id, response.Data);
                    }

                }
                if (use == false) {
                    this.messageBar.response_success();
                    this.viewShow = false;
                    this.clearDataSource();
                    use = true;
                }
            }
        });
    }

    async forBindLabelForm(tableSelectId: string, labels: ResourceLabel[]
        , items: InputTagArea[]) {
        const bind = items.filter(x => x.type == 1 && x.checked == true && x.del == false);
        const unbind = items.filter(x => x.type == 2 && x.checked == true);

        if (tableSelectId) {
            for (const x of bind) {
                const index = labels.findIndex(y => y.Id == x.id);
                if (index == -1) {
                    await this.resourceLabelRequestService.create(tableSelectId, x.id).toPromise();;
                }
            }
            for (const x of unbind) {
                const index = labels.findIndex(y => y.Id == x.id);
                if (index > -1)
                    await this.resourceLabelRequestService.del(tableSelectId, x.id).toPromise();;
            }
        }
    }

    fillResourceLabel(labels: ResourceLabel[], source: InputTagArea[]) {
        const bind = source.filter(x => x.type == 1 && x.checked == true && x.del == false);
        const unbind = source.filter(x => x.type == 2 && x.checked == true);
        for (const x of bind) {
            const index = labels.findIndex(y => y.Id == x.id);
            if (index == -1) {
                const u = new ResourceLabel();
                u.Id = x.id;
                u.Name = x.text;
                labels.push(u);
            }
        }
        for (const x of unbind) {
            const index = labels.findIndex(y => y.Id == x.id);
            if (index > -1)
                labels.splice(index, 1);

        }
    }
}