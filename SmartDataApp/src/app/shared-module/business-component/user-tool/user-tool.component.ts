import { Component, AfterViewInit } from "@angular/core";
import { isNullOrUndefined } from "util";
import { SessionUser } from "../../../common/tool/session-user";
import { GlobalStoreService } from "../../global-store.service";
@Component({
  selector: "app-user-tool",
  templateUrl: "./user-tool.component.html",
})
export class UserToolComponent {
  sessionUser = new SessionUser();
  get hideButton() {
    return GlobalStoreService.HideButton;
  }
  constructor() {}

  logOut() {
    this.sessionUser.clear();
    window.location.href = "/login";
  }
}
