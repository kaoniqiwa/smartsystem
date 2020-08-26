import { Component, OnInit,ViewChild, ElementRef, Input } from '@angular/core';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'hw-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.styl']
})
export class InputSearchComponent implements OnInit {
  searchInput = new FormControl('');
  @ViewChild('searchBtn')
  searchBtn:ElementRef;
  @ViewChild('input')
  input:ElementRef;
  @Input() placeholder = ''; 
  @Input() searchEvent:(text:string)=>void;
  constructor() { 
 
  }

  ngOnInit() {
    const clicks = fromEvent(this.searchBtn.nativeElement, 'click');
    const result = clicks.pipe(throttleTime(500));
    result.subscribe((x)=>{
       if(this.searchEvent)this.searchEvent(this.searchInput.value);
    });
    const keyUp=  fromEvent(this.input.nativeElement,'keyup');
    const keyUpEvent = keyUp.pipe(throttleTime(500));
    keyUpEvent.subscribe((x)=>{
      if(x['key']=="Enter"&&this.searchEvent)this.searchEvent(this.searchInput.value);
   });
  }

}