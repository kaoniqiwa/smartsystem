import { Injectable } from "@angular/core";
import { StatisticalDataBufferService } from "../business-card-grid/buffer/statistical-data-buffer";
import { DivisionType } from "../../../data-core/model/enum";
import { OrderTable } from "../../../shared-module/card-component/order-table-card/order-table";
import {
  StateScale,
  Arc,
} from "../../../shared-module/card-component/state-scale-card/state-scale";
import { ViewsModel } from "../../../common/abstract/base-view";
import { ColorEnum } from "../../../shared-module/card-component/card-content-factory";
import { ImageTheme } from "../../../shared-module/card-component/image-theme-card/image-theme";
import { Language } from "src/app/common/tool/language";
@Injectable()
export class IndexService {
  constructor(private bufferService: StatisticalDataBufferService) {}

  async getCounty() {
    const divisions = await this.bufferService.getDivisions();
    const countys = divisions.filter(
      (x) => x.DivisionType == DivisionType.County
    );
    return countys.shift();
  }

  async getCommittees() {
    const divisions = await this.bufferService.getDivisions();
    const committees = divisions.filter(
      (x) => x.DivisionType == DivisionType.Committees
    );
    return committees;
  }

  async getCommittesIds() {
    const committees = await this.getCommittees(),
      ids = new Array<string>();
    for (const x of committees) ids.push(x.Id);
    return ids;
  }

  get defaultOrderTable() {
    const model = new OrderTable();
    const view = new ViewsModel();
    view.views = [model];
    model.title = "乱丢垃圾行为TOP10";
    model.table = new Array();
    for (let i = 0; i < 10; i++)
      model.table.push({
        id: "",
        name: "-",
        subNameAfter: "起",
        subName: "0",
        linkTipLabel:
          Language.json.see + Language.json.event + Language.json.record,
      });

    return view;
  }

  defaultImageTheme(close: boolean) {
    const model = new ImageTheme(),
      view = new ViewsModel();
    view.views = [model];
    model.title =
      close == false
        ? Language.json.did + Language.json.link
        : Language.json.unlink;
    return view;
  }

  // get getStateScale(){

  //      const model=new StateScale();
  //      const view = new ViewsModel();
  //      view.views = [model];
  //      model.title='设备运行状态';
  //      model.stateLabel = {
  //          subTitle:'系统设备在线比',
  //          scaleNumber:'0',
  //          state:''
  //      }
  //      model.arc =Arc._0;
  //      model.detail = new Array();
  //      model.detail.push({
  //          label:'全部设备数量',
  //          number:'0',
  //          color:ColorEnum["sky-blue-text2"]
  //      });
  //      model.detail.push({
  //          label:'在线设备数量',
  //          number:'0',
  //          color:ColorEnum["green-text"]
  //      })
  //      model.detail.push({
  //         label:'离线设备数量',
  //         number:'0',
  //         color:ColorEnum["powder-red-text"]
  //     });
  //     return view;
  // }
}
