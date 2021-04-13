import { Directive, Input, ElementRef, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { Bar3dOption } from "./echart";

declare const echarts:any;

@Directive({
    selector: '[EChartBar3d]'
})
export class EChartBar3dDirective implements OnChanges {
    @Input('options') options: Bar3dOption;
    private echarts_:any;
    constructor(private e: ElementRef, private zone: NgZone) {
        window.addEventListener("resize", () =>  this.echarts_.resize());
    }

    ngOnChanges(){
        if (this.options) this.init();
    }

    init() { 
        var option = {
            tooltip: {  show:false},
            visualMap: {
                max: this.options.maxNumber,
                min:0,
                inRange: {
                    color:['#32e586', '#32dae5', '#32dfe5', '#32b0e5', '#326de5', '#3632e5', 
                    '#5832e5', '#9b32e5', '#da32e5', '#e532ac', '#e53232']
                }
            },
            xAxis3D: {
                type: 'category',
                data: this.options.xAxis3dData,
                axisLabel:{
                    textStyle :{
                        color: '#CFD7FE',
                        fontSize:16
                    }
               }
            },
            yAxis3D: {
                type: 'category',
                data: this.options.yAxis3dData,
                axisLabel:{
                    textStyle :{
                        color: '#CFD7FE',
                        fontSize:16
                    }
               }
            },
            zAxis3D: {
                type: 'value',
                axisLabel:{
                    textStyle :{
                        color: '#CFD7FE',
                        fontSize:16
                    }
               }
            },
            grid3D: {
                boxWidth: this.options.boxWidth,
                boxDepth: this.options.boxDepth,
                viewControl: {
                    // projection: 'orthographic'
                    beta : this.options.beta,
                    distance :this.options.distance
                },
                light: {
                    main: {
                        intensity: 1.2,
                        shadow: true
                    },
                    ambient: {
                        intensity: 0.3
                    }
                }
            },
            series: [{
                type: 'bar3D',
                data: this.options.seriesData.map(function (item) {
                    return {
                        value: [item[1], item[0], item[2]],
                    }
                }),
                shading: 'lambert', 
                label: {
                    fontSize: 16,
                    borderWidth: 1,
                     color: '#CFD7FE',
                      
                },
                emphasis: {
                    label: {
                        fontSize: 20,
                        color: '#900'
                    },
                    itemStyle: {
                        color: '#900'
                    }
                }
            }]
        }

        this.zone.runOutsideAngular(() => {
            this.echarts_ = echarts.init(this.e.nativeElement);              
            this.echarts_.setOption(option, true);
        });
    }

    reSize() {
        this.zone.runOutsideAngular(() => {
          if (this.echarts_ && this.echarts_.resize)
            this.echarts_.resize();
        });
      }
}