import { Injectable } from "@angular/core";
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
import {
  CameraTrashCansUrl,
  CameraUrl,
  GarbageStationsUrl,
  GarbageStationTrashCansUrl,
  GarbageStationTypeUrl,
} from "../url/waste-regulation/garbage-station";
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
import { classToPlain } from "class-transformer";
import { ServiceHelper } from "../model/waste-regulation/request-service-processor";
@Injectable({
  providedIn: "root",
})
export class GarbageStationRequestService {
  constructor(private requestService: HowellAuthHttpService) {}
  async create(item: GarbageStation) {
    let data = classToPlain(item);
    // SaveModel.toModel(item, SaveModel.formMustField.garbageStation)
    let response = await this.requestService
      .post<GarbageStation, HowellResponse<GarbageStation>>(
        GarbageStationsUrl.create(),
        data
      )
      .toPromise();
    return ServiceHelper.ResponseProcess(response, GarbageStation);
  }

  async get(id: string) {
    let observable = this.requestService.get<GarbageStation>(
      GarbageStationsUrl.get(id)
    );
    let response = await observable.toPromise();
    return ServiceHelper.ResponseProcess(response, GarbageStation);
  }

  async set(item: GarbageStation) {
    let data = classToPlain<GarbageStation>(item) as GarbageStation;
    // SaveModel.toModel(item, SaveModel.formMustField.garbageStation)
    let response = await this.requestService
      .put<GarbageStation, HowellResponse<GarbageStation>>(
        GarbageStationsUrl.edit(item.Id),
        data
      )
      .toPromise();
    return ServiceHelper.ResponseProcess(response, GarbageStation);
  }

  async del(id: string) {
    let response = await this.requestService
      .delete<GarbageStation>(GarbageStationsUrl.del(id))
      .toPromise();
    return ServiceHelper.ResponseProcess(response, GarbageStation);
  }

  async list(item: GetGarbageStationsParams) {
    let response = await this.requestService
      .post<
        GetGarbageStationsParams,
        HowellResponse<PagedList<GarbageStation>>
      >(GarbageStationsUrl.list(), item)
      .toPromise();
    debugger;
    return ServiceHelper.ResponseProcess(response, GarbageStation);
  }

  async volumesHistory(
    item: GetGarbageStationVolumesParams,
    divisionsId: string
  ) {
    let response = await this.requestService
      .post<
        GetGarbageStationVolumesParams,
        HowellResponse<PagedList<GarbageVolume>>
      >(GarbageStationsUrl.volumesHistory(divisionsId), item)
      .toPromise();

    return ServiceHelper.ResponseProcess(response, GarbageVolume);
  }

  async eventNumbersHistory(
    item: GetGarbageStationnEventNumbersParams,
    divisionsId: string
  ) {
    let response = await this.requestService
      .post<
        GetGarbageStationnEventNumbersParams,
        HowellResponse<PagedList<EventNumberStatistic>>
      >(GarbageStationsUrl.eventNumbersHistory(divisionsId), item)
      .toPromise();

    return ServiceHelper.ResponseProcess(response, EventNumberStatistic);
  }

  async statisticNumber(garbageStationId: string) {
    let response = await this.requestService
      .get<GarbageStationNumberStatistic>(
        GarbageStationsUrl.statisticNumber(garbageStationId)
      )
      .toPromise();

    return ServiceHelper.ResponseProcess(
      response,
      GarbageStationNumberStatistic
    );
  }

  async statisticNumberList(item: GetGarbageStationStatisticNumbersParams) {
    let response = await this.requestService
      .post<
        GetGarbageStationStatisticNumbersParams,
        HowellResponse<PagedList<GarbageStationNumberStatistic>>
      >(GarbageStationsUrl.statisticNumberList(), item)
      .toPromise();

    return ServiceHelper.ResponseProcess(
      response,
      GarbageStationNumberStatistic
    );
  }

  async statisticNumberListV2(item: GetGarbageStationStatisticNumbersParamsV2) {
    let response = await this.requestService
      .post<
        GetGarbageStationStatisticNumbersParamsV2,
        HowellResponse<GarbageStationNumberStatisticV2[]>
      >(GarbageStationsUrl.statisticNumberHistoryList(), item)
      .toPromise();

    return ServiceHelper.ResponseProcess(
      response,
      GarbageStationNumberStatisticV2
    );
  }

  async manualCapture(stationId: string) {
    let response = await this.requestService
      .post<any, HowellResponse<CameraPictureUrl[]>>(
        GarbageStationsUrl.manualCapture(stationId)
      )
      .toPromise();
    return ServiceHelper.ResponseProcess(response, CameraPictureUrl);
  }

  async cameraFile(
    stationId: string,
    cameraId: string,
    beginTime: string,
    endTime: string
  ) {
    return this.requestService
      .getStream(
        GarbageStationsUrl.cameraFile(stationId, cameraId, beginTime, endTime)
      )
      .toPromise();
  }

  async cameraFileUrl(
    stationId: string,
    cameraId: string,
    beginTime: string,
    endTime: string
  ) {
    let response = await this.requestService
      .post<any, HowellResponse<RecordFileUrl>>(
        GarbageStationsUrl.cameraFile(stationId, cameraId, beginTime, endTime)
      )
      .toPromise();

    return ServiceHelper.ResponseProcess(response, RecordFileUrl);
  }

  async statisticGarbageCount(
    item: GetGarbageStationStatisticGarbageCountsParams
  ) {
    let response = await this.requestService
      .post<
        GetGarbageStationStatisticGarbageCountsParams,
        HowellResponse<GarbageStationGarbageCountStatistic[]>
      >(GarbageStationsUrl.statisticGarbageCountHistoryList(), item)
      .toPromise();

    return ServiceHelper.ResponseProcess(
      response,
      GarbageStationGarbageCountStatistic
    );
  }
}

@Injectable({
  providedIn: "root",
})
export class CameraRequestService {
  constructor(private requestService: HowellAuthHttpService) {}
  async create(item: Camera) {
    let response = await this.requestService
      .post<Camera, HowellResponse<Camera>>(
        CameraUrl.create(item.GarbageStationId),
        item
      )
      .toPromise();

    return ServiceHelper.ResponseProcess(response, Camera);
  }

  async get(garbageStationId: string, cameraId: string) {
    let response = await this.requestService
      .get<Camera>(CameraUrl.get(garbageStationId, cameraId))
      .toPromise();

    return ServiceHelper.ResponseProcess(response, Camera);
  }

  async list(garbageStationId: string) {
    let response = await this.requestService
      .get<Camera[]>(CameraUrl.create(garbageStationId))
      .toPromise();

    return ServiceHelper.ResponseProcess(response, Camera);
  }

  async set(item: Camera) {
    let response = await this.requestService
      .put<Camera, HowellResponse<Camera>>(
        CameraUrl.edit(item.GarbageStationId, item.Id),
        item
      )
      .toPromise();

    return ServiceHelper.ResponseProcess(response, Camera);
  }

  async del(garbageStationId: string, cameraId: string) {
    let response = await this.requestService
      .delete<Camera>(CameraUrl.del(garbageStationId, cameraId))
      .toPromise();

    return ServiceHelper.ResponseProcess(response, Camera);
  }

  async postList(item: GetGarbageStationCamerasParams) {
    let response = await this.requestService
      .post<GetGarbageStationCamerasParams, HowellResponse<PagedList<Camera>>>(
        CameraUrl.list(),
        item
      )
      .toPromise();

    return ServiceHelper.ResponseProcess(response, Camera);
  }
}

@Injectable({
  providedIn: "root",
})
export class CameraTrashCanRequestService {
  constructor(private requestService: HowellAuthHttpService) {}
  async create(item: TrashCan) {
    let response = await this.requestService
      .post<TrashCan, HowellResponse<TrashCan>>(
        CameraTrashCansUrl.create(item.GarbageStationId, item.CameraId),
        item
      )
      .toPromise();

    return ServiceHelper.ResponseProcess(response, TrashCan);
  }

  async get(garbageStationId: string, cameraId: string, trashCanId: string) {
    let response = await this.requestService
      .get<TrashCan>(
        CameraTrashCansUrl.get(garbageStationId, cameraId, trashCanId)
      )
      .toPromise();

    return ServiceHelper.ResponseProcess(response, TrashCan);
  }

  async set(item: TrashCan) {
    let response = await this.requestService
      .put<TrashCan, HowellResponse<TrashCan>>(
        CameraTrashCansUrl.edit(item.GarbageStationId, item.CameraId, item.Id),
        item
      )
      .toPromise();

    return ServiceHelper.ResponseProcess(response, TrashCan);
  }

  async del(garbageStationId: string, cameraId: string, trashCanId: string) {
    let response = await this.requestService
      .delete<TrashCan>(
        CameraTrashCansUrl.del(garbageStationId, cameraId, trashCanId)
      )
      .toPromise();

    return ServiceHelper.ResponseProcess(response, TrashCan);
  }

  async list(garbageStationId: string, cameraId: string) {
    let response = await this.requestService
      .get<TrashCan[]>(CameraTrashCansUrl.list(garbageStationId, cameraId))
      .toPromise();

    return ServiceHelper.ResponseProcess(response, TrashCan);
  }
}

@Injectable({
  providedIn: "root",
})
export class GarbageStationTrashCanRequestService {
  constructor(private requestService: HowellAuthHttpService) {}
  async create(item: TrashCan) {
    let response = await this.requestService
      .post<TrashCan, HowellResponse<TrashCan>>(
        GarbageStationTrashCansUrl.create(item.GarbageStationId),
        item
      )
      .toPromise();

    return ServiceHelper.ResponseProcess(response, TrashCan);
  }

  async get(garbageStationId: string, cameraId: string) {
    let response = await this.requestService
      .get<TrashCan>(GarbageStationTrashCansUrl.get(garbageStationId, cameraId))
      .toPromise();

    return ServiceHelper.ResponseProcess(response, TrashCan);
  }

  async set(item: TrashCan) {
    let response = await this.requestService
      .put<TrashCan, HowellResponse<TrashCan>>(
        GarbageStationTrashCansUrl.edit(item.GarbageStationId, item.Id),
        item
      )
      .toPromise();

    return ServiceHelper.ResponseProcess(response, TrashCan);
  }

  async del(garbageStationId: string, cameraId: string) {
    let response = await this.requestService
      .delete<TrashCan>(
        GarbageStationTrashCansUrl.del(garbageStationId, cameraId)
      )
      .toPromise();

    return ServiceHelper.ResponseProcess(response, TrashCan);
  }

  async list(item: GetGarbageStationTrashCansParams) {
    let response = await this.requestService
      .post<
        GetGarbageStationTrashCansParams,
        HowellResponse<PagedList<TrashCan>>
      >(GarbageStationTrashCansUrl.postList(), item)
      .toPromise();

    return ServiceHelper.ResponseProcess(response, TrashCan);
  }
}

@Injectable({
  providedIn: "root",
})
export class GarbageStationTypeRequestService {
  constructor(private requestService: HowellAuthHttpService) {}
  async create(item: GarbageStationType) {
    let data = classToPlain(item);
    // SaveModel.toModel(item, SaveModel.formMustField.garbageStationType)
    let response = await this.requestService
      .post<GarbageStationType, HowellResponse<GarbageStationType>>(
        GarbageStationTypeUrl.create(),
        data
      )
      .toPromise();

    return ServiceHelper.ResponseProcess(response, GarbageStationType);
  }

  async get(type: string) {
    let response = await this.requestService.get<GarbageStationType>(
      GarbageStationTypeUrl.get(type)
    );
  }

  async set(item: GarbageStationType) {
    let data = classToPlain(item) as GarbageStationType;
    // SaveModel.toModel(item, SaveModel.formMustField.garbageStationType)
    let response = await this.requestService
      .put<GarbageStationType, HowellResponse<GarbageStationType>>(
        GarbageStationTypeUrl.edit(item.Type + ""),
        data
      )
      .toPromise();

    return ServiceHelper.ResponseProcess(response, GarbageStationType);
  }

  async del(type: string) {
    let response = await this.requestService
      .delete<GarbageStationType>(GarbageStationTypeUrl.del(type))
      .toPromise();

    return ServiceHelper.ResponseProcess(response, GarbageStationType);
  }

  async list() {
    let response = await this.requestService
      .get<GarbageStationType[]>(GarbageStationTypeUrl.list())
      .toPromise();

    return ServiceHelper.ResponseProcess(response, GarbageStationType);
  }
}
