import { DatePipe } from "@angular/common";
import { GarbageStation } from "../../../../../data-core/model/waste-regulation/garbage-station";
import { Injectable } from "@angular/core";
import { Division } from "../../../../../data-core/model/waste-regulation/division";
import { Page } from "../../../../../data-core/model/page";
import { GarbageStationRequestService } from "../../../../../data-core/repuest/garbage-station.service";
import { SearchControl } from "./station-stranded.search";
import { PlayVideo } from "../../../../../aiop-system/common/play-video";
import { GalleryTargetViewI } from "../../../station-state-view-summary/full-garbage-station/business/gallery-target";
import { TheDayTime } from "../../../../../common/tool/tool.service";
import { Camera } from "../../../../../data-core/model/waste-regulation/camera";
import { GarbageDropEventRequestService } from "../../../../../data-core/repuest/garbage-drop-event-record";
import { GarbageDropEventRecord } from "../../../../../data-core/model/waste-regulation/garbage-drop-event-record";
import { ImageEventEnum } from "../../../../gallery-target/gallery-target";
import { ListAttribute } from "../../../../../common/tool/table-form-helper";
import { GetGarbageDropEventRecordsParams } from "../../../../../data-core/model/waste-regulation/garbage-drop-event-record";
import {
  EventTable,
  GarbageDropEventsRecordViewModel,
} from "./station-stranded-event-table";
import { HWCameraImageUrl } from "../../../camera-img-url";
import { tooltip } from "../../../../../common/tool/jquery-help/jquery-help";
import {
  GarbageStationNumberStatistic,
  GetGarbageStationStatisticNumbersParams,
} from "../../../../../data-core/model/waste-regulation/garbage-station-number-statistic";
import { GetPreviewUrlParams } from "src/app/data-core/model/aiop/video-url";
import { HWVideoService } from "src/app/data-core/dao/video-dao";
@Injectable()
export class StationStrandedBusinessService {
  playVideo: PlayVideo;
  galleryTargetView = new GalleryTargetViewI(this.datePipe);

  cameras = new Array<Camera>();
  stations = new Array<GarbageStation>();
  dataSource = new Array<GarbageStationNumberStatistic>();

  divisions = new Array<Division>();
  divisionsId = "";

  search = new SearchControl();
  appendDataSource(items: Array<GarbageStationNumberStatistic>) {
    for (const x of items) this.dataSource.push(x);
  }

  table = new EventTable(this.datePipe);

  //playVideoFn = async (id: string) => {
  //const idV = id.split('&');

  //     camera = this.cameras.find(x => x.Id == idV[1]);
  // const video = await this.requestVideoUrl(camera.Id);
  // this.playVideo = new PlayVideo(null, camera.Name);
  // this.playVideo.url_=video.Url;
  //}

  playVideoFn = async (id: string) => {
    const idV = id.split("&"),
      camera = this.cameras.find((x) => x.Id == idV[1]),
      video = await this.requestVideoUrl(camera.Id);
    this.playVideo = new PlayVideo(video.WebUrl, video.Url, camera.Name);
    this.playVideo.url = video.Url;
  };
  async requestVideoUrl(cameraId: string) {
    const params = new GetPreviewUrlParams();
    params.CameraId = cameraId;
    const response = await this.videoService.videoUrl(params);
    return response;
  }

  constructor(
    private datePipe: DatePipe,
    private garbageStationRequestService: GarbageStationRequestService,
    private videoService: HWVideoService
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
    this.galleryTargetView.manualCaptureFn = (stationId, cb) => {
      this.garbageStationRequestService
        .manualCapture(stationId)
        .then((result) => {
          if (result && result) {
            const img = cb(result);
            this.table.dataSource.galleryTd.map((g) => {
              const oldIndex = g.imgSrc.findIndex(
                (f) => f.indexOf(img.old) > 0
              );
              if (oldIndex > 0 && g.key == stationId)
                g.imgSrc[oldIndex] = img.new;
            });
          }
        });
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

  async requestData(
    pageIndex: number,
    param?: { name?: string; stationId?: string; divisionId?: string },
    callBack?: (page: Page) => void
  ) {
    let params = this.getStationStatisticParam(
      pageIndex,
      this.search,
      this.toStationIds
    );
    if (param) {
      if (param.stationId) {
        params.Ids = [param.stationId];
      }
      if (param.name) {
        params.Name = param.name;
      }
      if (param.divisionId) {
        params.DivisionId = param.divisionId;
      }
    }
    const response =
      await this.garbageStationRequestService.statisticNumberList(params);
    console.log(params);
    console.log(response);
    const data = new GarbageDropEventsRecordViewModel();
    data.items = response.Data;
    this.table.clearItems();
    this.dataSource = [];
    this.table.Convert(data, this.table.dataSource);
    this.table.totalCount = response.Page.TotalRecordCount;
    this.appendDataSource(response.Data);
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
