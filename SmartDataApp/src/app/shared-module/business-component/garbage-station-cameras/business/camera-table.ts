import { DatePipe } from "@angular/common";
import { IConverter } from "../../../../common/interface/IConverter";
import { GarbageStation } from "../../../../data-core/model/waste-regulation/garbage-station";
import {
  CustomTableEvent,
  CustomTableEventEnum,
} from "../../../custom-table/custom-table-event";
import {
  CustomTableArgs,
  FootArgs,
  TableAttr,
} from "../../../custom-table/custom-table-model";
import { ITableField } from "../../../../aiop-system/common/ITableField";
import { IBusinessData } from "../../../../common/interface/IBusiness";
import { BusinessTable } from "../../../../aiop-system/common/business-table";
import { Camera } from "../../../../data-core/model/waste-regulation/camera";
import { Division } from "../../../../data-core/model/waste-regulation/division";
import { AIOPMediumPictureUrl } from "../../../../data-core/url/aiop/resources";
export class CameraTable extends BusinessTable implements IConverter {
  showImgFn: (id: string) => void;
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
      else if (event.eventType == CustomTableEventEnum.Img)
        this.showImgFn(event.data["id"]);
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
        HeadTitleName: "名称",
        tdWidth: "20%",
        tdInnerAttrName: "name",
      }),
      new TableAttr({
        HeadTitleName: "状态",
        tdWidth: "10%",
        tdInnerAttrName: "state",
      }),
      new TableAttr({
        HeadTitleName: "投放点",
        tdWidth: "15%",
        tdInnerAttrName: "garbageStationName",
      }),
      new TableAttr({
        HeadTitleName: "街道",
        tdWidth: "15%",
        tdInnerAttrName: "divisionName",
      }),
      new TableAttr({
        HeadTitleName: "居委会",
        tdWidth: "15%",
        tdInnerAttrName: "committees",
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

  Convert<BusinessData, CustomTableArgs>(
    input: BusinessData,
    output: CustomTableArgs
  ) {
    const items = new Array<TableField>();

    if (input instanceof BusinessData)
      for (const item of input.cameras) {
        const station = input.statioins.find(
            (x) => x.Id == item.GarbageStationId
          ),
          camera = input.resourceCameras.find((x) => x.Id == item.Id);
        var division: Division, committees: Division;
        if (station) {
          committees = input.divisions.find((x) => x.Id == station.DivisionId);
          if (committees)
            division = input.divisions.find((x) => x.Id == committees.ParentId);
        }

        items.push(
          this.toTableModel(item, station, division, camera, committees)
        );
      }
    if (output instanceof CustomTableArgs) output.values = items;

    return output;
  }

  toTableModel(
    camera: Camera,
    statioin: GarbageStation,
    division: Division,
    resourceCamera: Camera,
    committees: Division
  ) {
    let tableField = new TableField();
    tableField.id = camera.Id;
    tableField.name = camera.Name;
    tableField.divisionName = division ? division.Name : "-";
    tableField.committees = committees ? committees.Name : "-";
    tableField.imageUrl = resourceCamera
      ? AIOPMediumPictureUrl.getJPG(resourceCamera.ImageUrl)
      : "";
    tableField.garbageStationName = statioin ? statioin.Name : "-";
    tableField.state = camera
      ? camera.OnlineStatus == 0
        ? "正常"
        : "离线"
      : "离线";
    return tableField;
  }
}

export class BusinessData implements IBusinessData {
  statioins: GarbageStation[];
  cameras: Camera[];
  resourceCameras: Camera[];
  divisions: Division[];
}

export class TableField implements ITableField {
  id: string;
  name: string;
  state: string;
  divisionName: string;
  imageUrl: string;
  garbageStationName: string;
  committees: string;
}
