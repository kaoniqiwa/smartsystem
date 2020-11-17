import { IConverter } from "../../../../common/interface/IConverter";
import { IBusinessData } from "../../../../common/interface/IBusiness";
import { CustomTableArgs, FootArgs, TableAttr, GalleryTdAttr } from "../../../custom-table/custom-table-model";
import { TableFormControl } from "../../../../common/tool/table-form-helper";
import { IPageTable } from "../../../../common/interface/IPageTable";
import { CustomTableEvent, CustomTableEventEnum } from "../../../custom-table/custom-table-event";
import { ITableField } from "../../../../aiop-system/common/ITableField";
import { GarbageStationNumberStatistic } from "../../../../data-core/model/waste-regulation/garbage-station-number-statistic";
import { Injectable } from "@angular/core";
import { BusinessTable } from "../../../../aiop-system/common/business-table";
import { Page } from "../../../../data-core/model/page";
import { GarbageStation, GetGarbageStationsParams } from "../../../../data-core/model/waste-regulation/garbage-station";
import "../../../../common/string/hw-string";
import { SearchControl } from "./search";
import { GarbageStationRequestService } from "../../../../data-core/repuest/garbage-station.service";
import { GarbageStationDao } from "../../../../data-core/dao/garbage-station-dao"
import { ResourceCameraDao } from "../../../../data-core/dao/resources-camera-dao";
import { CameraRequestService, ResourceSRServersRequestService } from "../../../../data-core/repuest/resources.service";
import { Camera as ResourceCamera } from "../../../../data-core/model/aiop/camera";
import {Camera  } from "../../../../data-core/model/waste-regulation/camera";
import { MediumPicture } from "../../../../data-core/url/aiop/resources";
import { StationStateEnum } from "../../../../common/tool/enum-helper";
import { DatePipe } from "@angular/common";
import { GalleryTargetViewI } from "./gallery-target";
import { ImageEventEnum } from "../../../gallery-target/gallery-target";
import { PlayVideo } from "../../../../aiop-system/common/play-video";
import { TimeInterval } from "../../../../common/tool/tool.service";
import { GetVodUrlParams } from "../../../../data-core/model/aiop/video-url";
import { SideNavService } from "../../../../common/tool/sidenav.service";
@Injectable()
export class BusinessService {
    playVideo: PlayVideo;
    galleryTargetView = new GalleryTargetViewI(this.datePipe);
    garbageStationDao: GarbageStationDao;
    resourceCameraDao: ResourceCameraDao;
    cameras: ResourceCamera[] = new Array();
    table = new StatisticTable();
    search = new SearchControl();
    divisionId='';
    dataSource_ = new Array<GarbageStation>();

    set dataSource(items: GarbageStation[]) {
        for (const x of items)
            this.dataSource_.push(x);
    }

    get dataSource() {
        return this.dataSource_;
    }

    playVideoFn =async (id:string)=>{
        const idV = id.split('&'),
        camera=this.cameras.find(x=>x.Id==idV[1]);
        const time = TimeInterval(camera.ImageTime + '', -30),
            video = await this.requestVideoUrl(time.start, time.end, camera.Id);
        this.playVideo = new PlayVideo(video.Url,camera.Name);
        this.navService.playVideoBug.emit(true);
    }
    constructor(private garbageStationService: GarbageStationRequestService
        , private cameraService: CameraRequestService        
        , private srService: ResourceSRServersRequestService        
       ,private navService:SideNavService
        ,private datePipe: DatePipe) {
        this.resourceCameraDao = new ResourceCameraDao(this.cameraService);
        this.garbageStationDao = new GarbageStationDao(garbageStationService);

        this.table.findGarbageFn = (id) => {
            return this.dataSource.find(x => x.Id == id);
        }
        this.galleryTargetView.neighborEventFnI = (ids, e: ImageEventEnum) => {
           const idV = ids.split('&'),findStation =  this.dataSource.find(x => x.Id == idV[0]);
           var index = findStation.Cameras.findIndex(x => x.Id == idV[1]);
            var prev = true, next = true
                , item: ResourceCamera;

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
                const cameraToIndex = findStation.Cameras[index];

                if (index == findStation.Cameras.length - 1)
                    next = false;
                return {
                    item: this.cameras.find(x=>x.Id==cameraToIndex.Id),
                    prev: prev,
                    next: next
                }
            }
            else if (e == ImageEventEnum.prev) {
                index -= 1;
                const cameraToIndex  = findStation.Cameras[index];
                if (index == 0)
                    prev = false;
                return {
                    item: this.cameras.find(x=>x.Id==cameraToIndex.Id),
                    prev: prev,
                    next: next
                }
            }
        }

        this.table.initGalleryTargetFn = (garbageId,event) => { 
            const cameras = new Array<ResourceCamera>();
            event.map(x=>{
               const find=   this.cameras.find(c=>c.Id==x.Id);
               cameras.push(find);
            })
            this.galleryTargetView.initGalleryTargetI(garbageId,cameras);
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

    async stationStatistic() {
        const result = await this.garbageStationDao.allGarbageStationsStatistic();
        return result.Data;
    }

    async requestData(pageIndex: number, callBack?: (page: Page) => void) {
        const response = await this.garbageStationService.list(this.getRequsetParam(pageIndex, this.search)).toPromise();
        let data = new Statistics();
        data.garbageStations = response.Data.Data;
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
        param.DivisionId=this.divisionId;
        param.PageSize = 10;      
        if (search.searchText && search.other == false)
            param.Name = search.searchText;
        return param;
    }

}


export class StatisticTable extends BusinessTable implements IConverter, IPageTable<GarbageStationNumberStatistic> {
    dataSource = new CustomTableArgs<TableField>({
        hasTableOperationTd: false,
        hasHead: true,
        isDisplayDetailImg:true,
        isSingleElection: false,
        values: [],
        primaryKey: "id",
        eventDelegate: (event: CustomTableEvent) => {
           if (event.eventType == CustomTableEventEnum.Img) {
                const findEvent = this.findGarbageFn(event.data['id']);
                this.initGalleryTargetFn(findEvent.Id,findEvent.Cameras);
            }
        },
        tableAttrs: [new TableAttr({
            HeadTitleName: "名称",
            tdWidth: "40%",
            tdInnerAttrName: "name"
        }),new TableAttr({
            HeadTitleName: "状态",
            tdWidth: "30%",
            tdInnerAttrName: "state"
        })],
        galleryTd: [],
        footArgs: new FootArgs({
            hasSelectBtn: false,
            hasSelectCount: false
        })
    });

    findGarbageFn: (id: string) => GarbageStation;
    initGalleryTargetFn:(garbageId:string,event:Camera[])=>void;
    playVideoFn: (id: string) =>void;
    scrollPageFn: (event: CustomTableEvent) => void;

    form = new TableFormControl<GarbageStationNumberStatistic>(this);
    constructor() {
        super();
    }
    addItem(item: GarbageStationNumberStatistic): void {

    }
    editItem(item: GarbageStationNumberStatistic): void {

    }
    delItemFn: (id: string) => void;
    updateItemFn: (item: GarbageStationNumberStatistic) => void;
    addItemFn: (item: GarbageStationNumberStatistic) => void;
    findItemFn: (id: string) => GarbageStationNumberStatistic;

    Convert<Statistics, CustomTableArgs>(input: Statistics, output: CustomTableArgs) {
        const items = new Array<TableField>();
        var tds: GalleryTdAttr[] = new Array();
        if (input instanceof Statistics) {
          //  var stations = input.garbageStations.filter(x => x.DryFull || x.WetFull);
           const  stations = input.garbageStations.sort((a, b) => {
                 return ''.naturalCompare(b.UpdateTime, a.UpdateTime);
            });  

            for (const item of stations) {
                items.push(this.toTableModel(item));
                
                if(item.Cameras)
                   tds.push(this.toGalleryModel(input.items,item.Id,item.Cameras));              
            } 

        }
        if (output instanceof CustomTableArgs) {
            output.galleryTd = tds;
            output.values = [...output.values, ...items];
        }

        return output;
    }

    toTableModel(item: GarbageStation) {
        let tableField = new TableField();
        tableField.id = item.Id;
        tableField.name = item.Name;
        tableField.state=StationStateEnum[item.StationState];
        return tableField;
    }

    toGalleryModel(resourceCameras:ResourceCamera[],key:string,camera:Camera[]) {
        const pic = new MediumPicture(),galleryTdAttr = new GalleryTdAttr();   
        galleryTdAttr.imgSrc =new Array<string>();
        camera.map(x=>{
            const find = resourceCameras.find(x1=>x1.Id==x.Id);
            if(find){
                galleryTdAttr.imgSrc.push(pic.getJPG(find.ImageUrl));
            }
        }) 
        galleryTdAttr.key=key;
        return  galleryTdAttr;
    }
}

export class Statistics implements IBusinessData {
    items: ResourceCamera[];
    garbageStations: GarbageStation[];
}

export class TableField implements ITableField {
    id: string;
    name: string;
    state:string;
}
