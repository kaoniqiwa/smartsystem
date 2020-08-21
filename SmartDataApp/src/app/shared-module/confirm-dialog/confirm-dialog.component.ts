import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hw-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.styl']
})
export class ConfirmDialogComponent implements OnInit {

 @Input() dialog = new ConfirmDialog();
  constructor() { }

  ngOnInit() {
  }

  okBtnClick(){
     if(this.dialog.okFn)this.dialog.okFn();
  }
  cancelBtnClick(){
    if(this.dialog.cancelFn)this.dialog.cancelFn();
  }

}

export class ConfirmDialog{
    okFn:()=>void;
    cancelFn:()=>void;
    content = '删除该项';
}
