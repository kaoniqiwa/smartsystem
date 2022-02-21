import { Injectable } from "@angular/core";
import { CustomTableEvent } from "../../../custom-table/custom-table-event";
import { CameraTable, BusinessData } from "./camera-table";
import { SearchControl } from "./search";
import "../../../../common/string/hw-string";
import { Page } from "../../../../data-core/model/page";
import { DatePipe } from "@angular/common";
import {
  Camera,
  GetGarbageStationCamerasParams,
} from "../../../../data-core/model/waste-regulation/camera";
import { GarbageStationDao } from "../../../../data-core/dao/garbage-station-dao";
import { ResourceCameraDao } from "../../../../data-core/dao/resources-camera-dao";
import { DivisionDao } from "../../../../data-core/dao/division-dao";
import {
  GarbageStationRequestService,
  GarbageStationCameraRequestService,
} from "../../../../data-core/repuest/garbage-station.service";
import { GarbageStation } from "../../../../data-core/model/waste-regulation/garbage-station";
import { Division } from "../../../../data-core/model/waste-regulation/division";
import { DivisionRequestService } from "../../../../data-core/repuest/division.service";
import { AIOPMediumPictureUrl } from "../../../../data-core/url/aiop/resources";
import { ResourceMediumRequestService } from "../../../../data-core/repuest/resources.service";
import { OnlineStatus } from "src/app/data-core/model/enum";
import { HWVideoService } from "src/app/data-core/dao/video-dao";
import { GalleryTargetViewI } from "./gallery-target";
import { PlayVideo } from "src/app/aiop-system/common/play-video";
import { GetPreviewUrlParams } from "src/app/data-core/model/aiop/video-url";
@Injectable()
export class CameraTableService {
  galleryTargetView = new GalleryTargetViewI(this.datePipe);
  dataSource_ = new Array<Camera>();

  appendDataSource(items: Camera[]) {
    for (const x of items) this.dataSource_.push(x);
  }

  get dataSource() {
    return this.dataSource_;
  }
  search = new SearchControl();
  table = new CameraTable(this.datePipe);
  garbageStationDao: GarbageStationDao;
  resourceCameraDao: ResourceCameraDao;
  divisionDao: DivisionDao;
  garbageStations = new Array<GarbageStation>();
  resourceCamera = new Array<Camera>();
  divisions = new Array<Division>();
  cameraStateTable?: OnlineStatus = undefined;
  findImgSrc = "";
  divisionsId = "";
  constructor(
    garbageStationService: GarbageStationRequestService,
    private cameraService: GarbageStationCameraRequestService,
    divisionRequestService: DivisionRequestService,
    private datePipe: DatePipe,
    private videoService: HWVideoService
  ) {
    this.table.scrollPageFn = (event: CustomTableEvent) => {
      this.requestData(event.data as any);
    };
    this.garbageStationDao = new GarbageStationDao(garbageStationService);
    this.resourceCameraDao = new ResourceCameraDao(cameraService);
    this.divisionDao = new DivisionDao(divisionRequestService);

    this.table.showImgFn = (id: string) => {
      const find = this.resourceCamera.find((x) => x.Id == id);
      this.findImgSrc = ResourceMediumRequestService.getJPG(find.ImageUrl);
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
    this.table.initGalleryTargetFn = (cameraId) => {
      this.galleryTargetView.initGalleryTargetI(
        this.dataSource.find((x) => x.Id === cameraId)
      );
    };
  }

  async getGarbageStations() {
    const result = await this.garbageStationDao.allGarbageStations();
    this.garbageStations = result;
  }

  async getResourceCameras() {
    const result = await this.resourceCameraDao.allResourceCameras();
    this.resourceCamera = result;
  }

  async getDivisions() {
    const result = await this.divisionDao.allDivisions();
    this.divisions = result;
  }

  async requestData(pageIndex: number, callBack?: (page: Page) => void) {
    const response = await this.cameraService.postList(
      this.getRequsetParam(pageIndex, this.search)
    );

    const data = new BusinessData();
    data.statioins = this.garbageStations;
    data.resourceCameras = this.resourceCamera;
    data.divisions = this.divisions;
    data.cameras = response.Data.sort((a, b) => {
      return "".naturalCompare(a.Name, b.Name);
    });

    this.table.clearItems();
    this.dataSource_ = [];

    this.table.Convert(data, this.table.dataSource);
    this.table.totalCount = response.Page.TotalRecordCount;

    this.appendDataSource(response.Data);
    if (callBack) callBack(response.Page);
  }

  getRequsetParam(pageIndex: number, search: SearchControl) {
    const param = new GetGarbageStationCamerasParams();
    param.PageIndex = pageIndex;
    param.PageSize = 10;
    if (search.state) param.Name = search.searchText;
    param.OnlineStatus = this.cameraStateTable;
    param.DivisionIds = [this.divisionsId];
    console.log(param);

    return param;
  }

  playVideoFn = async (id: string) => {
    const idV = id.split("&"),
      camera = this.dataSource.find((x) => x.Id == idV[1]),
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
  playVideo: PlayVideo;
}
