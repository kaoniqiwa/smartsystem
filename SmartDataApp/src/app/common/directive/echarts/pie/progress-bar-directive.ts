/**
 * Developer 施文斌
 * LastUpdateTime  
 */
import { Directive, Input, ElementRef,OnInit, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { PieOption } from "../echart";

declare const echarts:any;
 
@Directive({
    selector: '[EChartProgressBar]'
})
export class EChartProgressBarDirective implements OnInit {
    private ele: any;
    private echarts_: any;
    @Input('options') options: PieOption;
    constructor(private e: ElementRef, private zone: NgZone) {
        window.addEventListener("resize", () =>  this.echarts_.resize());
    }
    ngOnInit(): void {
         this.init();
    }

    init() {
        const create = () => {
            return {
                animation:false,
                series: [{
                    name: '',
                    type: 'pie', 
                    radius: ["62%", "32%"],
                    center: ['64%', '50%'],
                    startAngle: -44,
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [{
                        value: 30,
                        itemStyle: {
                            normal: {
                                color: "rgba(80,150,224,0)"
                            }
                        }
                    },
                    {
                        value: 78,
                        itemStyle: {
                            normal: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0,
                                        color: '#ff9100' // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: '#ec2b2b' // 100% 处的颜色
                                    }],
                                    global: false // 缺省为 false
                                }
                            }
                        }

                    },

                    ]
                },

                ]
            }
        }
        this.zone.runOutsideAngular(() => {
            this.echarts_ = echarts.init(this.e.nativeElement);
            this.echarts_.setOption(create(), true);
        });
    }


    reSize() {
        this.zone.runOutsideAngular(() => {
            if (this.echarts_ && this.echarts_.resize)
                this.echarts_.resize();
        });
    }

}