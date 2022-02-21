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
  GalleryTdAttr,
  TableAttr,
} from "../../../custom-table/custom-table-model";
import { ITableField } from "../../../../aiop-system/common/ITableField";
import { IBusinessData } from "../../../../common/interface/IBusiness";
import { BusinessTable } from "../../../../aiop-system/common/business-table";
import { Camera } from "../../../../data-core/model/waste-regulation/camera";
import { Division } from "../../../../data-core/model/waste-regulation/division";
import { AIOPMediumPictureUrl } from "../../../../data-core/url/aiop/resources";
import { ResourceMediumRequestService } from "../../../../data-core/repuest/resources.service";
import { Language } from "src/app/common/tool/language";
export class CameraTable extends BusinessTable implements IConverter {
  showImgFn: (id: string) => void;
  initGalleryTargetFn: (cameraId: string) => void;
  dataSource = new CustomTableArgs<any>({
    hasTableOperationTd: false,
    hasHead: true,
    isSingleElection: true,
    values: [],
    primaryKey: "id",
    isDisplayDetailImg: true,
    eventDelegate: (event: CustomTableEvent) => {
      // if (event.eventType == CustomTableEventEnum.ScrollDown)
      //   this.scrollPageFn(event);
      // else if (event.eventType == CustomTableEventEnum.Img)
      //   this.showImgFn(event.data["id"]);

      if (event.eventType == CustomTableEventEnum.Img) {
        this.initGalleryTargetFn(event.data["item"].id);
      }
    },
    tableAttrs: [
      // new TableAttr({
      //   HeadTitleName: Language.json.picture,
      //   tdWidth: "15%",
      //   isHoverBig: true,
      //   isSmallImg: true,
      //   tdInnerAttrName: "imageUrl",
      //   isImg: true,
      // }),
      new TableAttr({
        HeadTitleName: Language.json.name,
        tdWidth: "15%",
        tdInnerAttrName: "name",
      }),
      new TableAttr({
        HeadTitleName: Language.json.state,
        tdWidth: "10%",
        tdInnerAttrName: "state",
      }),
      new TableAttr({
        HeadTitleName: Language.json.station,
        tdWidth: "15%",
        tdInnerAttrName: "garbageStationName",
      }),
      new TableAttr({
        HeadTitleName: Language.json.DivisionType.County,
        tdWidth: "15%",
        tdInnerAttrName: "divisionName",
      }),
      new TableAttr({
        HeadTitleName: Language.json.DivisionType.Committees,
        tdWidth: "15%",
        tdInnerAttrName: "committees",
      }),

      new TableAttr({
        HeadTitleName: Language.json.DivisionType.Community,
        tdWidth: "15%",
        tdInnerAttrName: "communityName",
      }),
    ],
    galleryTd: [],
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
    let tds: GalleryTdAttr[] = new Array();
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
        tds.push(this.toGalleryModel(item, item.Id, camera));
        items.push(
          this.toTableModel(item, station, division, camera, committees)
        );
      }
    if (output instanceof CustomTableArgs) {
      output.galleryTd = tds;
      output.values = items;
    }

    return output;
  }

  toTableModel(
    camera: Camera,
    station: GarbageStation,
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
      ? ResourceMediumRequestService.getJPG(resourceCamera.ImageUrl)
      : "";
    tableField.garbageStationName = station ? station.Name : "-";
    tableField.communityName = station ? station.CommunityName || "-" : "-";
    tableField.state = camera
      ? camera.OnlineStatus == 0
        ? "正常"
        : "离线"
      : "离线";

    return tableField;
  }

  toGalleryModel(resource: Camera, key: string, camera: Camera) {
    const galleryTdAttr = new GalleryTdAttr();
    galleryTdAttr.imgSrc = new Array<string>();
    galleryTdAttr.imgSrc.push(
      ResourceMediumRequestService.getJPG(resource.ImageUrl)
    );
    galleryTdAttr.key = key;
    return galleryTdAttr;
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
  communityName: string;
}
