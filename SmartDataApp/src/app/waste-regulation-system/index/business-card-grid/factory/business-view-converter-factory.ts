/**
 * Developer 施文斌
 * LastUpdateTime  21.3.17
 */

import { IConverter } from "../../../../common/interface/IConverter";
import { Injector, Injectable } from "@angular/core";
import { IllegalDropHistoryCardConverter } from "./converters/illegal-drop-history-card-converter";
import { MixedIntoHistoryCardConverter } from "./converters/mixed-into-history-card-converter";
import { DevStatusCardConverter } from "./converters/dev-status-card-converter";
import { DivisionListConverter } from "./converters/division-list-converter";
import { IllegalDropEventConverter } from "./converters/illegal-drop-event-converter";
import { DivisionGarbageSpecificationConverter } from "./converters/division-garbage-specification-converter";
import { DropOrderConverter } from "./converters/drop-order-converter";
import { GarbageStationInspectionCardConverter } from "./converters/garbage-station-inspection-card-converter";
import { GarbageDisposalRankConverter } from "./converters/garbage-disposal-rank-converter";
import { GarbageTaskNumberCardConverter } from "../business/garbage-task-number/garbage-task-number-card-converter";
import { GarbageRetentionRankcConverter } from "./converters/garbage-retention-rankc-converter";

// export class GarbageRetentionRankcConverter implements IConverter {
//   Convert<GarbageRetentionNumberDatas, ViewsModel>(
//     input: GarbageRetentionNumberDatas,
//     output: ViewsModel
//   ): ViewsModel;
//   Convert(
//     input: GarbageRetentionNumberDatas,
//     output: ViewsModel<GarbageRetentionNumberCardDatas>
//   ): ViewsModel<GarbageRetentionNumberCardDatas> {
//     if (!input) return;
//     output.views = [new GarbageRetentionNumberCardDatas()];

//     // output.views[0].datas = input.map((x) => {
//     //   let data = new GarbageRetentionNumberCardData();
//     //   data.Id = x.Id;
//     //   data.Name = x.Name;
//     //   data.Time = x.Time;
//     //   data.Count = x.Count;
//     //   return data;
//     // });
//     // const len = output.views[0].datas.length;
//     // if (len < 6)
//     //   for (let i = 0; i < 6 - len; i++)
//     //     output.views[0].datas.push({
//     //       Id: 12,
//     //       Name: "-",
//     //       Time: "sdf0",
//     //       Count: 0,
//     //     });

//     return output;
//   }
// }

@Injectable({ providedIn: "root" })
export class ConverterFactory {
  convertInjector: Injector;
  constructor() {
    this.convertInjector = Injector.create([
      {
        provide: IllegalDropHistoryCardConverter,
        useValue: new IllegalDropHistoryCardConverter(),
      },
      {
        provide: MixedIntoHistoryCardConverter,
        useValue: new MixedIntoHistoryCardConverter(),
      },
      {
        provide: DevStatusCardConverter,
        useValue: new DevStatusCardConverter(),
      },
      { provide: DivisionListConverter, useValue: new DivisionListConverter() },
      {
        provide: IllegalDropEventConverter,
        useValue: new IllegalDropEventConverter(),
      },
      {
        provide: DivisionGarbageSpecificationConverter,
        useValue: new DivisionGarbageSpecificationConverter(),
      },
      // { provide: IllegalDropOrderConverter, useValue: new IllegalDropOrderConverter() },
      // { provide: MixedIntoDropOrderConverter, useValue: new MixedIntoDropOrderConverter() },
      { provide: DropOrderConverter, useValue: new DropOrderConverter() },
      {
        provide: GarbageStationInspectionCardConverter,
        useValue: new GarbageStationInspectionCardConverter(),
      },
      {
        provide: GarbageDisposalRankConverter,
        useValue: new GarbageDisposalRankConverter(),
      },
      {
        provide: GarbageTaskNumberCardConverter,
        useValue: new GarbageTaskNumberCardConverter(),
      },

      {
        provide: GarbageRetentionRankcConverter,
        useValue: new GarbageRetentionRankcConverter(),
      },
    ]);
  }

  createConvert(businessConfig: { business: string }) {
    if (businessConfig.business) {
      let convert = this.convertInjector.get<IConverter>(
        CardBusinessCoverterEnum[businessConfig.business]
      );
      return convert;
    }
  }
}

export const CardBusinessCoverterEnum = {
  IllegalDropHistory: IllegalDropHistoryCardConverter,
  MixedIntoHistory: MixedIntoHistoryCardConverter,
  DeviceStatusStatistic: DevStatusCardConverter,
  DivisionList: DivisionListConverter,
  IllegalDropEvent: IllegalDropEventConverter,
  EventDropOrder: DropOrderConverter,
  // "IllegalDropOrder": IllegalDropOrderConverter,
  // "MixedIntoDropOrder": MixedIntoDropOrderConverter,
  DivisionGarbageSpecification: DivisionGarbageSpecificationConverter,
  GarbageStationInspection: GarbageStationInspectionCardConverter,
  GarbageDisposalRank: GarbageDisposalRankConverter,
  GarbageTaskNumberBusiness: GarbageTaskNumberCardConverter,
  GarbageRetentionRankBusiness: GarbageRetentionRankcConverter,
};
