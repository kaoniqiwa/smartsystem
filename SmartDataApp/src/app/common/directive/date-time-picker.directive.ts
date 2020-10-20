import { Directive,ElementRef ,AfterContentInit,Input} from '@angular/core'; 
declare var $: any;

@Directive({
  selector: '[DateTimePicker]'
})
export class DateTimePickerDirective implements AfterContentInit{
  private ele: any;

  @Input('format') format='yyyy-mm-dd';
  @Input('defaultVal') defaultVal='';
  @Input('changeDate') changeDate:(val:any)=>void;
  @Input('startView') startView=2;
  @Input('minView') minView=2;
  constructor(e: ElementRef) { 
    this.ele = e.nativeElement; 
  }

  ngAfterContentInit(){ 
    $(this.ele).datetimepicker({
      format: this.format,
      weekStart: 1,
      autoclose: true,
      startView: this.startView,
      minView: this.minView,
      forceParse: false,
      language: 'zh-CN',
      initialDate: this.defaultVal ? this.defaultVal : new Date(),
    }).on('changeDate',  (ev)=> {
      if(this.changeDate)this.changeDate(ev.date);
    });
    $(this.ele).val(this.defaultVal);
  }
}
