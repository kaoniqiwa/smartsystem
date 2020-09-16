/**
 * Developer 施文斌
 * LastUpdateTime 2020/7/7
 */

import { Injectable } from "@angular/core";
import { BusinessViewComponet } from "../../../common/tool/business-view-component";
import { IBusiness ,IBusinessData} from "../../../common/interface/IBusiness"; 

@Injectable({
    providedIn: 'root'
})
export class BusinessCardSlotService {
    views = new Array<BusinessViewComponetConstructor>();
    intervalRun: any;
    constructor() {
    }

    addViews(item: BusinessViewComponetConstructor) {
        this.views.push(item);
    }


    ngOnDestroy(): void {
        window.clearInterval(this.intervalRun);
    }

    firstView() {
        for (let i = 0; i < this.views.length; i++) {
            for (let j = 0; j < this.views[i].list.length; j++) {
                this.views[i].list[j].view.viewContrl(j > 0, false);

            }

        }
    }

    start() {

        const addSeconds = () => {
            for (let i = 0; i < this.views.length; i++) {
                for (let j = 0; j < this.views[i].list.length; j++) {
                    this.views[i].list[j].view.timeSpan.nextRefreshTime.setSeconds(
                        this.views[i].list[j].view.timeSpan.nextRefreshTime.getSeconds() + ((j + 1) * this.views[i].list[j].view.timeSpan.interval));


                }
            }
        }
        addSeconds();
        const run = () => {
            var iIndex = [];
            for (let i = 0; i < this.views.length; i++) {
                for (let j = 0; j < this.views[i].list.length; j++) {

                    if (Date.now() >= this.views[i].list[j].view.timeSpan.nextRefreshTime.valueOf()) {
                        const isNext = this.views[i].list[j].view.viewContrl(true, false);
                        if (isNext) {
                            iIndex.push(i);
                        }
                    }
                    break;
                }
            }


            for (var ii of iIndex) {
                if (this.views[ii].list.length == 1)
                    this.views[ii].list[0].view.viewContrl(false, true);
                else {
                    let item = this.views[ii].list.shift();
                    this.views[ii].list[0].view.viewContrl(false, true);
                    this.views[ii].list.push(item);

                }

            }
            if (iIndex.length > 0)
                addSeconds();
            iIndex = [];
        }

        this.intervalRun = setInterval(() => run(), 1000);
    }

    stop() {
        window.clearInterval(this.intervalRun);
    }
}

export class BusinessViewComponetConstructor {
    list: BusinessViewComponet[] = new Array();

    getBusinesses() {
        let businesses = new Array<IBusiness<IBusinessData>>();
        this.list.map(x => {
            businesses.push(x.business);
        });
        return businesses;
    }
}