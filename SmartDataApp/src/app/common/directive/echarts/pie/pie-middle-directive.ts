/**
 * Developer 施文斌
 * LastUpdateTime  
 */
import { Directive, Input, ElementRef, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { PieOption } from "../echart";

declare const echarts:any;

@Directive({
    selector: '[EChartPieMiddle]'
})
export class EChartPieMiddleDirective implements OnChanges {

    private ele: any;
    private echarts_: any;
    @Input('options') options: PieOption;
    constructor(private e: ElementRef, private zone: NgZone) {

    }
    ngOnChanges(changes: SimpleChanges): void {
        if (this.options) this.init();
    }

    init() {
        const create = (options: PieOption) => {
            return {
                tooltip: {
                  trigger: 'item',
                  formatter: '{c}吨\r\n{d}%'
                },
                legend: {
               //   top: 10,
                  orient: 'vertical',
               //   left: 'right',
                  data: options.legendData,
              //    icon: "circle",
                  show: false,
                  textStyle: {
                    color: "#FFFFFF"
                    , fontSize: 16
                  },
              //    itemGap: 8
                },
                color: ["#dc442f", "#f6a62b", "#29a1df", "#19af89", "#90bd25", "#a544f7", "#536dfe"],
                series: [
                  {
                    name: '',
                    type: 'pie',
                    radius: ['31%', '39%'],
                    avoidLabelOverlap: true,
                    center: ['40%', '56%'],
                    label: {
                      normal: {
                        show: false
                      }
                    },
                    labelLine: {
                      normal: {
                        show: false
                      }
                    },
                    data: options.seriesData,
                    itemStyle: {
                      emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                    },
                  }
                ],
                left: 60
              };
        }
        this.zone.runOutsideAngular(() => {
           this.echarts_ = echarts.init(this.e.nativeElement);
           this.echarts_.setOption(create(this.options), true);
        });
    }


    reSize() {
        this.zone.runOutsideAngular(() => {
            if (this.echarts_ && this.echarts_.resize)
                this.echarts_.resize();
        });
    }

}

