import { Component, OnInit, ViewChild } from '@angular/core';
import { CameraAIModelMgrService } from "./business/camera-aimodel-mgr.service";
import { CardListPanelComponent } from '../../../../shared-module/card-list-panel/card-list-panel.component'
import { timeStamp } from 'console';
@Component({
  selector: 'app-camera-aimodel-mgr',
  templateUrl: './camera-aimodel-mgr.component.html',
  styleUrls: ['./camera-aimodel-mgr.component.styl'],
  providers: [CameraAIModelMgrService]
})
export class CameraAIModelMgrComponent implements OnInit {

  @ViewChild('cardListPanel')
  cardListPanel: CardListPanelComponent;
  constructor(private mgrService: CameraAIModelMgrService) { }

  async ngOnInit() {
    await this.mgrService.requestCamerasData(1);
    await this.mgrService.requsetAIModelData(1);
    this.mgrService.panelControl.convertToList(this.mgrService.cameras);
    this.mgrService.panelControl.convertCardList(this.mgrService.cameras);
    this.mgrService.panelControl.convertFromList(this.mgrService.aiModels);
    this.mgrService.panelControl.cardListSelectedId = this.cardListPanel.selectedId;
  }

}
