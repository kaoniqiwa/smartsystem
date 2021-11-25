import {
  Directive,
  ElementRef,
  AfterContentInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
declare var $: any;

@Directive({
  selector: "[TimePicker]",
})
export class TimePickerDirective
  implements AfterContentInit, OnDestroy, OnChanges
{
  private ele: any;

  @Input("date") date: Date;
  // @Input('changeDate') changeDate: (val: any) => void;
  @Output("changeDate")
  changeDate: EventEmitter<Date> = new EventEmitter();

  constructor(e: ElementRef) {
    this.ele = e.nativeElement;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.init();
  }
  ngOnDestroy(): void {}

  ngAfterContentInit() {}

  init() {
    $(this.ele).timepicker({
      minuteStep: 1,
      showSeconds: true,
      showMeridian: false,
      defaultTime:
        this.date.getHours() + ":" + this.date.getMinutes() + ":" + "00",
    });
  }
}

@Directive({
  selector: "[TimePickerMirror]",
})
export class TimePickerMirrorDirective extends TimePickerDirective {}
