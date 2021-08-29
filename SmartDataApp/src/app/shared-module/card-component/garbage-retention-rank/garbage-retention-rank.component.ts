import { Component, OnInit } from "@angular/core";
import { EventType } from "src/app/data-core/model/enum";
import { DivisionBusinessService } from "src/app/waste-regulation-system/index/business-card-grid/division-business.service";
import { GlobalStoreService } from "../../global-store.service";

import {
  GarbageRetentionRankData,
  OptionModel,
  RetentionType,
} from "./garbage-retention-rank.model";
import { GarbageRetentionRankService } from "./service/garbage-retention-rank.service";

@Component({
  selector: "app-garbage-retention-rank",
  templateUrl: "./garbage-retention-rank.component.html",
  styleUrls: ["./garbage-retention-rank.component.less"],
  providers: [GarbageRetentionRankService],
})
export class GarbageRetentionRankComponent implements OnInit {
  private _retentionType: RetentionType = RetentionType.time;

  set retentionType(val: RetentionType) {
    this._retentionType = val;
  }
  get retentionType() {
    return this._retentionType;
  }

  get title() {
    return `垃圾${this.rankSelectMap.get(this.retentionType).content}排名`;
  }

  // 滞留数量单位
  unit: string = "起";

  // 排行榜数据
  private _rankData: GarbageRetentionRankData[] = [];

  get rankData() {
    if (this.retentionType == RetentionType.time) {
      this._rankData.sort((a, b) => b.time - a.time);
    } else if (this.retentionType == RetentionType.count) {
      this._rankData.sort((a, b) => b.count - a.count);
    }
    return this._rankData;
  }
  set rankData(val: GarbageRetentionRankData[]) {
    this._rankData = val;
  }

  // 下拉列表
  rankSelectMap: Map<RetentionType, OptionModel> = new Map([
    [
      RetentionType.time,
      {
        id: "retentionTime",
        content: "滞留时长",
      },
    ],
    [
      RetentionType.count,
      {
        id: "retentionCount",
        content: "滞留数量",
      },
    ],
  ]);

  get rankSelectTile() {
    return this.rankSelectMap.get(this.retentionType).content;
  }
  get rankSelectContent() {
    return [...this.rankSelectMap.values()];
  }

  // 是否显示下拉列表
  showSelectBody: boolean = false;

  constructor(
    private _garbageRetentionRankService: GarbageRetentionRankService,
    private _globalStoreService: GlobalStoreService,
    private _divisionBusinessService: DivisionBusinessService
  ) {
    this._globalStoreService.statusChange.subscribe(() => this._loadData());
  }
  async ngOnInit() {
    await this._loadData();
  }
  private async _loadData() {
    let divisionId = this._globalStoreService.divisionId;
    let divisionType = this._globalStoreService.divisionType;
    this.rankData = await this._garbageRetentionRankService.loadData(
      divisionId,
      divisionType
    );
    console.log(this.rankData);
  }

  toggleSelectBody(e: MouseEvent) {
    e.stopPropagation();
    this.showSelectBody = !this.showSelectBody;
  }
  changeRetentionType(opt: OptionModel) {
    this.showSelectBody = false;
    switch (opt.id) {
      case "retentionTime":
        if (this.retentionType == RetentionType.time) return;
        else this.retentionType = RetentionType.time;
        break;
      case "retentionCount":
        if (this.retentionType == RetentionType.count) return;
        else this.retentionType = RetentionType.count;
        break;
    }
  }
  itemClickHandler(item: GarbageRetentionRankData) {
    console.log(item);
    this._divisionBusinessService.linkChildView(
      item.id,
      EventType.IllegalDrop,
      null
    );
  }
  clickContainer() {
    this.showSelectBody = false;
  }
}
