import { Injectable } from "@angular/core";
import { CameraAIEventRecord } from "../../../../data-core/model/aiop/camera-ai-event-record";
import { GetCameraAIEventRecordsParams } from "../../../../data-core/model/aiop/camera-ai-event-records-params";
import { CustomTableEvent } from "../../../../shared-module/custom-table/custom-table-event";
import { EventTable, CameraAIEventsRecord } from "./event-table";
import { SearchControl } from "./search";
import "../../../../common/string/hw-string";
import { TheDayTime, DateInterval } from "../../../../common/tool/tool.service";
import { EventRequestService } from "../../../../data-core/repuest/event-record.service";
import { Page } from "../../../../data-core/model/page";
import {
  TableAttribute,
  ListAttribute,
} from "../../../../common/tool/table-form-helper";
import { AIModelRequestService } from "../../../../data-core/repuest/ai-model.service";
import { GetAIModelsParams } from "../../../../data-core/model/aiop/ai-models-params";
import { CameraAIModel } from "../../../../data-core/model/aiop/camera-ai-model";
import { DatePipe } from "@angular/common";
import { PageListMode } from "../../../../common/tool/enum-helper";
import { EventCards } from "./event-cards";
import { GalleryTargetView } from "./gallery-target";
import { PlayVideo } from "../../../common/play-video";
import { ImageEventEnum } from "../../../../shared-module/gallery-target/gallery-target";
import { GetVodUrlParams } from "../../../../data-core/model/aiop/video-url";
import { SideNavService } from "../../../../common/tool/sidenav.service";
import { SessionUser } from "../../../../common/tool/session-user";
import { HWVideoService } from "../../../../data-core/dao/video-dao";
@Injectable()
export class EventTableService {
  dataSource_ = new Array<CameraAIEventRecord>();
  allDataSource = new Array<CameraAIEventRecord>();

  set dataSource(items: CameraAIEventRecord[]) {
    for (const x of items) this.dataSource_.push(x);
  }

  get dataSource() {
    return this.dataSource_;
  }
  search = new SearchControl(this.datePipe);
  eventTable = new EventTable(this.datePipe);
  eventCards = new EventCards(this.datePipe);
  galleryTargetView = new GalleryTargetView(this.datePipe);
  playVideo: PlayVideo;
  fillMode: AIModeEventHistoryFillMode;
  camerasAIModel: CameraAIModel[] = new Array();
  videoService: HWVideoService;
  constructor(
    private eventRequestService: EventRequestService,
    private navService: SideNavService,
    private aiModelRequestService: AIModelRequestService,
    private datePipe: DatePipe
  ) {
    this.fillMode = new AIModeEventHistoryFillMode();
    this.eventTable.scrollPageFn = (event: CustomTableEvent) => {
      this.requestData(event.data as any);
    };
    this.eventTable.findEventFn = (id) => {
      return this.dataSource.find((x) => x.EventId == id);
    };

    this.eventTable.initGalleryTargetFn = (event) => {
      this.galleryTargetView.initGalleryTarget(event);
    };

    this.galleryTargetView.neighborEventFn = (id, e: ImageEventEnum) => {
      var index = this.allDataSource.findIndex((x) => x.EventId == id);
      var prev = true,
        next = true,
        item: CameraAIEventRecord;

      if (e == ImageEventEnum.none) {
        if (index == 0) prev = false;
        else if (index == this.allDataSource.length - 1) next = false;
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
      const user = new SessionUser(),
        video = await this.requestVideoUrl(
          DateInterval(event.EventTime + "", user.video.beforeInterval),
          DateInterval(event.EventTime + "", user.video.afterInterval),
          event.ResourceId
        );
      this.playVideo = new PlayVideo(video.WebUrl, null, event.ResourceName);
      this.playVideo.url = video.Url;
      this.navService.playVideoBug.emit(true);
    };
  }

  async requestVideoUrl(begin: Date, end: Date, cameraId: string) {
    const params = new GetVodUrlParams();
    params.BeginTime = begin;
    params.EndTime = end;
    // params.Protocol = 'ws-ps';
    // params.StreamType = 1;
    params.CameraId = cameraId;
    const response = await this.videoService.vodUrl(params);
    return response;
  }

  async getAIModels() {
    const param = new GetAIModelsParams();
    param.PageIndex = 1;
    param.PageSize = new ListAttribute().maxSize;
    const response = await this.aiModelRequestService.list(param).toPromise();
    this.camerasAIModel = response.Data.Data;
  }

  async requestData(pageIndex: number, callBack?: (page: Page) => void) {
    const response = await this.eventRequestService.list(
      this.getRequsetParam(pageIndex, this.search)
    );
    let data = new CameraAIEventsRecord();
    data.items = response.Data.sort((a, b) => {
      return "".naturalCompare(a.EventTime, b.EventTime);
    });

    this.eventTable.clearItems();
    this.dataSource = [];
    this.eventTable.Convert(data, this.eventTable.dataSource);
    this.eventTable.totalCount = response.Page.TotalRecordCount;
    this.dataSource = response.Data;
    if (callBack) callBack(response.Page);
  }

  async requestDataX(pageIndex: number, callBack?: (page: Page) => void) {
    const response = await this.eventRequestService.list(
      this.getRequsetParam(pageIndex, this.search)
    );
    let data = new CameraAIEventsRecord();
    data.items = response.Data.sort((a, b) => {
      return "".naturalCompare(a.EventTime, b.EventTime);
    });

    this.eventCards.clearData();
    this.eventCards.Convert(data.items);
    this.eventCards.cardList = this.eventCards.dataSource;
    this.dataSource = response.Data;
    if (callBack) callBack(response.Page);
  }

  async allEventsRecordData() {
    const response = await this.eventRequestService.list(
      this.getRequsetParam(1, this.search, new ListAttribute().maxSize)
    );
    let data = new CameraAIEventsRecord();
    data.items = response.Data.sort((a, b) => {
      return "".naturalCompare(a.EventTime, b.EventTime);
    });
    this.allDataSource = response.Data;
  }

  getRequsetParam(pageIndex: number, search: SearchControl, pageSize?: number) {
    const param = new GetCameraAIEventRecordsParams(),
      day = TheDayTime(new Date());
    param.PageIndex = pageIndex;
    param.BeginTime = day.begin.toISOString();
    param.EndTime = day.end.toISOString();
    const s = search.toSearchParam();
    if (pageSize) param.PageSize = pageSize;
    else {
      if (this.fillMode)
        param.PageSize =
          this.fillMode.pageListMode == PageListMode.list
            ? this.fillMode.cardPageSize
            : this.fillMode.tablePageSize;
      else param.PageSize = new TableAttribute().pageSize;
    }
    if (s.SearchText && search.other == false) {
      param.ResourceName = s.SearchText;
    } else {
      if (s.BeginTime) param.BeginTime = s.BeginTime;
      if (s.EndTime) param.EndTime = s.EndTime;
      if (s.EventType) param.EventTypes = [s.EventType];
      if (s.ModelId) param.ModelIds = [s.ModelId];
      if (s.ResourceType) param.ResourceTypes = [s.ResourceType];
    }
    return param;
  }
}

export class AIModeEventHistoryFillMode {
  divisionId: string = "";
  tablePageSize: number = 9;
  cardPageSize: number = 15;
  pageListMode_: PageListMode;
  readonly sessionTag = "ai-mode-event-history";
  get pageListMode() {
    const val = sessionStorage.getItem(this.sessionTag);
    return val ? val : PageListMode.table;
  }

  set pageListMode(val: any) {
    sessionStorage.setItem(this.sessionTag, val + "");
  }
}
