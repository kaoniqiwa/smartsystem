import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { classToPlain, plainToClass } from "class-transformer";
import { EventType } from "src/app/data-core/model/enum";
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import { GarbageStationNumberStatistic } from "src/app/data-core/model/waste-regulation/garbage-station-number-statistic";
import { ICommitteesComponent } from "../../../interface/committees-component.interface";
import { ICommitteesConverter } from "../../../interface/committees-converter.interface";
import { EchartBarOption } from "./echart-bar.option";
import { StatisticSummaryStationEventChartConverter } from "./statistic-summary-station-event-chart.converter";
import { StatisticSummaryStationEventChartViewModel } from "./statistic-summary-station-event-chart.model";

declare var echarts: any;

@Component({
  selector: "app-statistic-summary-station-event-chart",
  templateUrl: "./statistic-summary-station-event-chart.component.html",
  styleUrls: ["./statistic-summary-station-event-chart.component.css"],
})
export class StatisticSummaryStationEventChartComponent
  implements
    AfterViewInit,
    ICommitteesComponent<
      GarbageStationNumberStatistic[],
      StatisticSummaryStationEventChartViewModel[]
    >
{
  myChart: any;
  @ViewChild("echarts")
  private echarts?: ElementRef<HTMLDivElement>;

  private _Data: GarbageStationNumberStatistic[];
  public get Data(): GarbageStationNumberStatistic[] {
    return this._Data;
  }
  @Input()
  public set Data(v: GarbageStationNumberStatistic[]) {
    this._Data = v;
    this.onLoaded();
  }

  constructor() {}
  Converter: ICommitteesConverter<
    GarbageStationNumberStatistic[],
    StatisticSummaryStationEventChartViewModel[]
  > = new StatisticSummaryStationEventChartConverter();
  onLoaded(): void {
    if (this.Data) {
      let plain = classToPlain(this.Converter.Convert(this.Data));
      this.option.dataset.source = plain as Array<any>;
      this.option.xAxis.data = this.Data.map((x) => x.Name);
      this.setOption();
    }
  }
  ngAfterViewInit(): void {
    if (this.echarts) {
      this.myChart = echarts.init(this.echarts.nativeElement, "dark");
      this.setOption();
    }
  }

  setOption() {
    if (this.myChart) {
      console.log(this.option);
      this.myChart.setOption(this.option, true);
    }
  }

  option = classToPlain(EchartBarOption);
}
