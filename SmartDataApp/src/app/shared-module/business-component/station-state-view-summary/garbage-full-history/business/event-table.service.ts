import { Injectable } from "@angular/core";
import { CustomTableEvent } from "../../../../custom-table/custom-table-event";
import { EventTable, GarbageFullEventsRecord } from "./event-table";
import { SearchControl } from "../../../event-history/search";
import "../../../../../common/string/hw-string";
import {
  TheDayTime,
  DateInterval,
} from "../../../../../common/tool/tool.service";
import { MessageBar } from "../../../../../common/tool/message-bar";
import { PlayVideo } from "../../../../../aiop-system/common/play-video";
import { Page } from "../../../../../data-core/model/page";
import {
  TableAttribute,
  ListAttribute,
} from "../../../../../common/tool/table-form-helper";
import { DatePipe } from "@angular/common";
import { DivisionRequestService } from "../../../../../data-core/repuest/division.service";
import { EventRequestService } from "../../../../../data-core/repuest/garbage-full-event-record";
import {
  GetDivisionsParams,
  Division,
} from "../../../../../data-core/model/waste-regulation/division";
import {
  GarbageStationRequestService,
  CameraRequestService,
} from "../../../../../data-core/repuest/garbage-station.service";
import {
  GetGarbageStationsParams,
  GarbageStation,
} from "../../../../../data-core/model/waste-regulation/garbage-station";
import { Camera } from "../../../../../data-core/model/waste-regulation/camera";
import { GarbageFullEventRecord } from "../../../../../data-core/model/waste-regulation/garbage-full-event-record";
import { ImageEventEnum } from "../../../../gallery-target/gallery-target";
import { EventCards } from "../../../event-history/event-cards";
import { GalleryTargetView } from "./gallery-target";
import { GetVodUrlParams } from "../../../../../data-core/model/aiop/video-url";
import {
  PageListMode,
  EnumHelper,
} from "../../../../../common/tool/enum-helper";
import { DivisionListView } from "../../../event-history/division-list-view";
import { GetGarbageStationCamerasParams } from "../../../../../data-core/model/waste-regulation/camera";
import { SessionUser } from "../../../../../common/tool/session-user";
import { GetEventRecordsParams } from "../../../../../data-core/model/waste-regulation/illegal-drop-event-record";
import { GalleryTargetItem } from "./gallery-target";
import { MediumPicture } from "../../../../../data-core/url/aiop/resources";
@Injectable()
export class EventTableService extends ListAttribute {
  dataSource_ = new Array<GarbageFullEventRecord>();

  allDataSource = new Array<GarbageFullEventRecord>();

  set dataSource(items: GarbageFullEventRecord[]) {
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
  playVideo: PlayVideo;
  fillMode: FillMode;
  videoFilesFn: (id: string) => void;
  videoFileFn: (id: string) => void;
  playVideoToUrlFn: (
    id: string,
    time: Date | string,
    cb: (webUrl: string, url: string) => void
  ) => void;
  playVideoViewTitle = "";
  videoImgs: Array<{
    src: string;
    id: string;
    name: string;
    time: Date | string;
  }>;
  /**视频下载列表 */
  videoDownLoad: {
    name: string;
    stationId: string;
    cameraId: string;
    state: boolean;
    eventId: string;
  }[];
  playVideoFn: (id: string) => void;
  constructor(
    private eventRequestService: EventRequestService,
    private divisionService: DivisionRequestService,
    private garbageStationService: GarbageStationRequestService,
    private resourceService: CameraRequestService,
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
      this.galleryTargetView.initGalleryTarget(event, 0);
      this.galleryTargetView.galleryTarget.videoName = true;
    };

    this.galleryTargetView.neighborEventFn = (ids, e: ImageEventEnum) => {
      const idV = ids.split("&"),
        gi = new GalleryTargetItem();
      var findEvent = this.dataSource.find((x) => x.EventId == idV[1]),
        index = findEvent.Data.CameraImageUrls.findIndex(
          (x) => x.CameraId == idV[0]
        );
      gi.event = findEvent;
      var prev = true,
        next = true;
      if (e == ImageEventEnum.none) {
        if (index == 0) prev = false;
        else if (index == findEvent.Data.CameraImageUrls.length - 1)
          next = false;
        return {
          item: null,
          prev: prev,
          next: next,
        };
      } else if (e == ImageEventEnum.next) {
        index += 1;
        const cameraToIndex = findEvent.Data.CameraImageUrls[index];

        gi.other = cameraToIndex;
        if (index == findEvent.Data.CameraImageUrls.length - 1) next = false;
        return {
          item: gi,
          prev: prev,
          next: next,
        };
      } else if (e == ImageEventEnum.prev) {
        index -= 1;
        const cameraToIndex = findEvent.Data.CameraImageUrls[index];
        gi.other = cameraToIndex;
        if (index == 0) prev = false;
        return {
          item: gi,
          prev: prev,
          next: next,
        };
      }
    };

    this.eventTable.playVideosFn = async (ids) => {
      const idV = ids.split("&"),
        mp = new MediumPicture();
      var event = this.dataSource.find((x) => {
        if (idV.length == 1) return x.EventId == idV[0];
        else return x.EventId == idV[1];
      });

      if (event == null)
        event = this.allDataSource.find((x) => x.EventId == idV[1]);
      if (event.Data) {
        this.playVideoViewTitle = event.Data.StationName;
        this.videoImgs = new Array();
        event.Data.CameraImageUrls.map((u) => {
          this.videoImgs.push({
            src: mp.getJPG(u.ImageUrl),
            id: u.CameraId,
            name: u.CameraName,
            time: event.EventTime,
          });
        });
      }
    };
    this.eventTable.videoFilesFn = (id) => {
      this.appendVideoList(id);
    };

    this.videoFileFn = (ids) => {
      const idV = ids.split("&"),
        user = new SessionUser();
      const event = this.eventTable.findEventFn(idV[1]),
        s = DateInterval(
          event.EventTime + "",
          user.video.beforeInterval
        ).toISOString(),
        e = DateInterval(
          event.EventTime + "",
          user.video.afterInterval
        ).toISOString();
      new MessageBar().response_success("正在下载中...");
      this.garbageStationService
        .cameraFileUrl(event.Data.StationId, idV[0], s, e)
        .then((video) => {
          const a = document.createElement("a");
          a.href = video.Url;
          a.click();
          document.body.appendChild(a);
          document.body.removeChild(a);
        });
    };

    this.eventTable.findDivisionFn = (id) => {
      return this.divisions.find((d) => d.Id == id);
    };
  }

  /**多视频文件 列表 */
  appendVideoList(id: string) {
    const event = this.eventTable.findEventFn(id);
    if (event.Data) {
      const station = this.garbageStations.find(
        (g) => g.Id == event.Data.StationId
      );
      this.videoDownLoad = new Array();
      event.Data.CameraImageUrls.map((u) => {
        this.videoDownLoad.push({
          stationId: station.Id,
          cameraId: u.CameraId,
          name: u.CameraName,
          state: true,
          eventId: event.EventId,
        });
      });
    }
  }

  videoListDownload() {
    const user = new SessionUser();
    this.videoDownLoad.map((v) => {
      if (v.state) {
        const event = this.eventTable.findEventFn(v.eventId),
          s = DateInterval(
            event.EventTime + "",
            user.video.beforeInterval
          ).toISOString(),
          e = DateInterval(
            event.EventTime + "",
            user.video.afterInterval
          ).toISOString();
        new MessageBar().response_success("正在下载中...");
        this.garbageStationService
          .cameraFileUrl(event.Data.StationId, v.cameraId, s, e)
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

  getVodUrlParam(
    eventId: string,
    cameraId: string,
    bgTime?: string,
    edTime?: string
  ) {
    const param = new GetVodUrlParams();
    param.CameraId = cameraId;
    if (eventId) {
      const event = this.dataSource.find((x) => x.EventId == eventId);
      param.BeginTime = event.EventTime;
      param.EndTime = event.EventTime;
    } else if (bgTime && edTime) {
      param.BeginTime = bgTime;
      param.EndTime = edTime;
    }
    return param;
  }

  getCameraName(eventId: string, cameraId: string) {
    const event = this.dataSource.find((x) => x.EventId == eventId);
    var name = "";
    if (event.Data) {
      const camera = event.Data.CameraImageUrls.find(
        (x) => x.CameraId == cameraId
      );
      name = camera ? camera.CameraName : "";
    }
    return name;
  }
  /**
   * 排除外面摄像机
   * @param list
   */
  toGarbageFullEventsRecord(list: Array<GarbageFullEventRecord>) {
    const eh = new EnumHelper();
    list.map((event) => {
      if (event.Data) {
        const station = this.garbageStations.find(
            (g) => g.Id == event.Data.StationId
          ),
          camera = station.Cameras.filter(
            (x) => eh.cameraUsage.garbageFull.indexOf(x.CameraUsage) > 0
          ),
          delIndex = new Array<number>();
        for (let i = 0; i < event.Data.CameraImageUrls.length; i++) {
          const index = camera.findIndex(
            (x) => x.Id == event.Data.CameraImageUrls[i].CameraId
          );
          if (index == -1) delIndex.push(i);
        }
        delIndex.map((v) => event.Data.CameraImageUrls.splice(v, 1));
      }
    });
  }

  async requestResource() {
    const param = new GetGarbageStationCamerasParams();
    param.PageIndex = 1;
    param.PageSize = this.maxSize;
    const result = await this.resourceService.postList(param);
    return result.Data;
  }

  async requestDivisions() {
    const param = new GetDivisionsParams();
    param.PageIndex = 1;
    param.PageSize = this.maxSize;
    const result = await this.divisionService.list(param);
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
      this.toGarbageFullEventsRecord(response.Data);
      let data = new GarbageFullEventsRecord();
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
      this.toGarbageFullEventsRecord(response.Data);
      let data = new GarbageFullEventsRecord();
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

      let data = new GarbageFullEventsRecord();
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

      let data = new GarbageFullEventsRecord();
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
    let data = new GarbageFullEventsRecord();
    data.items = response.Data.sort((a, b) => {
      return "".naturalCompare(a.EventTime, b.EventTime);
    });
    this.allDataSource = response.Data;
  }

  getRequsetParam(pageIndex: number, search: SearchControl, pageSize?: number) {
    const param = new GetEventRecordsParams(),
      day = TheDayTime(new Date());
    param.PageIndex = pageIndex;
    param.BeginTime = day.begin.toISOString();
    param.EndTime = day.end.toISOString();
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
      if (s.BeginTime) param.BeginTime = s.BeginTime;
      if (s.EndTime) param.EndTime = s.EndTime;
      if (s.DivisionId) param.DivisionIds = [s.DivisionId];
      if (s.StationId) param.StationIds = [s.StationId];
      if (s.ResourceId) param.ResourceIds = [s.ResourceId];
    }
    return param;
  }
}

export class FillMode {
  divisionId: string = "";
  tablePageSize: number = 10;
  cardPageSize: number = 15;
  pageListMode_: PageListMode;
  readonly sessionTag = "garbage-Full-event-history";
  get pageListMode() {
    const val = sessionStorage.getItem(this.sessionTag);
    return val ? val : PageListMode.table;
  }

  set pageListMode(val: any) {
    sessionStorage.setItem(this.sessionTag, val + "");
  }
}
