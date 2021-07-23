import { DatePipe } from "@angular/common";
import { IConverter } from "../../../../../common/interface/IConverter";
import { GarbageStation } from "../../../../../data-core/model/waste-regulation/garbage-station";
import { GarbageStationType } from "../../../../../data-core/model/waste-regulation/garbage-station-type";
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
import { ITableField } from "../../../../../aiop-system/common/ITableField";
import { IBusinessData } from "../../../../../common/interface/IBusiness";
import { BusinessTable } from "../../../../../aiop-system/common/business-table";
import { Division } from "../../../../../data-core/model/waste-regulation/division";
import { DivisionType } from "../../../../../data-core/model/enum";
import { Camera } from "../../../../../data-core/model/waste-regulation/camera";
import { AIOPMediumPictureUrl } from "../../../../../data-core/url/aiop/resources";
import { Language } from "../../../../../common/tool/language";
import { ResourceMediumRequestService } from "../../../../../data-core/repuest/resources.service";

export class GarbageStationTable extends BusinessTable implements IConverter {
  dataSource = new CustomTableArgs<any>({
    hasTableOperationTd: true,
    hasHead: true,
    isSingleElection: true,
    values: [],
    primaryKey: "id",
    isDisplayDetailImg: true,
    eventDelegate: (event: CustomTableEvent) => {
      if (event.eventType == CustomTableEventEnum.Img) {
        const findEvent = this.findGarbageFn(event.data["item"].id);
        this.initGalleryTargetFn(
          findEvent.Id,
          findEvent.Cameras,
          event.data["index"]
        );
      }
    },
    tableAttrs: [
      new TableAttr({
        HeadTitleName: "投放点",
        tdWidth: "20%",
        tdInnerAttrName: "name",
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
        HeadTitleName: "状态",
        tdWidth: "8%",
        tdInnerAttrName: "state",
      }),
    ],
    tableOperationBtns: [
      new TableOperationBtn({
        css: "glyphicon glyphicon-map-marker",
        title: "地图定位",
        callback: (item: TableField) => {
          if (this.positionButtonClicked) {
            this.positionButtonClicked(item.id);
          }
        },
      }),
    ],
    galleryTd: [],
    footArgs: new FootArgs({
      hasSelectBtn: false,
      hasSelectCount: false,
    }),
  });
  findGarbageFn: (id: string) => GarbageStation;
  initGalleryTargetFn: (
    garbageId: string,
    event: Camera[],
    index: number
  ) => void;
  playVideoFn: (id: string) => void;
  findDivisionFn: (id: string) => Division;

  positionButtonClicked?: (id: string) => void;

  constructor(private datePipe: DatePipe) {
    super();
  }
  scrollPageFn: (event: CustomTableEvent) => void;

  Convert<BusinessData, CustomTableArgs>(
    input: BusinessData,
    output: CustomTableArgs
  ) {
    const items = new Array<TableField>();
    var tds: GalleryTdAttr[] = new Array();

    if (input instanceof BusinessData)
      for (const item of input.statioins) {
        items.push(this.toTableModel(item));
        if (item.Cameras)
          tds.push(this.toGalleryModel(input.items, item.Id, item.Cameras));
      }
    if (output instanceof CustomTableArgs) {
      output.values = items;
      output.galleryTd = tds;
    }
    return output;
  }

  toTableModel(station: GarbageStation) {
    let tableField = new TableField();
    tableField.id = station.Id;
    tableField.name = station.Name;
    tableField.committees = "-";
    const division1 = this.findDivisionFn(station.DivisionId),
      division2 = this.findDivisionFn(division1.ParentId);
    if (division1 && division1.DivisionType == DivisionType.County)
      tableField.county = division1.Name;
    else if (division1 && division1.DivisionType == DivisionType.Committees)
      tableField.committees = division1.Name;
    if (division2 && division2.DivisionType == DivisionType.County)
      tableField.county = division2.Name;
    else if (division2 && division2.DivisionType == DivisionType.Committees)
      tableField.committees = division2.Name;
    tableField.state = Language.StationStateFlags(station.StationStateFlags);
    return tableField;
  }

  toGalleryModel(resourceCameras: Camera[], key: string, camera: Camera[]) {
    const galleryTdAttr = new GalleryTdAttr();
    galleryTdAttr.imgSrc = new Array<string>();
    camera.map((x) => {
      const find = resourceCameras.find((x1) => x1.Id == x.Id);
      if (find)
        galleryTdAttr.imgSrc.push(
          ResourceMediumRequestService.getJPG(find.ImageUrl)
        );
    });
    galleryTdAttr.key = key;
    return galleryTdAttr;
  }
}

export class BusinessData implements IBusinessData {
  types: GarbageStationType[];
  statioins: GarbageStation[];
  items: Camera[];
  divisions: Division[];
  constructor(
    types: GarbageStationType[],
    statioins: GarbageStation[],
    divisions: Division[]
  ) {
    this.types = types;
    this.statioins = statioins;
    this.divisions = divisions;
  }
}

export class TableField implements ITableField {
  id: string;
  updateTime: string;
  name: string;
  committees: string;
  county: string;
  state: string;
}
