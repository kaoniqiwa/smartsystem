import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { classToPlain } from "class-transformer";
import { ICommitteesComponent } from "../../../interface/committees-component.interface";
import { ICommitteesConverter } from "../../../interface/committees-converter.interface";
import { StatisticSummaryViewModel } from "../../statistic-summary.model";
import { StatisticSummaryTaskChartConverter } from "./statistic-summary-task-chart.converter";
import { StatisticSummaryTaskChartViewModel } from "./statistic-summary-task-chart.model";
import { StatisticSummaryTaskChartOption } from "./statistic-summary-task-chart.option";

declare var echarts: any;
@Component({
  selector: "app-statistic-summary-task-chart",
  templateUrl: "./statistic-summary-task-chart.component.html",
  styleUrls: ["./statistic-summary-task-chart.component.css"],
})
export class StatisticSummaryTaskChartComponent
  implements
    OnInit,
    OnChanges,
    AfterViewInit,
    ICommitteesComponent<
      StatisticSummaryViewModel,
      StatisticSummaryTaskChartViewModel
    >
{
  myChart: any;

  private _Data: StatisticSummaryViewModel;
  public get Data(): StatisticSummaryViewModel {
    return this._Data;
  }
  @Input()
  public set Data(v: StatisticSummaryViewModel) {
    this._Data = v;
  }

  private _data: StatisticSummaryTaskChartViewModel =
    new StatisticSummaryTaskChartViewModel();
  public get data(): StatisticSummaryTaskChartViewModel {
    return this._data;
  }
  public set data(v: StatisticSummaryTaskChartViewModel) {
    this._data = v;
    this.setOption();
  }

  @ViewChild("echarts")
  private echarts?: ElementRef<HTMLDivElement>;

  option = StatisticSummaryTaskChartOption;

  Converter: ICommitteesConverter<
    StatisticSummaryViewModel,
    StatisticSummaryTaskChartViewModel
  > = new StatisticSummaryTaskChartConverter();

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.onLoaded();
  }
  ngAfterViewInit(): void {}
  ngOnInit() {
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
    if (this.data) {
      this.option.series[0].data[0].value = parseInt(
        this.data.ratio.toString()
      );
      debugger;
    }
    if (this.myChart) {
      this.myChart.setOption(this.option, true);
    }
  }
}
