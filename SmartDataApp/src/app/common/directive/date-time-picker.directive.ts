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

  set setStartDate(val:string|Date){
    $(this.ele).datetimepicker('update'); 
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
    }).on('show', (ev) => {
      const dayDom = $('.datetimepicker-days');
      dayDom.find('.week-tr').removeClass('week-tr');
    });
    $(this.ele).val(this.defaultVal);
  }

  reInit(startView: number, minView: number, format: string, defaultVal: string, week?: boolean) {
   
    $(this.ele).val(''); 
    $(this.ele).datetimepicker('remove').off('changeDate').off('show');
    if (week) {  
      $(this.ele).datetimepicker({
        format: format,
        weekStart: 1,
        autoclose: true,
        startView: startView,
        minView: minView,
        language: 'zh-CN',
        forceParse: false,
        initialDate: defaultVal ? defaultVal.dateTimePickerZC() : new Date(),
      }).on('changeDate', (ev) => { 
      
          if (this.changeDate) this.changeDate(ev.date);
          const week_ = OneWeekDate(ev.date);
          $(this.ele).val(`${this.datePipe.transform(week_.monday, 'yyyy年MM月dd日')} 至 ${this.datePipe.transform(week_.sunday, 'yyyy年MM月dd日')}`);
     
      }).on('show', (ev) => {
      
          const dayDom = $('.datetimepicker-days');
          dayDom.find('.week-tr').removeClass('week-tr');
          dayDom.addClass('week');
          var tbody = dayDom.find('tbody'),
            trs = tbody.find('tr'),
            d = this.datePipe.transform(ev.date, 'dd');
          d = parseInt(d) + '';console.log(d);
          
          $(trs).each(function (index: number, element: any) {
            var tds = $(element).children();
            $(tds).each(function (i: number, el: any) {
              if ($(el).hasClass('old') == false && $(el).hasClass('new') == false && $(el).text() == d) {
                $(el).parent().addClass('week-tr');
              }
            });
          });
      });   
      const week_ = OneWeekDate(new Date(defaultVal.dateTimePickerZC())); 
      $(this.ele).val(`${this.datePipe.transform(week_.monday, 'yyyy年MM月dd日')} 至 ${this.datePipe.transform(week_.sunday, 'yyyy年MM月dd日')}`);
    }
    else {
      $(this.ele).datetimepicker({
        format: format,
        weekStart: 1,
        autoclose: true,
        startView: startView,
        minView: minView,
        language: 'zh-CN',
        forceParse: false,
        initialDate: defaultVal ? defaultVal.dateTimePickerZC() : new Date(),
      }).on('changeDate', (ev) => {
        if (this.changeDate) this.changeDate(ev.date);
      }).on('show', (ev) => {
        const dayDom = $('.datetimepicker-days');
        dayDom.find('.week-tr').removeClass('week-tr');
      });
      $(this.ele).val(defaultVal);
    }
  }
}

@Directive({
  selector: '[DateTimePickerMirror]'
})
export class DateTimePickerMirrorDirective extends DateTimePickerDirective{}

