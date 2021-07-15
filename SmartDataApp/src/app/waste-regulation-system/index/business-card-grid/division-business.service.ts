import { Injectable, EventEmitter } from "@angular/core";
import { ViewsModel } from "../../../common/abstract/base-view";
import { BusinessParameter } from "../../../common/interface/IBusiness";
import { BaseBusinessRefresh } from "../../../common/tool/base-business-refresh";
import { EventDropHistory } from "./business/event-drop-history/event-drop-history";
import { EventDropOrder } from "./business/event-drop-order/event-drop-order";
import { DivisionTypeEnum, EnumHelper } from "../../../common/tool/enum-helper";
import { MessageBar } from "../../../common/tool/message-bar";
import { HeaderSquareListComponent } from "../../../shared-module/header-square-list/header-square-list.component";
import { BusinessViewComponetConstructor } from "./business-card-slot.service";
import { AMapComponent } from "../amap/amap.component";
import { CameraRequestService } from "../../../data-core/repuest/resources.service";
import { OrderTableCardComponent } from "../../../shared-module/card-component/order-table-card/order-table-card.component";
import { StateScaleCardComponent } from "../../../shared-module/card-component/state-scale-card/state-scale-card.component";
import { ImageThemeCardComponent } from "../../../shared-module/card-component/image-theme-card/image-theme-card.component";
import { GalleryRollPageComponent } from "../../../shared-module/card-component/gallery-roll-page/gallery-roll-page.component";
import { Gallery } from "../../../shared-module/card-component/gallery-roll-page/gallery-roll-page";
import { HintCardComponent } from "../../../shared-module/card-component/hint-card/hint-card.component";
import {
  Hint,
  HintTag,
} from "../../../shared-module/card-component/hint-card/hint";
import { FillMode } from "../../../shared-module/business-component/event-history/illegal-drop-event-history/business/event-table.service";
import { ColorEnum } from "../../../shared-module/card-component/card-content-factory";
import { CameraStateTableEnum } from "../../../shared-module/business-component/garbage-station-cameras/business/camera-table.service";
import { GarbageStationRequestService } from "../../../data-core/repuest/garbage-station.service";
import { MediumPicture } from "../../../data-core/url/aiop/resources";
import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
import { GetEventRecordsParams } from "../../../data-core/model/waste-regulation/illegal-drop-event-record";
import { TheDayTime } from "../../../common/tool/tool.service";
import { ListAttribute } from "../../../common/tool/table-form-helper";
import { EventRequestService } from "../../../data-core/repuest/Illegal-drop-event-record";
import {
  targetPosition,
  domSize,
} from "../../../common/tool/jquery-help/jquery-help";
import { isBoolean, isString } from "util";
import { BusinessEventTypeEnum } from "../../../shared-module/business-component/event-history/business-event-type";
import { ComponentService } from "../../../shared-module/component-service";
import { SessionUser } from "../../../common/tool/session-user";
import { EventType } from "src/app/data-core/model/waste-regulation/event-number";
import { Language } from "src/app/common/tool/language";
@Injectable({
  providedIn: "root",
})
export class DivisionBusinessService {
  componets = new Array<BusinessViewComponetConstructor>();
  galleryRollPage: BusinessViewComponetConstructor;
  childrenDivisionIds: string[];
  aMap: AMapComponent;
  /**区划 */
  illegalDropMode: FillMode;
  mixedIntoMode: FillMode;
  fullGarbageStationIntoMode: FillMode;
  fullStationsView = false;
  stationListView = false;
  eventHistoryView = false;
  stationCameraView = false;
  inspectionView = false;
  inspectionViewMaxPostion = false;
  inspectionViewVideo = false;
  vsClassStatistic = false;
  /**投放点投放滞留 */
  stationStrandedView = false;
  inspectionSize = { width: 0, height: 0, left: 0, top: 0 };
  /**更正区划id 视图显示当前 */
  nspectionParam: (val: string) => void;
  stationCameraStateTable: CameraStateTableEnum;
  divisionsId = "";
  /** 统计页面默认搜索图表 */
  illegalDropChartDefault = new EventEmitter<any>();
  /**事件卡片 参数记录 */
  eventDropCard: {
    eventType: EventType;
    divisionType: DivisionTypeEnum;
    dropDivisionType: DivisionTypeEnum;
  };
  user: SessionUser;
  linkChildView: (id: string, eventType: EventType, drop2: any) => void;
  constructor(
    private cameraService: CameraRequestService,
    private componentService: ComponentService,
    private eventRequestService: EventRequestService,
    private stationService: GarbageStationRequestService
  ) {
    this.eventDropCard = {
      eventType: EventType.IllegalDrop,
      divisionType: null,
      dropDivisionType: null,
    };
    this.user = new SessionUser();
  }

  get businessEventType() {
    if (this.mixedIntoMode) return BusinessEventTypeEnum.MixedInfo;
    else if (this.illegalDropMode) return BusinessEventTypeEnum.IllegalDrop;
  }

  moveToByGarbageStation(station: GarbageStation) {
    setTimeout(() => {
      this.aMap.MoveToByGarbageStation(station);
    }, 500);

    this.clearEventView();
  }

  /**显示乱扔垃圾view */
  illegalDrop(divisionsId: string) {
    this.illegalDropMode = new FillMode();
    this.illegalDropMode.divisionId = divisionsId;
    this.eventHistoryView = true;
  }

  /**显示混合投放view */
  mixedInto(divisionsId: string) {
    this.mixedIntoMode = new FillMode();
    this.mixedIntoMode.divisionId = divisionsId;
    this.eventHistoryView = true;
  }

  bindingEvent() {
    const resetDropDivisionType = (val: DivisionTypeEnum) => {
      if (val == DivisionTypeEnum.City)
        this.eventDropCard.dropDivisionType = DivisionTypeEnum.County;
      else if (val == DivisionTypeEnum.County)
        this.eventDropCard.dropDivisionType = DivisionTypeEnum.Committees;
      else if (val == DivisionTypeEnum.Committees)
        this.eventDropCard.dropDivisionType = "station" as any;
    };
    setTimeout(() => {
      for (const x of this.componets) {
        if (x.list[0].view instanceof HeaderSquareListComponent) {
          x.list[0].view.btnControl = (val: {
            id: string;
            type: DivisionTypeEnum;
          }) => {
            const param = new BusinessParameter(),
              eventTypes = [EventType.IllegalDrop, EventType.MixedInto];
            param.map.set("divisionId", val.id);
            param.map.set("divisionType", val.type);
            this.eventDropCard.divisionType = val.type;
            resetDropDivisionType(val.type);
            // param.map.set('divisionsIds', [val.id]);
            this.nspectionParam(val.id);
            this.divisionsId = val.id;
            if (this.aMap) {
              this.aMap.VillageSelect(val.id, true);
            }
            for (const x of this.componets) {
              if (x.list[0].view instanceof HeaderSquareListComponent) {
              } else {
                if (x.list[0].business instanceof BaseBusinessRefresh) {
                  /**小包处置跳过 */
                  //if(x.list[0].business instanceof StationDisposeScore)continue;
                  /**加上事件 类别 */
                  if (x.list[0].business instanceof EventDropHistory)
                    param.map.set("eventType", eventTypes.shift());

                  if (x.list[0].business instanceof EventDropOrder)
                    param.map.set("eventType", this.eventDropCard.eventType);
                  if (
                    x.list[0].business instanceof EventDropHistory ||
                    x.list[0].business instanceof EventDropOrder
                  ) {
                    setTimeout(() => {
                      const divisionDrop = new Map<
                        DivisionTypeEnum,
                        Array<{ id: string; name: string }>
                      >();
                      divisionDrop.set(DivisionTypeEnum.City, [
                        {
                          id: DivisionTypeEnum.County + "",
                          name: "街道",
                        },
                        {
                          id: DivisionTypeEnum.Committees + "",
                          name: "居委",
                        },
                      ]);
                      divisionDrop.set(DivisionTypeEnum.County, [
                        {
                          id: DivisionTypeEnum.Committees + "",
                          name: "居委",
                        },
                        {
                          id: "station",
                          name: "投放点",
                        },
                      ]);
                      this.componentService.selectOptionEventEmitter.emit(
                        divisionDrop.get(val.type)
                      );
                    }, 100);
                  }

                  x.list[0].business.businessParameter = param;
                  x.list[0].view.loadDatas(new ViewsModel());
                }
                setTimeout(() => {
                  if (x.list[0].view instanceof GalleryRollPageComponent) {
                    x.list[0].view.tagClick(null, false);
                  }
                }, 500);
              }
            }
          };
        } else if (x.list[0].view instanceof ImageThemeCardComponent) {
          x.list[0].view.btnControl = async (val: {
            timeInterval: { start: Date; end: Date };
            cameraId: string;
          }) => {
            const respone = await this.cameraService
              .get(val.cameraId)
              .toPromise();

            this.aMap.Playback(
              respone.Data as any,
              val.timeInterval.start,
              val.timeInterval.end
            );
          };
        } else if (x.list[0].view instanceof HintCardComponent) {
          x.list[0].view.btnControl = (tag) => {
            if (x.list[0].business instanceof BaseBusinessRefresh) {
              if (tag == HintTag.IllegalDrop) {
                this.illegalDropMode = new FillMode();
                this.illegalDropMode.divisionId =
                  x.list[0].business.businessParameter.map.get("divisionId");
              } else if (tag == HintTag.MixedInto) {
                this.mixedIntoMode = new FillMode();
                this.mixedIntoMode.divisionId =
                  x.list[0].business.businessParameter.map.get("divisionId");
              } else if (tag == HintTag.FullStation) {
                this.fullStationsView = true;
                this.fullGarbageStationIntoMode = new FillMode();
                this.fullGarbageStationIntoMode.divisionId =
                  x.list[0].business.businessParameter.map.get("divisionId");
              } else if (tag == HintTag.GarbageStation)
                this.stationListView = true;
              else if (tag == HintTag.StationStranded)
                this.stationStrandedView = true;
              this.eventHistoryView = true;
            }
          };
        } else if (x.list[0].view instanceof StateScaleCardComponent) {
          x.list[0].view.btnControl = (item: { tag: CameraStateTableEnum }) => {
            this.stationCameraStateTable = item.tag;
            this.stationCameraView = true;
            this.eventHistoryView = true;
          };
        } else if (x.list[0].view instanceof OrderTableCardComponent) {
          /** 列表切换功能 */
          x.list[0].view.btnControl = (item: {
            id: string;
            eventType: EventType;
            drop2: any;
          }) => {
            if (item.eventType == null) {
              this.linkChildView(
                item.id,
                this.eventDropCard.eventType,
                item.drop2
              );
            } else {
              const param = new BusinessParameter(),
                stationKey = "station";
              param.map.set("divisionId", this.divisionsId);
              if (item.id == "IllegalDrop" || item.id == "MixedInto") {
                this.eventDropCard.eventType =
                  item.id == "IllegalDrop"
                    ? EventType.IllegalDrop
                    : EventType.MixedInto;

                param.map.set("eventType", this.eventDropCard.eventType);
                param.map.set("dropList", this.eventDropCard.dropDivisionType);
              } else {
                param.map.set("eventType", item.eventType);
                if (item.id == stationKey) {
                  param.map.set("dropList", stationKey);
                  this.eventDropCard.dropDivisionType = stationKey as any;
                } else {
                  if (
                    this.eventDropCard.divisionType == DivisionTypeEnum.City
                  ) {
                    if (item.id == DivisionTypeEnum.Committees + "")
                      param.map.set("divisionType", DivisionTypeEnum.County);
                    else if (item.id == DivisionTypeEnum.County + "")
                      param.map.set("divisionType", DivisionTypeEnum.City);
                    param.map.set("dropList", item.id);
                    this.eventDropCard.dropDivisionType = item.id as any;
                  } else {
                    if (item.id == DivisionTypeEnum.Committees + "")
                      param.map.set("divisionType", DivisionTypeEnum.County);
                    this.eventDropCard.dropDivisionType =
                      param.map.get("divisionType");
                  }
                }
              }
              for (const x of this.componets) {
                if (x.list[0].view instanceof OrderTableCardComponent) {
                  //    if(x.list[0].view.model.dropList
                  //     &&x.list[0].view.model.dropList.eventType==item.eventType)
                  if (x.list[0].business instanceof BaseBusinessRefresh) {
                    x.list[0].business.businessParameter = param;
                    x.list[0].view.loadDatas(new ViewsModel());
                  }
                }
              }
            }
          };
        }
      }
    }, 1000);
  }

  bindingEvent2() {
    setTimeout(() => {
      for (const x of this.componets) {
        if (x.list[0].view instanceof GalleryRollPageComponent) {
          /**
           *
           * 抓图
           */
          const s_view = () => {
            const g = targetPosition("map__view"),
              san = targetPosition("san");
            this.inspectionSize.left = g.left - 5;
            this.inspectionSize.top = 0;
            const s = domSize("map__view");
            this.inspectionSize.width = s.width - g.left + 17;
            this.inspectionSize.height = san.top - 5;
          };
          x.list[0].view.btnControl = async (i) => {
            if (i == null) {
              this.inspectionView = false;
              setTimeout(() => {
                s_view();
                this.aMap.MapReload();
              }, 200);
            } else if (isBoolean(i)) {
              this.inspectionViewMaxPostion = i;
              if (i)
                this.inspectionSize = { width: 0, height: 0, left: 0, top: 0 };
              else
                setTimeout(() => {
                  s_view();
                });
            } else if (isString(i)) {
              this.inspectionViewVideo = i == "play";
            } else {
              const item = i as {
                  g: Gallery;
                  msg: boolean;
                  catchState: { o: boolean };
                },
                enumHelper = new EnumHelper(),
                pic = new MediumPicture(),
                state = (gs: GarbageStation) => {
                  debugger;
                  return Language.StationStateFlags(gs.StationState);
                  // if (gs.StationState == 0) return "正常";
                  // else if (
                  //   enumHelper.stationState.err.indexOf(gs.StationState) > -1
                  // )
                  //   return "异常";
                  // else if (
                  //   enumHelper.stationState.full.indexOf(gs.StationState) > -1
                  // )
                  //   return "满溢";
                };
              if (item.g && item.g.title) {
                /**更新投放点 */
                const station = await this.stationService
                  .get(item.g.title.id)
                  .toPromise();
                if (station && station.Data) {
                  item.g.title.state = state(station.Data);
                  station.Data.Cameras.map((m) => {
                    if (m.ImageUrl) {
                      const desc = item.g.imgDesc.find((i) => i.tag.id == m.Id);
                      if (desc) desc.src = pic.getData(m.ImageUrl);
                    }
                  });
                }
                this.getStationsIllegalDropEvent([item.g.title.id]).subscribe(
                  (x) => {
                    if (x.Data && x.Data.Data)
                      item.g.title.eventNumber = x.Data.Data.length;
                  }
                );
                this.stationService
                  .manualCapture(item.g.title.id)
                  .subscribe((data) => {
                    item.catchState.o = true;
                    if (data && data.Data) {
                      data.Data.map((m) => {
                        if (m.Result) {
                          const desc = item.g.imgDesc.find(
                            (i) => i.tag.id == m.CameraId
                          );
                          if (desc) desc.src = pic.getData(m.Id);
                        }
                      });
                    }
                    if (item.msg) new MessageBar().response_success();
                  });
              }
            }
          };
        }
      }
    }, 2000);
  }

  changeMqttState(state: boolean) {
    for (const x of this.componets) {
      if (x.list[0].view instanceof ImageThemeCardComponent) {
        x.list[0].view.model.imgDesc1Icon = state
          ? "howell-icon-signal2"
          : "howell-icon-no_signal";
        x.list[0].view.model.imgDesc1IconColor = state
          ? ColorEnum["green-text"]
          : ColorEnum["red-text"];
      }
    }
  }

  getStationsIllegalDropEvent(stationIds: string[]) {
    const param = new GetEventRecordsParams(),
      day = TheDayTime(new Date());
    param.PageIndex = 1;
    param.BeginTime = day.begin.toISOString();
    param.EndTime = day.end.toISOString();
    param.PageSize = new ListAttribute().maxSize;
    param.StationIds = stationIds;
    return this.eventRequestService.list(param);
  }

  clearEventView() {
    this.mixedIntoMode = null;
    this.illegalDropMode = null;
    this.fullStationsView = false;
    this.eventHistoryView = false;
    this.stationListView = false;
    this.stationCameraView = false;
    this.vsClassStatistic = false;
    this.stationStrandedView = false;
  }
}
