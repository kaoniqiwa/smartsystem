import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { IllegalDropEventRecord } from "src/app/data-core/model/waste-regulation/illegal-drop-event-record";
import { MixedIntoEventRecord } from "src/app/data-core/model/waste-regulation/mixed-into-event-record";
import { ResourceMediumRequestService } from "src/app/data-core/repuest/resources.service";
import { GalleryTarget } from "src/app/shared-module/gallery-target/gallery-target";
import { GalleryTargetConverter } from "src/app/shared-module/gallery-target/gallery-target.converter";
import { ICommitteesConverter } from "../../interface/committees-converter.interface";

type Record = IllegalDropEventRecord | MixedIntoEventRecord;

@Injectable()
export class HistoryImageWindowBussiness {
  constructor(private datePipe: DatePipe) {}
  Model?: GalleryTarget;

  private _Converter?: GalleryTargetConverter;
  public get Converter(): GalleryTargetConverter {
    if (!this._Converter) {
      this._Converter = new GalleryTargetConverter(this.datePipe);
    }
    return this._Converter;
  }

  load(record: Record) {
    this.Model = this.Converter.Convert(record);
  }
}
