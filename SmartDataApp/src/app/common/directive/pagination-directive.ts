/**
 * Developer 施文斌
 * LastUpdateTime 2020/8/14
 */
import { Directive, Input, ElementRef ,OnChanges, SimpleChanges, Output,EventEmitter} from '@angular/core';
import { HWPagination } from "../tool/pagination/pagination";
@Directive({
    selector: '[HWPagination]'
})
export class HWPaginationDirective implements OnChanges {

    private ele: any;
    @Input('options') options: HWPaginationOptions; 

    @Output() changePageEvent = new EventEmitter();
    constructor(e: ElementRef) {
        this.ele = e.nativeElement; 
    }
    ngOnChanges(changes: SimpleChanges): void {
        HWPagination(this.ele, this.options.total, (pageIndex: number) => {
            if(this.options&&this.options.changeFn){
                this.options.changeFn(pageIndex);
                this.changePageEvent.emit();
            }
        });   
    }
}

export class HWPaginationOptions{
    total:number = 1;
    changeFn:(pageIndex:number)=>void;
    viewWidth = 232;
    constructor(total:number,changeFn:(pageIndex:number)=>void){
        this.total=total == 0 ? 1:total;
        this.viewWidth+= total>=7 ? 7*30: total*30;
        this.changeFn = changeFn;
    }
}
