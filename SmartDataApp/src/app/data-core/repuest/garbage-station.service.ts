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
import { HowellResponse } from "../model/response";
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
import { Observable } from "rxjs";
import { plainToClass } from "class-transformer";
@Injectable({
  providedIn: "root",
})
export class GarbageStationRequestService {
  url: url.GarbageStations;
  constructor(private requestService: HowellAuthHttpService) {
    this.url = new url.GarbageStations();
  }
  create(item: GarbageStation) {
    return this.requestService.post<
      GarbageStation,
      HowellResponse<GarbageStation>
    >(
      this.url.create(),
      SaveModel.toModel(item, SaveModel.formMustField.garbageStation)
    );
  }

  async get(id: string) {
    let observable = this.requestService.get<GarbageStation>(this.url.get(id));
    let response = await observable.toPromise();
    return plainToClass(GarbageStation, response.Data);
  }

  set(item: GarbageStation) {
    return this.requestService.put<
      GarbageStation,
      HowellResponse<GarbageStation>
    >(
      this.url.edit(item.Id),
      SaveModel.toModel(item, SaveModel.formMustField.garbageStation)
    );
  }

  del(id: string) {
    return this.requestService.delete<GarbageStation>(this.url.del(id));
  }

  async list(item: GetGarbageStationsParams) {
    let response = await this.requestService
      .post<
        GetGarbageStationsParams,
        HowellResponse<PagedList<GarbageStation>>
      >(this.url.list(), item)
      .toPromise();
    response.Data.Data = plainToClass(GarbageStation, response.Data.Data);
    return response.Data;
  }

  volumesHistory(item: GetGarbageStationVolumesParams, divisionsId: string) {
    return this.requestService.post<
      GetGarbageStationVolumesParams,
      HowellResponse<PagedList<GarbageVolume>>
    >(this.url.volumesHistory(divisionsId), item);
  }

  eventNumbersHistory(
    item: GetGarbageStationnEventNumbersParams,
    divisionsId: string
  ) {
    return this.requestService.post<
      GetGarbageStationnEventNumbersParams,
      HowellResponse<PagedList<EventNumberStatistic>>
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
      HowellResponse<PagedList<GarbageStationNumberStatistic>>
    >(this.url.statisticNumberList(), item);
  }

  statisticNumberListV2(item: GetGarbageStationStatisticNumbersParamsV2) {
    return this.requestService.post<
      GetGarbageStationStatisticNumbersParamsV2,
      HowellResponse<GarbageStationNumberStatisticV2[]>
    >(this.url.statisticNumberHistoryList(), item);
  }

  manualCapture(stationId: string) {
    return this.requestService.post<any, HowellResponse<CameraPictureUrl[]>>(
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
    return this.requestService.post<any, HowellResponse<RecordFileUrl>>(
      this.url.cameraFile(stationId, cameraId, beginTime, endTime)
    );
  }

  statisticGarbageCount(item: GetGarbageStationStatisticGarbageCountsParams) {
    return this.requestService.post<
      GetGarbageStationStatisticGarbageCountsParams,
      HowellResponse<GarbageStationGarbageCountStatistic[]>
    >(this.url.statisticGarbageCountHistoryList(), item);
  }
}

@Injectable({
  providedIn: "root",
})
export class CameraRequestService {
  url: url.Camera;
  constructor(private requestService: HowellAuthHttpService) {
    this.url = new url.Camera();
  }
  create(item: Camera) {
    return this.requestService.post<Camera, HowellResponse<Camera>>(
      this.url.create(item.GarbageStationId),
      item
    );
  }

  get(garbageStationId: string, cameraId: string) {
    return this.requestService.get<Camera>(
      this.url.get(garbageStationId, cameraId)
    );
  }

  list(garbageStationId: string) {
    return this.requestService.get<Camera[]>(this.url.create(garbageStationId));
  }

  set(item: Camera) {
    return this.requestService.put<Camera, HowellResponse<Camera>>(
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
      HowellResponse<PagedList<Camera>>
    >(this.url.list(), item);
  }
}

@Injectable({
  providedIn: "root",
})
export class CameraTrashCanRequestService {
  url: url.CameraTrashCans;
  constructor(private requestService: HowellAuthHttpService) {
    this.url = new url.CameraTrashCans();
  }
  create(item: TrashCan) {
    return this.requestService.post<TrashCan, HowellResponse<TrashCan>>(
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
    return this.requestService.put<TrashCan, HowellResponse<TrashCan>>(
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
  }
}

@Injectable({
  providedIn: "root",
})
export class GarbageStationTrashCanRequestService {
  url: url.GarbageStationTrashCans;
  constructor(private requestService: HowellAuthHttpService) {
    this.url = new url.GarbageStationTrashCans();
  }
  create(item: TrashCan) {
    return this.requestService.post<TrashCan, HowellResponse<TrashCan>>(
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
    return this.requestService.put<TrashCan, HowellResponse<TrashCan>>(
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
      HowellResponse<PagedList<TrashCan>>
    >(this.url.postList(), item);
  }
}

@Injectable({
  providedIn: "root",
})
export class GarbageStationTypeRequestService {
  url: url.GarbageStationType;
  constructor(private requestService: HowellAuthHttpService) {
    this.url = new url.GarbageStationType();
  }
  create(item: GarbageStationType) {
    return this.requestService.post<
      GarbageStationType,
      HowellResponse<GarbageStationType>
    >(
      this.url.create(),
      SaveModel.toModel(item, SaveModel.formMustField.garbageStationType)
    );
  }

  get(type: string) {
    return this.requestService.get<GarbageStationType>(this.url.get(type));
  }

  set(item: GarbageStationType) {
    return this.requestService.put<
      GarbageStationType,
      HowellResponse<GarbageStationType>
    >(
      this.url.edit(item.Type + ""),
      SaveModel.toModel(item, SaveModel.formMustField.garbageStationType)
    );
  }

  del(type: string) {
    return this.requestService.delete<GarbageStationType>(this.url.del(type));
  }

  list() {
    return this.requestService.get<GarbageStationType[]>(this.url.list());
  }
}
