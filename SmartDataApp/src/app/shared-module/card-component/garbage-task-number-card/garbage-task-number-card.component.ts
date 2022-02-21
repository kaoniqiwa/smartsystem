import { AfterViewInit, ViewChild } from "@angular/core";
import { Component, ElementRef, OnInit } from "@angular/core";

import {
  BasisCardComponent,
  ViewsModel,
} from "src/app/common/abstract/base-view";
import { IViewEvent } from "src/app/common/interface/IViewEvent";
import { GlobalStoreService } from "../../global-store.service";
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
      if (this.option.series.length > 0) {
        this.option.series[0].data[0].value = parseInt(
          this._data.taskRatio.toString()
        );
      }
      if (this.option.series.length > 1) {
        this.option.series[1].data[0].value = parseInt(
          this._data.timeoutRatio.toString()
        );
      }
      if (this.myChart) {
        this.myChart.setOption(this.option, true);
      }
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
      if (this.data) {
        this.option.series[0].data[0].value = parseInt(
          this.data.taskRatio.toString()
        );
      }
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

    // 隔一段时间切换
    // this.timeSpan.stop();
    // this.index = 0;
    // this.timeSpan.run();

    if (!this.model) return;
    let datas = (this.model as GarbageTaskNumberCardDatas).datas;
    datas = datas
      // .filter((x) => {
      //   return !Number.isNaN(x.ratio);
      // })
      .sort((a, b) => {
        return a.Id.localeCompare(b.Id);
      });
    this.data = datas[0];
    if (this.index >= datas.length) {
      this.index = 0;
    }
  }

  ngOnInit(): void {
    this.loadDatas(new ViewsModel<GarbageTaskNumberCardDatas>());
    this.dataChanged();
    // this.timeSpan.onInterval = () => {};
    // 隔一段时间切换
    // this.timeSpan.run();
    GlobalStoreService.interval.subscribe((x) => {
      this.loadDatas(new ViewsModel<GarbageTaskNumberCardDatas>());
      this.dataChanged();
    });
  }

  onRunning() {}

  itemClick(args?: { handle?: boolean; timeout?: boolean }) {
    if (this.data)
      this.btnControl({
        id: this.data.Id,
        args: args,
      });
  }

  taskSerie = {
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
        borderWidth: 0,
        color: "#3a93ff",
      },
    },
    axisLine: {
      lineStyle: {
        width: 10,
        color: [[1, "#4b5899"]],
        opacity: 0.5,
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
          offsetCenter: ["0%", "-10%"],
        },
        detail: {
          offsetCenter: ["0%", "-42%"],
        },
      },
    ],
    title: {
      fontSize: 14,
      color: "#868fff",
    },
    detail: {
      width: 50,
      height: 14,
      color: "auto",
      rich: {
        a: {
          color: "white",
          fontSize: 28,
          fontWeight: "normal",
        },
        b: {
          fontSize: 12,
          color: "#cfd7ff",
          // verticalAlign: "bottom",
        },
      },
      formatter: (value) => {
        return "{a|" + value + "}{b|%}";
      },
    },
  };
  timeoutSerie = {
    type: "gauge",
    startAngle: 90,
    endAngle: -270,
    radius: "70%",
    pointer: {
      show: false,
    },
    progress: {
      show: true,
      overlap: false,
      roundCap: false,
      clip: false,
      itemStyle: {
        borderWidth: 0,
        color: "#ffba00",
      },
    },
    axisLine: {
      lineStyle: {
        width: 10,
        color: [[1, "#4b5899"]],
        opacity: 0.3,
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
        name: "超时率",
        title: {
          offsetCenter: ["0%", "55%"],
        },
        detail: {
          offsetCenter: ["0%", "18%"],
        },
      },
    ],
    title: {
      fontSize: 14,
      color: "#ffba00",
    },
    detail: {
      width: 50,
      height: 14,
      color: "auto",
      rich: {
        a: {
          color: "white",
          fontSize: 28,
          fontWeight: "normal",
        },
        b: {
          fontSize: 12,
          color: "#cfd7ff",
          fontFamily: "微软雅黑",
        },
      },
      formatter: (value) => {
        return "{a|" + value + "}{b|%}";
      },
    },
  };

  option = {
    color: ["#3a93ff"],
    backgroundColor: "transparent",
    series: [this.taskSerie, this.timeoutSerie],
  };
}
