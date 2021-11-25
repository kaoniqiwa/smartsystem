import { EventEmitter } from "@angular/core";
import { SessionUser } from "src/app/common/tool/session-user";
import { MobileChangeStep } from "../../../mobile/mobile.model";
import { WindowViewModel } from "../../../window/window.model";

export class MobileWindowViewModel extends WindowViewModel {
  constructor() {
    super();
    this.session = new SessionUser();
    let user = this.session.get();
    this.step = user.MobileNo ? MobileChangeStep.Check : MobileChangeStep.Bind;
  }
  session: SessionUser;
  styles = {
    width: "576px",
    height: "300px",
    top: "50%",
    left: "50%",
    transform: "translate(-288px, -150px)",
  };

  step: MobileChangeStep;

  bindedEvent = new EventEmitter();

  onBinded() {
    this.bindedEvent.emit();
    this.step = MobileChangeStep.Check;
    this.show = false;
  }
  onCancel() {
    this.show = false;
  }
}
