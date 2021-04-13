import { DatePipe } from "@angular/common";
import { IConverter } from "../../../../../common/interface/IConverter";
import { GarbageStation, GetGarbageStationsParams } from "../../../../../data-core/model/waste-regulation/garbage-station";
import { GarbageStationType } from "../../../../../data-core/model/waste-regulation/garbage-station-type";
import { CustomTableEvent, CustomTableEventEnum } from "../../../../custom-table/custom-table-event";
import { CustomTableArgs, FootArgs, GalleryTdAttr, TableAttr } from "../../../../custom-table/custom-table-model";
import { ITableField } from "../../../../../aiop-system/common/ITableField";
import { IBusinessData } from "../../../../../common/interface/IBusiness";
import { BusinessTable } from "../../../../../aiop-system/common/business-table";
import { Injectable } from "@angular/core";
import { Division } from "../../../../../data-core/model/waste-regulation/division";
import { Page } from "../../../../../data-core/model/page";
import { StationStateEnum } from "../../../../../common/tool/enum-helper";
import { GarbageStationRequestService } from "../../../../../data-core/repuest/garbage-station.service";
import { SearchControl } from "./search";
import { DivisionDao } from "../../../../../data-core/dao/division-dao";
import { GarbageStationTypeDao } from "../../../../../data-core/dao/garbage-station-type-dao";
import { DivisionRequestService } from "../../../../../data-core/repuest/division.service";
import { GarbageStationTypeRequestService } from "../../../../../data-core/repuest/garbage-station.service";
import { PlayVideo } from "../../../../../aiop-system/common/play-video"; 
import { GarbageStationDao } from "../../../../../data-core/dao/garbage-station-dao"
import { GalleryTargetViewI } from "../../../station-state-view-summary/full-garbage-station/business/gallery-target";
import { ResourceCameraDao } from "../../../../../data-core/dao/resources-camera-dao";
import { Camera as ResourceCamera } from "../../../../../data-core/model/aiop/camera";
import { Camera } from "../../../../../data-core/model/waste-regulation/camera"; 
import { ResourceSRServersRequestService, CameraRequestService, StationResourceSRServersRequestService } from "../../../../../data-core/repuest/resources.service";
import { SideNavService } from "../../../../../common/tool/sidenav.service";
import { ImageEventEnum } from "../../../../gallery-target/gallery-target";
import { MediumPicture } from "../../../../../data-core/url/aiop/resources"; 
import { UserDalService } from "../../../../../dal/user/user-dal.service";
import { SessionUser } from "../../../../../common/tool/session-user";
import { GetPreviewUrlParams } from "../../../../../data-core/model/aiop/video-url";
@Injectable()
export class BusinessService {
    playVideo: PlayVideo;
    galleryTargetView = new GalleryTargetViewI(this.datePipe);
    resourceCameraDao: ResourceCameraDao;
    cameras: ResourceCamera[] = new Array();

    dataSource_ = new Array<GarbageStation>();

    divisions: Division[] = new Array();
    divisionsId = '';
    garbageStationTypes: GarbageStationType[] = new Array();

    search = new SearchControl();
    set dataSource(items: GarbageStation[]) {
        for (const x of items)
            this.dataSource_.push(x);
    }

    get dataSource() {
        return this.dataSource_;
    }
    table = new GarbageStationTable(this.datePipe);
    private divisionDao: DivisionDao;
    private garbageStationTypeDao: GarbageStationTypeDao;
    private garbageStationDao: GarbageStationDao;
    playVideoFn = async (id: string) => {
        const idV = id.split('&'),
            camera = this.cameras.find(x => x.Id == idV[1]);
        const video = await this.requestVideoUrl(camera.Id);
        this.playVideo = new PlayVideo(null, camera.Name);
        this.playVideo.url_=video.Url;
        this.navService.playVideoBug.emit(true);
    }

    constructor(private datePipe: DatePipe, private garbageStationService: GarbageStationRequestService
        , divisionService: DivisionRequestService
        , private cameraService: CameraRequestService
        , private navService: SideNavService
        , private userDalService: UserDalService
        , private srService: StationResourceSRServersRequestService
        , garbageStationTypeService: GarbageStationTypeRequestService) {
        this.divisionDao = new DivisionDao(divisionService);
        this.garbageStationDao = new GarbageStationDao(garbageStationService);
        this.garbageStationTypeDao = new GarbageStationTypeDao(garbageStationTypeService);
        this.resourceCameraDao = new ResourceCameraDao(this.cameraService);
        this.galleryTargetView.neighborEventFnI = (ids, e: ImageEventEnum) => {
            const idV = ids.split('&'), findStation = this.dataSource.find(x => x.Id == idV[0]);
            var index = findStation.Cameras.findIndex(x => x.Id == idV[1]);
            var prev = true, next = true;
            if (e == ImageEventEnum.none) {
                if (index == 0)
                    prev = false;
                else if (index == findStation.Cameras.length - 1)
                    next = false;
                return {
                    item: null,
                    prev: prev,
                    next: next
                }
            }
            else if (e == ImageEventEnum.next) {
                index += 1;
                var cameraToIndex = findStation.Cameras[index];
                if (index == findStation.Cameras.length - 1)
                    next = false;
                return {
                    item: this.cameras.find(x => x.Id == cameraToIndex.Id),
                    prev: prev,
                    next: next
                }
            }
            else if (e == ImageEventEnum.prev) {
                index -= 1;
                var cameraToIndex = findStation.Cameras[index];
                if (index == 0)
                    prev = false;
                return {
                    item: this.cameras.find(x => x.Id == cameraToIndex.Id),
                    prev: prev,
                    next: next
                }
            }
        }
        this.table.findGarbageFn = (id) => {
            return this.dataSource.find(x => x.Id == id);
        }

        this.table.initGalleryTargetFn = (garbageId, event, index) => {
            const cameras = new Array<ResourceCamera>();
            event.map(x => {
                const find = this.cameras.find(c => c.Id == x.Id);
                cameras.push(find);
            })
            this.galleryTargetView.initGalleryTargetI(garbageId, cameras as any, index);
        }

        this.galleryTargetView.manualCaptureFn = (stationId, cb) => {
            this.garbageStationDao.manualCapture(stationId).subscribe(result => {
                if (result && result.Data) {
                    const img = cb(result.Data);  
                    this.table.dataSource.galleryTd.map(g => {
                        const oldIndex = g.imgSrc.findIndex(f => f.indexOf(img.old)>0);
                        if (oldIndex > 0 && g.key == stationId)
                            g.imgSrc[oldIndex] = img.new;
                    });
                }
            });
        }

        this.table.findDivisionFn=(id)=>{
            return this.divisions.find(d=>d.Id == id);
        }
    }

    async requestVideoUrl(cameraId: string) {
        const  user = new SessionUser(), params = new GetPreviewUrlParams()
        ,videoLive = '4'
        ,config = await this.userDalService.getUserConfig(user.id, videoLive);        
        params.CameraId = cameraId;
        params.Protocol = 'ws-ps';
        params.StreamType =config? parseInt(config):1;
        const response = await this.srService.PreviewUrls(params).toPromise(); 
        return response.Data;
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
        const response = await this.garbageStationService.list(this.getRequsetParam(pageIndex, this.search)).toPromise();
        let data = new BusinessData(this.garbageStationTypes, response.Data.Data, this.divisions);
        data.items = this.cameras;
        this.table.clearItems();
        this.dataSource = [];
        this.table.Convert(data, this.table.dataSource);
        this.table.totalCount = response.Data.Page.TotalRecordCount;
        this.dataSource = response.Data.Data;
        if (callBack) callBack(response.Data.Page);
    };

    getRequsetParam(pageIndex: number, search: SearchControl) {

        const param = new GetGarbageStationsParams();
        param.PageIndex = pageIndex;
        param.DivisionId = this.divisionsId;
        param.PageSize = 9;
        if (search.searchText && search.other == false)
            param.Name = search.searchText;
        return param;
    }
}

export class GarbageStationTable extends BusinessTable implements IConverter {

    dataSource = new CustomTableArgs<any>({
        hasTableOperationTd: false,
        hasHead: true,
        isSingleElection: true,
        values: [],
        primaryKey: "id",
        isDisplayDetailImg: true,
        eventDelegate: (event: CustomTableEvent) => {
            if (event.eventType == CustomTableEventEnum.Img) {
                const findEvent = this.findGarbageFn(event.data['item'].id);
                this.initGalleryTargetFn(findEvent.Id, findEvent.Cameras, event.data['index']);
            }
        },
        tableAttrs: [new TableAttr({
            HeadTitleName: "投放点",
            tdWidth: "20%",
            tdInnerAttrName: "name"
        }),new TableAttr({
            HeadTitleName: "街道",
            tdWidth: "15%",
            tdInnerAttrName: "county"
        }), new TableAttr({
            HeadTitleName: "居委会",
            tdWidth: "20%",
            tdInnerAttrName: "committees"
        }), new TableAttr({
            HeadTitleName: "状态",
            tdWidth: "15%",
            tdInnerAttrName: "state"
        })],
        galleryTd: [],
        footArgs: new FootArgs({
            hasSelectBtn: false,
            hasSelectCount: false
        })
    });
    findGarbageFn: (id: string) => GarbageStation;
    initGalleryTargetFn: (garbageId: string, event: Camera[], index: number) => void;
    playVideoFn: (id: string) => void;
    findDivisionFn:(id:string)=>Division;
    constructor(private datePipe: DatePipe) {
        super();
    }
    scrollPageFn: (event: CustomTableEvent) => void;


    Convert<BusinessData, CustomTableArgs>(input: BusinessData, output: CustomTableArgs) {
        const items = new Array<TableField>();
        var tds: GalleryTdAttr[] = new Array();
     
        if (input instanceof BusinessData)
            for (const item of input.statioins) {
                items.push(this.toTableModel(item));
                if (item.Cameras)
                    tds.push(this.toGalleryModel(input.items, item.Id, item.Cameras));
            }
        if (output instanceof CustomTableArgs)
           {
            output.values = items;
            output.galleryTd = tds;
           }
        return output;
    }

    toTableModel(station: GarbageStation) {
        let tableField = new TableField();
        tableField.id = station.Id;
        tableField.name = station.Name;
        const committees = this.findDivisionFn(station.DivisionId),
        county  = this.findDivisionFn(committees.ParentId);
        tableField.county =county.Name;
        tableField.committees =committees.Name;
        tableField.state = StationStateEnum[station.StationState];
        return tableField;
    }

    toGalleryModel(resourceCameras: ResourceCamera[], key: string, camera: Camera[]) {
        const pic = new MediumPicture(), galleryTdAttr = new GalleryTdAttr();
        galleryTdAttr.imgSrc = new Array<string>();
        camera.map(x => {
            const find = resourceCameras.find(x1 => x1.Id == x.Id);
            if (find)
                galleryTdAttr.imgSrc.push(pic.getJPG(find.ImageUrl));
        })
        galleryTdAttr.key = key; 
        return galleryTdAttr;
    }
}

export class BusinessData implements IBusinessData {
    types: GarbageStationType[];
    statioins: GarbageStation[];
    items: ResourceCamera[];
    divisions: Division[];
    constructor(types: GarbageStationType[],
        statioins: GarbageStation[],
        divisions: Division[]) {
        this.types = types;
        this.statioins = statioins;
        this.divisions = divisions;
    }
}

export class TableField implements ITableField {
    id: string;
    updateTime: string;
    name: string; 
    committees: string;  
    county: string; 
    state:string;
}
