import { Injectable,EventEmitter } from "@angular/core";


@Injectable({
    providedIn:'root'
})
export class ComponentService{
    /**下拉组件 通知 */
    selectOptionEventEmitter = new EventEmitter();
}