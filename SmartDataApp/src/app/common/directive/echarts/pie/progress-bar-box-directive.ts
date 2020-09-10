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
    constructor(private e: ElementRef, private zone: NgZone) {

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
                    radius: ["60%", "32%"],
                    center: ['64%', '50%'],
                    startAngle: -54,
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [{
                        value: 20,
                        itemStyle: {
                            normal: {
                                color: "rgba(80,150,224,0)"
                            }
                        }
                    },
                    {
                        value: 80,
                        itemStyle: {
                            normal: {
                                color: "rgba(80,150,224,0)",
                                borderWidth: 1,
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
           const echarts_ = echarts.init(this.e.nativeElement);
            echarts_.setOption(create(), true);
        });
    }
}