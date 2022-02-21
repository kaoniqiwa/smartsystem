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
  TooltipTd,
} from "../../../../custom-table/custom-table-model";
import { AIOPMediumPictureUrl } from "../../../../../data-core/url/aiop/resources";
import { IBusinessData } from "../../../../../common/interface/IBusiness";
import { GarbageStation } from "../../../../../data-core/model/waste-regulation/garbage-station";
import { Division } from "../../../../../data-core/model/waste-regulation/division";
import { DivisionType } from "../../../../../data-core/model/enum";
import { DatePipe } from "@angular/common";
import { GarbageStationNumberStatistic } from "../../../../../data-core/model/waste-regulation/garbage-station-number-statistic";
import { Camera } from "../../../../../data-core/model/waste-regulation/camera";
import { ToHoursMinutes } from "../../../../../common/tool/tool.service";
import { ResourceMediumRequestService } from "../../../../../data-core/repuest/resources.service";
import { Language } from "src/app/common/tool/language";
import { EventEmitter } from "@angular/core";
export class EventTable extends BusinessTable implements IConverter {
  dataSource = new CustomTableArgs<any>({
    hasTableOperationTd: true,
    hasHead: true,
    isSingleElection: false,
    values: [],
    primaryKey: "id",
    isDisplayDetailImg: true,
    eventDelegate: (event: CustomTableEvent) => {
      if (event.eventType == CustomTableEventEnum.Img) {
        const findEvent = this.findStationStatisticFn(event.data["item"].id);
        this.initGalleryTargetFn(
          findEvent.Id,
          this.findStationFn(findEvent.Id).Cameras,
          event.data["index"]
        );
      }
    },
    tableAttrs: [
      new TableAttr({
        HeadTitleName: Language.json.station,
        tdWidth: "12%",
        tdInnerAttrName: "station",
      }),
      new TableAttr({
        HeadTitleName: Language.json.DivisionType.County,
        tdWidth: "10%",
        tdInnerAttrName: "county",
      }),
      new TableAttr({
        HeadTitleName: Language.json.DivisionType.Committees,
        tdWidth: "12%",
        tdInnerAttrName: "committees",
      }),
      new TableAttr({
        HeadTitleName: Language.json.DivisionType.Community,
        tdWidth: "10%",
        tdInnerAttrName: "communityName",
      }),
      new TableAttr({
        HeadTitleName: "垃圾堆数",
        tdWidth: "10%",
        tdInnerAttrName: "garbageCount",
      }),
      new TableAttr({
        HeadTitleName: "滞留时间",
        tdWidth: "10%",
        tdInnerAttrName: "currentGarbageTime",
      }),
      new TableAttr({
        HeadTitleName: "总滞留时长",
        tdWidth: "10%",
        tdInnerAttrName: "garbageDuration",
      }),
    ],
    galleryTd: [],
    tooltipTd: new TooltipTd("6%", Language.json.people),
    footArgs: new FootArgs({
      hasSelectBtn: false,
      hasSelectCount: false,
    }),
    tableOperationBtns: [
      new TableOperationBtn({
        css: "glyphicon glyphicon-map-marker",
        title: "地图定位",
        callback: (item: TableField) => {
          this.positionButtonClicked.emit(item.id);
        },
      }),
    ],
  });
  findStationStatisticFn: (id: string) => GarbageStationNumberStatistic;
  findStationCameras: (id: string) => Array<Camera>;
  findDivisionFn: (id: string) => Division;
  initGalleryTargetFn: (
    garbageId: string,
    event: Camera[],
    index: number
  ) => void;
  playVideoFn: (id: string) => void;
  findStationFn: (id: string) => GarbageStation;
  constructor(private datePipe: DatePipe) {
    super();
  }
  positionButtonClicked: EventEmitter<string> = new EventEmitter();
  scrollPageFn: (event: CustomTableEvent) => void;

  Convert<GarbageDropEventsRecord, CustomTableArgs>(
    input: GarbageDropEventsRecord,
    output: CustomTableArgs
  ) {
    const items = new Array<TableField>();
    let tooltipTd = new TooltipTd("6%", Language.json.people);
    var tds: GalleryTdAttr[] = new Array();
    tooltipTd.listMap = new Map<string, Array<{ icon: string; tip: string }>>();

    if (input instanceof GarbageDropEventsRecordViewModel)
      for (const item of input.items) {
        let station = this.findStationFn(item.Id);
        if (station) {
          items.push(this.toTableModel(item));
          const mb = this.toMenber(item);
          if (mb) tooltipTd.listMap.set(item.Id, this.toMenber(item));
          tds.push(this.toGalleryModel(this.findStationFn(item.Id)));
        }
      }
    if (output instanceof CustomTableArgs) {
      output.values = items;
      output.galleryTd = tds;
      output.tooltipTd = tooltipTd;
      output.galleryTdWidth = "14%";
    }
    return output;
  }

  toTableModel(statistic: GarbageStationNumberStatistic) {
    const tableField = new TableField(),
      station = this.findStationFn(statistic.Id),
      division = this.findDivisionFn(station.DivisionId),
      toHour = (val: number) => {
        const hm = ToHoursMinutes(val);
        return `${hm.hours}:${hm.minutes}`;
      },
      toFormat = (val: string) => {
        const arr = val.split(":");
        if (arr[0] == "0" && arr[1] == "0") return "0分钟";
        else if (arr[0] != "0" && arr[1] != "0")
          return `${arr[0]}小时${arr[1]}分钟`;
        else if (arr[1] != "0") return `${arr[1]}分钟`;
      };
    tableField.id = statistic.Id;
    tableField.station = statistic.Name;
    tableField.garbageCount = statistic.GarbageCount + "";
    tableField.currentGarbageTime = toFormat(
      toHour(statistic.CurrentGarbageTime)
    );
    tableField.garbageDuration = toFormat(toHour(statistic.GarbageDuration));
    if (division.DivisionType == DivisionType.County)
      tableField.county = division.Name;
    else if (division.DivisionType == DivisionType.Committees) {
      tableField.committees = division.Name;
      const parentDivision = this.findDivisionFn(division.ParentId);
      if (parentDivision) tableField.county = parentDivision.Name;
    }
    tableField.communityName = station.CommunityName || "-";
    return tableField;
  }

  toMenber(event: GarbageStationNumberStatistic) {
    const station = this.findStationFn(event.Id),
      toolTip = new Array<{ icon: string; tip: string }>();

    if (station.Members && station.Members.length) {
      station.Members.map((m) => {
        toolTip.push({
          icon: "howell-icon-user-anonymous",
          tip: `${m.Name}(${m.MobileNo})`,
        });
      });
      return toolTip;
    }
  }

  // toGalleryModel(dropImageUrls: Array<CameraImageUrl>, key: string) {
  //     const galleryTdAttr = new GalleryTdAttr();
  //     galleryTdAttr.imgSrc = new Array<string>();
  //     if(dropImageUrls)dropImageUrls.map(u=> galleryTdAttr.imgSrc.push(ResourceMediumRequestService.getJPG(u.ImageUrl)));
  //     galleryTdAttr.key = key;
  //     return galleryTdAttr;
  // }

  toGalleryModel(station: GarbageStation) {
    const galleryTdAttr = new GalleryTdAttr();
    galleryTdAttr.imgSrc = new Array<string>();

    station.Cameras.map((x) => {
      galleryTdAttr.imgSrc.push(
        ResourceMediumRequestService.getJPG(x.ImageUrl)
      );
    });
    galleryTdAttr.key = station.Id;
    return galleryTdAttr;
  }
}

export class GarbageDropEventsRecordViewModel implements IBusinessData {
  items: Array<GarbageStationNumberStatistic>;
}

export class TableField implements ITableField {
  id: string;
  county: string;
  committees: string;
  garbageCount: string;
  station: string;
  currentGarbageTime: string;
  garbageDuration: string;
  communityName: string;
  menber: string;
}
