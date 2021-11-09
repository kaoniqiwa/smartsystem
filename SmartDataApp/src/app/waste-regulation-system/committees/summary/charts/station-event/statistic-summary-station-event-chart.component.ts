import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { classToPlain, plainToClass } from "class-transformer";
import { EventType } from "src/app/data-core/model/enum";
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import {
  GarbageStationNumberStatistic,
  GarbageStationNumberStatisticV2,
} from "src/app/data-core/model/waste-regulation/garbage-station-number-statistic";
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
    OnChanges,
    ICommitteesComponent<
      GarbageStationNumberStatisticV2[],
      StatisticSummaryStationEventChartViewModel[]
    >
{
  myChart: any;
  @ViewChild("echarts")
  private echarts?: ElementRef<HTMLDivElement>;

  @Input()
  Data?: GarbageStationNumberStatisticV2[];

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.onLoaded();
  }
  Converter: ICommitteesConverter<
    GarbageStationNumberStatisticV2[],
    StatisticSummaryStationEventChartViewModel[]
  > = new StatisticSummaryStationEventChartConverter();
  onLoaded(): void {
    if (this.Data) {
      let plain = classToPlain(this.Converter.Convert(this.Data));
      this.option.dataset.source = plain as Array<any>;
      this.option.xAxis.data = plain.map((x: { product: any }) => x.product);
      this.setOption();
    }
  }

  ngAfterViewInit(): void {
    if (this.echarts) {
      this.myChart = echarts.init(this.echarts.nativeElement, "dark");
      this.onLoaded();
    }
  }

  setOption() {
    if (this.myChart) {
      this.myChart.resize();
      this.myChart.setOption(this.option, true);
    }
  }

  option = classToPlain(EchartBarOption);
}
