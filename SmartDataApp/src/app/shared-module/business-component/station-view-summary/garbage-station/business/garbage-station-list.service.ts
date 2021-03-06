import { DatePipe } from "@angular/common";
import {
  GarbageStation,
  GetGarbageStationsParams,
} from "../../../../../data-core/model/waste-regulation/garbage-station";
import { GarbageStationType } from "../../../../../data-core/model/waste-regulation/garbage-station-type";
import { Injectable } from "@angular/core";
import { Division } from "../../../../../data-core/model/waste-regulation/division";
import { Page } from "../../../../../data-core/model/page";
import { GarbageStationRequestService } from "../../../../../data-core/repuest/garbage-station.service";
import { SearchControl } from "./search";
import { DivisionDao } from "../../../../../data-core/dao/division-dao";
import { GarbageStationTypeDao } from "../../../../../data-core/dao/garbage-station-type-dao";
import { DivisionRequestService } from "../../../../../data-core/repuest/division.service";
import { GarbageStationTypeRequestService } from "../../../../../data-core/repuest/garbage-station.service";
import { PlayVideo } from "../../../../../aiop-system/common/play-video";
import { GarbageStationDao } from "../../../../../data-core/dao/garbage-station-dao";
import { GalleryTargetViewI } from "../../../station-state-view-summary/full-garbage-station/business/gallery-target";
import { ResourceCameraDao } from "../../../../../data-core/dao/resources-camera-dao";
import { Camera } from "../../../../../data-core/model/waste-regulation/camera";
import { GarbageStationCameraRequestService } from "../../../../../data-core/repuest/garbage-station.service";
import { HWVideoService } from "../../../../../data-core/dao/video-dao";
import { ImageEventEnum } from "../../../../gallery-target/gallery-target";
import { SessionUser } from "../../../../../common/tool/session-user";
import { GetPreviewUrlParams } from "../../../../../data-core/model/aiop/video-url";
import { BusinessData, GarbageStationTable } from "./garbage-station-table";

@Injectable()
export class BusinessService {
  playVideo: PlayVideo;
  galleryTargetView = new GalleryTargetViewI(this.datePipe);
  resourceCameraDao: ResourceCameraDao;
  cameras: Camera[] = new Array();

  dataSource_ = new Array<GarbageStation>();

  divisions: Division[] = new Array();
  divisionsId = "";
  garbageStationTypes: GarbageStationType[] = new Array();

  positionClicked?: (station: GarbageStation) => void;

  search = new SearchControl();
  set dataSource(items: GarbageStation[]) {
    for (const x of items) this.dataSource_.push(x);
  }

  get dataSource() {
    return this.dataSource_;
  }
  table = new GarbageStationTable(this.datePipe);
  private divisionDao: DivisionDao;
  private garbageStationTypeDao: GarbageStationTypeDao;
  private garbageStationDao: GarbageStationDao;
  videoService: HWVideoService;
  playVideoFn = async (id: string) => {
    const idV = id.split("&"),
      camera = this.cameras.find((x) => x.Id == idV[1]);
    const video = await this.requestVideoUrl(camera.Id);
    this.playVideo = new PlayVideo(video.WebUrl, video.Url, camera.Name);
    this.playVideo.url = video.Url;
  };

  constructor(
    private datePipe: DatePipe,
    private garbageStationService: GarbageStationRequestService,
    divisionService: DivisionRequestService,
    private cameraService: GarbageStationCameraRequestService,
    garbageStationTypeService: GarbageStationTypeRequestService
  ) {
    this.divisionDao = new DivisionDao(divisionService);
    this.garbageStationDao = new GarbageStationDao(garbageStationService);
    this.garbageStationTypeDao = new GarbageStationTypeDao(
      garbageStationTypeService
    );
    this.resourceCameraDao = new ResourceCameraDao(this.cameraService);
    this.galleryTargetView.neighborEventFnI = (ids, e: ImageEventEnum) => {
      const idV = ids.split("&"),
        findStation = this.dataSource.find((x) => x.Id == idV[0]);
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
    this.table.findGarbageFn = (id) => {
      return this.dataSource.find((x) => x.Id == id);
    };

    this.table.initGalleryTargetFn = (garbageId, event, index) => {
      const cameras = new Array<Camera>();
      event.map((x) => {
        const find = this.cameras.find((c) => c.Id == x.Id);
        cameras.push(find);
      });
      this.galleryTargetView.initGalleryTargetI(
        garbageId,
        cameras as any,
        index
      );
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

    this.table.findDivisionFn = (id) => {
      return this.divisions.find((d) => d.Id == id);
    };
    this.table.positionButtonClicked = (id: string) => {
      let station = this.dataSource.find((x) => x.Id === id);
      if (station && this.positionClicked) {
        this.positionClicked(station);
      }
    };
  }

  async requestVideoUrl(cameraId: string) {
    const user = new SessionUser(),
      params = new GetPreviewUrlParams();
    // ,videoLive = '4'
    // ,config = await this.userDalService.getUserConfig(user.id, videoLive);
    params.CameraId = cameraId;
    // params.Protocol = 'ws-ps';
    // params.StreamType =config? parseInt(config):1;
    const response = await this.videoService.videoUrl(params);
    return response;
  }

  async requestGarbageStationType() {
    const result = await this.garbageStationTypeDao.garbageStationType();
    return result;
  }

  async requestDivisions() {
    const result = await this.divisionDao.allDivisions();
    return result;
  }

  async requestData(pageIndex: number, callBack?: (page: Page) => void) {
    const response = await this.garbageStationService.list(
      this.getRequsetParam(pageIndex, this.search)
    );
    let data = new BusinessData(
      this.garbageStationTypes,
      response.Data,
      this.divisions
    );
    data.items = this.cameras;
    this.table.clearItems();
    this.dataSource = [];
    this.table.Convert(data, this.table.dataSource);
    this.table.totalCount = response.Page.TotalRecordCount;
    this.dataSource = response.Data;
    if (callBack) callBack(response.Page);
  }

  getRequsetParam(pageIndex: number, search: SearchControl) {
    let s = search.searchform.value;
    const param = new GetGarbageStationsParams();
    param.PageIndex = pageIndex;
    param.DivisionId = this.divisionsId;
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
