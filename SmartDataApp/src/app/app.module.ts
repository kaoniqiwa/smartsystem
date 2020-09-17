import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { AppInterceptorServiceService } from "./data-core/repuest/app-interceptor-service.service";
import { SharedModule } from "./shared-module/shared.module";
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,BrowserAnimationsModule,HttpClientModule,
      AppRoutingModule,SharedModule
    
  ],
  providers: [ {provide:HTTP_INTERCEPTORS,useClass:AppInterceptorServiceService,multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
