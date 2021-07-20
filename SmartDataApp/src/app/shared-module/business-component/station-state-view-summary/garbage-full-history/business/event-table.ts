import { DatePipe } from "@angular/common";
import { IConverter } from "../../../../../common/interface/IConverter";
import {
  GarbageFullEventRecord,
  CameraImageUrl,
} from "../../../../../data-core/model/waste-regulation/garbage-full-event-record";
import {
  CustomTableEvent,
  CustomTableEventEnum,
} from "../../../../custom-table/custom-table-event";
import {
  CustomTableArgs,
  FootArgs,
  TableAttr,
  TableOperationBtn,
} from "../../../../custom-table/custom-table-model";
import { ITableField } from "../../../../../aiop-system/common/ITableField";
import { AIOPMediumPictureUrl } from "../../../../../data-core/url/aiop/resources";
import { IBusinessData } from "../../../../../common/interface/IBusiness";
import { BusinessTable } from "../../../../../aiop-system/common/business-table";
import { Division } from "../../../../../data-core/model/waste-regulation/division";
import { DivisionType } from "../../../../../data-core/model/enum";
export class EventTable extends BusinessTable implements IConverter {
  findEventFn: (id: string) => GarbageFullEventRecord;
  initGalleryTargetFn: (event: GarbageFullEventRecord) => void;
  videoFilesFn: (id: string) => void;
  playVideosFn: (id: string) => void;
  findDivisionFn: (id: string) => Division;
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
      if (event.eventType == CustomTableEventEnum.Img) {
        const findEvent = this.findEventFn(event.data["id"]);
        this.initGalleryTargetFn(findEvent);
      }
    },
    tableAttrs: [
      new TableAttr({
        HeadTitleName: "图片",
        tdWidth: "15%",
        isHoverBig: true,
        isSmallImg: true,
        tdInnerAttrName: "imageUrl",
        isImg: true,
      }),
      new TableAttr({
        HeadTitleName: "投放点",
        tdWidth: "20%",
        tdInnerAttrName: "station",
      }),
      new TableAttr({
        HeadTitleName: "街道",
        tdWidth: "15%",
        tdInnerAttrName: "county",
      }),
      new TableAttr({
        HeadTitleName: "居委会",
        tdWidth: "20%",
        tdInnerAttrName: "committees",
      }),
      new TableAttr({
        HeadTitleName: "上报时间",
        tdWidth: "20%",
        tdInnerAttrName: "eventTime",
      }),
    ],
    tableOperationBtns: [
      new TableOperationBtn({
        css: "howell-icon-video td-icon",
        title: "播放视频",
        callback: (item: TableField) => {
          this.playVideosFn("1&" + item.id);
        },
      }),
      new TableOperationBtn({
        css: "howell-icon-picturedownload td-icon",
        title: "下载图片",
        callback: (item: TableField) => {
          const a = document.createElement("a");
          a.href = item.imageUrl;
          a.download =
            item.resourceName +
            " " +
            item.eventTime.replace("-", "_").replace("-", "_") +
            ".jpeg";
          a.click();
          document.body.appendChild(a);
          document.body.removeChild(a);
        },
      }),
      new TableOperationBtn({
        css: "howell-icon-videodownload td-icon",
        title: "下载视频",
        callback: (item: TableField) => {
          this.videoFilesFn(item.id);
        },
      }),
    ],
    footArgs: new FootArgs({
      hasSelectBtn: false,
      hasSelectCount: false,
    }),
  });

  constructor(private datePipe: DatePipe) {
    super();
  }
  scrollPageFn: (event: CustomTableEvent) => void;

  Convert<IllegalDropEventsRecord, CustomTableArgs>(
    input: IllegalDropEventsRecord,
    output: CustomTableArgs
  ) {
    const items = new Array<TableField>();

    if (input instanceof GarbageFullEventsRecord)
      for (const item of input.items) items.push(this.toTableModel(item));
    if (output instanceof CustomTableArgs) output.values = items;
    return output;
  }

  toTableModel(item: GarbageFullEventRecord) {
    let tableField = new TableField();
    tableField.id = item.EventId;
    tableField.eventTime = this.datePipe.transform(
      item.EventTime,
      "yyyy-MM-dd HH:mm:ss"
    );
    tableField.resourceName = item.ResourceName;
    tableField.station = item.Data.StationName;
    const division = this.findDivisionFn(item.Data.DivisionId);
    if (division.DivisionType == DivisionType.Committees) {
      tableField.committees = division.Name;
      const county = this.findDivisionFn(division.ParentId);
      tableField.county = county.Name;
    } else {
      tableField.committees = item.Data.DivisionName;
      tableField.county = item.Data.DivisionName;
    }

    if (
      item.Data &&
      item.Data.CameraImageUrls &&
      item.Data.CameraImageUrls.length
    )
      tableField.imageUrl = AIOPMediumPictureUrl.getJPG(
        item.Data.CameraImageUrls[0].ImageUrl
      );
    return tableField;
  }
}

export class GarbageFullEventsRecord implements IBusinessData {
  items: GarbageFullEventRecord[];
}

export class TableField implements ITableField {
  id: string;
  eventTime: string;
  committees: string;
  resourceName: string;
  station: string;
  county: string;
  imageUrl: string;
}
