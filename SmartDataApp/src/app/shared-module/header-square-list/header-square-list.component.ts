import { Component, Input, OnInit } from "@angular/core";
import { DivisionType } from "../../data-core/model/enum";
import {
  BasisCardComponent,
  ViewsModel,
} from "../../common/abstract/base-view";
import { HeaderSquareList } from "./header-square-list";
import { GlobalStoreService } from "../global-store.service";
@Component({
  selector: "hw-header-square-list",
  templateUrl: "./header-square-list.component.html",
})
export class HeaderSquareListComponent
  extends BasisCardComponent
  implements OnInit
{
  @Input() model: HeaderSquareList;
  private selectedId_ = "";
  constructor(private _globalStoreService: GlobalStoreService) {
    super();
  }

  ngOnInit() {
    this.loadDatas(new ViewsModel());
  }

  set selectedId(id: string) {
    this.selectedId_ = id;
  }

  itemClick(id: string, type: DivisionType.City) {
    this.selectedId = id;
    if (this.btnControl) {
      this.btnControl({
        id: id,
        type: type,
      });
      this._globalStoreService.divisionId = id;
      this._globalStoreService.divisionType = type;
      this._globalStoreService.statusChange.emit();
    }
  }

  get selectedId() {
    return this.selectedId_;
  }
}
