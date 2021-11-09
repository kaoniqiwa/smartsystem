import { Injectable } from "@angular/core";
import { IllegalDropEventRecord } from "src/app/data-core/model/waste-regulation/illegal-drop-event-record";
import { MixedIntoEventRecord } from "src/app/data-core/model/waste-regulation/mixed-into-event-record";
import { CommitteesHistoryTableTypes } from "../../histroy-table/committees-history-table.model";
import { WindowOperationBussiness } from "./window-operation.business";

export class CommitteesHistroyTableBussiness {
  constructor(private window: WindowOperationBussiness) {}

  Types = new CommitteesHistoryTableTypes();
  Type = this.Types.IllegalDrop;

  OnPictureClicked(record: IllegalDropEventRecord | MixedIntoEventRecord) {
    this.window.picture.load(record);
    this.window.picture.show = true;
  }
  OnVideoClicked(record: IllegalDropEventRecord | MixedIntoEventRecord) {
    this.window.video.load(record);
    this.window.video.show = true;
  }
}
