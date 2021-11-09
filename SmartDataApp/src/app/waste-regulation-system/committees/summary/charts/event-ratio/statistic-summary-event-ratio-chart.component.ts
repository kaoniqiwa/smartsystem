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
import { plainToClass } from "class-transformer";
import { Language } from "src/app/common/tool/language";
import { EventType } from "src/app/data-core/model/enum";
import { DivisionNumberStatistic } from "src/app/data-core/model/waste-regulation/division-number-statistic";
import { ICommitteesComponent } from "../../../interface/committees-component.interface";
import { ICommitteesConverter } from "../../../interface/committees-converter.interface";
import { StatisticSummaryViewModel } from "../../statistic-summary.model";
import { EChartPieOption } from "./echart-pie.option";
import { StatisticSummaryEventRatioChartConverter } from "./statistic-summary-event-ratio-chart.converter";
import { StatisticSummaryEventRatioChartViewModel } from "./statistic-summary-event-ratio-chart.model";

declare var echarts: any;
@Component({
  selector: "app-statistic-summary-event-ratio-chart",
  templateUrl: "./statistic-summary-event-ratio-chart.component.html",
  styleUrls: ["./statistic-summary-event-ratio-chart.component.css"],
})
export class StatisticSummaryEventRatioChartComponent
  implements
    AfterViewInit,
    OnChanges,
    ICommitteesComponent<
      StatisticSummaryViewModel[],
      StatisticSummaryEventRatioChartViewModel
    >
{
  @ViewChild("echarts")
  private echarts?: ElementRef<HTMLDivElement>;

  myChart: any;

  @Input()
  Data?: StatisticSummaryViewModel[];

  private data?: StatisticSummaryEventRatioChartViewModel;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.onLoaded();
  }
  Converter: ICommitteesConverter<
    StatisticSummaryViewModel[],
    StatisticSummaryEventRatioChartViewModel
  > = new StatisticSummaryEventRatioChartConverter();

  ngAfterViewInit(): void {
    if (this.echarts) {
      this.myChart = echarts.init(this.echarts.nativeElement, "dark");
    }
    this.onLoaded();
  }
  onLoaded(): void {
    if (this.Data) {
      this.data = this.Converter.Convert(this.Data);
    }
    this.setOption();
  }

  setOption() {
    if (this.myChart) {
      this.myChart.resize();
      this.myChart.setOption(this.getOption(this.EChartOptionData), true);
    }
  }

  get EChartOptionData() {
    return [
      {
        value: this.data ? this.data.MixedInto : 0,
        name: Language.EventType(EventType.MixedInto),
      },
      {
        value: this.data ? this.data.GarbageFull : 0,
        name: Language.EventType(EventType.GarbageFull),
      },
      {
        value: this.data ? this.data.IllegalDrop : 0,
        name: Language.EventType(EventType.IllegalDrop),
      },
    ];
  }

  getOption(data: { value: number; name: string }[]) {
    for (let i = 0; i < this.option.series.length; i++) {
      const serie = this.option.series[i];
      serie.data = data;
    }
    return this.option;
  }

  option = EChartPieOption;
}
