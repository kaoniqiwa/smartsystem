import { Component, AfterViewInit } from "@angular/core";
import { isNullOrUndefined } from "util";
import { SessionUser } from "../../../common/tool/session-user";
@Component({
  selector: "app-user-tool",
  templateUrl: "./user-tool.component.html",
})
export class UserToolComponent implements AfterViewInit {
  sessionUser = new SessionUser();
  hideButton = false;
  constructor() {}
  ngAfterViewInit(): void {
    setTimeout(() => {
      let HideButton = "HideButton";

      this.hideButton = isNullOrUndefined(
        window.sessionStorage.getItem(HideButton)
      );
      window.sessionStorage.removeItem(HideButton);
    }, 0);
  }

  logOut() {
    this.sessionUser.clear();
    window.location.href = "/login";
  }
}
