import { WindowViewModel } from "../../../window/window.model";

export class PasswordWindowViewModel extends WindowViewModel {
  styles = {
    width: "576px",
    height: "400px",
    top: "50%",
    left: "50%",
    transform: "translate(-288px, -200px)",
  };

  closeable = true;

  onChanged() {
    this.closeable = false;
  }
  onCancel() {
    this.show = false;
  }
}
