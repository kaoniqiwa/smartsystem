import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { Language } from "src/app/common/tool/language";
import { ICommitteesComponent } from "../../interface/committees-component.interface";
import { ICommitteesConverter } from "../../interface/committees-converter.interface";
import { IEventTrigger } from "../../interface/committees-event-trigger.interface";
import { StatisticSummaryViewModel } from "../statistic-summary.model";
import { StatisticSummaryHeaderConverter } from "./statistic-summary-header.converter";
import { StatisticSummaryHeaderViewModel } from "./statistic-summary-header.model";

@Component({
  selector: "app-statistic-summary-header",
  templateUrl: "./statistic-summary-header.component.html",
  styleUrls: ["./statistic-summary-header.component.css"],
})
export class StatisticSummaryHeaderComponent
  implements
    OnInit,
    OnChanges,
    ICommitteesComponent<
      StatisticSummaryViewModel[],
      StatisticSummaryHeaderViewModel
    >,
    IEventTrigger<StatisticSummaryHeaderViewModel>
{
  Language = Language;

  view: StatisticSummaryHeaderViewModel = new StatisticSummaryHeaderViewModel();

  @Input()
  DivisonStatistic: StatisticSummaryViewModel[];

  @Input()
  EventTrigger: EventEmitter<void>;

  @Output()
  OnTriggerEvent: EventEmitter<StatisticSummaryHeaderViewModel> = new EventEmitter();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.onLoaded();
  }
  Converter: ICommitteesConverter<
    StatisticSummaryViewModel[],
    StatisticSummaryHeaderViewModel
  > = new StatisticSummaryHeaderConverter();

  onLoaded(): void {
    if (this.DivisonStatistic) {
      this.view = this.Converter.Convert(this.DivisonStatistic);
    }
  }

  ngOnInit() {
    if (this.EventTrigger) {
      this.EventTrigger.subscribe((x) => {
        // 处理数据
        this.OnTriggerEvent.emit(this.view);
      });
    }
  }
}
