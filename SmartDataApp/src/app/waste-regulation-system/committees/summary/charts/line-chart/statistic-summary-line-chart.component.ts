import { DatePipe } from "@angular/common";
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
import { Language } from "src/app/common/tool/language";
import { EventType, TimeUnit } from "src/app/data-core/model/enum";
import { EventNumberStatistic } from "src/app/data-core/model/waste-regulation/division-event-numbers";
import { ICommitteesComponent } from "../../../interface/committees-component.interface";
import { ICommitteesConverter } from "../../../interface/committees-converter.interface";
import { EChartLineOption } from "./echart-line.option";
import { StatisticSummaryIllegalDropChartConverter } from "./statistic-summary-line-chart.converter";
import { StatisticSummaryIllegalDropChartViewModel } from "./statistic-summary-line-chart.model";

declare var echarts: any;
@Component({
  selector: "app-statistic-summary-line-chart",
  templateUrl: "./statistic-summary-line-chart.component.html",
  styleUrls: ["./statistic-summary-line-chart.component.css"],
})
export class StatisticSummaryIllegalDropChartComponent
  implements
    AfterViewInit,
    OnChanges,
    ICommitteesComponent<
      EventNumberStatistic[],
      StatisticSummaryIllegalDropChartViewModel
    >
{
  @ViewChild("echarts")
  private echarts: ElementRef<HTMLDivElement>;

  myChart: any;

  @Input()
  Data?: EventNumberStatistic[];

  @Input()
  Type?: EventType;

  @Input()
  TimeUnit?: TimeUnit;

  private data: StatisticSummaryIllegalDropChartViewModel =
    new StatisticSummaryIllegalDropChartViewModel();

  Converter: ICommitteesConverter<
    EventNumberStatistic[],
    StatisticSummaryIllegalDropChartViewModel
  > = new StatisticSummaryIllegalDropChartConverter();

  constructor(private datePipe: DatePipe) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.onLoaded();
  }
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.myChart = echarts.init(this.echarts.nativeElement, "dark");
    this.onLoaded();
  }
  onLoaded(): void {
    if (this.Type) {
      this.option.title.text = Language.EventType(this.Type);
    }
    if (this.Data && this.TimeUnit) {
      this.data = this.Converter.Convert(
        this.Data,
        this.Type,
        this.TimeUnit,
        this.datePipe
      );
      this.setOption();
    }
  }

  setOption() {
    if (this.myChart) {
      this.myChart.resize();
      this.myChart.setOption(this.getOption(this.data), true);
    }
  }

  getOption(viewModel: StatisticSummaryIllegalDropChartViewModel) {
    if (viewModel) {
      let max = Math.max(...viewModel.data);
      for (let i = 0; i < this.option.series.length; i++) {
        const serie = this.option.series[i];
        serie.data = viewModel.data;
        serie.label.formatter = (params) => {
          if (params.value === max) {
            return params.value;
          }
          if (params.dataIndex % 3 !== 0) {
            return "";
          }
          return params.value;
        };
      }
      this.option.xAxis.data = viewModel.xAxis;

      return this.option;
    }
  }

  option = EChartLineOption;
}
