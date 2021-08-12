import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "../shared-module/shared.module";
import { AIModelFormComponent } from "./ai-models/aimodel-form/aimodel-form.component";
import { AIModelsMgrComponent } from "./ai-models/aimodels-mgr/aimodels-mgr.component";
import { AIOPSystemRoutingModule } from "./aiop-system-routing.module";
import { AIModelEventComponent } from "./event-history/aimodel-event/aimodel-event.component";
import { DeployCameraComponent } from "./garbage-station/deploy-camera/deploy-camera.component";
import { DivisionManageComponent } from "./garbage-station/division-manage/division-manage.component";
import { DivisionStationTreeComponent } from "./garbage-station/division-station-tree/division-station-tree.component";
import { FullTrashCanComponent } from "./garbage-station/full-trash-can/full-trash-can.component";
import { GarbageStationFormComponent } from "./garbage-station/garbage-station-form/garbage-station-form.component";
import { GarbageStationManageComponent } from "./garbage-station/garbage-station-manage/garbage-station-manage.component";
import { GarbageStationComponent } from "./garbage-station/garbage-station/garbage-station.component";
import { ConfirmComponent } from "./garbage-station/map-deploy/confirm/confirm.component";
import { CoordinateManageComponent } from "./garbage-station/map-deploy/coordinate-manage/coordinate-manage.component";
import { MapDeployComponent } from "./garbage-station/map-deploy/map-deploy.component";
import { RegionCameraTreeComponent } from "./garbage-station/region-camera-tree/region-camera-tree.component";
import { StationChartComponent } from "./garbage-station/station-chart/station-chart.component";
import { TrashIconsListComponent } from "./garbage-station/station-chart/trash-icons-list/trash-icons-list.component";
import { AlarmPointToolComponent } from "./index/alarm-point-tool/alarm-point-tool.component";
import { HistoryLinkToolComponent } from "./index/history-link-tool/history-link-tool.component";
import { IndexComponent } from "./index/index.component";
import { SideNavMenuComponent } from "./index/side-nav-menu/side-nav-menu.component";
import { PlatformFormComponent } from "./platform/platform-form/platform-form.component";
import { PlatformMgrComponent } from "./platform/platform-mgr/platform-mgr.component";
import { RegionFormComponent } from "./region/region-form/region-form.component";
import { RegionMgrComponent } from "./region/region-mgr/region-mgr.component";
import { CameraAIModelMgrComponent } from "./resources/camera/camera-aimodel-mgr/camera-aimodel-mgr.component";
import { CameraFormComponent } from "./resources/camera/camera-form/camera-form.component";
import { CameraMgrComponent } from "./resources/camera/camera-mgr/camera-mgr.component";
import { CameraRegionMoveComponent } from "./resources/camera/camera-region-move/camera-region-move.component";
import { RegionCameraCopyComponent } from "./resources/camera/region-camera-copy/region-camera-copy.component";
import { EncodeDeviceFormComponent } from "./resources/encode-device/encode-device-form/encode-device-form.component";
import { EncodeDeviceMgrComponent } from "./resources/encode-device/encode-device-mgr/encode-device-mgr.component";
import { SRServerFormComponent } from "./sr-server/sr-service-form/srserver-form.component";
import { SRServersMgrComponent } from "./sr-server/srservers-mgr/srservers-mgr.component";
import { FormsModule } from "@angular/forms";
@NgModule({
  imports: [CommonModule, AIOPSystemRoutingModule, SharedModule, FormsModule],
  declarations: [
    IndexComponent,
    AlarmPointToolComponent,
    SideNavMenuComponent,
    HistoryLinkToolComponent,
    CameraFormComponent,
    CameraMgrComponent,
    EncodeDeviceMgrComponent,
    EncodeDeviceFormComponent,
    RegionMgrComponent,
    RegionFormComponent,
    PlatformMgrComponent,
    PlatformFormComponent,
    AIModelsMgrComponent,
    AIModelFormComponent,
    CameraAIModelMgrComponent,
    SRServersMgrComponent,
    SRServerFormComponent,
    RegionCameraCopyComponent,
    DeployCameraComponent,
    TrashIconsListComponent,
    MapDeployComponent,
    CameraRegionMoveComponent,
    GarbageStationManageComponent,
    StationChartComponent,
    DivisionStationTreeComponent,
    RegionCameraTreeComponent,
    GarbageStationComponent,
    GarbageStationFormComponent,
    FullTrashCanComponent,
    AIModelEventComponent,
    CameraAIModelMgrComponent,
    SRServersMgrComponent,
    SRServerFormComponent,
    RegionCameraCopyComponent,
    DeployCameraComponent,
    TrashIconsListComponent,
    CoordinateManageComponent,
    ConfirmComponent,
    MapDeployComponent,
    CameraRegionMoveComponent,
    GarbageStationManageComponent,
    StationChartComponent,
    DivisionStationTreeComponent,
    RegionCameraTreeComponent,
    GarbageStationComponent,
    GarbageStationFormComponent,
    FullTrashCanComponent,
    DivisionManageComponent,
  ],
  exports: [],
})
export class AIOPSystemModule {}
