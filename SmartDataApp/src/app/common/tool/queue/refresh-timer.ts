import { OnDestroy, Injectable } from "@angular/core";
import { IBusinessRefresh, IBusinessData, IBusiness } from "../../interface/IBusiness";
import { interval, of, Subscription } from "rxjs"; 

@Injectable({
    providedIn: 'root'
})
export class RefreshTimer implements OnDestroy {
    private businesses = new Array<IBusiness<IBusinessData>>();
    private seconds = interval(1000);
    private subscription: Subscription;
    constructor() {
    }

    delBusinesses(){
        this.businesses=[];
    }

    addBusiness(list: IBusiness<IBusinessData>[]) {
        list.map(x=>{
            x.disposing = this.businessDisposing;
            this.businesses.push(x);
        }) ;  

    }


    private businessDisposing(business: IBusiness<IBusinessData>) {
        let index = this.businesses.indexOf(business);
        this.businesses.splice(index, 1);
    }

      ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
 

    start() {
        this.subscription = this.seconds.subscribe(x => {
            this.businesses.map(m => {
                if (m.timeSpan&&Date.now() >= m.timeSpan.nextRefreshTime.valueOf()) {
                    m.timeSpan.raise();      
                    m.timeSpan.nextRefreshTime.setSeconds(m.timeSpan.nextRefreshTime.getSeconds() + m.timeSpan.interval);
                }
            });
        });
    }

    stop() {
        this.subscription.unsubscribe();
    }
}