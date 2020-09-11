/**
 * Developer 施文斌
 * LastUpdateTime  
 */
import { Directive, Input, ElementRef, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { PieOption } from "../echart";

declare const echarts:any;

@Directive({
    selector: '[EChartPieIn]'
})
export class EChartPieInDirective implements OnChanges {

    private ele: any;
    private echarts_: any;
    @Input('options') options: PieOption;
    constructor(private e: ElementRef, private zone: NgZone) {
      window.addEventListener("resize", () =>  this.echarts_.resize());
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (this.options) this.init();
    }

    init() {
        const create = (options: PieOption) => {
            return {
                tooltip: {
                  trigger: 'item',
                  formatter: function (params, ticket, callback) {
                    var index = params.name.indexOf(' ');
                    return `${params.name.substring(0, index)} ${params.seriesName} ${params.data.value}吨 (${params.percent})%`;
                  }
                  // formatter: "{a} <br/>{b} : {c} ({d}%)",
                },
                legend: {
                //  top: 10,
                  orient: 'vertical',
                 left: '80%', 
                 itemWidth:6,
                 itemHeight :6,
                  data: options.legendData,
                //  icon: "circle",
                  textStyle: {
                    color: "#CFD7FE"
                    , fontSize: 12
                  },
               //   itemGap: 8
                },
                color: ["#979896", "#854D39", "#0068BD", "#E43520", "#90bd25", "#a544f7", "#536dfe"],
                series: [
                  {
                    name: '',
                    type: 'pie',
                    radius: ['40%', '50%'], 
                    avoidLabelOverlap: true,
                    center: ['40%', '56%'],
                    labelLine: {
                      normal: {
                        length: 10,
                        length2: 10
                      }
                    },
                    label: {
                      normal: {
                        color: "red",
                        formatter: '{c}吨\r\n{d}%',
                        backgroundColor: 'rgba(128, 128, 128, 0)',
                        borderColor: '#aaa',
                        borderWidth: 0,
                        borderRadius: 4,
                        padding: [2, 2]
                        , fontSize: 12
                      },
                    },
                    data: options.seriesData,
                    itemStyle: {
                      normal: {
                        label: {
                          textStyle: {
                            color: "#FFFFFF"
                          }
                        }
                      },
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