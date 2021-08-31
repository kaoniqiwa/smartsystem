import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IndexComponent } from "./index/index.component";
import { CameraMgrComponent } from "./resources/camera/camera-mgr/camera-mgr.component";
import { EncodeDeviceMgrComponent } from "./resources/encode-device/encode-device-mgr/encode-device-mgr.component";
import { RegionMgrComponent } from "./region/region-mgr/region-mgr.component";
import { PlatformMgrComponent } from "./platform/platform-mgr/platform-mgr.component";
import { AIModelsMgrComponent } from "./ai-models/aimodels-mgr/aimodels-mgr.component";
import { CameraAIModelMgrComponent } from "./resources/camera/camera-aimodel-mgr/camera-aimodel-mgr.component";
import { SRServersMgrComponent } from "./sr-server/srservers-mgr/srservers-mgr.component";
import { DeployCameraComponent } from "./garbage-station/deploy-camera/deploy-camera.component";
import { GarbageStationManageComponent } from "./garbage-station/garbage-station-manage/garbage-station-manage.component";
import { GarbageStationComponent } from "./garbage-station/garbage-station/garbage-station.component";
import { MapDeployComponent } from "./garbage-station/map-deploy/map-deploy.component";
import { FullTrashCanComponent } from "./garbage-station/full-trash-can/full-trash-can.component";
import { AIModelEventComponent } from "./event-history/aimodel-event/aimodel-event.component";
import { IllegalDropEventSummaryComponent } from "../shared-module/business-component/event-history/illegal-drop-event-summary/illegal-drop-event-summary.component";
import { DivisionManageComponent } from "./garbage-station/division-manage/division-manage.component";

const routes: Routes = [
  {
    path: "",
    component: IndexComponent,
    children: [
      {
        path: "resources",
        children: [
          { path: "camera-mgr", component: CameraMgrComponent },
          { path: "camera-ai-model-mgr", component: CameraAIModelMgrComponent },
          { path: "encode-device-mgr", component: EncodeDeviceMgrComponent },
        ],
      },
      {
        path: "regions",
        children: [{ path: "region-mgr", component: RegionMgrComponent }],
      },
      {
        path: "platform",
        children: [
          {
            path: "",
            redirectTo: "platform-mgr",
            pathMatch: "full",
          },
          { path: "platform-mgr", component: PlatformMgrComponent },
          { path: "sr-service-mgr", component: SRServersMgrComponent },
        ],
      },
      {
        path: "ai-models",
        children: [{ path: "ai-models-mgr", component: AIModelsMgrComponent }],
      },
      {
        path: "event-history",
        children: [
          {
            path: "",
            redirectTo: "illegal-drop-event",
            pathMatch: "full",
          },
          {
            path: "illegal-drop-event",
            component: IllegalDropEventSummaryComponent,
            data: {
              p: "1",
            },
          },
          { path: "ai-model-event", component: AIModelEventComponent },
        ],
      },
      {
        path: "garbage-station",
        children: [
          {
            path: "",
            redirectTo: "index",
            pathMatch: "full",
          },
          { path: "map-deploy", component: MapDeployComponent },
          { path: "deploy-camera", component: DeployCameraComponent },
          {
            path: "garbage-station-manage",
            component: GarbageStationManageComponent,
          },
          { path: "index", component: DivisionManageComponent },
          { path: "full-trashcan", component: FullTrashCanComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AIOPSystemRoutingModule {}
