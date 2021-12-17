import { DatePipe } from "@angular/common";
import { EventEmitter } from "@angular/core";
import { IllegalDropEventRecord } from "src/app/data-core/model/waste-regulation/illegal-drop-event-record";
import { MixedIntoEventRecord } from "src/app/data-core/model/waste-regulation/mixed-into-event-record";
import { ResourceMediumRequestService } from "src/app/data-core/repuest/resources.service";
import { GalleryTarget } from "src/app/shared-module/gallery-target/gallery-target";
import { GalleryTargetConverter } from "src/app/shared-module/gallery-target/gallery-target.converter";
import { WindowViewModel } from "../../../window/window.model";

export class DetailsPictureWindowViewModel extends WindowViewModel {
  constructor(private datePipe: DatePipe) {
    super();
  }

  private _converter?: GalleryTargetConverter;
  public get converter(): GalleryTargetConverter {
    if (!this._converter) {
      this._converter = new GalleryTargetConverter(this.datePipe);
    }
    return this._converter;
  }

  close: () => void = () => {
    this.show = false;
  };
  target: GalleryTarget<IllegalDropEventRecord | MixedIntoEventRecord>;

  load(record: IllegalDropEventRecord | MixedIntoEventRecord) {
    this.target = this.converter.Convert(record);
    this.target.data = record;
  }

  playVideoEvent: EventEmitter<IllegalDropEventRecord | MixedIntoEventRecord> =
    new EventEmitter();

  playVideo = async (id: string) => {
    if (id === this.target.data.EventId) {
      let event = this.target.data;
      this.playVideoEvent.emit(event);
    }
    // this.navService.playVideoBug.emit(true);
  };
}
