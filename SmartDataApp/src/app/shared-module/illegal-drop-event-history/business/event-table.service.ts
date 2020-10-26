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
import { GarbageStationRequestService,CameraRequestService } from "../../../data-core/repuest/garbage-station.service";
import { GetGarbageStationsParams, GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
import { ResourceSRServersRequestService } from "../../../data-core/repuest/resources.service";
import { Camera } from "../../../data-core/model/waste-regulation/camera";
import { GetEventRecordsParams, IllegalDropEventRecord } from "../../../data-core/model/waste-regulation/illegal-drop-event-record";
import { ImageEventEnum } from "../../gallery-target/gallery-target";
import { EventCards } from "./event-cards";
import { GalleryTargetView } from "./gallery-target";
import { GetVodUrlParams } from "../../../data-core/model/aiop/video-url";
import { PageListMode } from "../../../common/tool/enum-helper";
import { DivisionListView } from "./division-list-view";
import { GetCamerasParams } from "../../../data-core/model/aiop/encode-devices-params";
import { GetGarbageStationCamerasParams } from "../../../data-core/model/waste-regulation/camera";
@Injectable()
export class EventTableService extends ListAttribute {
    dataSource_ = new Array<IllegalDropEventRecord>();

    allDataSource = new Array<IllegalDropEventRecord>();

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
    resources = new Array<Camera>();
    divisionListView = new DivisionListView();
    playVideo: PlayVideo;
    fillMode: FillMode;
    constructor(private eventRequestService: EventRequestService
        , private divisionService: DivisionRequestService
        , private garbageStationService: GarbageStationRequestService
       , private resourceService: CameraRequestService
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

        // this.eventCards.viewPaginationFn = (page: Page) => {
        //     return new ViewPagination(page.PageCount, async (index) => {
        //         if (this.eventCards.pageIndex != index) {
        //             this.eventCards.pageIndex = index;
        //             await this.requestData(index);
        //             this.eventCards.cardList = this.eventCards.dataSource;
        //         }

        //     });
        // }

        this.eventTable.initGalleryTargetFn = (event) => {
            this.galleryTargetView.initGalleryTarget(event);
        }

        this.galleryTargetView.neighborEventFn= (id, e: ImageEventEnum) => {   
            var index = this.allDataSource.findIndex(x => x.EventId == id);
            var prev = true, next = true
                , item: IllegalDropEventRecord;

            if (e == ImageEventEnum.none) {
                if (index == 0)
                    prev = false;
                else if (index == this.allDataSource.length - 1)
                    next = false;
                return {
                    item: null,
                    prev: prev,
                    next: next
                }
            }
            else if (e == ImageEventEnum.next) {
                index += 1;
                item = this.allDataSource[index];
                if (index == this.allDataSource.length - 1)
                    next = false;
                return {
                    item: item,
                    prev: prev,
                    next: next
                }
            }
            else if (e == ImageEventEnum.prev) {
                index -= 1;
                item = this.allDataSource[index];
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
                time = TimeInterval(event.EventTime + '', -30),
                video = await this.requestVideoUrl(time.start, time.end, event.ResourceId);
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
        const param = new GetGarbageStationCamerasParams();
        param.PageIndex = 1;
        param.PageSize = this.maxSize;
        const result = await this.resourceService.postList(param).toPromise();
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

    async requestDataX(pageIndex: number, callBack?: (page: Page) => void) {
        if (this.search.state == false) {
            const response = await this.eventRequestService.list(this.getRequsetParam(pageIndex, this.search,15)).toPromise();
            let data = new IllegalDropEventsRecord();
            data.items = response.Data.Data.sort((a, b) => {
                return ''.naturalCompare(a.EventTime, b.EventTime);
            });
            this.eventCards.clearData();
            this.eventCards.Convert(data.items); 
            this.eventCards.cardList = this.eventCards.dataSource;
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
            this.eventTable.clearItems();
            this.dataSource_ = new Array();
            this.eventTable.Convert(data, this.eventTable.dataSource);
            this.eventTable.totalCount = response.Data.Page.TotalRecordCount;
            this.dataSource = response.Data.Data;
            if (callBack) callBack(response.Data.Page);
        }
    }

    async searchDataX(pageIndex: number, callBack?: (page: Page) => void) {
        if (this.search.state) {
            const response = await this.eventRequestService.list(this.getRequsetParam(pageIndex, this.search)).toPromise();

            let data = new IllegalDropEventsRecord();
            data.items = response.Data.Data.sort((a, b) => {
                return ''.naturalCompare(a.EventTime, b.EventTime);
            });
            this.eventCards.clearData();
            this.eventCards.Convert(data.items);       
            this.eventCards.cardList = this.eventCards.dataSource;       
            this.dataSource = response.Data.Data;
            if (callBack) callBack(response.Data.Page);
        }
    }

    async allEventsRecordData() {
        const response = await this.eventRequestService.list(this.getRequsetParam(1, this.search,new ListAttribute().maxSize)).toPromise();
        let data = new IllegalDropEventsRecord();
        data.items = response.Data.Data.sort((a, b) => {
            return ''.naturalCompare(a.EventTime, b.EventTime);
        });      
        this.allDataSource = response.Data.Data;
    }


    getRequsetParam(pageIndex: number, search: SearchControl, pageSize?: number) {

        const param = new GetEventRecordsParams(), day = TheDayTime(new Date());
        param.PageIndex = pageIndex;
        param.BeginTime = day.begin.toISOString();
        param.EndTime = day.end.toISOString();
        if (pageSize)  param.PageSize=pageSize;
        else {
            if (this.fillMode)
                param.PageSize = this.fillMode.pageListMode == PageListMode.list
                    ? this.fillMode.cardPageSize : this.fillMode.tablePageSize;
            else param.PageSize = new TableAttribute().pageSize;
        }
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

export class FillMode {
    divisionId: string = '';
    tablePageSize: number = 10;
    cardPageSize: number = 15;
    pageListMode_: PageListMode;
    readonly sessionTag = 'illegal-drop-event-history';
    get pageListMode() {
        const val = sessionStorage.getItem(this.sessionTag);
        return val ? val : PageListMode.table;
    }

    set pageListMode(val: any) {
        sessionStorage.setItem(this.sessionTag, val + '');
    }
} 
