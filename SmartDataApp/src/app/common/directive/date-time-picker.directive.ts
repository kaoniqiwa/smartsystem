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
  constructor(e: ElementRef) { 
    this.ele = e.nativeElement; 
  }

  ngAfterContentInit(){ 
    $(this.ele).datetimepicker({
      format: this.format,
      weekStart: 1,
      autoclose: true,
      startView: 2,
      minView: 2,
      forceParse: false,
      language: 'zh-CN',
      initialDate: this.defaultVal ? this.defaultVal : new Date(),
    }).on('changeDate',  (ev)=> {
      if(this.changeDate)this.changeDate(ev.date);
    });
    $(this.ele).val(this.defaultVal);
  }
}
