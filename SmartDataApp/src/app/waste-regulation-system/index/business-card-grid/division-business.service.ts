import { Injectable } from "@angular/core";
import { ViewsModel } from "../../../common/abstract/base-view";
import { BusinessParameter } from "../../../common/interface/IBusiness";
import { BaseBusinessRefresh } from "../../../common/tool/base-business-refresh";
import { DivisionTypeEnum } from "../../../common/tool/enum-helper";
import { HeaderSquareListComponent } from "../../../shared-module/header-square-list/header-square-list.component";
import { BusinessViewComponetConstructor } from "./business-card-slot.service";
import { StatisticalDataBufferService } from "./buffer/statistical-data-buffer";
import { AMapComponent } from "../amap/amap.component";
import { CameraRequestService } from "../../../data-core/repuest/resources.service";
import { ImageThemeCardComponent } from "../../../shared-module/card-component/image-theme-card/image-theme-card.component";
import { HintCardComponent } from "../../../shared-module/card-component/hint-card/hint-card.component";
import { FillMode } from "../../../shared-module/illegal-drop-event-history/business/event-table.service";
@Injectable({
    providedIn: 'root'
})
export class DivisionBusinessService {
    componets = new Array<BusinessViewComponetConstructor>();
    committesIds: string[];
    mapClient: CesiumMapClient;
    aMap: AMapComponent;
    /**区划 */
    fillMode=new FillMode(); 
    eventHistoryView = false;
    constructor(private cameraService: CameraRequestService) {
        setTimeout(() => {
            for (const x of this.componets) {

                if (x.list[0].view instanceof HeaderSquareListComponent) {
                    x.list[0].view.btnControl = (val: { id: string, type: DivisionTypeEnum }) => {
                        const param = new BusinessParameter();
                        param.map.set('divisionsId', val.id);
                        param.map.set('divisionsType', val.type);
                        param.map.set('divisionsIds', this.committesIds);
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
                    
                    
                    x.list[0].view.btnControl = () => {
                        if (x.list[0].business instanceof BaseBusinessRefresh)
                        {
                            this.fillMode.divisionId=x.list[0].business.businessParameter.map.get("divisionsId");
                            this.eventHistoryView=true;
                        }
                        
                    }
                }
            }
        }, 1000);
    }

}
