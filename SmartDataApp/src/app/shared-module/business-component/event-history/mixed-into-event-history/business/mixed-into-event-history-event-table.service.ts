import { Injectable } from "@angular/core";
import { CustomTableEvent } from "../../../../custom-table/custom-table-event";
import {
  EventTable,
  MixedIntoEventRecordList,
} from "./mixed-into-event-history-event-table";
import { SearchControl } from "../../search";
import "../../../../../common/string/hw-string";
import {
  TheDayTime,
  TimeInterval,
  DateInterval,
} from "../../../../../common/tool/tool.service";
import { PlayVideo } from "../../../../../aiop-system/common/play-video";
import { Page } from "../../../../../data-core/model/page";
import {
  TableAttribute,
  ListAttribute,
} from "../../../../../common/tool/table-form-helper";
import { DatePipe } from "@angular/common";
import { DivisionRequestService } from "../../../../../data-core/repuest/division.service";
import { MixedIntoEventRequestService } from "../../../../../data-core/repuest/mixed-into-event-record";
import {
  GetDivisionsParams,
  Division,
} from "../../../../../data-core/model/waste-regulation/division";
import {
  GarbageStationRequestService,
  GarbageStationCameraRequestService,
} from "../../../../../data-core/repuest/garbage-station.service";
import {
  GetGarbageStationsParams,
  GarbageStation,
} from "../../../../../data-core/model/waste-regulation/garbage-station";
import { Camera } from "../../../../../data-core/model/waste-regulation/camera";
import { MixedIntoEventRecord } from "../../../../../data-core/model/waste-regulation/mixed-into-event-record";
import { GetEventRecordsParams } from "../../../../../data-core/model/waste-regulation/illegal-drop-event-record";
import { ImageEventEnum } from "../../../../gallery-target/gallery-target";
import { EventCards } from "../../event-cards";
import { GalleryTargetView } from "../../gallery-target";
import { PageListMode } from "../../../../../common/tool/enum-helper";
import { DivisionListView } from "../../division-list-view";
import { GetGarbageStationCamerasParams } from "../../../../../data-core/model/waste-regulation/camera";
import { SessionUser } from "../../../../../common/tool/session-user";
import { EnumHelper } from "../../../../../common/tool/enum-helper";
import { AIOPMediumPictureUrl } from "../../../../../data-core/url/aiop/resources";
import { MessageBar } from "../../../../../common/tool/message-bar";
import { ResourceMediumRequestService } from "../../../../../data-core/repuest/resources.service";
import { Flags } from "src/app/data-core/model/flags";
import { CameraUsage } from "src/app/data-core/model/enum";
@Injectable()
export class EventTableService extends ListAttribute {
  dataSource_ = new Array<MixedIntoEventRecord>();

  allDataSource = new Array<MixedIntoEventRecord>();

  set dataSource(items: MixedIntoEventRecord[]) {
    for (const x of items) this.dataSource_.push(x);
  }

  get dataSource() {
    return this.dataSource_;
  }
  search = new SearchControl(this.datePipe);
  eventTable = new EventTable(this.datePipe);
  eventCards = new EventCards(this.datePipe);
  galleryTargetView = new GalleryTargetView(this.datePipe);
  divisions = new Array<Division>();
  garbageStations = new Array<GarbageStation>();
  resources = new Array<Camera>();
  divisionListView = new DivisionListView();
  playVideoViewTitle = "";
  videoImgs: Array<{
    src: string;
    id: string;
    name: string;
    time: Date | string;
  }>;
  fillMode: MixedInfoEventHistoryFillMode;
  /**视频下载列表 */
  videoDownLoad: VideoDownLoadInfo[];
  playVideoToUrlFn: (
    id: string,
    time: Date | string,
    cb: (webUrl: string, url: string) => void
  ) => void;
  videoFilesFn: (id: string) => void;
  constructor(
    private eventRequestService: MixedIntoEventRequestService,
    private divisionService: DivisionRequestService,
    private garbageStationService: GarbageStationRequestService,
    private resourceService: GarbageStationCameraRequestService,
    private datePipe: DatePipe
  ) {
    super();
    this.eventTable.scrollPageFn = (event: CustomTableEvent) => {
      this.requestData(event.data as any);
      this.searchData(event.data as any);
    };
    this.eventTable.findEventFn = (id) => {
      return this.dataSource.find((x) => x.EventId == id);
    };

    this.eventTable.initGalleryTargetFn = (event) => {
      this.galleryTargetView.initGalleryTarget(event);
      this.galleryTargetView.galleryTarget.videoName = true;
    };

    this.galleryTargetView.neighborEventFn = (id, e: ImageEventEnum) => {
      var index = this.allDataSource.findIndex((x) => x.EventId == id);
      var prev = true,
        next = true,
        item: MixedIntoEventRecord;

      if (e == ImageEventEnum.none) {
        if (index == 0) prev = false;
        if (index == this.allDataSource.length - 1) next = false;
        return {
          item: null,
          prev: prev,
          next: next,
        };
      } else if (e == ImageEventEnum.next) {
        index += 1;
        item = this.allDataSource[index];
        if (index == this.allDataSource.length - 1) next = false;
        return {
          item: item,
          prev: prev,
          next: next,
        };
      } else if (e == ImageEventEnum.prev) {
        index -= 1;
        item = this.allDataSource[index];
        if (index == 0) prev = false;
        return {
          item: item,
          prev: prev,
          next: next,
        };
      }
    };

    this.eventTable.playVideoFn = async (id) => {
      var event = this.eventTable.findEventFn(id);
      if (event == null)
        event = this.allDataSource.find((x) => x.EventId == id);
      const station = this.garbageStations.find(
        (x) => x.Id == event.Data.StationId
      );
      this.videoImgs = new Array();
      this.playVideoViewTitle = station.Name;

      this.videoImgs.push({
        src: ResourceMediumRequestService.getJPG(event.ImageUrl),
        id: event.ResourceId,
        name: event.ResourceName,
        time: event.EventTime,
      });
      if (station.Cameras)
        station.Cameras.map((m) => {
          let flags = new Flags(m.CameraUsage);
          if (flags.contains(CameraUsage.MixedInto)) {
            this.videoImgs.push({
              src: ResourceMediumRequestService.getJPG(m.ImageUrl),
              id: m.Id,
              name: m.Name,
              time: event.EventTime,
            });
          }
        });
      this.videoDownLoad = null;
    };

    this.eventTable.videoFilesFn = (id) => {
      this.appendVideoList(id);
    };

    // this.playVideoToUrlFn = async (id, time, cb) => {
    //     const user = new SessionUser(),
    //         video = await this.requestVideoUrl(DateInterval(time + '', user.video.beforeInterval)
    //             , DateInterval(time + '', user.video.afterInterval), id);
    //     video.Url = video.Url.indexOf('password') > 0 ? video.Url : video.Url + user.videoUserPwd;
    //     cb(video.Url)
    //     this.navService.playVideoBug.emit(true);
    // }

    this.videoFilesFn = (id) => {
      this.appendVideoList(id);
    };

    this.eventTable.findDivisionFn = (id) => {
      return this.divisions.find((d) => d.Id == id);
    };
  }

  /**多视频文件 列表 */
  appendVideoList(id: string) {
    const event = this.eventTable.findEventFn(id),
      station = this.garbageStations.find((x) => x.Id == event.Data.StationId);
    this.videoDownLoad = new Array();
    this.videoDownLoad.push({
      stationId: station.Id,
      cameraId: event.ResourceId,
      name: event.ResourceName,
      state: this.videoDownLoad.length === 0,
      eventId: id,
    });
    station.Cameras.map((m) => {
      let flags = new Flags(m.CameraUsage);
      if (flags.contains(CameraUsage.MixedInto)) {
        this.videoDownLoad.push({
          stationId: station.Id,
          cameraId: m.Id,
          name: m.Name,
          state: this.videoDownLoad.length === 0,
          eventId: id,
        });
      }
    });
  }

  videoItemClicked(item: VideoDownLoadInfo) {
    this.videoDownLoad.forEach((x) => {
      x.state = false;
    });
    item.state = true;
  }

  videoListDownload() {
    const user = new SessionUser();
    this.videoDownLoad.forEach((v) => {
      if (v.state) {
        const event = this.eventTable.findEventFn(v.eventId);
        const start = DateInterval(
          event.EventTime + "",
          user.video.beforeInterval
        ).toISOString();
        const end = DateInterval(
          event.EventTime + "",
          user.video.afterInterval
        ).toISOString();
        MessageBar.response_success("正在下载中...");
        this.garbageStationService
          // .cameraFileUrl(event.Data.StationId, event.ResourceId, s, e)
          .cameraFileUrl(v.stationId, v.cameraId, start, end)
          .then((video) => {
            const a = document.createElement("a");
            a.href = video.Url;
            a.click();
            document.body.appendChild(a);
            document.body.removeChild(a);
          });
      }
    });
  }

  // async requestVideoUrl(begin: Date, end: Date, cameraId: string) {
  //     const params = new GetVodUrlParams();
  //     params.BeginTime = begin;
  //     params.EndTime = end;
  //     params.Protocol = 'ws-ps';
  //     params.StreamType = 1;
  //     params.CameraId = cameraId;
  //     const response = await this.srService.VodUrls(params).toPromise();
  //     return response.Data;
  // }

  async requestResource() {
    const param = new GetGarbageStationCamerasParams();
    param.PageIndex = 1;
    param.PageSize = this.maxSize;
    const result = await this.resourceService.postList(param);
    return result.Data;
  }

  async requestDivisions() {
    const result = await this.divisionService.list();
    return result.Data;
  }

  async requestGarbageStations() {
    const param = new GetGarbageStationsParams();
    param.PageIndex = 1;
    param.PageSize = this.maxSize;
    const result = await this.garbageStationService.list(param);
    return result.Data;
  }

  async requestData(pageIndex: number, callBack?: (page: Page) => void) {
    if (this.search.state == false) {
      const response = await this.eventRequestService.list(
        this.getRequsetParam(pageIndex, this.search)
      );
      let data = new MixedIntoEventRecordList();
      data.items = response.Data.sort((a, b) => {
        return "".naturalCompare(a.EventTime, b.EventTime);
      });

      this.eventCards.clearData();
      this.eventCards.Convert(data.items);

      this.eventTable.clearItems();
      this.dataSource_ = new Array();
      this.eventTable.Convert(data, this.eventTable.dataSource);
      this.eventTable.totalCount = response.Page.TotalRecordCount;
      this.dataSource = response.Data;
      if (callBack) callBack(response.Page);
    }
  }

  async requestDataX(pageIndex: number, callBack?: (page: Page) => void) {
    if (this.search.state == false) {
      const response = await this.eventRequestService.list(
        this.getRequsetParam(pageIndex, this.search, 15)
      );
      let data = new MixedIntoEventRecordList();
      data.items = response.Data.sort((a, b) => {
        return "".naturalCompare(a.EventTime, b.EventTime);
      });
      this.eventCards.clearData();
      this.eventCards.Convert(data.items);
      this.eventCards.cardList = this.eventCards.dataSource;
      this.dataSource = response.Data;
      if (callBack) callBack(response.Page);
    }
  }

  async searchData(pageIndex: number, callBack?: (page: Page) => void) {
    if (this.search.state) {
      const response = await this.eventRequestService.list(
        this.getRequsetParam(pageIndex, this.search)
      );

      let data = new MixedIntoEventRecordList();
      data.items = response.Data.sort((a, b) => {
        return "".naturalCompare(a.EventTime, b.EventTime);
      });
      this.eventTable.clearItems();
      this.dataSource_ = new Array();
      this.eventTable.Convert(data, this.eventTable.dataSource);
      this.eventTable.totalCount = response.Page.TotalRecordCount;
      this.dataSource = response.Data;
      if (callBack) callBack(response.Page);
    }
  }

  async searchDataX(pageIndex: number, callBack?: (page: Page) => void) {
    if (this.search.state) {
      const response = await this.eventRequestService.list(
        this.getRequsetParam(pageIndex, this.search)
      );

      let data = new MixedIntoEventRecordList();
      data.items = response.Data.sort((a, b) => {
        return "".naturalCompare(a.EventTime, b.EventTime);
      });
      this.eventCards.clearData();
      this.eventCards.Convert(data.items);
      this.eventCards.cardList = this.eventCards.dataSource;
      this.dataSource = response.Data;
      if (callBack) callBack(response.Page);
    }
  }

  async allEventsRecordData() {
    const response = await this.eventRequestService.list(
      this.getRequsetParam(1, this.search, new ListAttribute().maxSize)
    );
    let data = new MixedIntoEventRecordList();
    data.items = response.Data.sort((a, b) => {
      return "".naturalCompare(a.EventTime, b.EventTime);
    });
    this.allDataSource = response.Data;
  }

  getRequsetParam(pageIndex: number, search: SearchControl, pageSize?: number) {
    const param = new GetEventRecordsParams(),
      day = TheDayTime(new Date());
    param.PageIndex = pageIndex;
    param.BeginTime = day.begin;
    param.EndTime = day.end;
    if (pageSize) param.PageSize = pageSize;
    else {
      if (this.fillMode)
        param.PageSize =
          this.fillMode.pageListMode == PageListMode.list
            ? this.fillMode.cardPageSize
            : this.fillMode.tablePageSize;
      else param.PageSize = new TableAttribute().pageSize;
    }
    const s = search.toSearchParam();
    if (s.SearchText && search.other == false) {
      param.StationName = s.SearchText;
    } else {
      if (s.BeginTime) param.BeginTime = new Date(s.BeginTime);
      if (s.EndTime) param.EndTime = new Date(s.EndTime);
      if (s.DivisionId) param.DivisionIds = [s.DivisionId];
      if (s.StationId) param.StationIds = [s.StationId];
      if (s.ResourceId) param.ResourceIds = [s.ResourceId];
    }
    return param;
  }
}

export class MixedInfoEventHistoryFillMode {
  divisionId: string = "";
  tablePageSize: number = 9;
  cardPageSize: number = 15;
  pageListMode_: PageListMode;
  readonly sessionTag = "mixed-info-event-history";
  get pageListMode() {
    const val = sessionStorage.getItem(this.sessionTag);
    return val ? val : PageListMode.table;
  }

  set pageListMode(val: any) {
    sessionStorage.setItem(this.sessionTag, val + "");
  }
}

interface VideoDownLoadInfo {
  name: string;
  stationId: string;
  cameraId: string;
  state: boolean;
  eventId: string;
}
