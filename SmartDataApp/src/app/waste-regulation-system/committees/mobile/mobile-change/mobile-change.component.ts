import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MessageBar } from "src/app/common/tool/message-bar";
import { SessionUser } from "src/app/common/tool/session-user";
import { MobileBindingService } from "../mobile-binding.service";
import { MobileChangeStep, MobileViewModel } from "../mobile.model";
import { MobileChangeBindBusiness } from "./mobile-change-bind.business";
import { MobileChangeCheckBusiness } from "./mobile-change-check.business";

@Component({
  selector: "app-mobile-change",
  templateUrl: "./mobile-change.component.html",
  styleUrls: ["./mobile-change.component.css"],
  providers: [
    MobileBindingService,
    MobileChangeCheckBusiness,
    MobileChangeBindBusiness,
  ],
})
export class MobileChangeComponent implements OnInit {
  session = new SessionUser();
  MobileChangeStep = MobileChangeStep;

  @Input("Step")
  step = MobileChangeStep.Check;

  @Output()
  OnBinded: EventEmitter<void> = new EventEmitter();
  @Output()
  OnCancel: EventEmitter<void> = new EventEmitter();

  constructor(
    private checkBusiness: MobileChangeCheckBusiness,
    private bindBusiness: MobileChangeBindBusiness
  ) {}

  ngOnInit() {}

  cancel() {
    this.OnCancel.emit();
  }

  async check() {
    let result = await this.checkBusiness.checkMobileNo();
    if (result) {
      this.step = MobileChangeStep.Bind;
    }
  }

  async bind() {
    let result = await this.bindBusiness.bind();
    if (result) {
    }
    this.OnBinded.emit();
  }
}
