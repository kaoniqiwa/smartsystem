import { DatePipe } from "@angular/common";
import { IConverter } from "../../../../common/interface/IConverter";
import { GarbageStation } from "../../../../data-core/model/waste-regulation/garbage-station";
import { CustomTableEvent, CustomTableEventEnum } from "../../../custom-table/custom-table-event";
import { CustomTableArgs, FootArgs, TableAttr } from "../../../custom-table/custom-table-model";
import { ITableField } from "../../../../aiop-system/common/ITableField";
import { IBusinessData } from "../../../../common/interface/IBusiness";
import { BusinessTable } from "../../../../aiop-system/common/business-table";
import { Camera } from "../../../../data-core/model/waste-regulation/camera";
import { CameraUsageEnum } from "../../../../common/tool/enum-helper";

export class CameraTable extends BusinessTable implements IConverter {

    dataSource = new CustomTableArgs<any>({
        hasTableOperationTd: false,
        hasHead: true,
        isSingleElection: true,
        values: [],
        primaryKey: "id",
        isDisplayDetailImg: true,
        eventDelegate: (event: CustomTableEvent) => {
            if (event.eventType == CustomTableEventEnum.ScrollDown)
                this.scrollPageFn(event);
        },
        tableAttrs: [new TableAttr({
            HeadTitleName: "名称",
            tdWidth: "20%",
            tdInnerAttrName: "name"
        }), new TableAttr({
            HeadTitleName: "用途",
            tdWidth: "20%",
            tdInnerAttrName: "usage"
        }), new TableAttr({
            HeadTitleName: "状态",
            tdWidth: "20%",
            tdInnerAttrName: "state"
        }), new TableAttr({
            HeadTitleName: "垃圾房",
            tdWidth: "20%",
            tdInnerAttrName: "garbageStationName"
        }), new TableAttr({
            HeadTitleName: "更新时间",
            tdWidth: "20%",
            tdInnerAttrName: "updateTime"
        })],
        footArgs: new FootArgs({
            hasSelectBtn: false,
            hasSelectCount: false
        })
    });


    constructor(private datePipe: DatePipe) {
        super();
    }
    scrollPageFn: (event: CustomTableEvent) => void;


    Convert<BusinessData, CustomTableArgs>(input: BusinessData, output: CustomTableArgs) {
        const items = new Array<TableField>();

        if (input instanceof BusinessData)
            for (const item of input.cameras) {
                const station = input.statioins.find(x => x.Id == item.GarbageStationId);
                items.push(this.toTableModel(item, station));
            }
        if (output instanceof CustomTableArgs)
            output.values = items;

        return output;
    }

    toTableModel(camera: Camera, statioin: GarbageStation) {
        let tableField = new TableField();
        tableField.id = camera.Id;
        tableField.updateTime = this.datePipe.transform(statioin.UpdateTime, 'yyyy-MM-dd HH:mm');
        tableField.name = camera.Name;
        tableField.usage = CameraUsageEnum[camera.CameraUsage];
        tableField.garbageStationName = statioin ? statioin.Name : '-';
        tableField.state='-';
        // tableField.state = resourceCamera ? (resourceCamera.OnlineStatus == 0 ? '正常' : '离线') : '-';
        return tableField;
    }
}

export class BusinessData implements IBusinessData {
    statioins: GarbageStation[];
    cameras: Camera[];
}

export class TableField implements ITableField {
    id: string;
    updateTime: string;
    name: string;
    state: string;
    usage: string;
    garbageStationName: string;
}
