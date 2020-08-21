import { IConverter } from "../../../../../common/interface/IConverter";
import { IBusinessData } from "../../../../../common/interface/IBusiness";
import { Camera } from "../../../../../data-core/model/camera";
import { CustomTableArgs, TableAttr, TableOperationBtn, TableIconTextTagAttr, TableTh } from "../../../../../shared-module/custom-table/custom-table-model";
import { CustomTableEvent, CustomTableEventEnum } from "../../../../../shared-module/custom-table/custom-table-event";
import { TableFormControl } from "../../../../../common/tool/table-form-helper";
import { IPageTable } from "../../../../../common/interface/IPageTable";
import { EncodeDevice } from "../../../../../data-core/model/encode-device";
import { ResourceLabel } from "../../../../../data-core/model/resource-label";
import { ResourcesTable } from '../../../../common/resources-table';
import { ITableField } from "../../../../common/ITableField";
import { FormGroup, FormControl } from '@angular/forms';
import { SearchControl } from "./search";
export class CameraTable extends ResourcesTable implements IConverter, IPageTable<Camera>{
    dataSource = new CustomTableArgs<TableField>({
        hasTableOperationTd: true,
        hasHead: true,
        isSingleElection: false,
        values: [],
        primaryKey: "id",
        eventDelegate: (event: CustomTableEvent) => {
            if (event.eventType == CustomTableEventEnum.ScrollDown)
                this.scrollPageFn(event);
            else if (event.eventType == CustomTableEventEnum.TagBtn)
                if (this.attrBtnFn) this.attrBtnFn();
        },
        tableAttrs: [new TableAttr({
            HeadTitleName: "名称",
            tdWidth: "22%",
            tdInnerAttrName: "name"
        }), new TableAttr({
            HeadTitleName: "类型",
            tdWidth: "10%",
            tdInnerAttrName: "cameraType"
        }), new TableAttr({
            HeadTitleName: "状态",
            tdWidth: "7%",
            tdInnerAttrName: "cameraState"
        }), new TableAttr({
            HeadTitleName: "编码设备",
            tdWidth: "15%",
            tdInnerAttrName: "encodeDevice"
        }), new TableAttr({
            HeadTitleName: "通道号",
            tdWidth: "10%",
            tdInnerAttrName: "channelNo"
        })],
        iconTextTh: new TableTh('29%', '标签'),
        iconTextTagAttr: []
        , tableOperationBtns: [
            new TableOperationBtn({
                css: 'howell-icon-modification td-icon',
                title: '编辑',
                callback: (item: TableField) => {
                    this.form.show = true;
                    this.form.editItem = this.findItemFn(item.id);
                }
            })
        ]
    });
    updateItemFn: (item: Camera) => void;
    addItemFn: (item: Camera) => void;
    findItemFn: (id: string) => Camera;
    findDeviceFn: (id: string) => EncodeDevice;     
    delItemFn: (id: string) => void;
    // scrollPageFn: (event: CustomTableEvent) => void;
    form = new TableFormControl<Camera>(this);
    searchControl = new SearchControl();
   // tableSelectIds: string[];
    constructor() {
        super();
        this.searchform = new FormGroup({
            Name: new FormControl(''), 
            EncodeDeviceId: new FormControl(''), 
            CameraType: new FormControl(''),
            SearchText: new FormControl('')
        });
    } 

    Convert<Cameras, CustomTableArgs>(input: Cameras, output: CustomTableArgs) {
        const items = new Array<TableField>();
        const tagsAttr = new Array<TableIconTextTagAttr>();
        if (input instanceof Cameras) {
            for (const item of input.items) {
                items.push(this.toTableModel(item));
                const tagAttr = new TableIconTextTagAttr();
                tagAttr.key = item.Id;
                item.Labels.map(l => {
                    tagAttr.texts.push({ id: l.Id, label: l.Name });
                });
                tagsAttr.push(tagAttr);
            }
        }
        if (output instanceof CustomTableArgs) {
            output.values = [...output.values, ...items];
            output.iconTextTagAttr = [...output.iconTextTagAttr, ...tagsAttr];
        }
        return output;
    }
 

    addItem(item: Camera) {
        this.dataSource.values.push(this.toTableModel(item));
        this.addItemFn(item);
        this.dataSource.footArgs.totalRecordCount += 1;
    }

    getSelectItemsLabels() {
        if (this.tableSelectIds) {
            var items = new Array<ResourceLabel>();
            this.tableSelectIds.map(id => {
                const camera = this.findItemFn(id);
                camera.Labels.map(label => {
                    const findItem = items.find(i => i.Id == label.Id);
                    const label_ = { ...label, type: 2 };
                    if (findItem == null) items.push(label_);
                });
            });
            this.labels.dataSource = items;
        }
    }

    // updateItemLabels(add: boolean, devId: string, label: ResourceLabel) {
    //     const index = this.dataSource.iconTextTagAttr.findIndex(i => i.key == devId);
    //     if (add && index > -1) {
    //         this.dataSource.iconTextTagAttr[index].texts.push({ id: label.Id, label: label.Name });
    //     }
    //     else if (add == false && index > -1) {
    //         const lIndex = this.dataSource.iconTextTagAttr[index].texts.findIndex(x => x.id == label.Id);
    //         if (lIndex > -1) this.dataSource.iconTextTagAttr[index].texts.splice(lIndex, 1);
    //     }
    // }

    editItem(item: Camera) {
        this.updateItemFn(item);
        const findVal = this.dataSource.values.find(x => x.id == item.Id);
        findVal.name = item.Name;
        findVal.channelNo = item.ChannelNo + ''; 
        findVal.cameraType = this.cameraType.get(item.CameraType);
        const dev = this.findDeviceFn(item.EncodeDeviceId);
        if (dev) findVal.encodeDevice = dev.Name;
    }

    // delItems(ids: string[]) {
    //     for (const id of ids) {
    //         const index = this.dataSource.values.findIndex(x => x.id == id);
    //         if (index > -1)
    //             this.dataSource.values.splice(index, 1);
    //     }
    //     this.dataSource.footArgs.totalRecordCount -= ids.length;
    // }

    // clearItems() {
    //     this.dataSource.values = [];
    //     this.dataSource.footArgs.totalRecordCount = 0;
    // }

    toTableModel(item: Camera) {
        let tableField = new TableField();
        tableField.id = item.Id;
        tableField.name = item.Name;
        tableField.channelNo = item.ChannelNo + '';
        tableField.cameraState = this.cameraState.get(item.CameraState) || '-';
        tableField.cameraType = this.cameraType.get(item.CameraType);
        const dev = this.findDeviceFn(item.EncodeDeviceId);
        if (dev) tableField.encodeDevice = dev.Name;
        return tableField;
    }
}

export class Cameras implements IBusinessData {
    items: Camera[];
}

export class TableField implements ITableField {
    id: string;
    name: string;
    cameraType: string;
    cameraState: string;
    encodeDevice: string;
    channelNo: string;
}