import { DatePipe } from "@angular/common";
import { GarbageStation } from "../../../../../data-core/model/waste-regulation/garbage-station";
import { Injectable } from "@angular/core";
import { Division } from "../../../../../data-core/model/waste-regulation/division";
import { Page } from "../../../../../data-core/model/page";
import { GarbageStationRequestService } from "../../../../../data-core/repuest/garbage-station.service";
import { SearchControl } from "./search";
import { PlayVideo } from "../../../../../aiop-system/common/play-video";
import { GalleryTargetViewI } from "../../../station-state-view-summary/full-garbage-station/business/gallery-target";
import { TheDayTime } from "../../../../../common/tool/tool.service";
import { Camera } from "../../../../../data-core/model/waste-regulation/camera";
import { EventRequestService } from "../../../../../data-core/repuest/garbage-drop-event-record";
import { GarbageDropEventRecord } from "../../../../../data-core/model/waste-regulation/garbage-drop-event-record";
import { ImageEventEnum } from "../../../../gallery-target/gallery-target";
import { ListAttribute } from "../../../../../common/tool/table-form-helper";
import { GetGarbageDropEventRecordsParams } from "../../../../../data-core/model/waste-regulation/garbage-drop-event-record";
import { EventTable, GarbageDropEventsRecord } from "./event-table";
import { HWCameraImageUrl } from "../../../camera-img-url";
import { tooltip } from "../../../../../common/tool/jquery-help/jquery-help";
import {
  GarbageStationNumberStatistic,
  GetGarbageStationStatisticNumbersParams,
} from "../../../../../data-core/model/waste-regulation/garbage-station-number-statistic";
@Injectable()
export class BusinessService {
  playVideo: PlayVideo;
  galleryTargetView = new GalleryTargetViewI(this.datePipe);

  cameras = new Array<Camera>();
  stations = new Array<GarbageStation>();
  dataSource_ = new Array<GarbageStationNumberStatistic>();

  divisions = new Array<Division>();
  divisionsId = "";

  search = new SearchControl();
  set dataSource(items: Array<GarbageStationNumberStatistic>) {
    for (const x of items) this.dataSource_.push(x);
  }

  get dataSource() {
    return this.dataSource_;
  }
  table = new EventTable(this.datePipe);

  //playVideoFn = async (id: string) => {
  //const idV = id.split('&');

  //     camera = this.cameras.find(x => x.Id == idV[1]);
  // const video = await this.requestVideoUrl(camera.Id);
  // this.playVideo = new PlayVideo(null, camera.Name);
  // this.playVideo.url_=video.Url;
  //}

  constructor(
    private datePipe: DatePipe,
    private garbageStationRequestService: GarbageStationRequestService
  ) {
    this.galleryTargetView.neighborEventFnI = (ids, e: ImageEventEnum) => {
      const idV = ids.split("&"),
        findStation = this.stations.find((x) => x.Id == idV[0]);
      var index = findStation.Cameras.findIndex((x) => x.Id == idV[1]);
      var prev = true,
        next = true;
      if (e == ImageEventEnum.none) {
        if (index == 0) prev = false;
        else if (index == findStation.Cameras.length - 1) next = false;
        return {
          item: null,
          prev: prev,
          next: next,
        };
      } else if (e == ImageEventEnum.next) {
        index += 1;
        var cameraToIndex = findStation.Cameras[index];
        if (index == findStation.Cameras.length - 1) next = false;
        return {
          item: this.cameras.find((x) => x.Id == cameraToIndex.Id),
          prev: prev,
          next: next,
        };
      } else if (e == ImageEventEnum.prev) {
        index -= 1;
        var cameraToIndex = findStation.Cameras[index];
        if (index == 0) prev = false;
        return {
          item: this.cameras.find((x) => x.Id == cameraToIndex.Id),
          prev: prev,
          next: next,
        };
      }
    };
    this.table.findStationFn = (id) => {
      return this.stations.find((x) => x.Id == id);
    };

    this.table.findStationStatisticFn = (id) => {
      return this.dataSource.find((f) => f.Id == id);
    };

    this.table.findStationCameras = (stationId: string) => {
      return this.cameras.filter((c) => c.GarbageStationId == stationId);
    };

    this.table.initGalleryTargetFn = (eventId, cameras, index) => {
      this.galleryTargetView.initGalleryTargetI(eventId, cameras, index);
    };

    this.table.findDivisionFn = (id) => {
      return this.divisions.find((d) => d.Id == id);
    };
  }

  get toStationIds() {
    const ids = new Array<string>();
    this.stations.map((s) => ids.push(s.Id));
    return ids;
  }

  async requestData(pageIndex: number, callBack?: (page: Page) => void) {
    const response =
      await this.garbageStationRequestService.statisticNumberList(
        this.getStationStatisticParam(pageIndex, this.search, this.toStationIds)
      );
    const data = new GarbageDropEventsRecord();
    data.items = response.Data;
    this.table.clearItems();
    this.dataSource = [];
    this.table.Convert(data, this.table.dataSource);
    this.table.totalCount = response.Page.TotalRecordCount;
    this.dataSource = response.Data;
    if (callBack) callBack(response.Page);
    setTimeout(() => {
      tooltip();
    }, 1000);
  }

  getStationStatisticParam(
    pageIndex: number,
    search: SearchControl,
    stationIds: Array<string>
  ) {
    const param = new GetGarbageStationStatisticNumbersParams(),
      day = TheDayTime(new Date());
    param.PageIndex = pageIndex;
    param.GarbageDrop = true;
    param.PageSize = 9;
    if (search.searchText && search.other == false)
      param.Name = search.searchText;
    return param;
  }
}
