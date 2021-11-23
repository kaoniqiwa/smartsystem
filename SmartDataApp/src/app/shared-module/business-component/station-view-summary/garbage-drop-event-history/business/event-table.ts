import { BusinessTable } from "../../../../../aiop-system/common/business-table";
import { ITableField } from "../../../../../aiop-system/common/ITableField";
import { IConverter } from "../../../../../common/interface/IConverter";
import {
  CustomTableEvent,
  CustomTableEventEnum,
} from "../../../../custom-table/custom-table-event";
import {
  CustomTableArgs,
  FootArgs,
  GalleryTdAttr,
  TableAttr,
  TableOperationBtn,
} from "../../../../custom-table/custom-table-model";
import { CameraImageUrl } from "../../../../../data-core/model/waste-regulation/event-record";
import { AIOPMediumPictureUrl } from "../../../../../data-core/url/aiop/resources";
import { GarbageDropEventRecord } from "../../../../../data-core/model/waste-regulation/garbage-drop-event-record";
import { IBusinessData } from "../../../../../common/interface/IBusiness";
import { Division } from "../../../../../data-core/model/waste-regulation/division";
import { DivisionType } from "../../../../../data-core/model/enum";
import { DatePipe } from "@angular/common";
import { ImgTypeEnum, TypeNameEnum, HWCameraImageUrl } from "./camera-img-url";
import { ResourceMediumRequestService } from "../../../../../data-core/repuest/resources.service";
import { DivisionRequestService } from "src/app/data-core/repuest/division.service";
import { Language } from "src/app/common/tool/language";

export class EventTable extends BusinessTable implements IConverter {
  dataSource = new CustomTableArgs<any>({
    hasTableOperationTd: true,
    hasHead: true,
    isSingleElection: false,
    values: [],
    primaryKey: "id",
    isDisplayDetailImg: true,
    galleryTdWidth: "16%",
    eventDelegate: (event: CustomTableEvent) => {
      if (event.eventType == CustomTableEventEnum.Img) {
        const findEvent = this.findEventFn(event.data["item"].id);
        (findEvent.Data.DropImageUrls as Array<HWCameraImageUrl>).map((d) => {
          d.imgType = ImgTypeEnum.drop;
          d.typeName = TypeNameEnum.drop;
        });

        (findEvent.Data.TimeoutImageUrls as Array<HWCameraImageUrl>).map(
          (d) => {
            d.imgType = ImgTypeEnum.timeOut;
            d.typeName = TypeNameEnum.timeOut;
          }
        );
        (findEvent.Data.HandleImageUrls as Array<HWCameraImageUrl>).map((d) => {
          d.imgType = ImgTypeEnum.handle;
          d.typeName = TypeNameEnum.handle;
        });
        let imgs = [
          ...findEvent.Data.DropImageUrls,
          ...findEvent.Data.TimeoutImageUrls,
          ...findEvent.Data.HandleImageUrls,
        ];
        console.log(imgs);
        this.initGalleryTargetFn(findEvent.EventId, imgs, event.data["index"]);
      }
    },
    tableAttrs: [
      new TableAttr({
        HeadTitleName: "投放点",
        tdWidth: "13%",
        tdInnerAttrName: TableHeader.station,
      }),
      // new TableAttr({
      //   HeadTitleName: "街道",
      //   tdWidth: "10%",
      //   tdInnerAttrName: "county",
      // }),
      new TableAttr({
        HeadTitleName: "居委会",
        tdWidth: "12%",
        tdInnerAttrName: TableHeader.committees,
      }),
      new TableAttr({
        HeadTitleName: "工单号",
        tdWidth: "12%",
        tdInnerAttrName: TableHeader.recordNo,
      }),
      new TableAttr({
        HeadTitleName: "发送时间",
        tdWidth: "12%",
        tdInnerAttrName: TableHeader.dropTime,
      }),
      new TableAttr({
        HeadTitleName: "处置时间",
        tdWidth: "9%",
        tdInnerAttrName: TableHeader.handleTime,
      }),
      new TableAttr({
        HeadTitleName: "处置员",
        tdWidth: "7%",
        tdInnerAttrName: TableHeader.processorName,
      }),
      new TableAttr({
        HeadTitleName: "已发送",
        tdWidth: "7%",
        tdInnerAttrName: TableHeader.isSend,
        align: true,
      }),
      new TableAttr({
        HeadTitleName: "状态",
        tdWidth: "6%",
        tdInnerAttrName: TableHeader.timeOut,
      }),
    ],
    tableOperationBtns: [
      new TableOperationBtn({
        css: "howell-icon-video td-icon",
        title: "播放视频",
        callback: (item: TableField) => {
          this.playVideoFn(item.id);
        },
      }),
    ],
    galleryTd: [],
    footArgs: new FootArgs({
      hasSelectBtn: false,
      hasSelectCount: false,
    }),
  });
  findEventFn: (id: string) => GarbageDropEventRecord;
  findDivisionFn: (id: string) => Division;
  initGalleryTargetFn: (
    eventId: string,
    cameras: Array<CameraImageUrl>,
    index: number
  ) => void;
  playVideoFn: (id: string) => void;
  // eventCameraMap = new Map<string,Array<CameraImageUrl>>();
  constructor(private datePipe: DatePipe) {
    super();
  }
  scrollPageFn: (event: CustomTableEvent) => void;

  Convert<GarbageDropEventsRecord, CustomTableArgs>(
    input: GarbageDropEventsRecord,
    output: CustomTableArgs
  ) {
    const items = new Array<TableField>();
    var tds: GalleryTdAttr[] = new Array();
    if (input instanceof GarbageDropEventsRecord)
      for (const item of input.items) {
        items.push(this.toTableModel(item));

        tds.push(
          this.toGalleryModel(
            item.Data.DropImageUrls,
            item.Data.TimeoutImageUrls,
            item.Data.HandleImageUrls,
            item.EventId
          )
        );
        // const cameras = new Array<CameraImageUrl>();

        //this.eventCameraMap.set(item.EventId,[...item.Data.DropImageUrls,...item.Data.HandleImageUrls,...item.Data.TimeoutImageUrls]);
      }
    if (output instanceof CustomTableArgs) {
      output.values = items;
      output.galleryTd = tds;
      output.galleryTdWidth = "16%";
    }
    return output;
  }

  toTableModel(event: GarbageDropEventRecord) {
    const tableField = new TableField();
    let division = this.findDivisionFn(event.Data.DivisionId);

    tableField.id = event.EventId;
    // tableField.timeOut = event.Data.IsHandle
    //   ? event.Data.IsTimeout
    //     ? "超时处置"
    //     : "已处置"
    //   : event.Data.IsTimeout
    //   ? "超时待处置"
    //   : "待处置";
    let inner = Language.GarbageDropEventType(event.EventType);
    let className = Language.GarbageDropEventTypeClassName(event.EventType);
    tableField.timeOut = new ClassNameString(className, inner);

    //`<span class="${className}">${inner}</span>`;
    tableField.station = event.Data.StationName;
    tableField.dropTime = this.datePipe.transform(
      event.Data.DropTime,
      "yyyy-MM-dd HH:mm:ss"
    );
    tableField.handleTime = event.Data.IsHandle
      ? this.datePipe.transform(event.Data.HandleTime, "HH:mm:ss")
      : "-";

    tableField.processorName = event.Data.ProcessorName || "-";
    tableField.isSend = "是";
    if (division.DivisionType == DivisionType.County)
      tableField.county = division.Name;
    else if (division.DivisionType == DivisionType.Committees) {
      tableField.committees = division.Name;
      const parentDivision = this.findDivisionFn(division.ParentId);
      if (parentDivision) tableField.county = parentDivision.Name;
    }

    tableField.recordNo = event.Data.RecordNo;
    return tableField;
  }

  toGalleryModel(
    dropImageUrls: Array<CameraImageUrl>,
    handleImageUrls: Array<CameraImageUrl>,
    timeoutImageUrls: Array<CameraImageUrl>,
    key: string
  ) {
    const galleryTdAttr = new GalleryTdAttr();
    galleryTdAttr.imgSrc = new Array<string>();
    if (dropImageUrls)
      dropImageUrls.map((u) =>
        galleryTdAttr.imgSrc.push(
          ResourceMediumRequestService.getJPG(u.ImageUrl)
        )
      );
    if (handleImageUrls)
      handleImageUrls.map((u) =>
        galleryTdAttr.imgSrc.push(
          ResourceMediumRequestService.getJPG(u.ImageUrl)
        )
      );
    if (timeoutImageUrls)
      timeoutImageUrls.map((u) =>
        galleryTdAttr.imgSrc.push(
          ResourceMediumRequestService.getJPG(u.ImageUrl)
        )
      );
    galleryTdAttr.key = key;
    return galleryTdAttr;
  }
}

export class GarbageDropEventsRecord implements IBusinessData {
  items: Array<GarbageDropEventRecord>;
}

export class TableField implements ITableField {
  id: string;
  county: string;
  timeOut: ClassNameString;
  committees: string;
  station: string;
  dropTime: string;
  handleTime: string;
  processorName: string;
  isSend: string;
  recordNo: string;
}

class ClassNameString {
  constructor(className: string, value?: any) {
    this.className = className;
    this.value = value;
  }
  value: string;
  private _className: string;
  public get className(): string {
    return this._className;
  }
  public set className(v: string) {
    this._className = v;
  }

  toString() {
    return this.value;
  }
}

enum TableHeader {
  station = "station",
  committees = "committees",
  dropTime = "dropTime",
  handleTime = "handleTime",
  processorName = "processorName",
  isSend = "isSend",
  timeOut = "timeOut",
  recordNo = "recordNo",
}
