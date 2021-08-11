import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { StringMapWithRename } from "@angular/core/src/render3/jit/compiler_facade_interface";

@Component({
  selector: "hw-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  styleUrls: ["./confirm-dialog.component.styl"],
})
export class ConfirmDialogComponent implements OnInit {
  @Input() dialog = new ConfirmDialog();

  @Output() dialogMsg = new EventEmitter<string>();
  constructor() {}

  ngOnInit() {}

  okBtnClick() {
    if (this.dialog.okFn) {
      this.dialog.okFn();
    }
    this.dialogMsg.emit("ok");
  }
  cancelBtnClick() {
    if (this.dialog.cancelFn) {
      this.dialog.cancelFn();
    }
    this.dialogMsg.emit("cancel");
  }
}

export class ConfirmDialog {
  constructor(opts?: {
    title?: string;
    content?: string;
    okFn?: () => void;
    cancelFn?: () => void;
  }) {
    if (opts) {
      if (opts.title) {
        this.title = opts.title;
      }
      if (opts.content) {
        this.content = opts.content;
      }
      if (opts.okFn) {
        this.okFn = opts.okFn;
      }
      if (opts.cancelFn) {
        this.cancelFn = opts.cancelFn;
      }
    }
  }
  okFn: () => void;
  cancelFn: () => void;
  content = "删除该项";
  title = "确认删除";
}
