import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';


@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  @Input()
  message: string;

  @Output() CancelClickedEvent: EventEmitter<string> = new EventEmitter();

  @Output() YesClickedEvent: EventEmitter<string> = new EventEmitter();


  @ViewChild('confirm')
  confirm: ElementRef;

  private _display = false;

  get display(): boolean {
    return this._display;
  }

  @Input()
  set display(val: boolean) {
    this._display = val;
    let value = 'none';
    if (val) {
      value = '';
    }
    this.confirm.nativeElement['style'].display = value;
  }


  constructor() {

  }

  OnYesClicked() {
    if (this.YesClickedEvent) {
      this.YesClickedEvent.emit('');
    }
    this.display = false;
  }

  OnCancelClicked() {
    if (this.CancelClickedEvent) {
      this.CancelClickedEvent.emit('');
    }
    this.display = false;
  }



  ngOnInit(): void {
    this.display = false;
  }



}
