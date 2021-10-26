import { Injectable } from "@angular/core";
import { DivisionNumberStatistic } from "src/app/data-core/model/waste-regulation/division-number-statistic";
import { DivisionRequestService } from "src/app/data-core/repuest/division.service";
import { ICommitteesService } from "../interface/committees-service.interface";

@Injectable()
export class CommitteesStatisticService
  implements ICommitteesService<DivisionNumberStatistic>
{
  constructor(private divisionService: DivisionRequestService) {}

  async load(divisionId: string) {
    return this.divisionService.statisticNumber(divisionId);
  }
}
