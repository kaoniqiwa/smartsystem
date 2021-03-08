/**
 * Developer 施文斌
 * LastUpdateTime  
 */
import { Directive, Input, ElementRef, NgZone, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CandlestickOption } from "./echart";

declare const echarts: any;

@Directive({
    selector: '[EChartCandlestick]'
})
export class EChartCandlestickDirective implements OnChanges, OnInit {

    private ele: any;
    private echarts_: any;
    @Input('options') options: CandlestickOption;
    constructor(private e: ElementRef, private zone: NgZone) {
        window.addEventListener("resize", () => this.echarts_.resize());
    }
    ngOnInit(): void {

    }
    ngOnChanges(changes: SimpleChanges): void {
        if (this.options)
            this.init();
    }

    init() {

        const options = {
            animation: false,
            tooltip: {
                trigger: 'axis',
                formatter: '{b}',
                axisPointer :{
                    lineStyle :{
                        color:'#5e6ebf',
                          width:1.2
                    }
               }
            },

            grid: [
                {
                    top:20,
                    left: '40px',
                    right: '60px',
                    height: '60%',
                },
                {
                    left: '40px',
                    right: '60px',
                    top: '74%',
                    height: '10%'
                }
            ],
            xAxis: [
                {
                    type: 'category',
                    data: this.options.xAxisLine,
                    scale: true,
                    boundaryGap: false,
                    axisLine: { onZero: false,
                        lineStyle:{
                            color:'#7d90bc'
                        } },
                    splitLine: {
                        lineStyle: {
                            color: 'rgb(117,134,224,0.3)'
                        }
                    },
                    // splitNumber: 20,
                    // minInterval: 2,
                    min: 'dataMin',
                    max: 'dataMax',
                    axisLabel: {
                        color: '#CFD7FE',
                        fontSize: "16",
                        // interval: function (index: number, value: string) {                            
                        //    return value.indexOf(':00')>0|| value.indexOf(':20')>0
                        //    ||value.indexOf(':40')>0;                           
                        // }
                    },
                    axisTick: {        //刻度线
                        show: false,
                        lineStyle: {
                            color: 'rgb(117,134,224,0.3)'
                        }
                    },
                },
                {
                    type: 'category',
                    gridIndex: 1,
                    data: this.options.xAxisBar,
                    // axisPointer: {
                    //     show: false
                    // },
                    axisPointer: {
                        show: true,
                        type:'none',
                        label:{
                          //  show:true,
                            formatter:(param:{value:number,seriesData:Array<{name:string}> })=>{ 
                            
                               if(param&&param.seriesData.length&&param.value==1) 
                                   {console.log( param);
                                    return param.seriesData[0].name;
                                    
                                   }
                                else return '';
                            }
                        }
                    },
                    axisLabel: {
                        show: false
                    },
                    axisLine: { show: false },
                    axisTick: { show: false },
                }
            ],
            yAxis: [
                {
                    scale: true,
                    splitArea: {
                        show: false
                    },
                    axisTick: {        //刻度线
                        show: false
                    },
                    
                    axisLine: { 
                        show: false,
                        onZero: false,//y轴
                        lineStyle:{
                            color:'#7d90bc'
                        } },
                    axisLabel: {
                        color: '#CFD7FE',
                        fontSize: "16",
                        show: false,
                        // formatter: function (value: number) {
                        //     if (value > 0 && value < 1)
                        //         return '';
                        //     else return value;
                        // }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgb(117,134,224,0.3)'
                        }
                    }
                },
                {
                    scale: true,
                    gridIndex: 1,
                    axisLabel: { show: false },
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    axisPointer: {
                        show: false
                    }
                }
            ],
            visualMap: {
                show: false,
                
                pieces: [{
                    gt:0.005,
                    lte:1,
                    color: '#CD661D'
                }, {
                    gte:0,
                    lte:0.005,
                    color: '#28ce38'
                }],
                seriesIndex: 0,
            },
            dataZoom: [
                {
                    type: 'inside',
                    xAxisIndex: [0, 1],
                    start: 0,
                    end: 100
                },
                {
                    show: true,
                    xAxisIndex: [0, 1],
                    type: 'slider',
                    top: '84%',
                    start: 0,
                    end: 100,
                    fillerColor: 'rgb(117,134,224,0.5)',
                    borderColor: '#5e6ebf',
                    textStyle: {
                        color: '#CFD7FE',
                        fontSize: "16",
                    }
                }
            ],
            series: [
                {
                    name: 'theLine',
                    type: 'line',
                    data:  this.options.lineData,
                    symbolSize: 8, 
                //    showSymbol: false,
                    step: 'end', 
                },{
                    name: 'theLineB',
                    type: 'line',
                   // showSymbol: false,
                    data: this.options.lineDataB,
                    symbolSize: 8, 
                    itemStyle :{
                        color:'gray'
                    }
                },
                {
                    name: 'theBar',
                    type: 'bar',
                    animation: false,
                    xAxisIndex: 1,
                    yAxisIndex: 1, 
                    // barWidth: 10,
                    data: this.options.barData,
                },
                {
                    name: 'theBarA',
                   type: 'bar', 
                    // barWidth: 10,              
                    selectedMode: true,
                    animation: false,
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    data: this.options.barDataB,
                    // emphasis:{
                    //     focus: 'series',
                    //     label :{
                    //         show: true,
                    //         rich : {
                    //             value: {
                    //                 lineHeight: 30,
                    //                 align: 'center'
                    //             },
                    //             Sunny: {
                    //                 width: 12,
                    //                 height: 22,
                    //                 align: 'center',
                    //                 backgroundColor: {
                    //                     image: '/assets/img/arrow-tag.png',               
                    //                 },
                    //             }
                    //         }
                    //     }
                    // },             
                }
            ]
        }


        this.zone.runOutsideAngular(() => {
            this.echarts_ = echarts.init(this.e.nativeElement);

        //    console.log(JSON.stringify(this.options.xAxisLine.slice(0,20)));
        //    console.log(JSON.stringify(this.options.visualMapPieces.slice(0,20)));
        //    console.log(JSON.stringify(this.options.lineDataB.slice(0,100)));
            this.echarts_.setOption(options, true);

            this.echarts_.on('click', 'series.bar',   (obj:any) =>{    
                window.event.cancelBubble=true;
               this.options.itemClick(obj); 
            });
            this.echarts_.on('click', 'series.line',   (obj:any) =>{     
                window.event.cancelBubble=true;
               this.options.itemClick(obj); 
            });
            this.echarts_.getZr().on('dblclick', (obj: any) => {
                window.event.cancelBubble = true;

                const pointInPixel = [obj.offsetX, obj.offsetY]
                , pointInGrid = this.echarts_.convertFromPixel({ seriesIndex: 0 }, pointInPixel)
                // x轴数据的索引值
                , xIndex = pointInGrid[0];
                // 使用getOption() 获取图表的option
                //, op = this.echarts_.getOption();

                // 获取当前点击位置要的数据
                //var xData = op.series[0].data[xIndex];  
 
                if(pointInGrid[1]>0)
                this.options.dbitemClick(this.options.xAxisLine[xIndex]); 
            });

            this.echarts_.on('dataZoom',()=>{
                this.options.dataZoomClick();
            });
        });
    }


    reSize() {
        this.zone.runOutsideAngular(() => {
            if (this.echarts_ && this.echarts_.resize)
                this.echarts_.resize();
        });
    }

}

