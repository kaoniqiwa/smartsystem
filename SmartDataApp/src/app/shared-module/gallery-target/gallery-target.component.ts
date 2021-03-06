import {
  Component,
  Input,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { EventRecord } from "src/app/data-core/model/waste-regulation/event-record";
import {
  domSize,
  drawRectangle,
  clearCanvas,
} from "../../common/tool/jquery-help/jquery-help";
import { GalleryTarget, ImageEventEnum } from "./gallery-target";
@Component({
  selector: "hw-gallery-target",
  templateUrl: "./gallery-target.component.html",
  styleUrls: ["./gallery-target.component.styl"],
})
export class GalleryTargetComponent implements OnInit, OnChanges {
  @Input() model: GalleryTarget;

  @Input() closeViewFn: () => void;

  @Input() imgEventFn: (e: ImageEventEnum, id: string) => number;

  @Input() videoFileFn: (id: string) => void;

  @Input() videoFn: (id: string) => void;

  onDescFn = (on: boolean) => {
    this.onDesc = on;
    this.imgCanvas = on;
  };

  imgEvent = ImageEventEnum;
  constructor() {}

  closeViewClick() {
    if (this.closeViewFn) this.closeViewFn();
  }

  enlargeImageSize = {
    width: 0,
    height: 0,
  };

  onDesc = this.imgCanvas;
  ngOnChanges() {
    this.load();
  }

  readonly sessionCanvas = "session-event-canvas";

  get imgCanvas() {
    const val = sessionStorage.getItem(this.sessionCanvas);
    return val == "1";
  }

  set imgCanvas(val: boolean) {
    const v = val ? "1" : "0";
    sessionStorage.setItem(this.sessionCanvas, v);
  }

  imgPageClick(e: ImageEventEnum) {
    if (this.imgEventFn) this.imgEventFn(e, this.model.id);
  }

  videoFileClick() {
    if (this.videoFileFn) this.videoFileFn(this.model.id);
  }

  ngOnInit() {
    window.addEventListener("resize", () => this.load());
    this.onDescFn(true);
  }

  videoClick() {
    if (this.videoFn) this.videoFn(this.model.id);
  }

  load() {
    if (this.model && this.model.polygon) {
      setTimeout(() => {
        const size = domSize("enlargeImage");
        this.enlargeImageSize.width = size.width;
        this.enlargeImageSize.height = size.height;
        setTimeout(() => {
          clearCanvas("polygonCanvas");

          let text = "";
          if (this.model.polygon && this.model.polygon.length > 0) {
            text =
              this.model.polygon[0].Id +
              " " +
              this.model.polygon[0].Confidence +
              "%";
          }

          let canvas = drawRectangle(
            "polygonCanvas",
            this.model.polygon.map((x) => x.Polygon),
            size,
            "red",
            text
          );
          if (this.model.rules) {
            let points = this.model.rules.map((x) => x.Polygon);
            drawRectangle(canvas, points, size, "blue");
          }
        });
      });
    }
  }
}
