import { EventType } from "src/app/data-core/model/enum";
import { DivisionNumberStatistic } from "src/app/data-core/model/waste-regulation/division-number-statistic";
import { ICommitteesConverter } from "../interface/committees-converter.interface";
import { CommitteesStatisticViewModel } from "./committees-statistic.model";

export class CommitteesStatisticConverter
  implements
    ICommitteesConverter<DivisionNumberStatistic, CommitteesStatisticViewModel>
{
  Convert(statistic: DivisionNumberStatistic) {
    let vm = new CommitteesStatisticViewModel();

    vm.CameraCount = statistic.CameraNumber;
    vm.OfflineCount = statistic.OfflineCameraNumber;
    vm.OnlineCount = statistic.CameraNumber - statistic.OfflineCameraNumber;
    vm.StationCount = statistic.StationNumber;
    vm.StationDropCount = statistic.GarbageDropStationNumber;
    vm.StationFullCount =
      statistic.WetFullStationNumber + statistic.DryFullStationNumber;

    if (statistic.TodayEventNumbers) {
      statistic.TodayEventNumbers.forEach((x) => {
        switch (x.EventType) {
          case EventType.IllegalDrop:
            vm.IllegalDropCount = x.DayNumber;
            break;
          case EventType.MixedInto:
            vm.MixedIntoCount = x.DayNumber;
            break;
          default:
            break;
        }
      });
    }
    return vm;
  }
}
