import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { classToPlain } from "class-transformer";
import { ICommitteesComponent } from "../../../interface/committees-component.interface";
import { ICommitteesConverter } from "../../../interface/committees-converter.interface";
import { IEventTrigger } from "../../../interface/committees-event-trigger.interface";
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
    >,
    IEventTrigger<StatisticSummaryTaskChartViewModel>
{
  myChart: any;

  @Input()
  EventTrigger: EventEmitter<void>;
  @Output()
  OnTriggerEvent: EventEmitter<StatisticSummaryTaskChartViewModel> = new EventEmitter();

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

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.onLoaded();
  }
  ngAfterViewInit(): void {
    this.myChart = echarts.init(this.echarts.nativeElement, "dark");
    this.onLoaded();
  }
  ngOnInit() {
    if (this.EventTrigger) {
      this.EventTrigger.subscribe((x) => {
        this.OnTriggerEvent.emit(this.data);
      });
    }
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
      this.myChart.setOption(this.option, true);
    }
  }
}
