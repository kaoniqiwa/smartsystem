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
import "../../common/string/hw-string";
import { DatePipe } from "@angular/common";
import { OneWeekDate } from "../tool/tool.service";
declare var $: any;

@Directive({
  selector: "[DateTimePicker]",
})
export class DateTimePickerDirective
  implements AfterContentInit, OnDestroy, OnChanges
{
  private ele: any;
  @Input("format") format = "yyyy-mm-dd";
  @Input("defaultVal") defaultVal: Date | string = "";
  // @Input('changeDate') changeDate: (val: any) => void;
  @Input("startView") startView = 2;
  @Input("minView") minView = 2;
  @Output("changeDate")
  changeDate: EventEmitter<Date> = new EventEmitter();

  constructor(e: ElementRef, private datePipe: DatePipe) {
    this.ele = e.nativeElement;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.reInit(this.startView, this.minView, this.format, this.defaultVal);
  }
  ngOnDestroy(): void {
    $(this.ele).datetimepicker("remove");
  }

  set setStartDate(val: string | Date) {
    $(this.ele).datetimepicker("update");
  }
  ngAfterContentInit() {
    $(this.ele)
      .datetimepicker({
        format: this.format,
        weekStart: 1,
        autoclose: true,
        startView: this.startView,
        minView: this.minView,
        forceParse: false,
        language: "zh-CN",
        initialDate: this.defaultVal
          ? this.defaultVal instanceof Date
            ? this.datePipe.transform(this.defaultVal, "yyyy-MM-dd")
            : this.defaultVal.dateTimePickerZC()
          : new Date(),
      })
      .on("changeDate", (ev) => {
        this.changeDate.emit(ev.date);
      })
      .on("show", (ev) => {
        const dayDom = $(".datetimepicker-days");
        dayDom.find(".week-tr").removeClass("week-tr");
      });
    $(this.ele).val(
      this.defaultVal instanceof Date
        ? this.datePipe.transform(this.defaultVal, this.format)
        : this.defaultVal
    );
  }

  reInit(
    startView: number,
    minView: number,
    format: string,
    defaultVal: Date | string,
    week?: boolean
  ) {
    $(this.ele).val("");
    $(this.ele).datetimepicker("remove").off("changeDate").off("show");
    if (week) {
      $(this.ele)
        .datetimepicker({
          format: format,
          weekStart: 1,
          autoclose: true,
          startView: startView,
          minView: minView,
          language: "zh-CN",
          forceParse: false,
          initialDate: defaultVal
            ? defaultVal instanceof Date
              ? this.datePipe.transform(this.defaultVal, "yyyy-MM-dd")
              : defaultVal.dateTimePickerZC()
            : new Date(),
        })
        .on("changeDate", (ev) => {
          this.changeDate.emit(ev.date);
          const week_ = OneWeekDate(ev.date);
          $(this.ele).val(
            `${this.datePipe.transform(
              week_.monday,
              "yyyy年MM月dd日"
            )} 至 ${this.datePipe.transform(week_.sunday, "yyyy年MM月dd日")}`
          );
        })
        .on("show", (ev) => {
          const dayDom = $(".datetimepicker-days");
          dayDom.find(".week-tr").removeClass("week-tr");
          dayDom.addClass("week");
          var tbody = dayDom.find("tbody"),
            trs = tbody.find("tr"),
            d = this.datePipe.transform(ev.date, "dd");
          d = parseInt(d) + ""; //console.log(d);

          $(trs).each(function (index: number, element: any) {
            var tds = $(element).children();
            $(tds).each(function (i: number, el: any) {
              if (
                $(el).hasClass("old") == false &&
                $(el).hasClass("new") == false &&
                $(el).text() == d
              ) {
                $(el).parent().addClass("week-tr");
              }
            });
          });
        });
      const week_ = OneWeekDate(
        new Date(
          defaultVal instanceof Date
            ? this.datePipe.transform(this.defaultVal, "yyyy-MM-dd")
            : defaultVal.dateTimePickerZC()
        )
      );
      $(this.ele).val(
        `${this.datePipe.transform(
          week_.monday,
          "yyyy年MM月dd日"
        )} 至 ${this.datePipe.transform(week_.sunday, "yyyy年MM月dd日")}`
      );
    } else {
      $(this.ele)
        .datetimepicker({
          format: format,
          weekStart: 1,
          autoclose: true,
          startView: startView,
          minView: minView,
          language: "zh-CN",
          forceParse: false,
          initialDate: defaultVal
            ? defaultVal instanceof Date
              ? this.datePipe.transform(this.defaultVal, "yyyy-MM-dd")
              : defaultVal.dateTimePickerZC()
            : new Date(),
        })
        .on("changeDate", (ev) => {
          if (this.changeDate) this.changeDate.emit(ev.date);
        })
        .on("show", (ev) => {
          const dayDom = $(".datetimepicker-days");
          dayDom.find(".week-tr").removeClass("week-tr");
        });
      $(this.ele).val(
        this.defaultVal instanceof Date
          ? this.datePipe.transform(this.defaultVal, this.format)
          : this.defaultVal
      );
    }
  }
}

@Directive({
  selector: "[DateTimePickerMirror]",
})
export class DateTimePickerMirrorDirective extends DateTimePickerDirective {}
