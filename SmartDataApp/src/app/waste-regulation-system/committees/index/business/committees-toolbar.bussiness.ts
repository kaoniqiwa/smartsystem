import { DatePipe } from "@angular/common";
import { Language } from "src/app/common/tool/language";
import { MessageBar } from "src/app/common/tool/message-bar";
import { SessionUser } from "src/app/common/tool/session-user";
import { IllegalDropEventRecord } from "src/app/data-core/model/waste-regulation/illegal-drop-event-record";
import {
  CommitteesToolbarNotifyViewModel,
  NotifyStatus,
} from "../../toolbar/committees-toolbar.model";
import { CommitteesIndexService } from "../committees-index.service";
import { WindowOperationBussiness } from "./window-operation.business";

export class CommitteesToolbarBussiness {
  session = new SessionUser();
  constructor(
    private window: WindowOperationBussiness,
    private datePipe: DatePipe,
    private service: CommitteesIndexService
  ) {
    this.initForUser();

    window.mobile.bindedEvent.subscribe((x) => {
      let user = this.session.get();
      let promise = this.service.getUser(user.Id);
      promise.then((user) => {
        this.session.set(user);
        if (user.MobileNo) {
          this.notify = undefined;
          MessageBar.response_success("手机号绑定成功。");
        } else {
          MessageBar.response_Error("手机号绑定失败。");
        }
      });
    });
  }
  notify?: CommitteesToolbarNotifyViewModel;

  subscribe(record: IllegalDropEventRecord) {
    this.notify = new CommitteesToolbarNotifyViewModel();
    this.notify.status = NotifyStatus.normal;
    let date = this.datePipe.transform(record.EventTime, "HH:mm:ss");
    this.notify.text = `${date} ${record.Data.StationName} ${Language.EventType(
      record.EventType
    )}`;
  }

  onChangePasswordClick() {
    this.window.password.show = true;
  }

  onChangeMobileClick() {
    this.window.mobile.show = true;
  }

  async initForUser() {
    this.createNotify();
  }

  createNotify() {
    this.session = new SessionUser();
    let user = this.session.get();
    if (!user.MobileNo) {
      this.notify = new CommitteesToolbarNotifyViewModel();
      this.notify.status = NotifyStatus.remind;
      this.notify.text = "提示：您还未绑定手机号码 点击这里绑定";
      this.notify.onClick = () => {
        this.window.mobile.show = true;
      };
    }
  }
}
