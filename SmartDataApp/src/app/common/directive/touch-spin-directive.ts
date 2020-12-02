/**
 * Developer 施文斌
 * LastUpdateTime 2020/7/7
 */
import { Directive, Input, AfterViewInit, ElementRef } from '@angular/core';
export class TouchSpinOptions {
    verticalbuttons: boolean;
    min: number;
    max: number;
    step: number;
    decimals: number;
    verticalup:'▴';
    verticaldown:'▾';
    // verticalupclass: string;
    // verticaldownclass: string;
    // buttondown_class: string;
    // buttonup_class: string;
    constructor() {
        this.verticalbuttons = true;
        this.min = 1;
        this.max = 65536;
        this.step = 1;
        this.decimals = 0;
        // this.verticalupclass = 'glyphicon glyphicon-plus';
        // this.verticaldownclass = 'glyphicon glyphicon-minus';
        // this.buttondown_class = 'btn btn-blue';
        // this.buttonup_class = 'btn btn-blue';
    }
}

declare var $: any;
@Directive({
    selector: '[NgTouchSpin]'
})
export class TouchSpinDirective implements AfterViewInit {

    private ele: any;
    @Input('options') options: TouchSpinOptions;
    @Input('event') event: (val: number) => void;

    constructor(e: ElementRef) {
        this.ele = e.nativeElement;
        if(this.options==null)this.options=new TouchSpinOptions();
    }

    ngAfterViewInit() {
        $(this.ele).TouchSpin(this.options).on('change', (ev) => {
            if(this.event)this.event(ev.currentTarget.value);
        });
    }
}
