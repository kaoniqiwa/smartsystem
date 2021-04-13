import { Component } from '@angular/core'; 
import { Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent {
  // title = 'SmartDataApp'; 
  constructor(  private meta: Meta){
    
    this.meta.addTag({ httpEquiv: 'cache-control', content: 'no-cache,no-store,max-age=0, must-revalidate' });
    this.meta.addTag({ httpEquiv: 'pragma', content: 'no-cache' });
    this.meta.addTag({ httpEquiv: 'Expires', content: 'Tue, 13 Apr 2021 11:35:00  GMT' });
  //   console.log(new Date('2021-4-13 11:33').toString());//Tue, 13 Apr 2021 11:33:00  GMT  Fri, 12 Jan 2001 18:18:18 GMT
     //Tue Apr 13 2021 11:33:00 
 
    
  }
}
