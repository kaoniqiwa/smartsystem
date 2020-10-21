import { Component, OnInit, ViewChild } from '@angular/core';
import { CameraAIModelMgrService } from "./business/camera-aimodel-mgr.service";
import { CardListPanelComponent } from '../../../../shared-module/card-list-panel/card-list-panel.component'
import { Page } from '../../../../data-core/model/page';
import { Camera } from '../../../../data-core/model/aiop/camera';

@Component({
  selector: 'app-camera-aimodel-mgr',
  templateUrl: './camera-aimodel-mgr.component.html',
  styleUrls: ['./camera-aimodel-mgr.component.styl'],
  providers: [CameraAIModelMgrService]
})
export class CameraAIModelMgrComponent implements OnInit {

  @ViewChild('cardListPanel')
  cardListPanel: CardListPanelComponent;
  close = ()=>{
    this.mgrService.aiCameraPanel.copyCameraId='';
  }
  constructor(private mgrService: CameraAIModelMgrService) { }

  init(data: Camera[], page: Page){
    this.mgrService.aiCameraPanel.cardListPanelView = data;
    this.mgrService.aiCameraPanel.underCamerasAIModels =data;
    const viewPagination = this.mgrService.aiCameraPanel.viewPaginationFn(page);
    this.mgrService.aiCameraPanel.cardListPanelV.pagination = viewPagination;
    this.mgrService.aiCameraPanel.cardListPanelV.pagination.totalRecordCount = page.TotalRecordCount;
  }
  async ngOnInit() {
     
    await this.mgrService.requestCamerasData(1, (data, page) => {
       this.init(data, page);    
    });
    await this.mgrService.requsetAIModelData(1);
    await this.mgrService.requestResourceLabels((data) => {
      this.mgrService.search.toInputTagSelect(data);
    });   
    this.mgrService.aiModelsPanel.convertFromList(this.mgrService.aiModels);
    this.mgrService.aiCameraPanel.cardListSelectedId = this.cardListPanel.selectedId;
  }

  async search() {
    this.mgrService.search.state = true;
    this.mgrService.pageIndex=1;
    await this.mgrService.requestCamerasData(1, (data, page) => {
      this.mgrService.aiCameraPanel.clearPanelView();
       this.init(data, page);     
    }); 
  }
}
