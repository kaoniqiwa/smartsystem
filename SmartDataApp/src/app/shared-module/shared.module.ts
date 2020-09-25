
import { NgModule } from '@angular/core'; 
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ReactiveFormsModule } from '@angular/forms'; 
import { FlexLayoutModule } from '@angular/flex-layout';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {  MatTreeModule,MatSidenavModule,MatToolbarModule ,MatButtonModule,MatMenuModule,MatButtonToggleModule
  ,MatCheckboxModule,MatSnackBarModule,MatTabsModule
} from '@angular/material';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { FormTitlePipe,TxtLenPipe } from "../common/tool/howell.pipe";
import { DateTimePickerDirective } from "../common/directive/date-time-picker.directive";
import {  EChartBarDirective} from "../common/directive/echarts/bar-directive";
import {  EChartLineDirective} from "../common/directive/echarts/line-directive";
import {  EChartPieOutDirective} from "../common/directive/echarts/pie/pie-out-directive";
import {  EChartPieInDirective} from "../common/directive/echarts/pie/pie-in-directive";
import {  EChartPieMiddleDirective} from "../common/directive/echarts/pie/pie-middle-directive";
import {  EChartProgressBarBoxDirective} from "../common/directive/echarts/pie/progress-bar-box-directive";
import {  EChartProgressBarDirective} from "../common/directive/echarts/pie/progress-bar-directive";
import { HWSPlayerDirective } from "../common/directive/wsplayer-directive";
import { TouchSpinDirective } from "../common/directive/touch-spin-directive";
import { HWPaginationDirective } from "../common/directive/pagination-directive";
import {  CardDirective } from "../common/directive/card-directive";
import { InputSearchComponent } from './input-search/input-search.component'; 
import { InputTagAreaComponent } from './input-tag-area/input-tag-area.component';
import { CustomTableComponent } from "./custom-table/custom-table.component";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";
import { InputTagSelectComponent } from './input-tag-select/input-tag-select.component';
import { CustomTreeComponent } from './custom-tree/custom-tree.component';
import { PicturesDropListComponent } from './pictures-drop-list/pictures-drop-list.component';
import { CardListPanelComponent } from './card-list-panel/card-list-panel.component'; 
import { VideoSimpleCardComponent } from './video-simple-card/video-simple-card.component';
import { StateScaleCardComponent } from './card-component/state-scale-card/state-scale-card.component';
import { CardComponent } from "./card-component/card.component";  
import { BusinessCardGridComponent } from '../waste-regulation-system/index/business-card-grid/business-card-grid.component';
import { HeaderSquareListComponent } from './header-square-list/header-square-list.component';
import { ImageThemeCardComponent } from './card-component/image-theme-card/image-theme-card.component';
import { HintCardComponent } from './card-component/hint-card/hint-card.component';
import { OrderTableCardComponent } from './card-component/order-table-card/order-table-card.component';
import { LineEChartsCardComponent } from "./card-component/line-echarts-card/line-echarts-card.component";
@NgModule({
  imports: [
    CommonModule,DragDropModule, HttpClientModule,ScrollingModule,
    InfiniteScrollModule,FlexLayoutModule,MatCheckboxModule,MatTreeModule,
    ReactiveFormsModule ,MatSidenavModule,MatToolbarModule,MatTabsModule,
    MatButtonModule,MatMenuModule,MatButtonToggleModule,MatSnackBarModule
  ],
  declarations: [
    DateTimePickerDirective,
    HWPaginationDirective,TouchSpinDirective,EChartBarDirective,EChartLineDirective ,HWSPlayerDirective,CardDirective
    ,EChartPieOutDirective,EChartPieInDirective,EChartPieMiddleDirective ,EChartProgressBarBoxDirective,EChartProgressBarDirective
    ,FormTitlePipe,TxtLenPipe,
  InputSearchComponent,CustomTableComponent, ConfirmDialogComponent,
  InputTagAreaComponent,
  InputTagSelectComponent,
  CustomTreeComponent,
  PicturesDropListComponent,
  CardListPanelComponent, VideoSimpleCardComponent, StateScaleCardComponent,CardComponent,BusinessCardGridComponent, HeaderSquareListComponent, ImageThemeCardComponent, HintCardComponent, OrderTableCardComponent
,LineEChartsCardComponent  
],
  exports: [
    InfiniteScrollModule,MatTreeModule,DragDropModule, HttpClientModule,ScrollingModule,
    MatSidenavModule,MatToolbarModule,FlexLayoutModule,MatCheckboxModule,ReactiveFormsModule,
    MatButtonModule,MatMenuModule,MatButtonToggleModule,MatSnackBarModule,MatTabsModule
    ,DateTimePickerDirective
    ,HWPaginationDirective,TouchSpinDirective,EChartBarDirective,EChartLineDirective,HWSPlayerDirective,CardDirective
     ,EChartPieOutDirective,EChartPieInDirective,EChartPieMiddleDirective ,EChartProgressBarBoxDirective,EChartProgressBarDirective
    ,FormTitlePipe,TxtLenPipe
    ,InputSearchComponent,InputTagAreaComponent,CustomTableComponent,ConfirmDialogComponent
    ,InputTagSelectComponent,CustomTreeComponent,PicturesDropListComponent,CardListPanelComponent
    ,VideoSimpleCardComponent,StateScaleCardComponent,CardComponent,BusinessCardGridComponent
    ,HeaderSquareListComponent,ImageThemeCardComponent,HintCardComponent,OrderTableCardComponent
    ,LineEChartsCardComponent
  ],
  providers: [DatePipe,
   ],
   entryComponents: [CardComponent,ImageThemeCardComponent,StateScaleCardComponent,OrderTableCardComponent,
    BusinessCardGridComponent,HeaderSquareListComponent,HintCardComponent,LineEChartsCardComponent]
  ,
})
export class SharedModule { }
