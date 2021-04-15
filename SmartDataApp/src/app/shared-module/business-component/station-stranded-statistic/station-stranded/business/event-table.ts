import { BusinessTable } from "../../../../../aiop-system/common/business-table";
import { ITableField } from "../../../../../aiop-system/common/ITableField";
import { IConverter } from "../../../../../common/interface/IConverter";
import { CustomTableEvent, CustomTableEventEnum } from "../../../../custom-table/custom-table-event";
import { CustomTableArgs, FootArgs, GalleryTdAttr, TableAttr ,TooltipTd} from "../../../../custom-table/custom-table-model";
import { MediumPicture } from "../../../../../data-core/url/aiop/resources";
import { IBusinessData } from "../../../../../common/interface/IBusiness";
import { GarbageStation } from "../../../../../data-core/model/waste-regulation/garbage-station";
import { Division } from "../../../../../data-core/model/waste-regulation/division";
import { DivisionTypeEnum } from "../../../../../common/tool/enum-helper";
import { DatePipe } from "@angular/common"; 
import { GarbageStationNumberStatistic } from "../../../../../data-core/model/waste-regulation/garbage-station-number-statistic";
import { Camera } from "../../../../../data-core/model/waste-regulation/camera";
import { ToHoursMinutes } from "../../../../../common/tool/tool.service";
export class EventTable extends BusinessTable implements IConverter {
     
    dataSource = new CustomTableArgs<any>({
        hasTableOperationTd: false,
        hasHead: true,
        isSingleElection: false,
        values: [],
        primaryKey: "id",
        isDisplayDetailImg: true,
        eventDelegate: (event: CustomTableEvent) => {
            if (event.eventType == CustomTableEventEnum.Img) { 
                const findEvent = this.findStationStatisticFn(event.data['item'].id);
                this.initGalleryTargetFn(findEvent.Id, this.findStationFn(findEvent.Id).Cameras, event.data['index']);
            }
        },
        tableAttrs: [ new TableAttr({
            HeadTitleName: "投放点",
            tdWidth: "17%",
            tdInnerAttrName: "station"
        }),new TableAttr({
            HeadTitleName: "街道",
            tdWidth: "13%",
            tdInnerAttrName: "county"
        }), new TableAttr({
            HeadTitleName: "居委会",
            tdWidth: "17%",
            tdInnerAttrName: "committees"
        }), new TableAttr({
            HeadTitleName: "垃圾堆数",
            tdWidth: "15%",
            tdInnerAttrName: "garbageCount"
        }), new TableAttr({
            HeadTitleName: "滞留时间",
            tdWidth: "15%",
            tdInnerAttrName: "currentGarbageTime"
        }), new TableAttr({
            HeadTitleName: "总滞留时长",
            tdWidth: "15%",
            tdInnerAttrName: "garbageDuration"
        })
    ],
        galleryTd: [],
        tooltipTd:  new TooltipTd('8%','人员'),
        footArgs: new FootArgs({
            hasSelectBtn: false,
            hasSelectCount: false
        })
    }); 
    findStationStatisticFn: (id: string) => GarbageStationNumberStatistic;
    findStationCameras :(id:string)=>Array<Camera>;
    findDivisionFn:(id:string)=>Division;
    initGalleryTargetFn: (garbageId: string, event: Camera[], index: number) => void; 
    playVideoFn: (id: string) => void;
    findStationFn:(id:string)=>GarbageStation;
    constructor(private datePipe: DatePipe) {
        super(); 
    
    }
    scrollPageFn: (event: CustomTableEvent) => void;


    Convert<GarbageDropEventsRecord, CustomTableArgs>(input: GarbageDropEventsRecord, output: CustomTableArgs) {
        const items = new Array<TableField>()
         , tooltipTd = new TooltipTd('8%','人员'); 
        var tds: GalleryTdAttr[] = new Array(); 
        tooltipTd.listMap =  new Map<string,Array<{icon:string,tip:string}>>();
        if (input instanceof GarbageDropEventsRecord)
            for (const item of input.items) { 
                items.push(this.toTableModel(item));
                const mb = this.toMenber(item);
                if(mb)
                    tooltipTd.listMap.set(item.Id,this.toMenber(item));
                tds.push(this.toGalleryModel(this.findStationFn(item.Id)));
        }
        if (output instanceof CustomTableArgs)
           {
            output.values = items;
            output.galleryTd = tds;
            output.tooltipTd = tooltipTd;
            output.galleryTdWidth='20%'
           }
        return output;
    }

    toTableModel(statistic:GarbageStationNumberStatistic) {
        const tableField = new TableField(),station = this.findStationFn(statistic.Id)
        ,division = this.findDivisionFn(station.DivisionId)
        , toHour = (val: number) => {
            const hm= ToHoursMinutes(val)
            return `${hm.hours}:${hm.minutes}`;
        }, toFormat=(val:string)=>{
            const arr = val.split(':');
            if(arr[0]=='0'&&arr[1]=='0')
                return '0分钟';
            else if(arr[0]!='0'&&arr[1]!='0')
                return `${arr[0]}小时${arr[1]}分钟`;
            else if(arr[1]!='0')
                return `${arr[1]}分钟`;
        };
        tableField.id = statistic.Id;        
        tableField.station =  statistic.Name;
        tableField.garbageCount=statistic.GarbageCount+'';
        tableField.currentGarbageTime=toFormat(toHour(statistic.CurrentGarbageTime));
        tableField.garbageDuration=toFormat(toHour(statistic.GarbageDuration));
        if(division.DivisionType == DivisionTypeEnum.County)
            tableField.county=division.Name;  
        else if(division.DivisionType ==DivisionTypeEnum.Committees){
            tableField.committees=division.Name; 
            const parentDivision = this.findDivisionFn(division.ParentId);
            if(parentDivision)tableField.county=parentDivision.Name;
        }        
        return tableField;
    }

    toMenber(event:GarbageStationNumberStatistic){ 
        const station =  this.findStationFn(event.Id)
        ,toolTip = new Array<{icon:string,tip:string}>();

        if(station.Members&&station.Members.length){
            station.Members.map(m=>{
                toolTip.push({
                    icon:'howell-icon-user-anonymous',
                    tip:`${m.Name}(${m.MobileNo})`
                });
            }) 
            return toolTip;
        } 
    }

    // toGalleryModel(dropImageUrls: Array<CameraImageUrl>, key: string) {
    //     const pic = new MediumPicture(), galleryTdAttr = new GalleryTdAttr();
    //     galleryTdAttr.imgSrc = new Array<string>();
    //     if(dropImageUrls)dropImageUrls.map(u=> galleryTdAttr.imgSrc.push(pic.getJPG(u.ImageUrl)));     
    //     galleryTdAttr.key = key; 
    //     return galleryTdAttr;
    // }

    toGalleryModel(station: GarbageStation) { 
    
        const pic = new MediumPicture(), galleryTdAttr = new GalleryTdAttr();
        galleryTdAttr.imgSrc = new Array<string>();
    
        station.Cameras.map(x => { 
           galleryTdAttr.imgSrc.push(pic.getJPG(x.ImageUrl));
        });
        galleryTdAttr.key = station.Id; 
        return galleryTdAttr;
    }
}

export class GarbageDropEventsRecord implements IBusinessData {
    items:  Array<GarbageStationNumberStatistic>;
}

export class TableField implements ITableField {
    id: string;
    county: string;
    committees: string;
    garbageCount:string;
    station: string;
    currentGarbageTime: string;
    garbageDuration: string;
}
