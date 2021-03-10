import { Injectable, EventEmitter } from "@angular/core";
import { ViewsModel } from "../../../common/abstract/base-view";
import { BusinessParameter } from "../../../common/interface/IBusiness";
import { BaseBusinessRefresh } from "../../../common/tool/base-business-refresh";
import { DivisionTypeEnum, EnumHelper } from "../../../common/tool/enum-helper";
import { MessageBar } from "../../../common/tool/message-bar";
import { HeaderSquareListComponent } from "../../../shared-module/header-square-list/header-square-list.component";
import { BusinessViewComponetConstructor } from "./business-card-slot.service";
import { AMapComponent } from "../amap/amap.component";
import { CameraRequestService } from "../../../data-core/repuest/resources.service";
import { StateScaleCardComponent } from "../../../shared-module/card-component/state-scale-card/state-scale-card.component";
import { ImageThemeCardComponent } from "../../../shared-module/card-component/image-theme-card/image-theme-card.component";
import { GalleryRollPageComponent } from "../../../shared-module/card-component/gallery-roll-page/gallery-roll-page.component";
import { Gallery } from "../../../shared-module/card-component/gallery-roll-page/gallery-roll-page";
import { HintCardComponent } from "../../../shared-module/card-component/hint-card/hint-card.component";
import { HintTag } from "../../../shared-module/card-component/hint-card/hint";
import { FillMode } from "../../../shared-module/business-component/event-history/illegal-drop-event-history/business/event-table.service";
import { ColorEnum } from "../../../shared-module/card-component/card-content-factory";
import { CameraStateTableEnum } from "../../../shared-module/business-component/garbage-station-cameras/business/camera-table.service";
import { GarbageStationRequestService } from "../../../data-core/repuest/garbage-station.service";
import { MediumPicture } from "../../../data-core/url/aiop/resources";
import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
import { GetEventRecordsParams } from "../../../data-core/model/waste-regulation/illegal-drop-event-record";
import { TheDayTime } from "../../../common/tool/tool.service";
import { ListAttribute } from "../../../common/tool/table-form-helper";
import { EventRequestService } from "../../../data-core/repuest/Illegal-drop-event-record";
import { targetPosition, domSize } from "../../../common/tool/jquery-help/jquery-help";
import { isBoolean, isString } from "util";
import { BusinessEventTypeEnum } from '../../../shared-module/business-component/event-history/business-event-type';
@Injectable({
    providedIn: 'root'
})
export class DivisionBusinessService {
    componets = new Array<BusinessViewComponetConstructor>();
    committesIds: string[];
    mapClient: CesiumMapClient;
    aMap: AMapComponent;
    /**区划 */
    illegalDropMode: FillMode;
    mixedIntoMode: FillMode;
    fullGarbageStationIntoMode: FillMode;
    fullStationsView = false;
    stationListView = false;
    eventHistoryView = false;
    stationCameraView = false;
    inspectionView = false;
    inspectionViewMaxPostion = false;
    inspectionViewVideo = false;
    vsClassStatistic = false;
    inspectionSize = { width: 0, height: 0, left: 0, top: 0 };
    /**更正区划id 视图显示当前 */
    nspectionParam: (val: string) => void;
    stationCameraStateTable: CameraStateTableEnum;
    divisionsId = '';
    /** 统计页面默认搜索图表 */
    illegalDropChartDefault = new EventEmitter<any>();
    constructor(private cameraService: CameraRequestService
        , private eventRequestService: EventRequestService
        , private stationService: GarbageStationRequestService) {

    }

    get businessEventType() {
        if (this.mixedIntoMode) return BusinessEventTypeEnum.MixedInfo;
        else if (this.illegalDropMode) return BusinessEventTypeEnum.IllegalDrop;
    }

    bindingEvent() {
        setTimeout(() => {
            for (const x of this.componets) {

                if (x.list[0].view instanceof HeaderSquareListComponent) {
                    x.list[0].view.btnControl = (val: { id: string, type: DivisionTypeEnum }) => {
                        const param = new BusinessParameter();
                        param.map.set('divisionsId', val.id);
                        param.map.set('divisionsType', val.type);
                        param.map.set('divisionsIds', this.committesIds);
                        this.nspectionParam(val.id);
                        this.divisionsId = val.id;
                        if (this.mapClient) {
                            this.mapClient.Village.Select(val.id);
                            let village = this.mapClient.DataController.Village.Get(val.id);
                            this.mapClient.Viewer.MoveTo(village.center);
                        }
                        for (const x of this.componets) {
                            if (x.list[0].view instanceof HeaderSquareListComponent) { }
                            else {
                                if (x.list[0].business instanceof BaseBusinessRefresh) {
                                    x.list[0].business.businessParameter = param;
                                    x.list[0].view.loadDatas(new ViewsModel());
                                }
                                setTimeout(() => {
                                    if (x.list[0].view instanceof GalleryRollPageComponent) {
                                        x.list[0].view.tagClick(null, false);
                                    }
                                }, 500);

                            }
                        }
                    }
                }
                if (x.list[0].view instanceof ImageThemeCardComponent) {
                    x.list[0].view.btnControl = async (val: { timeInterval: { start: Date, end: Date }, cameraId: string }) => {
                        const respone = await this.cameraService.get(val.cameraId).toPromise();

                        this.aMap.Playback(respone.Data as any, val.timeInterval.start, val.timeInterval.end);
                    }
                }
                if (x.list[0].view instanceof HintCardComponent) {

                    x.list[0].view.btnControl = (tag) => {
                        if (x.list[0].business instanceof BaseBusinessRefresh) {
                            if (tag == HintTag.IllegalDrop) {
                                this.illegalDropMode = new FillMode();
                                this.illegalDropMode.divisionId = x.list[0].business.businessParameter.map.get("divisionsId");

                            }
                            else if (tag == HintTag.MixedInto) {
                                this.mixedIntoMode = new FillMode();
                                this.mixedIntoMode.divisionId = x.list[0].business.businessParameter.map.get("divisionsId");
                            }
                            else if (tag == HintTag.FullStation) {
                                this.fullStationsView = true;
                                this.fullGarbageStationIntoMode = new FillMode();
                                this.fullGarbageStationIntoMode.divisionId = x.list[0].business.businessParameter.map.get("divisionsId");
                            }
                            else if (tag == HintTag.GarbageStation)
                                this.stationListView = true;
                            this.eventHistoryView = true;
                        }

                    }
                }
                if (x.list[0].view instanceof StateScaleCardComponent) {
                    x.list[0].view.btnControl = (item: { tag: CameraStateTableEnum }) => {
                        this.stationCameraStateTable = item.tag;
                        this.stationCameraView = true;
                        this.eventHistoryView = true;

                    }
                }
            }
        }, 1000);
    }

    bindingEvent2() {
        setTimeout(() => {
            for (const x of this.componets) {
                if (x.list[0].view instanceof GalleryRollPageComponent) {
                    /**
                     * 
                     * 抓图
                     */
                    const s_view = () => {
                        const g = targetPosition('map__view'), san = targetPosition('san');
                        this.inspectionSize.left = g.left - 5;
                        this.inspectionSize.top = 0;
                        const s = domSize('map__view');
                        this.inspectionSize.width = s.width - g.left + 17;
                        this.inspectionSize.height = san.top - 5;
                    }
                    x.list[0].view.btnControl = async (i) => {
                        if (i == null) {
                            this.inspectionView = false;
                            setTimeout(() => {
                                s_view();
                                this.aMap.MapReload();
                            });
                        }
                        else if (isBoolean(i)) {
                            this.inspectionViewMaxPostion = i;
                            if (i)
                                this.inspectionSize = { width: 0, height: 0, left: 0, top: 0 };
                            else
                                setTimeout(() => {

                                    s_view();
                                });
                        }
                        else if (isString(i)) {
                            this.inspectionViewVideo = i == 'play';
                        }
                        else {
                            const item = i as {
                                g: Gallery,
                                msg: boolean,
                                catchState: { o: boolean }
                            }, enumHelper = new EnumHelper()
                                , pic = new MediumPicture()
                                , state = (gs: GarbageStation) => {
                                    if (gs.StationState == 0) return '正常';
                                    else if (enumHelper.stationState.err.indexOf(gs.StationState) > -1)
                                        return '异常';
                                    else if (enumHelper.stationState.full.indexOf(gs.StationState) > -1)
                                        return '满溢';
                                };;
                            if (item.g && item.g.title) {
                                /**更新投放点 */
                                const station = await this.stationService.get(item.g.title.id).toPromise();
                                if (station && station.Data) {
                                    item.g.title.state = state(station.Data);
                                    station.Data.Cameras.map(m => {
                                        if (m.ImageUrl) {
                                            const desc = item.g.imgDesc.find(i => i.tag.id == m.Id);
                                            if (desc)
                                                desc.src = pic.getData(m.ImageUrl);
                                        }
                                    });
                                }
                                this.getStationsIllegalDropEvent([item.g.title.id]).subscribe(x => {
                                    if (x.Data && x.Data.Data)
                                        item.g.title.eventNumber = x.Data.Data.length;

                                });
                                this.stationService.manualCapture(item.g.title.id).subscribe(data => {
                                    item.catchState.o = true;
                                    if (data && data.Data) {
                                        data.Data.map(m => {
                                            if (m.Result) {
                                                const desc = item.g.imgDesc.find(i => i.tag.id == m.CameraId);
                                                if (desc)
                                                    desc.src = pic.getData(m.Id);
                                            }
                                        });
                                    }
                                    if (item.msg)
                                        new MessageBar().response_success();
                                });
                            }

                        }
                    }
                }
            }
        });
    }

    changeMqttState(state: boolean) {
        for (const x of this.componets) {

            if (x.list[0].view instanceof ImageThemeCardComponent) {
                x.list[0].view.model.imgDesc1Icon = state ? 'howell-icon-signal2' : 'howell-icon-no_signal';
                x.list[0].view.model.imgDesc1IconColor = state ? ColorEnum["green-text"] : ColorEnum["red-text"];
            }
        }
    }

    getStationsIllegalDropEvent(stationIds: string[]) {
        const param = new GetEventRecordsParams(), day = TheDayTime(new Date());
        param.PageIndex = 1;
        param.BeginTime = day.begin.toISOString();
        param.EndTime = day.end.toISOString();
        param.PageSize = new ListAttribute().maxSize;
        param.StationIds = stationIds;
        return this.eventRequestService.list(param);
    }

    clearEventView() {
        this.mixedIntoMode = null;
        this.illegalDropMode = null;
        this.fullStationsView = false;
        this.eventHistoryView = false;
        this.stationListView = false;
        this.stationCameraView = false;
        this.vsClassStatistic = false;
    }
}
