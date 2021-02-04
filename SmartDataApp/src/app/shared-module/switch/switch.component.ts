import { Component, OnInit,Input } from '@angular/core'; 
@Component({
  selector: 'hw-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css']
})
export class SwitchComponent implements OnInit {

  @Input() onFn:(on:boolean)=>void;

  @Input() on = false;
  constructor() { }

  ngOnInit() {
    
  }

  btnClick(){
    this.on =!this.on; 
    if(this.onFn)this.onFn(this.on);
  }
}
