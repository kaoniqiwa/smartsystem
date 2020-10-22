import { Injectable } from "@angular/core";
import { CustomTableEvent } from "../../../shared-module/custom-table/custom-table-event";
import { EventTable, IllegalDropEventsRecord } from "./event-table";
import { SearchControl } from "./search";
import "../../../common/string/hw-string";
import { TheDayTime, TimeInterval } from "../../../common/tool/tool.service";
import { PlayVideo } from "../../../aiop-system/common/play-video";
import { Page } from "../../../data-core/model/page";
import { TableAttribute, ListAttribute } from "../../../common/tool/table-form-helper";
import { DatePipe } from "@angular/common";
import { DivisionRequestService } from "../../../data-core/repuest/division.service";
import { EventRequestService } from "../../../data-core/repuest/Illegal-drop-event-record";
import { GetDivisionsParams, Division } from "../../../data-core/model/waste-regulation/division";
import { GarbageStationRequestService } from "../../../data-core/repuest/garbage-station.service";
import { GetGarbageStationsParams, GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
import { ResourceRequestService, ResourceSRServersRequestService } from "../../../data-core/repuest/resources.service";
import { Resource } from "../../../data-core/model/aiop/resource";
import { GetEventRecordsParams, IllegalDropEventRecord } from "../../../data-core/model/waste-regulation/illegal-drop-event-record";
import { GetResourcesParams } from "../../../data-core/model/aiop/resources-params";
import { ImageEventEnum } from "../../gallery-target/gallery-target";
import { EventCards } from "./event-cards";
import { ViewPagination } from "../../../shared-module/card-list-panel/card-list-panel";
import { GalleryTargetView } from "./gallery-target";
import { GetVodUrlParams } from "../../../data-core/model/aiop/video-url"; 
@Injectable()
export class EventTableService extends ListAttribute {
    dataSource_ = new Array<IllegalDropEventRecord>();

    set dataSource(items: IllegalDropEventRecord[]) {
        for (const x of items)
            this.dataSource_.push(x);
    }

    get dataSource() {
        return this.dataSource_;
    }
    search = new SearchControl(this.datePipe);
    eventTable = new EventTable(this.datePipe);
    eventCards = new EventCards(this.datePipe);
    galleryTargetView = new GalleryTargetView();
    divisions = new Array<Division>();
    garbageStations = new Array<GarbageStation>();
    resources = new Array<Resource>();
    playVideo: PlayVideo;
    constructor(private eventRequestService: EventRequestService
        , private divisionService: DivisionRequestService
        , private garbageStationService: GarbageStationRequestService
        , private resourceService: ResourceRequestService
        , private srService: ResourceSRServersRequestService
        // ,private navService:SideNavService
        , private datePipe: DatePipe) {
        super();
        this.eventTable.scrollPageFn = (event: CustomTableEvent) => {
            this.requestData(event.data as any);
            this.searchData(event.data as any);
        }
        this.eventTable.findEventFn = (id) => {
            return this.dataSource.find(x => x.EventId == id);
        }

        this.eventCards.viewPaginationFn = (page: Page) => {
            return new ViewPagination(page.PageCount, async (index) => {
                if (this.eventCards.pageIndex != index) {
                    this.eventCards.pageIndex = index;
                    await this.requestData(index);
                    this.eventCards.cardList = this.eventCards.dataSource;
                }

            });
        }

        this.eventTable.initGalleryTargetFn = (event) => {
            this.galleryTargetView.initGalleryTarget(event);
        }

        this.galleryTargetView.neighborEventFn = (id, e: ImageEventEnum) => {
            var index = this.dataSource.findIndex(x => x.EventId == id);
            var prev = true, next = true
                , item: IllegalDropEventRecord;

            if (e == ImageEventEnum.none) {
                if (index == 0)
                    prev = false;
                else if (index == this.dataSource.length - 1)
                    next = false;
                return {
                    item: null,
                    prev: prev,
                    next: next
                }
            }
            else if (e == ImageEventEnum.next) {
                index += 1;
                item = this.dataSource[index];
                if (index == this.dataSource.length - 1)
                    next = false;
                return {
                    item: item,
                    prev: prev,
                    next: next
                }
            }
            else if (e == ImageEventEnum.prev) {
                index -= 1;
                item = this.dataSource[index];
                if (index == 0)
                    prev = false;
                return {
                    item: item,
                    prev: prev,
                    next: next
                }
            }
        }

        this.eventTable.playVideoFn = async (id) => {
            const event = this.eventTable.findEventFn(id),
                time=   TimeInterval(event.EventTime+'', -30),
                video = await this.requestVideoUrl(time.start,time.end,event.ResourceId);                
            this.playVideo = new PlayVideo(video.Url, event.ResourceName); 
            // this.navService.playVideoBug.emit(true);
        }

    }

    async requestVideoUrl(begin: Date, end: Date, cameraId: string) {
        const params = new GetVodUrlParams();
        params.BeginTime = begin;
        params.EndTime = end;
        params.Protocol = 'ws-ps';
        params.StreamType = 1;
        params.CameraId = cameraId;
        const response = await this.srService.VodUrls(params).toPromise();
        return response.Data;
    }

    async requestResource() {
        const param = new GetResourcesParams();
        param.PageIndex = 1;
        param.PageSize = this.maxSize;
        const result = await this.resourceService.list(param).toPromise();
        return result.Data.Data;
    }


    async requestDivisions() {
        const param = new GetDivisionsParams();
        param.PageIndex = 1;
        param.PageSize = this.maxSize;
        const result = await this.divisionService.list(param).toPromise();
        return result.Data.Data;
    }

    async requestGarbageStations() {
        const param = new GetGarbageStationsParams();
        param.PageIndex = 1;
        param.PageSize = this.maxSize;
        const result = await this.garbageStationService.list(param).toPromise();
        return result.Data.Data;
    }

    async requestData(pageIndex: number, callBack?: (page: Page) => void) {
        if (this.search.state == false) {
            const response = await this.eventRequestService.list(this.getRequsetParam(pageIndex, this.search)).toPromise();
            let data = new IllegalDropEventsRecord();
            data.items = response.Data.Data.sort((a, b) => {
                return ''.naturalCompare(a.EventTime, b.EventTime);
            });

            this.eventCards.clearData();
            this.eventCards.Convert(data.items);

            this.eventTable.clearItems();
            this.dataSource_ = new Array();
            this.eventTable.Convert(data, this.eventTable.dataSource);
            this.eventTable.totalCount = response.Data.Page.TotalRecordCount;
            this.dataSource = response.Data.Data;
            if (callBack) callBack(response.Data.Page);
        }

    }

    async searchData(pageIndex: number, callBack?: (page: Page) => void) {
        if (this.search.state) {
            const response = await this.eventRequestService.list(this.getRequsetParam(pageIndex, this.search)).toPromise();

            let data = new IllegalDropEventsRecord();
            data.items = response.Data.Data.sort((a, b) => {
                return ''.naturalCompare(a.EventTime, b.EventTime);
            });


            this.eventCards.clearData();
            this.eventCards.Convert(data.items);

            this.eventTable.clearItems();
            this.dataSource_ = new Array();
            this.eventTable.Convert(data, this.eventTable.dataSource);
            this.eventTable.totalCount = response.Data.Page.TotalRecordCount;
            this.dataSource = response.Data.Data;
            if (callBack) callBack(response.Data.Page);
        }

    }


    getRequsetParam(pageIndex: number, search: SearchControl) {

        const param = new GetEventRecordsParams(), day = TheDayTime(new Date());
        param.PageIndex = pageIndex;
        param.PageSize = new TableAttribute().pageSize;
        param.BeginTime = day.begin.toISOString();
        param.EndTime = day.end.toISOString();
        const s = search.toSearchParam();
        if (s.SearchText && search.other == false) {
            param.StationName = s.SearchText;
        }
        else {
            if (s.BeginTime) param.BeginTime = s.BeginTime;
            if (s.EndTime) param.EndTime = s.EndTime;
            if (s.DivisionId) param.DivisionIds = [s.DivisionId];
            if (s.StationId) param.StationIds = [s.StationId];
            if (s.ResourceId) param.ResourceIds = [s.ResourceId];
        }
        return param;
    }
}
