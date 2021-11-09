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
      StatisticSummaryViewModel[],
      StatisticSummaryTaskChartViewModel
    >
{
  myChart: any;

  @Input()
  private Data?: StatisticSummaryViewModel[];

  data: StatisticSummaryTaskChartViewModel =
    new StatisticSummaryTaskChartViewModel();

  @ViewChild("echarts")
  private echarts?: ElementRef<HTMLDivElement>;

  option = StatisticSummaryTaskChartOption;

  Converter: ICommitteesConverter<
    StatisticSummaryViewModel[],
    StatisticSummaryTaskChartViewModel
  > = new StatisticSummaryTaskChartConverter();

  constructor() {
    console.log("constructor");
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("ngOnChanges");
    this.onLoaded();
  }
  ngAfterViewInit(): void {
    console.log("ngAfterViewInit");
    this.myChart = echarts.init(this.echarts.nativeElement, "dark");
    console.log(this.echarts.nativeElement);
    this.onLoaded();
  }
  ngOnInit() {
    console.log("ngOnInit");
  }

  onLoaded(): void {
    if (this.Data) {
      this.data = this.Converter.Convert(this.Data);
      this.setOption();
    }
  }

  setOption() {
    if (this.data) {
      this.option.series[0].data[0].value = parseInt(
        this.data.ratio.toString()
      );
    }
    if (this.myChart) {
      this.myChart.resize();
      console.log("setOption");
      this.myChart.setOption(this.option, true);
    }
  }
}
