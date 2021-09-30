// import { BusinessTable } from "../../../../../aiop-system/common/business-table";
// import { ITableField } from "../../../../../aiop-system/common/ITableField";
// import { IConverter } from "../../../../../common/interface/IConverter";
// import {
//   CustomTableEvent,
//   CustomTableEventEnum,
// } from "../../../../custom-table/custom-table-event";
// import {
//   CustomTableArgs,
//   FootArgs,
//   GalleryTdAttr,
//   TableAttr,
//   TableOperationBtn,
// } from "../../../../custom-table/custom-table-model";
// import { CameraImageUrl } from "../../../../../data-core/model/waste-regulation/event-record";
// import { AIOPMediumPictureUrl } from "../../../../../data-core/url/aiop/resources";
// import { GarbageDropEventRecord } from "../../../../../data-core/model/waste-regulation/garbage-drop-event-record";
// import { IBusinessData } from "../../../../../common/interface/IBusiness";
// import { Division } from "../../../../../data-core/model/waste-regulation/division";
// import { DivisionType } from "../../../../../data-core/model/enum";
// import { DatePipe } from "@angular/common";
// import { ImgTypeEnum, TypeNameEnum, HWCameraImageUrl } from "./camera-img-url";
// import { ResourceMediumRequestService } from "../../../../../data-core/repuest/resources.service";
// import { DivisionRequestService } from "src/app/data-core/repuest/division.service";
// import { Language } from "src/app/common/tool/language";
// import { GarbageStationNumberStatistic } from "src/app/data-core/model/waste-regulation/garbage-station-number-statistic";
// import { DivisionNumberStatistic } from "src/app/data-core/model/waste-regulation/division-number-statistic";

// export class TaskTable extends BusinessTable implements IConverter {
//   dataSource = new CustomTableArgs<any>({
//     hasTableOperationTd: false,
//     hasHead: true,
//     isSingleElection: true,
//     values: [],
//     primaryKey: "id",
//     tableAttrs: [
//       new TableAttr({
//         HeadTitleName: "投放点",
//         tdWidth: "15%",
//         tdInnerAttrName: "station",
//       }),
//       new TableAttr({
//         HeadTitleName: "街道",
//         tdWidth: "15%",
//         tdInnerAttrName: "county",
//       }),
//       new TableAttr({
//         HeadTitleName: "居委会",
//         tdWidth: "15%",
//         tdInnerAttrName: "committees",
//       }),
//       new TableAttr({
//         HeadTitleName: "全部任务",
//         tdWidth: "10%",
//         tdInnerAttrName: "all",
//       }),
//       new TableAttr({
//         HeadTitleName: "未完成任务",
//         tdWidth: "10%",
//         tdInnerAttrName: "unhandle",
//       }),
//       new TableAttr({
//         HeadTitleName: "超时处置",
//         tdWidth: "10%",
//         tdInnerAttrName: "timeout",
//       }),
//     ],
//     footArgs: new FootArgs({
//       hasSelectBtn: false,
//       hasSelectCount: false,
//     }),
//   });
//   findEventFn: (id: string) => GarbageDropEventRecord;
//   findDivisionFn: (id: string) => Division;
//   initGalleryTargetFn: (
//     eventId: string,
//     cameras: Array<CameraImageUrl>,
//     index: number
//   ) => void;
//   playVideoFn: (id: string) => void;
//   // eventCameraMap = new Map<string,Array<CameraImageUrl>>();
//   constructor(private datePipe: DatePipe) {
//     super();
//   }
//   scrollPageFn: (event: CustomTableEvent) => void;

//   Convert<GarbageDropEventsRecord, CustomTableArgs>(
//     input: GarbageDropEventsRecord,
//     output: CustomTableArgs
//   ) {
//     const items = new Array<TableField>();
//     var tds: GalleryTdAttr[] = new Array();
//     if (input instanceof GarbageDropEventsRecord)
//       for (const item of input.items) {
//         items.push(this.toTableModel(item));

//         tds.push(
//           this.toGalleryModel(
//             item.Data.DropImageUrls,
//             item.Data.HandleImageUrls,
//             item.Data.TimeoutImageUrls,
//             item.EventId
//           )
//         );
//         // const cameras = new Array<CameraImageUrl>();

//         //this.eventCameraMap.set(item.EventId,[...item.Data.DropImageUrls,...item.Data.HandleImageUrls,...item.Data.TimeoutImageUrls]);
//       }
//     if (output instanceof CustomTableArgs) {
//       output.values = items;
//       output.galleryTd = tds;
//       output.galleryTdWidth = "16%";
//     }
//     return output;
//   }

//   toTableModel(data: GarbageStationNumberStatistic) {
//     const tableField = new TableField();
//     let division = this.findDivisionFn();

//     tableField.id = data.Id;

//     tableField.all = data.TotalTaskCount.toString() || "0";
//     tableField.station = data.Name;
//     tableField.timeout = this.datePipe.transform(
//       event.Data.DropTime,
//       "yyyy-MM-dd HH:mm:ss"
//     );
//     tableField.handleTime = event.Data.IsHandle
//       ? this.datePipe.transform(event.Data.HandleTime, "HH:mm:ss")
//       : "-";

//     tableField.processorName = event.Data.ProcessorName || "-";

//     if (division.DivisionType == DivisionType.County)
//       tableField.county = division.Name;
//     else if (division.DivisionType == DivisionType.Committees) {
//       tableField.committees = division.Name;
//       const parentDivision = this.findDivisionFn(division.ParentId);
//       if (parentDivision) tableField.county = parentDivision.Name;
//     }
//     return tableField;
//   }

//   toGalleryModel(
//     dropImageUrls: Array<CameraImageUrl>,
//     handleImageUrls: Array<CameraImageUrl>,
//     timeoutImageUrls: Array<CameraImageUrl>,
//     key: string
//   ) {
//     const galleryTdAttr = new GalleryTdAttr();
//     galleryTdAttr.imgSrc = new Array<string>();
//     if (dropImageUrls)
//       dropImageUrls.map((u) =>
//         galleryTdAttr.imgSrc.push(
//           ResourceMediumRequestService.getJPG(u.ImageUrl)
//         )
//       );
//     if (handleImageUrls)
//       handleImageUrls.map((u) =>
//         galleryTdAttr.imgSrc.push(
//           ResourceMediumRequestService.getJPG(u.ImageUrl)
//         )
//       );
//     if (timeoutImageUrls)
//       timeoutImageUrls.map((u) =>
//         galleryTdAttr.imgSrc.push(
//           ResourceMediumRequestService.getJPG(u.ImageUrl)
//         )
//       );
//     galleryTdAttr.key = key;
//     return galleryTdAttr;
//   }
// }

// export class GarbageDropEventsRecord implements IBusinessData {
//   items: Array<GarbageDropEventRecord>;
// }

// export class TableField implements ITableField {
//   id: string;
//   station: string;
//   county: string;
//   all: string;
//   committees: string;
//   unhandle: string;
//   timeout: string;
// }
