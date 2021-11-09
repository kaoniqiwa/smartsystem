import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { ICommitteesComponent } from "../../interface/committees-component.interface";
import { ICommitteesConverter } from "../../interface/committees-converter.interface";
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
    >
{
  view: StatisticSummaryHeaderViewModel = new StatisticSummaryHeaderViewModel();

  @Input()
  DivisonStatistic: StatisticSummaryViewModel[];

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

  ngOnInit() {}
}
