import { Component, OnInit } from "@angular/core";
import { TimeToolService } from "../../common/tool/time.service";
@Component({
  selector: "app-time-tool",
  templateUrl: "./time-tool.component.html",
  styleUrls: ["./time-tool.component.css"],
  providers: [TimeToolService],
})
export class TimeToolComponent implements OnInit {
  constructor(private service: TimeToolService) {
    this.service.runTime();
  }

  ngOnInit() {}
}
