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
import { ServiceResponseProcessor } from "../model/waste-regulation/request-service-processor";
@Injectable({
  providedIn: "root",
})
export class GarbageStationRequestService {
  url: url.GarbageStations;
  constructor(private requestService: HowellAuthHttpService) {
    this.url = new url.GarbageStations();
  }
  async create(item: GarbageStation) {
    let response = await this.requestService
      .post<GarbageStation, HowellResponse<GarbageStation>>(
        this.url.create(),
        SaveModel.toModel(item, SaveModel.formMustField.garbageStation)
      )
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(response, GarbageStation);
  }

  async get(id: string) {
    let observable = this.requestService.get<GarbageStation>(this.url.get(id));
    let response = await observable.toPromise();
    return ServiceResponseProcessor.ResponseProcess(response, GarbageStation);
  }

  async set(item: GarbageStation) {
    let response = await this.requestService
      .put<GarbageStation, HowellResponse<GarbageStation>>(
        this.url.edit(item.Id),
        SaveModel.toModel(item, SaveModel.formMustField.garbageStation)
      )
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(response, GarbageStation);
  }

  async del(id: string) {
    let response = await this.requestService
      .delete<GarbageStation>(this.url.del(id))
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(response, GarbageStation);
  }

  async list(item: GetGarbageStationsParams) {
    let response = await this.requestService
      .post<
        GetGarbageStationsParams,
        HowellResponse<PagedList<GarbageStation>>
      >(this.url.list(), item)
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(response, GarbageStation);
  }

  async volumesHistory(
    item: GetGarbageStationVolumesParams,
    divisionsId: string
  ) {
    let response = await this.requestService
      .post<
        GetGarbageStationVolumesParams,
        HowellResponse<PagedList<GarbageVolume>>
      >(this.url.volumesHistory(divisionsId), item)
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(response, GarbageVolume);
  }

  async eventNumbersHistory(
    item: GetGarbageStationnEventNumbersParams,
    divisionsId: string
  ) {
    let response = await this.requestService
      .post<
        GetGarbageStationnEventNumbersParams,
        HowellResponse<PagedList<EventNumberStatistic>>
      >(this.url.eventNumbersHistory(divisionsId), item)
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(
      response,
      EventNumberStatistic
    );
  }

  async statisticNumber(garbageStationId: string) {
    let response = await this.requestService
      .get<GarbageStationNumberStatistic>(
        this.url.statisticNumber(garbageStationId)
      )
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(
      response,
      GarbageStationNumberStatistic
    );
  }

  async statisticNumberList(item: GetGarbageStationStatisticNumbersParams) {
    let response = await this.requestService
      .post<
        GetGarbageStationStatisticNumbersParams,
        HowellResponse<PagedList<GarbageStationNumberStatistic>>
      >(this.url.statisticNumberList(), item)
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(
      response,
      GarbageStationNumberStatistic
    );
  }

  async statisticNumberListV2(item: GetGarbageStationStatisticNumbersParamsV2) {
    let response = await this.requestService
      .post<
        GetGarbageStationStatisticNumbersParamsV2,
        HowellResponse<GarbageStationNumberStatisticV2[]>
      >(this.url.statisticNumberHistoryList(), item)
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(
      response,
      GarbageStationNumberStatisticV2
    );
  }

  async manualCapture(stationId: string) {
    let response = await this.requestService
      .post<any, HowellResponse<CameraPictureUrl[]>>(
        this.url.manualCapture(stationId)
      )
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(response, CameraPictureUrl);
  }

  async cameraFile(
    stationId: string,
    cameraId: string,
    beginTime: string,
    endTime: string
  ) {
    return this.requestService
      .getStream(this.url.cameraFile(stationId, cameraId, beginTime, endTime))
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
        this.url.cameraFile(stationId, cameraId, beginTime, endTime)
      )
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(response, RecordFileUrl);
  }

  async statisticGarbageCount(
    item: GetGarbageStationStatisticGarbageCountsParams
  ) {
    let response = await this.requestService
      .post<
        GetGarbageStationStatisticGarbageCountsParams,
        HowellResponse<GarbageStationGarbageCountStatistic[]>
      >(this.url.statisticGarbageCountHistoryList(), item)
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(
      response,
      GarbageStationGarbageCountStatistic
    );
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
  async create(item: Camera) {
    let response = await this.requestService
      .post<Camera, HowellResponse<Camera>>(
        this.url.create(item.GarbageStationId),
        item
      )
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(response, Camera);
  }

  async get(garbageStationId: string, cameraId: string) {
    let response = await this.requestService
      .get<Camera>(this.url.get(garbageStationId, cameraId))
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(response, Camera);
  }

  async list(garbageStationId: string) {
    let response = await this.requestService
      .get<Camera[]>(this.url.create(garbageStationId))
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(response, Camera);
  }

  async set(item: Camera) {
    let response = await this.requestService
      .put<Camera, HowellResponse<Camera>>(
        this.url.edit(item.GarbageStationId, item.Id),
        item
      )
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(response, Camera);
  }

  async del(garbageStationId: string, cameraId: string) {
    let response = await this.requestService
      .delete<Camera>(this.url.del(garbageStationId, cameraId))
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(response, Camera);
  }

  async postList(item: GetGarbageStationCamerasParams) {
    let response = await this.requestService
      .post<GetGarbageStationCamerasParams, HowellResponse<PagedList<Camera>>>(
        this.url.list(),
        item
      )
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(response, Camera);
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
  async create(item: TrashCan) {
    let response = await this.requestService
      .post<TrashCan, HowellResponse<TrashCan>>(
        this.url.create(item.GarbageStationId, item.CameraId),
        item
      )
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(response, TrashCan);
  }

  async get(garbageStationId: string, cameraId: string, trashCanId: string) {
    let response = await this.requestService
      .get<TrashCan>(this.url.get(garbageStationId, cameraId, trashCanId))
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(response, TrashCan);
  }

  async set(item: TrashCan) {
    let response = await this.requestService
      .put<TrashCan, HowellResponse<TrashCan>>(
        this.url.edit(item.GarbageStationId, item.CameraId, item.Id),
        item
      )
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(response, TrashCan);
  }

  async del(garbageStationId: string, cameraId: string, trashCanId: string) {
    let response = await this.requestService
      .delete<TrashCan>(this.url.del(garbageStationId, cameraId, trashCanId))
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(response, TrashCan);
  }

  async list(garbageStationId: string, cameraId: string) {
    let response = await this.requestService
      .get<TrashCan[]>(this.url.list(garbageStationId, cameraId))
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(response, TrashCan);
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
  async create(item: TrashCan) {
    let response = await this.requestService
      .post<TrashCan, HowellResponse<TrashCan>>(
        this.url.create(item.GarbageStationId),
        item
      )
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(response, TrashCan);
  }

  async get(garbageStationId: string, cameraId: string) {
    let response = await this.requestService
      .get<TrashCan>(this.url.get(garbageStationId, cameraId))
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(response, TrashCan);
  }

  async set(item: TrashCan) {
    let response = await this.requestService
      .put<TrashCan, HowellResponse<TrashCan>>(
        this.url.edit(item.GarbageStationId, item.Id),
        item
      )
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(response, TrashCan);
  }

  async del(garbageStationId: string, cameraId: string) {
    let response = await this.requestService
      .delete<TrashCan>(this.url.del(garbageStationId, cameraId))
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(response, TrashCan);
  }

  async list(item: GetGarbageStationTrashCansParams) {
    let response = await this.requestService
      .post<
        GetGarbageStationTrashCansParams,
        HowellResponse<PagedList<TrashCan>>
      >(this.url.postList(), item)
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(response, TrashCan);
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
  async create(item: GarbageStationType) {
    let response = await this.requestService
      .post<GarbageStationType, HowellResponse<GarbageStationType>>(
        this.url.create(),
        SaveModel.toModel(item, SaveModel.formMustField.garbageStationType)
      )
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(
      response,
      GarbageStationType
    );
  }

  async get(type: string) {
    let response = await this.requestService.get<GarbageStationType>(
      this.url.get(type)
    );
  }

  async set(item: GarbageStationType) {
    let response = await this.requestService
      .put<GarbageStationType, HowellResponse<GarbageStationType>>(
        this.url.edit(item.Type + ""),
        SaveModel.toModel(item, SaveModel.formMustField.garbageStationType)
      )
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(
      response,
      GarbageStationType
    );
  }

  async del(type: string) {
    let response = await this.requestService
      .delete<GarbageStationType>(this.url.del(type))
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(
      response,
      GarbageStationType
    );
  }

  async list() {
    let response = await this.requestService
      .get<GarbageStationType[]>(this.url.list())
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(
      response,
      GarbageStationType
    );
  }
}
