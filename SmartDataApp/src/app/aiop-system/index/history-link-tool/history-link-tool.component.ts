import { Component, OnInit ,Input} from '@angular/core'; 
@Component({
  selector: 'history-link-tool',
  templateUrl: './history-link-tool.component.html',
  styleUrls: ['./history-link-tool.component.styl']
})
export class HistoryLinkToolComponent implements OnInit {
  links = new Array<string>();
  constructor() {
    
    
   }

  ngOnInit() {
  
  }

}

