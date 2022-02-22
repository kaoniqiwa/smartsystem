import { IConverter } from "../../../../../common/interface/IConverter";
import { IBusinessData } from "../../../../../common/interface/IBusiness";
import {
  CustomTableArgs,
  FootArgs,
  TableAttr,
  GalleryTdAttr,
} from "../../../../custom-table/custom-table-model";
import { TableFormControl } from "../../../../../common/tool/table-form-helper";
import { IPageTable } from "../../../../../common/interface/IPageTable";
import {
  CustomTableEvent,
  CustomTableEventEnum,
} from "../../../../custom-table/custom-table-event";
import { ITableField } from "../../../../../aiop-system/common/ITableField";
import { GarbageStationNumberStatistic } from "../../../../../data-core/model/waste-regulation/garbage-station-number-statistic";
import { Injectable } from "@angular/core";
import { BusinessTable } from "../../../../../aiop-system/common/business-table";
import { Page } from "../../../../../data-core/model/page";
import {
  GarbageStation,
  GetGarbageStationsParams,
} from "../../../../../data-core/model/waste-regulation/garbage-station";
import { Division } from "../../../../../data-core/model/waste-regulation/division";
import "../../../../../common/string/hw-string";
import { SearchControl } from "./search";
import { GarbageStationRequestService } from "../../../../../data-core/repuest/garbage-station.service";
import { GarbageStationDao } from "../../../../../data-core/dao/garbage-station-dao";
import { ResourceCameraDao } from "../../../../../data-core/dao/resources-camera-dao";
import { DivisionDao } from "../../../../../data-core/dao/division-dao";
import { DivisionRequestService } from "../../../../../data-core/repuest/division.service";
import { GarbageStationCameraRequestService } from "../../../../../data-core/repuest/garbage-station.service";
import { Camera } from "../../../../../data-core/model/waste-regulation/camera";
import { AIOPMediumPictureUrl } from "../../../../../data-core/url/aiop/resources";
import { EnumHelper } from "../../../../../common/tool/enum-helper";
import { DatePipe } from "@angular/common";
import { GalleryTargetViewI } from "./gallery-target";
import { ImageEventEnum } from "../../../../gallery-target/gallery-target";
import { PlayVideo } from "../../../../../aiop-system/common/play-video";
import { DateDifference } from "../../../../../common/tool/tool.service";
import { GetPreviewUrlParams } from "../../../../../data-core/model/aiop/video-url";
import { HWVideoService } from "../../../../../data-core/dao/video-dao";
import { Language } from "../../../../../common/tool/language";
import { ResourceMediumRequestService } from "../../../../../data-core/repuest/resources.service";
import { Flags } from "src/app/data-core/model/flags";
import { CameraUsage } from "src/app/data-core/model/enum";
@Injectable()
export class BusinessService extends EnumHelper {
  playVideo: PlayVideo;
  galleryTargetView = new GalleryTargetViewI(this.datePipe);
  garbageStationDao: GarbageStationDao;
  resourceCameraDao: ResourceCameraDao;
  divisionDao: DivisionDao;
  cameras: Camera[] = new Array();
  divisions = new Array<Division>();
  table = new StatisticTable();
  search = new SearchControl();
  divisionId = "";
  dataSource_ = new Array<GarbageStation>();

  set dataSource(items: GarbageStation[]) {
    for (const x of items) this.dataSource_.push(x);
  }

  get dataSource() {
    return this.dataSource_;
  }
  videoService: HWVideoService;

  playVideoFn = async (id: string) => {
    const idV = id.split("&"),
      camera = this.cameras.find((x) => x.Id == idV[1]),
      video = await this.requestVideoUrl(camera.Id);
    this.playVideo = new PlayVideo(video.WebUrl, video.Url, camera.Name);
    this.playVideo.url = video.Url;
  };
  constructor(
    private garbageStationService: GarbageStationRequestService,
    private cameraService: GarbageStationCameraRequestService,
    divisionService: DivisionRequestService,
    private datePipe: DatePipe
  ) {
    super();
    this.resourceCameraDao = new ResourceCameraDao(this.cameraService);
    this.garbageStationDao = new GarbageStationDao(garbageStationService);
    this.divisionDao = new DivisionDao(divisionService);
    this.table.findGarbageFn = (id) => {
      return this.dataSource.find((x) => x.Id == id);
    };
    this.galleryTargetView.neighborEventFnI = (ids, e: ImageEventEnum) => {
      const idV = ids.split("&"),
        findStation = this.dataSource.find((x) => x.Id == idV[0]);
      var index = findStation.Cameras.filter((j) => {
        let flags = new Flags(j.CameraUsage);
        return flags.contains(CameraUsage.GarbageFull);
      }).findIndex((x) => x.Id == idV[1]);
      var prev = true,
        next = true,
        cameras = findStation.Cameras.filter((x) => {
          let flags = new Flags(x.CameraUsage);
          return flags.contains(CameraUsage.GarbageFull);
        });

      if (e == ImageEventEnum.none) {
        if (index == 0) prev = false;
        else if (index == cameras.length - 1) next = false;
        return {
          item: null,
          prev: prev,
          next: next,
        };
      } else if (e == ImageEventEnum.next) {
        index += 1;
        const cameraToIndex = cameras[index];

        if (index == cameras.length - 1) next = false;
        return {
          item: this.cameras.find((x) => x.Id == cameraToIndex.Id) as any,
          prev: prev,
          next: next,
        };
      } else if (e == ImageEventEnum.prev) {
        index -= 1;
        const cameraToIndex = cameras[index];
        if (index == 0) prev = false;
        return {
          item: this.cameras.find((x) => x.Id == cameraToIndex.Id) as any,
          prev: prev,
          next: next,
        };
      }
    };

    this.galleryTargetView.manualCaptureFn = (stationId, cb) => {
      this.garbageStationDao.manualCapture(stationId).then((result) => {
        if (result && result) {
          const img = cb(result);
          this.table.dataSource.galleryTd.map((g) => {
            const oldIndex = g.imgSrc.findIndex((f) => f.indexOf(img.old) > 0);
            if (oldIndex > 0 && g.key == stationId)
              g.imgSrc[oldIndex] = img.new;
          });
        }
      });
    };

    this.table.initGalleryTargetFn = (garbageId, event, index) => {
      const cameras = new Array<Camera>();
      event.map((x) => {
        const find = this.cameras.find((c) => c.Id == x.Id);
        cameras.push(find);
      });
      this.galleryTargetView.initGalleryTargetI(
        garbageId,
        cameras as Array<any>,
        index
      );
    };
  }

  async requestVideoUrl(cameraId: string) {
    const params = new GetPreviewUrlParams();
    params.CameraId = cameraId;
    const response = await this.videoService.videoUrl(params);
    return response;
  }

  async stationStatistic() {
    const result = await this.garbageStationDao.allGarbageStationsStatistic();
    return result;
  }

  async requestData(pageIndex: number, callBack?: (page: Page) => void) {
    const response = await this.garbageStationService.list(
      this.getRequsetParam(pageIndex, this.search)
    );
    let data = new Statistics();
    data.garbageStations = response.Data;
    data.items = this.cameras;
    data.divisions = this.divisions;
    this.table.clearItems();
    this.dataSource = [];
    this.table.Convert(data, this.table.dataSource);
    this.table.totalCount = response.Page.TotalRecordCount;
    this.dataSource = response.Data;
    if (callBack) callBack(response.Page);
  }

  getRequsetParam(pageIndex: number, search: SearchControl) {
    const param = new GetGarbageStationsParams();
    param.PageIndex = pageIndex;
    param.DivisionId = this.divisionId;
    param.DryFull = true;
    param.PageSize = 10;
    if (search.searchText && search.other == false) {
      if (search.searchName) {
        if (search.searchName === "CommunityName") {
          param.CommunityName = search.searchText;
        } else {
          param.Name = search.searchText;
        }
      } else {
        param.Name = search.searchText;
      }
    }
    return param;
  }
}

export class StatisticTable
  extends BusinessTable
  implements IConverter, IPageTable<GarbageStationNumberStatistic>
{
  helper = new EnumHelper();
  dataSource = new CustomTableArgs<TableField>({
    hasTableOperationTd: false,
    hasHead: true,
    isDisplayDetailImg: true,
    isSingleElection: false,
    values: [],
    primaryKey: "id",
    eventDelegate: (event: CustomTableEvent) => {
      if (event.eventType == CustomTableEventEnum.Img) {
        const findEvent = this.findGarbageFn(event.data["item"].id),
          cameras = findEvent.Cameras.filter((x) => {
            let flags = new Flags(x.CameraUsage);
            return flags.contains(CameraUsage.GarbageFull);
          });
        this.initGalleryTargetFn(findEvent.Id, cameras, event.data["index"]);
      }
    },
    tableAttrs: [
      new TableAttr({
        HeadTitleName: Language.json.station,
        tdWidth: "15%",
        tdInnerAttrName: "name",
      }),
      new TableAttr({
        HeadTitleName: "区划名称",
        tdWidth: "15%",
        tdInnerAttrName: "division",
      }),

      new TableAttr({
        HeadTitleName: Language.json.DivisionType.Community,
        tdWidth: "15%",
        tdInnerAttrName: "communityName",
      }),
      new TableAttr({
        HeadTitleName: Language.json.state,
        tdWidth: "15%",
        tdInnerAttrName: "state",
      }),
      new TableAttr({
        HeadTitleName: "满溢时间",
        tdWidth: "15%",
        tdInnerAttrName: "stranded",
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
  scrollPageFn: (event: CustomTableEvent) => void;

  form = new TableFormControl<GarbageStationNumberStatistic>(this);
  constructor() {
    super();
  }
  addItem(item: GarbageStationNumberStatistic): void {}
  editItem(item: GarbageStationNumberStatistic): void {}
  delItemFn: (id: string) => void;
  updateItemFn: (item: GarbageStationNumberStatistic) => void;
  addItemFn: (item: GarbageStationNumberStatistic) => void;
  findItemFn: (id: string) => GarbageStationNumberStatistic;

  Convert<Statistics, CustomTableArgs>(
    input: Statistics,
    output: CustomTableArgs
  ) {
    const items = new Array<TableField>();
    var tds: GalleryTdAttr[] = new Array();
    if (input instanceof Statistics) {
      const stations = input.garbageStations.sort((a, b) => {
        return "".naturalCompare(b.DryFull, a.DryFull);
      });
      for (const item of stations) {
        items.push(this.toTableModel(item, input.divisions));
        if (item.Cameras)
          tds.push(this.toGalleryModel(input.items, item.Id, item.Cameras));
      }
    }
    if (output instanceof CustomTableArgs) {
      output.galleryTd = tds;
      output.values = [...output.values, ...items];
    }

    return output;
  }

  toTableModel(item: GarbageStation, divisions: Division[]) {
    let tableField = new TableField(),
      eHelper = new EnumHelper();
    tableField.id = item.Id;
    tableField.name = item.Name;

    tableField.state = Language.StationStateFlags(item.StationStateFlags);

    tableField.stranded = DateDifference(item.DryFullTime + "", new Date());
    const division = divisions.find((x) => x.Id == item.DivisionId);
    tableField.division = division ? division.Name : "-";
    tableField.communityName = item.CommunityName || "-";
    return tableField;
  }

  toGalleryModel(resourceCameras: Camera[], key: string, camera: Camera[]) {
    const galleryTdAttr = new GalleryTdAttr();
    galleryTdAttr.imgSrc = new Array<string>();
    camera.map((x) => {
      let flags = new Flags(x.CameraUsage);

      if (flags.contains(CameraUsage.GarbageFull)) {
        const find = resourceCameras.find((x1) => x1.Id == x.Id);
        if (find)
          galleryTdAttr.imgSrc.push(
            ResourceMediumRequestService.getJPG(find.ImageUrl)
          );
      }
    });
    galleryTdAttr.key = key;
    return galleryTdAttr;
  }
}

export class Statistics implements IBusinessData {
  items: Camera[];
  divisions: Division[];
  garbageStations: GarbageStation[];
}

export class TableField implements ITableField {
  id: string;
  name: string;
  state: string;
  division: string;
  stranded: string;
  communityName: string;
}
