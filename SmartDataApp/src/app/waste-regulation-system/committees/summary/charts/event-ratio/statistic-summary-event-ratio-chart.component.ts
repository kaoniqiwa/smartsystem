import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { plainToClass } from "class-transformer";
import { Language } from "src/app/common/tool/language";
import { EventType } from "src/app/data-core/model/enum";
import { DivisionNumberStatistic } from "src/app/data-core/model/waste-regulation/division-number-statistic";
import { ICommitteesComponent } from "../../../interface/committees-component.interface";
import { ICommitteesConverter } from "../../../interface/committees-converter.interface";
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
    ICommitteesComponent<
      DivisionNumberStatistic,
      StatisticSummaryEventRatioChartViewModel
    >
{
  @ViewChild("echarts")
  private echarts?: ElementRef<HTMLDivElement>;

  myChart: any;

  private _Data: DivisionNumberStatistic;
  public get Data(): DivisionNumberStatistic {
    return this._Data;
  }
  @Input()
  public set Data(v: DivisionNumberStatistic) {
    this._Data = v;
    this.onLoaded();
  }

  private _data: StatisticSummaryEventRatioChartViewModel;
  public get data(): StatisticSummaryEventRatioChartViewModel {
    return this._data;
  }
  public set data(v: StatisticSummaryEventRatioChartViewModel) {
    this._data = v;

    // if (this._data) {
    //   this.setOption(this._data);
    // }
  }

  constructor() {}
  Converter: ICommitteesConverter<
    DivisionNumberStatistic,
    StatisticSummaryEventRatioChartViewModel
  > = new StatisticSummaryEventRatioChartConverter();

  ngAfterViewInit(): void {
    if (this.echarts) {
      this.myChart = echarts.init(this.echarts.nativeElement, "dark");
      this.setOption();
    }
  }
  onLoaded(): void {
    if (this.Data) {
      this.data = this.Converter.Convert(this.Data);
    }
  }

  setOption() {
    if (this.myChart) {
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
    for (let i = 0; i < EChartPieOption.series.length; i++) {
      const serie = EChartPieOption.series[i];
      serie.data = data;
    }
    return EChartPieOption;
  }
}
