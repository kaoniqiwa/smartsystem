import {
  Component,
  AfterViewInit,
  Output,
  EventEmitter,
  OnInit,
} from "@angular/core";
import { DivisionType } from "src/app/data-core/model/enum";
import { isNullOrUndefined } from "util";
import { SessionUser } from "../../../common/tool/session-user";
import { GlobalStoreService } from "../../global-store.service";
@Component({
  selector: "app-user-tool",
  templateUrl: "./user-tool.component.html",
  styleUrls: ["./user-tool.component.css"],
})
export class UserToolComponent implements OnInit {
  sessionUser = new SessionUser();

  username: string;

  get hideButton() {
    return GlobalStoreService.HideButton;
  }
  constructor() {}
  ngOnInit(): void {
    let user = this.sessionUser.get();
    this.username = user.Username;
  }

  display = {
    changePassword:
      this.sessionUser.userDivisionType === DivisionType.Committees,
    changeMobile: this.sessionUser.userDivisionType === DivisionType.Committees,
  };

  @Output()
  OnChangePasswordClick = new EventEmitter();
  @Output()
  OnChangeMobileClick = new EventEmitter();

  changePasswordClick(event: Event) {
    this.OnChangePasswordClick.emit();
  }
  changeMobileClick(event: Event) {
    this.OnChangeMobileClick.emit();
  }

  logOut() {
    this.sessionUser.clear();

    window.location.href = "/login";
  }
}
