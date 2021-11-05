import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { LineOption } from "src/app/common/directive/echarts/echart";
import { EventNumberStatistic } from "src/app/data-core/model/waste-regulation/division-event-numbers";
import { DivisionNumberStatistic } from "src/app/data-core/model/waste-regulation/division-number-statistic";
import { ICommitteesComponent } from "../../../interface/committees-component.interface";
import { ICommitteesConverter } from "../../../interface/committees-converter.interface";
import { EChartLineOption } from "./echart-line.option";

declare var echarts: any;
@Component({
  selector: "app-statistic-summary-illegal-drop-chart",
  templateUrl: "./statistic-summary-illegal-drop-chart.component.html",
  styleUrls: ["./statistic-summary-illegal-drop-chart.component.css"],
})
export class StatisticSummaryIllegalDropChartComponent
  implements
    OnInit,
    AfterViewInit,
    ICommitteesComponent<EventNumberStatistic[], number[]>
{
  @ViewChild("echarts")
  private echarts?: ElementRef<HTMLDivElement>;

  myChart: any;

  private _Data: EventNumberStatistic[];
  public get Data(): EventNumberStatistic[] {
    return this._Data;
  }
  @Input()
  public set Data(v: EventNumberStatistic[]) {
    this._Data = v;
    this.onLoaded();
  }

  private _data: number[];
  public get data(): number[] {
    return this._data;
  }
  public set data(v: number[]) {
    this._data = v;

    // if (this._data) {
    //   this.setOption(this._data);
    // }
  }

  constructor() {}
  ngOnInit(): void {}

  Converter: ICommitteesConverter<EventNumberStatistic[], number[]>;

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
    return [];
  }

  getOption(data: number[]) {
    for (let i = 0; i < EChartLineOption.series.length; i++) {
      const serie = EChartLineOption.series[i];
      serie.data = data;
    }
    return EChartLineOption;
  }

  option = new LineOption();
}
