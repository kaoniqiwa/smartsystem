
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
import { InputSearchComponent } from './input-search/input-search.component'; 
import { InputTagAreaComponent } from './input-tag-area/input-tag-area.component';
import { CustomTableComponent } from "./custom-table/custom-table.component";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";
import { InputTagSelectComponent } from './input-tag-select/input-tag-select.component';
import { CustomTreeComponent } from './custom-tree/custom-tree.component';
import { PicturesDropListComponent } from './pictures-drop-list/pictures-drop-list.component';
import { CardListPanelComponent } from './card-list-panel/card-list-panel.component'; 
import { VideoSimpleCardComponent } from './video-simple-card/video-simple-card.component'
@NgModule({
  imports: [
    CommonModule,DragDropModule, HttpClientModule,ScrollingModule,
    InfiniteScrollModule,FlexLayoutModule,MatCheckboxModule,MatTreeModule,
    ReactiveFormsModule ,MatSidenavModule,MatToolbarModule,MatTabsModule,
    MatButtonModule,MatMenuModule,MatButtonToggleModule,MatSnackBarModule
  ],
  declarations: [
    HWPaginationDirective,TouchSpinDirective,EChartBarDirective,EChartLineDirective ,HWSPlayerDirective
    ,EChartPieOutDirective,EChartPieInDirective,EChartPieMiddleDirective ,EChartProgressBarBoxDirective,EChartProgressBarDirective
    ,FormTitlePipe,TxtLenPipe,
  InputSearchComponent,CustomTableComponent, ConfirmDialogComponent,
  InputTagAreaComponent,
  InputTagSelectComponent,
  CustomTreeComponent,
  PicturesDropListComponent,
  CardListPanelComponent, VideoSimpleCardComponent
  ],
  exports: [
    InfiniteScrollModule,MatTreeModule,DragDropModule, HttpClientModule,ScrollingModule,
    MatSidenavModule,MatToolbarModule,FlexLayoutModule,MatCheckboxModule,ReactiveFormsModule,
    MatButtonModule,MatMenuModule,MatButtonToggleModule,MatSnackBarModule,MatTabsModule
    ,HWPaginationDirective,TouchSpinDirective,EChartBarDirective,EChartLineDirective,HWSPlayerDirective
     ,EChartPieOutDirective,EChartPieInDirective,EChartPieMiddleDirective ,EChartProgressBarBoxDirective,EChartProgressBarDirective
    ,FormTitlePipe,TxtLenPipe
    ,InputSearchComponent,InputTagAreaComponent,CustomTableComponent,ConfirmDialogComponent
    ,InputTagSelectComponent,CustomTreeComponent,PicturesDropListComponent,CardListPanelComponent
    ,VideoSimpleCardComponent
  ],
  providers: [DatePipe,
   ],
  entryComponents: []
  ,
})
export class SharedModule { }
