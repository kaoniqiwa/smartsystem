import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { SessionUser } from "src/app/common/tool/session-user";
import { Division } from "src/app/data-core/model/waste-regulation/division";
import {
  CommitteesToolbarNotifyViewModel,
  NotifyStatus,
} from "./committees-toolbar.model";

@Component({
  selector: "app-committees-toolbar",
  templateUrl: "./committees-toolbar.component.html",
  styleUrls: ["./committees-toolbar.component.css"],
})
export class ToolbarComponent implements OnInit {
  NotifyStatus = NotifyStatus;

  @Input()
  Committees?: Division;

  @Input()
  Notify?: CommitteesToolbarNotifyViewModel;

  @Output()
  OnChangePasswordClick = new EventEmitter();
  @Output()
  OnChangeMobileClick = new EventEmitter();

  onChangePasswordClick() {
    this.OnChangePasswordClick.emit();
  }
  onChangeMobileClick() {
    this.OnChangeMobileClick.emit();
  }

  HideButton: boolean = false;
  HideTitlebar: boolean = false;

  user = new SessionUser();

  get title(): string {
    return this.titleService.getTitle();
  }

  constructor(
    private titleService: Title,
    private activatedRoute: ActivatedRoute
  ) {
    titleService.setTitle("生活垃圾分类全程监管平台");
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((param) => {
      for (const key in param) {
        if (key.toLowerCase() == "hidebutton") {
          this.HideButton = JSON.parse(param[key]);
        }
        if (key.toLowerCase() == "hidetitlebar") {
          this.HideTitlebar = JSON.parse(param[key]);
        }
      }
    });
  }

  logOut() {
    this.user.clear();
  }

  notifyClick(event: Event) {
    if (this.Notify && this.Notify.onClick) {
      this.Notify.onClick();
    }
  }
}
