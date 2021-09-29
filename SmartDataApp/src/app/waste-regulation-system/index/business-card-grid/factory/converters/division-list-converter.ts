import { ViewsModel } from "src/app/common/abstract/base-view";
import { IConverter } from "src/app/common/interface/IConverter";
import {
  HeaderSquareList,
  SquareItem,
} from "src/app/shared-module/header-square-list/header-square-list";
import { Divisions } from "../../business/division/data";

export class DivisionListConverter implements IConverter {
  Convert<Divisions, ViewsModel>(
    input: Divisions,
    output: ViewsModel
  ): ViewsModel;
  Convert(
    input: Divisions,
    output: ViewsModel<HeaderSquareList>
  ): ViewsModel<HeaderSquareList> {
    output.views = [new HeaderSquareList()];
    output.pageSize = 1;
    output.pageIndex = 1;
    if (input instanceof Divisions) {
      output.views[0].squareItems = new Array();
      const countys = input.items.filter((x) => x.root == true),
        committees = input.items.filter(
          (x) => x.root == false && x.parentId == countys[0].id
        );

      for (let i = 0; i < countys.length; i++)
        output.views[0].squareItems.push(
          new SquareItem(
            countys[i].id,
            countys[i].name,
            countys[i].divisionType
          )
        );

      for (let i = 0; i < committees.length; i++)
        output.views[0].squareItems.push(
          new SquareItem(
            committees[i].id,
            committees[i].name,
            committees[i].divisionType,
            committees[i].parentId
          )
        );

      /**填补空白 样式走样 */
      // for (let i = 0; i < (12 - committees.length); i++)
      //     output.views[0].fillView.push('');
      if (countys.length) output.views[0].changebodyView = countys[0].id;
    }
    // setTimeout(() => {
    //     poshytip();
    // },300);
    return output;
  }
}
