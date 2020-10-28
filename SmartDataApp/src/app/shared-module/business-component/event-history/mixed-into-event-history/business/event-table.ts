import { DatePipe } from "@angular/common";
import { IConverter } from "../../../../../common/interface/IConverter";
import { MixedIntoEventRecord } from "../../../../../data-core/model/waste-regulation/mixed-into-event-record";
import { CustomTableEvent, CustomTableEventEnum } from "../../../../../shared-module/custom-table/custom-table-event";
import { CustomTableArgs, FootArgs, TableAttr, TableOperationBtn } from "../../../../../shared-module/custom-table/custom-table-model";
import { ITableField } from "../../../../../aiop-system/common/ITableField";
import { MediumPicture } from "../../../../../data-core/url/aiop/resources";
import { IBusinessData } from "../../../../../common/interface/IBusiness";
import { BusinessTable } from "../../../../../aiop-system/common/business-table"; 
export class EventTable extends BusinessTable implements IConverter {
    findEventFn: (id: string) => MixedIntoEventRecord;
    initGalleryTargetFn:(event:MixedIntoEventRecord)=>void;
    playVideoFn: (id: string) =>void;
    dataSource = new CustomTableArgs<any>({
        hasTableOperationTd: true,
        hasHead: true,
        isSingleElection: true,
        values: [],
        primaryKey: "id",
        isDisplayDetailImg: true,
        eventDelegate: (event: CustomTableEvent) => {
            if (event.eventType == CustomTableEventEnum.ScrollDown)
                this.scrollPageFn(event);
            else if (event.eventType == CustomTableEventEnum.Img) {

                const findEvent = this.findEventFn(event.data['id']);
                this.initGalleryTargetFn(findEvent);
            }
        },
        tableAttrs: [new TableAttr({
            HeadTitleName: "图片",
            tdWidth: "15%",
            isHoverBig: true,
            isSmallImg: true,
            tdInnerAttrName: "imageUrl",
            isImg: true
        }), new TableAttr({
            HeadTitleName: "资源名称",
            tdWidth: "18%",
            tdInnerAttrName: "resourceName"
        }), new TableAttr({
            HeadTitleName: "区划名称",
            tdWidth: "20%",
            tdInnerAttrName: "divisionName"
        }), new TableAttr({
            HeadTitleName: "垃圾房名称",
            tdWidth: "20%",
            tdInnerAttrName: "stationName"
        }), new TableAttr({
            HeadTitleName: "上报时间",
            tdWidth: "20%",
            tdInnerAttrName: "eventTime"
        })]
        , tableOperationBtns: [
            new TableOperationBtn({
                css: 'howell-icon-video td-icon',
                title: '视频',
                callback: (item: TableField) => {
                    this.playVideoFn(item.id);
                }
            })
        ],
        footArgs: new FootArgs({
            hasSelectBtn: false,
            hasSelectCount: false
        })
    });


    constructor(private datePipe: DatePipe) {
        super();
    }
    scrollPageFn: (event: CustomTableEvent) => void;

   
    Convert<MixedIntoEventsRecord, CustomTableArgs>(input: MixedIntoEventsRecord, output: CustomTableArgs) {
        const items = new Array<TableField>();

        if (input instanceof MixedIntoEventsRecord)
            for (const item of input.items) {
                items.push(this.toTableModel(item));
            }
        if (output instanceof CustomTableArgs)
            output.values = items;

        return output;
    }

    toTableModel(item: MixedIntoEventRecord) {
        let tableField = new TableField();
        tableField.id = item.EventId;
        tableField.eventTime = this.datePipe.transform(item.EventTime, 'yyyy-MM-dd HH:mm:ss');
        tableField.resourceName = item.ResourceName
        tableField.imageUrl = new MediumPicture().getJPG(item.ImageUrl);
        tableField.stationName = item.Data.StationName;
        tableField.divisionName = item.Data.DivisionName;

        return tableField;
    }
}

export class MixedIntoEventsRecord implements IBusinessData {
    items: MixedIntoEventRecord[];
}

export class TableField implements ITableField {
    id: string;
    eventTime: string;
    resourceName: string;
    stationName: string;
    divisionName: string;
    imageUrl: string;
}
