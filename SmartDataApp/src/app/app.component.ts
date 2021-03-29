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
    
    this.meta.addTag({ httpEquiv: 'cache-control', content: 'no-cache,no-store, must-revalidate' });
    this.meta.addTag({ httpEquiv: 'pragma', content: 'no-cache' });
    this.meta.addTag({ httpEquiv: 'Expires', content: '0' });
  }
}
