import { Injectable } from "@angular/core";
import { ViewsModel } from "../../../common/abstract/base-view";
import { BusinessParameter } from "../../../common/interface/IBusiness";
import { BaseBusinessRefresh } from "../../../common/tool/base-business-refresh";
import { HeaderSquareListComponent } from "../../../shared-module/header-square-list/header-square-list.component";
import { BusinessViewComponetConstructor } from "./business-card-slot.service";

@Injectable({
    providedIn: 'root'
})
export class DivisionBusinessService {
    componets = new Array<BusinessViewComponetConstructor>();
    constructor() {
        setTimeout(() => {
            for (const x of this.componets) {
                if (x.list[0].view instanceof HeaderSquareListComponent) {
                    x.list[0].view.btnControl = (id) => {
                        const param = new BusinessParameter();
                        param.map.set('divisionsId', id);
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
                    break;
                }
            }
        }, 1000);
    }   

}
