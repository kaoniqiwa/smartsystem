<<<<<<< HEAD
import { Injectable } from "@angular/core";
import { SaveModel } from "../model/save-model";
import {
  GarbageStation,
  GetGarbageStationsParams,
  RecordFileUrl,
} from "../model/waste-regulation/garbage-station";
import {
  Camera,
  GetGarbageStationCamerasParams,
} from "../model/waste-regulation/camera";
import {
  GetGarbageStationVolumesParams,
  GarbageVolume,
} from "../model/waste-regulation/garbage-volume";
import {
  TrashCan,
  GetGarbageStationTrashCansParams,
} from "../model/waste-regulation/trashCan";
import * as url from "../url/waste-regulation/garbage-station";
import { PagedList } from "../model/page";
import { Response } from "../model/Response";
import { HowellAuthHttpService } from "./howell-auth-http.service";
import {
  GetGarbageStationnEventNumbersParams,
  EventNumberStatistic,
} from "../model/waste-regulation/division-event-numbers";
import {
  GetGarbageStationStatisticGarbageCountsParams,
  GarbageStationNumberStatistic,
  GetGarbageStationStatisticNumbersParams,
  GarbageStationNumberStatisticV2,
  GetGarbageStationStatisticNumbersParamsV2,
  GarbageStationGarbageCountStatistic,
} from "../model/waste-regulation/garbage-station-number-statistic";
import { GarbageStationType } from "../model/waste-regulation/garbage-station-type";
import { CameraPictureUrl } from "../model/waste-regulation/camera-picture-url";
@Injectable({
  providedIn: "root",
=======
import { Injectable } from '@angular/core';
import { SaveModel } from '../model/save-model';
import { GarbageStation, GetGarbageStationsParams, RecordFileUrl } from '../model/waste-regulation/garbage-station';
import { Camera, GetGarbageStationCamerasParams } from '../model/waste-regulation/camera';
import { GetGarbageStationVolumesParams, GarbageVolume } from '../model/waste-regulation/garbage-volume';
import { TrashCan, GetGarbageStationTrashCansParams } from '../model/waste-regulation/trashCan';
import * as url from '../url/waste-regulation/garbage-station';
import { PagedList } from '../model/page';
import { Response } from '../model/response';
import { HowellAuthHttpService } from './howell-auth-http.service';
import { GetGarbageStationnEventNumbersParams, EventNumberStatistic } from '../model/waste-regulation/division-event-numbers';
import {
  GetGarbageStationStatisticGarbageCountsParams, GarbageStationNumberStatistic
  , GetGarbageStationStatisticNumbersParams, GarbageStationNumberStatisticV2, GetGarbageStationStatisticNumbersParamsV2
  , GarbageStationGarbageCountStatistic
} from '../model/waste-regulation/garbage-station-number-statistic';
import { GarbageStationType } from "../model/waste-regulation/garbage-station-type";
import { CameraPictureUrl } from "../model/waste-regulation/camera-picture-url";
@Injectable({
  providedIn: 'root'
>>>>>>> 7e196198e2b56c987d4f5d27edf6aaeaed975cbf
})
export class GarbageStationRequestService extends SaveModel {
  url: url.GarbageStations;
  constructor(private requestService: HowellAuthHttpService) {
    super();
    this.url = new url.GarbageStations();
  }
  create(item: GarbageStation) {
<<<<<<< HEAD
    return this.requestService.post<GarbageStation, Response<GarbageStation>>(
      this.url.create(),
      this.toModel(item, this.formMustField.garbageStation)
    );
=======
    return this.requestService.post<GarbageStation,
      Response<GarbageStation>>(this.url.create(), this.toModel(item, this.formMustField.garbageStation));
>>>>>>> 7e196198e2b56c987d4f5d27edf6aaeaed975cbf
  }

  get(id: string) {
    return this.requestService.get<GarbageStation>(this.url.get(id));
  }

  set(item: GarbageStation) {
<<<<<<< HEAD
    return this.requestService.put<GarbageStation, Response<GarbageStation>>(
      this.url.edit(item.Id),
      this.toModel(item, this.formMustField.garbageStation)
    );
=======
    return this.requestService.put<GarbageStation,
      Response<GarbageStation>>(this.url.edit(item.Id), this.toModel(item, this.formMustField.garbageStation));
>>>>>>> 7e196198e2b56c987d4f5d27edf6aaeaed975cbf
  }

  del(id: string) {
    return this.requestService.delete<GarbageStation>(this.url.del(id));
  }

  list(item: GetGarbageStationsParams) {
<<<<<<< HEAD
    return this.requestService.post<
      GetGarbageStationsParams,
      Response<PagedList<GarbageStation>>
    >(this.url.list(), item);
  }

  volumesHistory(item: GetGarbageStationVolumesParams, divisionsId: string) {
    return this.requestService.post<
      GetGarbageStationVolumesParams,
      Response<PagedList<GarbageVolume>>
    >(this.url.volumesHistory(divisionsId), item);
  }

  eventNumbersHistory(
    item: GetGarbageStationnEventNumbersParams,
    divisionsId: string
  ) {
    return this.requestService.post<
      GetGarbageStationnEventNumbersParams,
      Response<PagedList<EventNumberStatistic>>
    >(this.url.eventNumbersHistory(divisionsId), item);
  }

  statisticNumber(garbageStationId: string) {
    return this.requestService.get<GarbageStationNumberStatistic>(
      this.url.statisticNumber(garbageStationId)
    );
  }

  statisticNumberList(item: GetGarbageStationStatisticNumbersParams) {
    return this.requestService.post<
      GetGarbageStationStatisticNumbersParams,
      Response<PagedList<GarbageStationNumberStatistic>>
    >(this.url.statisticNumberList(), item);
  }

  statisticNumberListV2(item: GetGarbageStationStatisticNumbersParamsV2) {
    return this.requestService.post<
      GetGarbageStationStatisticNumbersParamsV2,
      Response<GarbageStationNumberStatisticV2[]>
    >(this.url.statisticNumberHistoryList(), item);
  }

  manualCapture(stationId: string) {
    return this.requestService.post<any, Response<CameraPictureUrl[]>>(
      this.url.manualCapture(stationId)
    );
  }

  cameraFile(
    stationId: string,
    cameraId: string,
    beginTime: string,
    endTime: string
  ) {
    return this.requestService.getStream(
      this.url.cameraFile(stationId, cameraId, beginTime, endTime)
    );
  }

  cameraFileUrl(
    stationId: string,
    cameraId: string,
    beginTime: string,
    endTime: string
  ) {
    return this.requestService.post<any, Response<RecordFileUrl>>(
      this.url.cameraFile(stationId, cameraId, beginTime, endTime)
    );
  }

  statisticGarbageCount(item: GetGarbageStationStatisticGarbageCountsParams) {
    return this.requestService.post<
      GetGarbageStationStatisticGarbageCountsParams,
      Response<GarbageStationGarbageCountStatistic[]>
    >(this.url.statisticGarbageCountHistoryList(), item);
=======
    return this.requestService.post<GetGarbageStationsParams, Response<PagedList<GarbageStation>>>(this.url.list(), item);
  }

  volumesHistory(item: GetGarbageStationVolumesParams, divisionsId: string) {
    return this.requestService.post<GetGarbageStationVolumesParams,
      Response<PagedList<GarbageVolume>>>(this.url.volumesHistory(divisionsId), item);
  }

  eventNumbersHistory(item: GetGarbageStationnEventNumbersParams, divisionsId: string) {
    return this.requestService.post<GetGarbageStationnEventNumbersParams,
      Response<PagedList<EventNumberStatistic>>>(this.url.eventNumbersHistory(divisionsId), item);
  }

  statisticNumber(divisionsId: string) {
    return this.requestService.get<GarbageStationNumberStatistic>(this.url.statisticNumber(divisionsId));
  }

  statisticNumberList(item: GetGarbageStationStatisticNumbersParams) {
    return this.requestService.post<GetGarbageStationStatisticNumbersParams,
      Response<PagedList<GarbageStationNumberStatistic>>>(this.url.statisticNumberList(), item);
  }

  statisticNumberListV2(item: GetGarbageStationStatisticNumbersParamsV2) {
    return this.requestService.post<GetGarbageStationStatisticNumbersParamsV2,
      Response<GarbageStationNumberStatisticV2[]>>(this.url.statisticNumberHistoryList(), item);
  }

  manualCapture(stationId: string) {
    return this.requestService.post<any,
      Response<CameraPictureUrl[]>>(this.url.manualCapture(stationId));
  }

  cameraFile(stationId: string, cameraId: string, beginTime: string, endTime: string) {
    return this.requestService.getStream(this.url.cameraFile(stationId, cameraId, beginTime, endTime));
  }

  cameraFileUrl(stationId: string, cameraId: string, beginTime: string, endTime: string) {
    return this.requestService.post<any,
      Response<RecordFileUrl>>(this.url.cameraFile(stationId, cameraId, beginTime, endTime));
  }

  statisticGarbageCount(item: GetGarbageStationStatisticGarbageCountsParams) {
    return this.requestService.post<GetGarbageStationStatisticGarbageCountsParams
      , Response<GarbageStationGarbageCountStatistic[]>>(this.url.statisticGarbageCountHistoryList(), item);
>>>>>>> 7e196198e2b56c987d4f5d27edf6aaeaed975cbf
  }
}

@Injectable({
<<<<<<< HEAD
  providedIn: "root",
=======
  providedIn: 'root'
>>>>>>> 7e196198e2b56c987d4f5d27edf6aaeaed975cbf
})
export class CameraRequestService extends SaveModel {
  url: url.Camera;
  constructor(private requestService: HowellAuthHttpService) {
    super();
    this.url = new url.Camera();
  }
  create(item: Camera) {
<<<<<<< HEAD
    return this.requestService.post<Camera, Response<Camera>>(
      this.url.create(item.GarbageStationId),
      item
    );
  }

  get(garbageStationId: string, cameraId: string) {
    return this.requestService.get<Camera>(
      this.url.get(garbageStationId, cameraId)
    );
=======
    return this.requestService.post<Camera, Response<Camera>>(this.url.create(item.GarbageStationId), item);
  }

  get(garbageStationId: string, cameraId: string) {
    return this.requestService.get<Camera>(this.url.get(garbageStationId, cameraId));
>>>>>>> 7e196198e2b56c987d4f5d27edf6aaeaed975cbf
  }

  list(garbageStationId: string) {
    return this.requestService.get<Camera[]>(this.url.create(garbageStationId));
  }

  set(item: Camera) {
<<<<<<< HEAD
    return this.requestService.put<Camera, Response<Camera>>(
      this.url.edit(item.GarbageStationId, item.Id),
      item
    );
  }

  del(garbageStationId: string, cameraId: string) {
    return this.requestService.delete<Camera>(
      this.url.del(garbageStationId, cameraId)
    );
  }

  postList(item: GetGarbageStationCamerasParams) {
    return this.requestService.post<
      GetGarbageStationCamerasParams,
      Response<PagedList<Camera>>
    >(this.url.list(), item);
=======
    return this.requestService.put<Camera, Response<Camera>>(this.url.edit(item.GarbageStationId, item.Id), item);
  }

  del(garbageStationId: string, cameraId: string) {
    return this.requestService.delete<Camera>(this.url.del(garbageStationId, cameraId));
  }

  postList(item: GetGarbageStationCamerasParams) {
    return this.requestService.post<GetGarbageStationCamerasParams, Response<PagedList<Camera>>>(this.url.list(), item);
>>>>>>> 7e196198e2b56c987d4f5d27edf6aaeaed975cbf
  }
}

@Injectable({
<<<<<<< HEAD
  providedIn: "root",
=======
  providedIn: 'root'
>>>>>>> 7e196198e2b56c987d4f5d27edf6aaeaed975cbf
})
export class CameraTrashCanRequestService extends SaveModel {
  url: url.CameraTrashCans;
  constructor(private requestService: HowellAuthHttpService) {
    super();
    this.url = new url.CameraTrashCans();
  }
  create(item: TrashCan) {
<<<<<<< HEAD
    return this.requestService.post<TrashCan, Response<TrashCan>>(
      this.url.create(item.GarbageStationId, item.CameraId),
      item
    );
  }

  get(garbageStationId: string, cameraId: string, trashCanId: string) {
    return this.requestService.get<TrashCan>(
      this.url.get(garbageStationId, cameraId, trashCanId)
    );
  }

  set(item: TrashCan) {
    return this.requestService.put<TrashCan, Response<TrashCan>>(
      this.url.edit(item.GarbageStationId, item.CameraId, item.Id),
      item
    );
  }

  del(garbageStationId: string, cameraId: string, trashCanId: string) {
    return this.requestService.delete<TrashCan>(
      this.url.del(garbageStationId, cameraId, trashCanId)
    );
  }

  list(garbageStationId: string, cameraId: string) {
    return this.requestService.get<TrashCan[]>(
      this.url.list(garbageStationId, cameraId)
    );
=======
    return this.requestService.post<TrashCan, Response<TrashCan>>(this.url.create(item.GarbageStationId, item.CameraId), item);
  }

  get(garbageStationId: string, cameraId: string, trashCanId: string) {
    return this.requestService.get<TrashCan>(this.url.get(garbageStationId, cameraId, trashCanId));
  }

  set(item: TrashCan) {
    return this.requestService.put<TrashCan, Response<TrashCan>>(this.url.edit(item.GarbageStationId, item.CameraId, item.Id), item);
  }

  del(garbageStationId: string, cameraId: string, trashCanId: string) {
    return this.requestService.delete<TrashCan>(this.url.del(garbageStationId, cameraId, trashCanId));
  }

  list(garbageStationId: string, cameraId: string) {
    return this.requestService.get<TrashCan[]>(this.url.list(garbageStationId, cameraId));
>>>>>>> 7e196198e2b56c987d4f5d27edf6aaeaed975cbf
  }
}

@Injectable({
<<<<<<< HEAD
  providedIn: "root",
=======
  providedIn: 'root'
>>>>>>> 7e196198e2b56c987d4f5d27edf6aaeaed975cbf
})
export class GarbageStationTrashCanRequestService extends SaveModel {
  url: url.GarbageStationTrashCans;
  constructor(private requestService: HowellAuthHttpService) {
    super();
    this.url = new url.GarbageStationTrashCans();
  }
  create(item: TrashCan) {
<<<<<<< HEAD
    return this.requestService.post<TrashCan, Response<TrashCan>>(
      this.url.create(item.GarbageStationId),
      item
    );
  }

  get(garbageStationId: string, cameraId: string) {
    return this.requestService.get<TrashCan>(
      this.url.get(garbageStationId, cameraId)
    );
  }

  set(item: TrashCan) {
    return this.requestService.put<TrashCan, Response<TrashCan>>(
      this.url.edit(item.GarbageStationId, item.Id),
      item
    );
  }

  del(garbageStationId: string, cameraId: string) {
    return this.requestService.delete<TrashCan>(
      this.url.del(garbageStationId, cameraId)
    );
  }

  list(item: GetGarbageStationTrashCansParams) {
    return this.requestService.post<
      GetGarbageStationTrashCansParams,
      Response<PagedList<TrashCan>>
    >(this.url.postList(), item);
=======
    return this.requestService.post<TrashCan, Response<TrashCan>>(this.url.create(item.GarbageStationId), item);
  }

  get(garbageStationId: string, cameraId: string) {
    return this.requestService.get<TrashCan>(this.url.get(garbageStationId, cameraId));
  }

  set(item: TrashCan) {
    return this.requestService.put<TrashCan, Response<TrashCan>>(this.url.edit(item.GarbageStationId, item.Id), item);
  }

  del(garbageStationId: string, cameraId: string) {
    return this.requestService.delete<TrashCan>(this.url.del(garbageStationId, cameraId));
  }

  list(item: GetGarbageStationTrashCansParams) {
    return this.requestService.post<GetGarbageStationTrashCansParams, Response<PagedList<TrashCan>>>(this.url.postList(), item);
>>>>>>> 7e196198e2b56c987d4f5d27edf6aaeaed975cbf
  }
}

@Injectable({
<<<<<<< HEAD
  providedIn: "root",
=======
  providedIn: 'root'
>>>>>>> 7e196198e2b56c987d4f5d27edf6aaeaed975cbf
})
export class GarbageStationTypeRequestService extends SaveModel {
  url: url.GarbageStationType;
  constructor(private requestService: HowellAuthHttpService) {
    super();
    this.url = new url.GarbageStationType();
  }
  create(item: GarbageStationType) {
<<<<<<< HEAD
    return this.requestService.post<
      GarbageStationType,
      Response<GarbageStationType>
    >(
      this.url.create(),
      this.toModel(item, this.formMustField.garbageStationType)
    );
=======
    return this.requestService.post<GarbageStationType, Response<GarbageStationType>>(this.url.create(), this.toModel(item, this.formMustField.garbageStationType));
>>>>>>> 7e196198e2b56c987d4f5d27edf6aaeaed975cbf
  }

  get(type: string) {
    return this.requestService.get<GarbageStationType>(this.url.get(type));
  }

  set(item: GarbageStationType) {
<<<<<<< HEAD
    return this.requestService.put<
      GarbageStationType,
      Response<GarbageStationType>
    >(
      this.url.edit(item.Type + ""),
      this.toModel(item, this.formMustField.garbageStationType)
    );
=======
    return this.requestService.put<GarbageStationType, Response<GarbageStationType>>(this.url.edit(item.Type + ''), this.toModel(item, this.formMustField.garbageStationType));
>>>>>>> 7e196198e2b56c987d4f5d27edf6aaeaed975cbf
  }

  del(type: string) {
    return this.requestService.delete<GarbageStationType>(this.url.del(type));
  }

  list() {
    return this.requestService.get<GarbageStationType[]>(this.url.list());
  }
}
