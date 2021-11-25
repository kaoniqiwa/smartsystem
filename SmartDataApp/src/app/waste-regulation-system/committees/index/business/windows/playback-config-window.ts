import { EventEmitter } from "@angular/core";
import { PlaybackViewModel } from "../../../playback-config/playback-config.model";
import { WindowViewModel } from "../../../window/window.model";

export class PlaybackConfigWindowViewModel extends WindowViewModel {
  styles = {
    width: "530px",
    height: "400px",
    top: "50%",
    left: "50%",
    transform: "translate(-265px, -200px)",
  };

  onOkClicked = new EventEmitter();

  ok(model: PlaybackViewModel) {
    this.onOkClicked.emit(model);
    this.show = false;
  }

  cancel() {
    this.show = false;
  }
}
