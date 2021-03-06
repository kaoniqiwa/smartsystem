/**
 * Developer 施文斌
 * LastUpdateTime  
 */
import { Directive, ElementRef, NgZone,OnInit } from '@angular/core';


declare const echarts:any;

@Directive({
    selector: '[EChartProgressBarBox]'
})
export class EChartProgressBarBoxDirective implements OnInit {
    private echarts_: any;
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
                    radius: ["67%", "28%"],
                    center: ['64%', '50%'],
                    startAngle: -50,
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [{
                        value: 23,
                        itemStyle: {
                            normal: {
                                color: "rgba(80,150,224,0)"
                            }
                        }
                    },
                    {
                        value: 77,
                        itemStyle: {
                            normal: {
                                color: "rgba(80,150,224)",
                                borderWidth: 0,
                                borderColor: '#235FA4'
                            }
                        }

                    },

                    ]
                },

                ]
            };
        }
        this.zone.runOutsideAngular(() => {
           this.echarts_ = echarts.init(this.e.nativeElement);
           this.echarts_.setOption(create(), true);
        });
    }
}