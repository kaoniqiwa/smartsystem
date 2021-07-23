import { DatePipe } from "@angular/common";
import "../../../../../common/string/hw-string";
import { GarbageStation } from "../../../../../data-core/model/waste-regulation/garbage-station";
import { Injectable } from "@angular/core";
import { Division } from "../../../../../data-core/model/waste-regulation/division";
import { TableAttribute } from "../../../../../common/tool/table-form-helper";
import { EventRequestService } from "../../../../../data-core/repuest/garbage-drop-event-record";
import { TheDayTime } from "../../../../../common/tool/tool.service";
import {
  GetGarbageDropEventRecordsParams,
  GarbageDropEventRecord,
} from "../../../../../data-core/model/waste-regulation/garbage-drop-event-record";
import { SearchControl } from "../../../event-history/search";
import { PlayVideo } from "../../../../../aiop-system/common/play-video";
import { GalleryTargetViewI } from "../business/gallery-target";
import { Page } from "../../../../../data-core/model/page";
import { ImageEventEnum } from "../../../../gallery-target/gallery-target";
import { EventTable, GarbageDropEventsRecord } from "./event-table";
import { HWCameraImageUrl, ImgTypeEnum, TypeNameEnum } from "./camera-img-url";
import { DivisionListView } from "../../../event-history/division-list-view";
import { AIOPMediumPictureUrl } from "../../../../../data-core/url/aiop/resources";
import { Camera } from "../../../../../data-core/model/waste-regulation/camera";
import { ResourceMediumRequestService } from "../../../../../data-core/repuest/resources.service";
@Injectable()
export class BusinessService {
  playVideo: PlayVideo;
  galleryTargetView = new GalleryTargetViewI(this.datePipe);
  dataSource_ = new Array<GarbageDropEventRecord>();

  cameras = new Array<Camera>();
  divisions = new Array<Division>();
  stations = new Array<GarbageStation>();
  /**视频播放 */
  videoImgs: Array<{
    src: string;
    id: string;
    name: string;
    time: Date | string;
  }>;
  playVideoViewTitle = "";
  playVideoToUrlFn: (
    id: string,
    time: Date | string,
    cb: (webUrl: string, url: string) => void
  ) => void;
  search = new SearchControl(this.datePipe);
  set dataSource(items: GarbageDropEventRecord[]) {
    for (const x of items) this.dataSource_.push(x);
  }

  get dataSource() {
    return this.dataSource_;
  }
  table = new EventTable(this.datePipe);

  playVideoFn = async (id: string) => {
    // const idV = id.split('&');
    //     camera = this.cameras.find(x => x.Id == idV[1]);
    // const video = await this.requestVideoUrl(camera.Id);
    // this.playVideo = new PlayVideo(null, camera.Name);
    // this.playVideo.url_=video.Url;
    // this.navService.playVideoBug.emit(true);
  };
  divisionListView = new DivisionListView();
  constructor(
    private datePipe: DatePipe,
    private eventRequestService: EventRequestService
  ) {
    this.table.findDivisionFn = (id) => {
      return this.divisions.find((d) => d.Id == id);
    };

    this.galleryTargetView.neighborEventFnI = (ids, e: ImageEventEnum) => {
      const idV = ids.split("&"),
        findEvent = this.dataSource.find((x) => x.EventId == idV[0]),
        cameras = [
          ...findEvent.Data.DropImageUrls,
          ...findEvent.Data.HandleImageUrls,
          ...findEvent.Data.TimeoutImageUrls,
        ] as Array<HWCameraImageUrl>;
      for (let i = 0; i < cameras.length; i++) cameras[i].id = i + "";

      var index = cameras.findIndex((x) => x.id == idV[1]);
      var prev = true,
        next = true;
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
        var cameraToIndex = cameras[index];
        if (index == cameras.length - 1) next = false;
        return {
          item: cameras.find((x) => x.id == cameraToIndex.id),
          prev: prev,
          next: next,
        };
      } else if (e == ImageEventEnum.prev) {
        index -= 1;
        var cameraToIndex = cameras[index];
        if (index == 0) prev = false;
        return {
          item: cameras.find((x) => x.id == cameraToIndex.id),
          prev: prev,
          next: next,
        };
      }
    };
    this.table.findEventFn = (id) => {
      return this.dataSource.find((x) => x.EventId == id);
    };

    this.table.initGalleryTargetFn = (eventId, cameras, index) => {
      this.galleryTargetView.initGalleryTargetI(
        eventId,
        cameras as Array<HWCameraImageUrl>,
        index
      );
    };

    this.table.playVideoFn = (id) => {
      const event = this.table.findEventFn(id);
      this.videoImgs = new Array();
      this.playVideoViewTitle = event.Data.StationName;
      event.Data.DropImageUrls.map((m) => {
        if (this.videoImgs.findIndex((f) => f.id == m.CameraId) == -1)
          this.videoImgs.push({
            src: ResourceMediumRequestService.getJPG(m.ImageUrl),
            id: m.CameraId,
            name: m.CameraName,
            time: event.Data.DropTime,
          });
      });
      event.Data.HandleImageUrls.map((m) => {
        if (this.videoImgs.findIndex((f) => f.id == m.CameraId) == -1)
          this.videoImgs.push({
            src: ResourceMediumRequestService.getJPG(m.ImageUrl),
            id: m.CameraId,
            name: m.CameraName,
            time: event.Data.HandleTime,
          });
      });

      //     this.videoDownLoad = null;
    };
  }

  async requestData(pageIndex: number, callBack?: (page: Page) => void) {
    const response = await this.eventRequestService.list(
      this.getRequsetParam(pageIndex, this.search)
    );
    const data = new GarbageDropEventsRecord();

    data.items = response.Data.sort((a, b) => {
      return "".naturalCompare(a.EventTime, b.EventTime);
    });
    this.table.clearItems();
    this.dataSource = new Array();
    this.table.Convert(data, this.table.dataSource);
    this.table.totalCount = response.Page.TotalRecordCount;
    this.dataSource = response.Data;
    if (callBack) callBack(response.Page);
  }

  getRequsetParam(pageIndex: number, search: SearchControl) {
    const param = new GetGarbageDropEventRecordsParams(),
      day = TheDayTime(new Date());
    param.PageIndex = pageIndex;
    param.BeginTime = day.begin.toISOString();
    param.EndTime = day.end.toISOString();
    param.PageSize = 9;

    const s = search.toSearchParam();
    if (s.SearchText && search.other == false) {
      param.StationName = s.SearchText;
    } else {
      if (s.BeginTime) param.BeginTime = s.BeginTime;
      if (s.EndTime) param.EndTime = s.EndTime;
      if (s.DivisionId) param.DivisionIds = [s.DivisionId];
      if (s.StationId) param.StationIds = [s.StationId];
      if (s.ResourceId) param.ResourceIds = [s.ResourceId];
    }
    return param;
  }
}
