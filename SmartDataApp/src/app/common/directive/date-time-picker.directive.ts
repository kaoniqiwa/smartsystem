import { Directive, ElementRef, AfterContentInit, Input } from '@angular/core';
import "../../common/string/hw-string";
import { DatePipe } from "@angular/common";
import { OneWeekDate } from "../tool/tool.service";
declare var $: any;

@Directive({
  selector: '[DateTimePicker]'
})
export class DateTimePickerDirective implements AfterContentInit {
  private ele: any;

  @Input('format') format = 'yyyy-mm-dd';
  @Input('defaultVal') defaultVal = '';
  @Input('changeDate') changeDate: (val: any) => void;
  @Input('startView') startView = 2;
  @Input('minView') minView = 2;
  constructor(e: ElementRef, private datePipe: DatePipe) {
    this.ele = e.nativeElement;
  }

  ngAfterContentInit() {
    $(this.ele).datetimepicker({
      format: this.format,
      weekStart: 1,
      autoclose: true,
      startView: this.startView,
      minView: this.minView,
      forceParse: false,
      language: 'zh-CN',
      initialDate: this.defaultVal ? this.defaultVal.dateTimePickerZC() : new Date(),
    }).on('changeDate', (ev) => {
      if (this.changeDate) this.changeDate(ev.date);
    });
    $(this.ele).val(this.defaultVal);
  }

  reInit(startView: number, minView: number, format: string, defaultVal: string, week?: boolean) {
    $(this.ele).val('');
    $(this.ele).datetimepicker('remove');
    if (week){
      $(this.ele).datetimepicker({
        format: format,
        weekStart: 1,
        autoclose: true,
        startView: startView,
        minView: minView,
        language: 'zh-CN',
        forceParse: false,
      }).on('changeDate', (ev) => {
        if (this.changeDate) this.changeDate(ev.date);
      }).on('show', (ev) => {
        const dayDom = $('.datetimepicker-days');
        dayDom.addClass('week');
        var tbody = dayDom.find('tbody'),
          trs = tbody.find('tr'),
          d = this.datePipe.transform(ev.date,'dd');
        d = parseInt(d) + '';
        $(trs).each(function (index:number, element:any) {
          var tds = $(element).children();
        
          $(tds).each(function (i:number, el:any) {
            if ($(el).hasClass('old') == false && $(el).hasClass('new') == false && $(el).text() == d) {
              $(el).parent().addClass('week-tr');
            }
          });

        })
      });
      const week = OneWeekDate(new Date(defaultVal.dateTimePickerZC())); 
      $(this.ele).val(`${this.datePipe.transform(week.monday,'yyyy年MM月dd日')} 至 ${this.datePipe.transform(week.sunday,'yyyy年MM月dd日')}`);
    }
    else{
      $(this.ele).datetimepicker({
        format: format,
        weekStart: 1,
        autoclose: true,
        startView: startView,
        minView: minView,
        language: 'zh-CN',
        forceParse: false,
      }).on('changeDate', (ev) => {
        if (this.changeDate) this.changeDate(ev.date);
      });
      $(this.ele).val(defaultVal);
    }
  }
}
