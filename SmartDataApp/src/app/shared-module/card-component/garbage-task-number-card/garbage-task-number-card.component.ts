import { AfterViewInit, ViewChild } from "@angular/core";
import { Component, ElementRef, OnInit } from "@angular/core";

import {
  BasisCardComponent,
  ViewsModel,
} from "src/app/common/abstract/base-view";
import { IViewEvent } from "src/app/common/interface/IViewEvent";
import {
  GarbageTaskNumberCardData,
  GarbageTaskNumberCardDatas,
} from "./garbage-task-number-card-data";

declare var echarts: any;

@Component({
  selector: "app-garbage-task-number-card",
  templateUrl: "./garbage-task-number-card.component.html",
  styleUrls: ["./garbage-task-number-card.component.css"],
})
export class GarbageTaskNumberCardComponent
  extends BasisCardComponent
  implements OnInit, AfterViewInit
{
  private _data: GarbageTaskNumberCardData = new GarbageTaskNumberCardData();
  public get data(): GarbageTaskNumberCardData {
    return this._data;
  }
  public set data(v: GarbageTaskNumberCardData) {
    this._data = v;
    if (this._data) {
      this.option.series[0].data[0].value = parseInt(
        this._data.ratio.toString()
      );
      this.myChart.setOption(this.option, true);
    }
  }

  private _echarts?: ElementRef<HTMLDivElement>;
  get echarts(): ElementRef<HTMLDivElement> | undefined {
    return this._echarts;
  }
  @ViewChild("echarts")
  set echarts(v: ElementRef<HTMLDivElement> | undefined) {
    this._echarts = v;
    if (this._echarts) {
      this.myChart = echarts.init(this.echarts.nativeElement, "dark");
      this.myChart.setOption(this.option, true);
    }
  }

  constructor() {
    super();
  }

  ngAfterViewInit(): void {}

  myChart: any;

  index: number = 0;

  dataChanged() {
    super.dataChanged();
    this.timeSpan.stop();
    this.index = 0;
    this.timeSpan.run();
  }

  ngOnInit(): void {
    // this.loadDatas(new ViewsModel<GarbageTaskNumberCardDatas>());
    // this.timeSpan.onInterval = () => {
    //   let datas = (this.model as GarbageTaskNumberCardDatas).datas;
    //   datas = datas
    //     // .filter((x) => {
    //     //   return !Number.isNaN(x.ratio);
    //     // })
    //     .sort((a, b) => {
    //       return a.Id.localeCompare(b.Id);
    //     });
    //   this.data = datas[this.index++];
    //   if (this.index >= datas.length) {
    //     this.index = 0;
    //   }
    // };
    // this.timeSpan.run();
  }

  onRunning() {}

  btnControl: (tag: IViewEvent) => {};

  itemClick(id: string) {
    if (id) this.btnControl({ id: id });
  }

  option = {
    color: ["#3a93ff"],
    backgroundColor: "transparent",
    series: [
      {
        type: "gauge",
        startAngle: 90,
        endAngle: -270,
        radius: "80%",
        pointer: {
          show: false,
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: false,
          clip: false,
          itemStyle: {
            borderWidth: 8,
            borderColor: "#3a93ff",
          },
        },
        axisLine: {
          lineStyle: {
            width: 5,
            color: [[1, "#6b7199"]],
          },
        },
        splitLine: {
          show: false,
          distance: 0,
          length: 10,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        data: [
          {
            value: 100,
            name: "处置率",
            title: {
              offsetCenter: ["0%", "30%"],
            },
            detail: {
              offsetCenter: ["0%", "-20%"],
            },
          },
        ],
        title: {
          fontSize: 16,
          color: "#868fff",
        },
        detail: {
          width: 50,
          height: 14,
          fontSize: 50,
          color: "auto",
          rich: {
            a: {
              color: "white",
              fontSize: 40,
              fontWeight: "normal",
            },
            b: {
              fontSize: 14,
              color: "#cfd7ff",
              verticalAlign: "bottom",
            },
          },
          formatter: (value) => {
            return "{a|" + value + "}{b|%}";
          },
        },
      },
    ],
  };
}
