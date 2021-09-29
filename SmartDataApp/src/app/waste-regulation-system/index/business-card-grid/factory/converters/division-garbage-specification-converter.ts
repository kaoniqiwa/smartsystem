import { ViewsModel } from "src/app/common/abstract/base-view";
import { IConverter } from "src/app/common/interface/IConverter";
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
      hint.title = "垃圾投放点数量";
      hint.linkTipLabel = "查看垃圾投放点信息";
      hint.subTitleColor = ColorEnum["sky-blue-text2"];
      hint.subTitle = input.garbagePushNumber + "";
      hint.tag = HintTag.GarbageStation;
      hints.push(hint);
      hint = new Hint();
      hint.title = "垃圾滞留投放点";
      hint.linkTipLabel = "查看垃圾滞留投放点信息";
      hint.tag = HintTag.StationStranded;
      hint.subTitleColor = ColorEnum["green-text"];
      hint.subTitle = input.garbageStrandedNumber + "";
      hints.push(hint);
      hint = new Hint();
      hint.title = "已满溢投放点数量";
      hint.linkTipLabel = "查看满溢投放点信息";
      hint.subTitleColor = ColorEnum["orange-text"];
      hint.subTitle = input.fullPushNumber + "";
      hint.tag = HintTag.FullStation;
      hints.push(hint);
      hint = new Hint();
      hint.title = "乱丢垃圾";
      hint.linkTipLabel = "查看乱丢垃圾事件记录";
      hint.subTitleColor = ColorEnum["powder-red-text"];
      hint.subTitle = input.illegalDropNumber + "";
      hint.tag = HintTag.IllegalDrop;
      hints.push(hint);
      hint = new Hint();
      hint.linkTipLabel = "查看混合投放事件记录";
      hint.title = "混合投放";
      hint.tag = HintTag.MixedInto;
      hint.subTitleColor = ColorEnum["light-purple-text"];
      hint.subTitle = input.hybridPushNumber + "";
      hints.push(hint);
      output.views = [hints];
    }
    return output;
  }
}
