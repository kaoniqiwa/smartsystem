import { Injectable } from "@angular/core";
import { ViewsModel } from "../../../common/abstract/base-view";
import { BusinessParameter } from "../../../common/interface/IBusiness";
import { BaseBusinessRefresh } from "../../../common/tool/base-business-refresh";
import { DivisionTypeEnum } from "../../../common/tool/enum-helper";
import { HeaderSquareListComponent } from "../../../shared-module/header-square-list/header-square-list.component";
import { BusinessViewComponetConstructor } from "./business-card-slot.service";
import { AMapComponent } from "../amap/amap.component";
import { CameraRequestService } from "../../../data-core/repuest/resources.service";
import { StateScaleCardComponent } from "../../../shared-module/card-component/state-scale-card/state-scale-card.component";
import { ImageThemeCardComponent } from "../../../shared-module/card-component/image-theme-card/image-theme-card.component";
import { HintCardComponent } from "../../../shared-module/card-component/hint-card/hint-card.component";
import { HintTag } from "../../../shared-module/card-component/hint-card/hint";
import { FillMode } from "../../../shared-module/business-component/event-history/illegal-drop-event-history/business/event-table.service";
import { ColorEnum } from "../../../shared-module/card-component/card-content-factory";
import {CameraStateTableEnum  } from "../../../shared-module/business-component/garbage-station-cameras/business/camera-table.service";
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
    fullStationsView = false;
    stationListView = false;
    eventHistoryView = false;
    stationCameraView = false;
    stationCameraStateTable:CameraStateTableEnum;
    divisionsId ='';
    constructor(private cameraService: CameraRequestService) {
       
    }

    bindingEvent(){
        setTimeout(() => {
            for (const x of this.componets) {

                if (x.list[0].view instanceof HeaderSquareListComponent) {
                    x.list[0].view.btnControl = (val: { id: string, type: DivisionTypeEnum }) => {
                        const param = new BusinessParameter();
                        param.map.set('divisionsId', val.id);
                        param.map.set('divisionsType', val.type);
                        param.map.set('divisionsIds', this.committesIds);
                        this.divisionsId=val.id;
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
                            else if (tag == HintTag.FullStation)
                                this.fullStationsView = true;
                            else if (tag == HintTag.GarbageStation)
                                this.stationListView = true;
                            this.eventHistoryView = true;
                        }
    
                    }
                }
                if(x.list[0].view instanceof StateScaleCardComponent) {
                    x.list[0].view.btnControl = (item:{ tag:CameraStateTableEnum}) => {
                        this.stationCameraStateTable=item.tag;
                        this.stationCameraView=true;
                        this.eventHistoryView = true;
    
                    }
                }
            }
        }, 1000);
    }

    changeMqttState(state: boolean) {
        for (const x of this.componets) {

            if (x.list[0].view instanceof ImageThemeCardComponent) {
                x.list[0].view.model.imgDesc1Icon = state ? 'howell-icon-signal2' : 'howell-icon-no_signal';
                x.list[0].view.model.imgDesc1IconColor = state ? ColorEnum["green-text"] : ColorEnum["red-text"];
            }
        }
    }

    clearEventView() {
        this.mixedIntoMode = null;
        this.illegalDropMode = null;
        this.fullStationsView = false;
        this.eventHistoryView = false;
        this.stationListView = false;
        this.stationCameraView = false;
    }
}
