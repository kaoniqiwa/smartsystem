import { Component, Input, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { SessionUser } from "src/app/common/tool/session-user";
import { Division } from "src/app/data-core/model/waste-regulation/division";

@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.css"],
})
export class ToolbarComponent implements OnInit {
  @Input()
  Committees?: Division;

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
      // console.log("HideButton:", param);
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
}
