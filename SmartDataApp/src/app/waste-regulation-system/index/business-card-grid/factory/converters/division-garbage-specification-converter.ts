import { ViewsModel } from "src/app/common/abstract/base-view";
import { IConverter } from "src/app/common/interface/IConverter";
import { Language } from "src/app/common/tool/language";
import { ColorEnum } from "src/app/shared-module/card-component/card-content-factory";
import {
  Hint,
  HintTag,
} from "src/app/shared-module/card-component/hint-card/hint";
import { Specification } from "../../business/division-garbage-specification/data";

export class DivisionGarbageSpecificationConverter implements IConverter {
  Convert<Specification, ViewsModel>(
    input: Specification,
    output: ViewsModel
  ): ViewsModel;
  Convert(
    input: Specification,
    output: ViewsModel<Hint[]>
  ): ViewsModel<Hint[]> {
    output.pageSize = 1;
    output.pageIndex = 1;
    if (input instanceof Specification) {
      var hint = new Hint(),
        hints = new Array<Hint>();
      hint.title =
        Language.json.garbage + Language.json.station + Language.json.number;
      hint.linkTipLabel =
        Language.json.see +
        Language.json.garbage +
        Language.json.station +
        Language.json.info;
      hint.subTitleColor = ColorEnum["sky-blue-text2"];
      hint.subTitle = input.garbagePushNumber.toString();
      hint.tag = HintTag.GarbageStation;
      hints.push(hint);
      hint = new Hint();
      hint.title =
        Language.json.garbage + Language.json.stay + Language.json.station;
      hint.linkTipLabel =
        Language.json.see +
        Language.json.garbage +
        Language.json.stay +
        Language.json.station +
        Language.json.info;
      hint.tag = HintTag.StationStranded;
      hint.subTitleColor = ColorEnum["green-text"];
      hint.subTitle = input.garbageStrandedNumber.toString();
      hints.push(hint);
      hint = new Hint();
      hint.title =
        Language.json.did +
        Language.json.full +
        Language.json.station +
        Language.json.number;
      hint.linkTipLabel =
        Language.json.see +
        Language.json.full +
        Language.json.station +
        Language.json.info;
      hint.subTitleColor = ColorEnum["orange-text"];
      hint.subTitle = input.fullPushNumber.toString();
      hint.tag = HintTag.FullStation;
      hints.push(hint);
      hint = new Hint();
      hint.title = Language.json.EventType.IllegalDrop;
      hint.linkTipLabel =
        Language.json.see +
        Language.json.EventType.IllegalDrop +
        Language.json.event +
        Language.json.record;
      hint.subTitleColor = ColorEnum["powder-red-text"];
      hint.subTitle = input.illegalDropNumber.toString();
      hint.tag = HintTag.IllegalDrop;
      hints.push(hint);
      hint = new Hint();
      hint.linkTipLabel =
        Language.json.see +
        Language.json.EventType.MixedInto +
        Language.json.event +
        Language.json.record;
      hint.title = Language.json.EventType.MixedInto;
      hint.tag = HintTag.MixedInto;
      hint.subTitleColor = ColorEnum["light-purple-text"];
      hint.subTitle = input.hybridPushNumber.toString();
      hints.push(hint);
      output.views = [hints];
    }
    return output;
  }
}
