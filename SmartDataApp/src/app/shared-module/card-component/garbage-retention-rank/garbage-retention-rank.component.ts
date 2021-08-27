import { Component, OnInit } from "@angular/core";
import {
  BasisCardComponent,
  CardComponent,
  ViewsModel,
} from "src/app/common/abstract/base-view";
import { IViewEvent } from "src/app/common/interface/IViewEvent";
import { GarbageRetentionNumberCardDatas } from "./garbage-retention-rank-data";

@Component({
  selector: "app-garbage-retention-rank",
  templateUrl: "./garbage-retention-rank.component.html",
  styleUrls: ["./garbage-retention-rank.component.less"],
})
export class GarbageRetentionRankComponent
  extends BasisCardComponent
  implements OnInit
{
  title: string = "垃圾滞留排名";
  unit: string = "起";

  constructor() {
    super();
  }
  ngOnInit(): void {
    this.loadDatas(new ViewsModel<GarbageRetentionNumberCardDatas>());
  }
  btnControl: (tag: IViewEvent) => {};

  itemClick(id: string) {
    // if (id) this.btnControl({ id: id });
  }
}
