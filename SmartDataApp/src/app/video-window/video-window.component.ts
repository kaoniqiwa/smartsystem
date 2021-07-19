import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { VideoPlayArgs } from "../video/mode";
import { DatePipe } from "@angular/common";
import { UserDalService } from "../dal/user/user-dal.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

declare var $: any;
export const ConfigType = {
  Map: 1,
  MapStatisticVideo: 2,
  MapStatisticLayout: 3,
  GisMapVideoLive: 4,
};

@Component({
  selector: "app-video-window",
  templateUrl: "./video-window.component.html",
  styleUrls: ["./video-window.component.css"],
})
export class VideoWindowComponent implements OnInit, OnDestroy {
  @Input() videoPlayArgs?: VideoPlayArgs;
  @Input() playMode: PlayModeEnum;
  @Input() cameraId = ""; // 00310101031111111000003001000003
  @Input() nodeId: Array<String>;
  @Input() hasControl = true;
  // @Input() cameraName = '';

  protected _cameraName = "";
  get cameraName(): string {
    return this._cameraName;
  }
  @Input() set cameraName(value: string) {
    this._cameraName = value;
  }

  delayPlayHandle: NodeJS.Timer;

  private _url = "";
  get url() {
    return this._url;
  }
  @Input()
  set url(val: string) {
    this._url = val;
    if (val) {
      this.videoPlayArgs = VideoPlayArgs.FromUrl(val);
      this.videoPlayArgs.stream = this.stream;
    }
  }

  @Input()
  WebUrl: string;

  hdVideo = false;

  @ViewChild("date") txtDate;
  @ViewChild("begin_time") txtBeginTime;
  @ViewChild("end_time") txtEndTime;

  private _userId: string;
  private get userId() {
    if (!this._userId) {
      this._userId = localStorage.getItem("userId");
    }
    return this._userId;
  }

  private _stream = 1;

  get stream() {
    return this._stream;
  }
  set stream(hd: number) {
    const saveDB = async (userId) => {
      const fault = await this.userDalService.editUserConfig(
        userId,
        ConfigType.GisMapVideoLive.toString(),
        hd.toString()
      );
      if (fault && fault.FaultCode === 0) {
        this._stream = hd;
        this.hdVideo = this._stream === 1;
      }
    };
    saveDB(this.userId);
  }

  private srcUrl: SafeResourceUrl;

  private _player: WSPlayerProxy;
  get player(): WSPlayerProxy {
    if (!this._player) {
      this._player = new WSPlayerProxy(this.divId);
    }
    return this._player;
  }
  isChangeMode = true;
  guid: string = Guid.NewGuid().ToString("N");

  @Input() videoWidth = "404px";

  beginTime: string;

  endTime: string;

  date: string;

  private _devId = "";
  get divId() {
    return this._devId;
  }
  set divId(val: string) {
    this._devId = val;
    this._player = new WSPlayerProxy(this._devId);
  }

  screenId = "";

  modalWindowEmit: EventEmitter<boolean>;
  playMode_ = PlayModeEnum;
  private viewModel_: ViewModel;
  @Output() closeWindowEventListen: EventEmitter<string> = new EventEmitter();
  @Output() closeWindowOnloadEventListen: EventEmitter<string> =
    new EventEmitter();
  @Output() changeModeEventListen: EventEmitter<PlayModeEnum> =
    new EventEmitter();
  @Output() PlaybackClickedListen: EventEmitter<{ begin: Date; end: Date }> =
    new EventEmitter();
  @Output() VideoPlayingEventListen: EventEmitter<boolean> = new EventEmitter();
  @Output() DownloadClickedEventListen: EventEmitter<{
    begin: Date;
    end: Date;
  }> = new EventEmitter();

  setBeginTime(time: Date) {
    $("#txt_begin_time").wickedpicker({
      now: time.format("HH : mm : ss"),
      twentyFour: true,
      showSeconds: true,
    });
    this.beginTime = time.format("HH : mm : ss");
  }
  setEndTime(time: Date) {
    $("#txt_end_time").wickedpicker({
      now: time.format("HH : mm : ss"),
      twentyFour: true,
      showSeconds: true,
    });
    this.endTime = time.format("HH : mm : ss");
  }

  constructor(
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private userDalService: UserDalService
  ) {
    if (this.hasControl) {
      if (this.viewModel_ == null) {
        this.viewModel_ = new ViewModel();
      }
    }
    this.modalWindowEmit = new EventEmitter();
    this.modalWindowEmit.emit(true);
  }

  set videoPlayArgs_(v: any) {
    this.videoPlayArgs = v;
    this.videoPlayArgs.stream = this.stream;
  }
  get viewModel() {
    return this.viewModel_;
  }

  changePlayMode(parm: PlayModeEnum, eleId: any) {
    this.playMode = parm;
    if (!this.player) {
      return;
    }
    try {
      if (this.player) {
        this.player.stop();
      }
    } catch (ex) {
      // console.warn(ex);
    }
    // this.playMode_ = parm;
    if (!eleId) {
      this.changeModeEventListen.emit(parm);
    }
  }

  initDateTimePicker() {
    const this_ = this,
      getDate = (d: any) => {
        const date = new Date(d);
        return {
          beginTime: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            0,
            0
          ).toISOString(),
          endTime: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            23,
            59
          ).toISOString(),
        };
      },
      saveTime = (date: Date) => {
        const b_e = getDate(date);
        this_.viewModel.recordFilePage.beginTime = b_e.beginTime;
        this_.viewModel.recordFilePage.endTime = b_e.endTime;
      };
    if (
      this.playMode === this.playMode_.vod ||
      this.playMode === this.playMode_.live
    ) {
      const date = new Date();
      saveTime(date);
      this.searchFilesClick();
      setTimeout(() => {
        $('[data-picker="date"]')
          .datetimepicker({
            format: "yyyy-mm-dd",
            weekStart: 0,
            autoclose: true,
            startView: 2,
            minView: 2,
            language: "zh-CN",
            initialDate: date,
          })
          .on("changeDate", function (ev) {
            saveTime(ev.date);
          });
      });
    }
  }

  initPresetList() {
    this.viewModel.PTZ.presetControl = new Array();
    for (let i = 1; i <= 255; i++) {
      this.viewModel.PTZ.presetControl.push(new PresetControl(i, false));
    }
  }

  videoItemClick(item: any) {
    if (this.videoPlayArgs && this.videoPlayArgs.deviceId) {
      // if(item.beginTime)
      this.videoPlayArgs.begin = new Date(item.beginTime).toISOString();
      // if(item.endTime)
      this.videoPlayArgs.begin = new Date(item.endTime).toISOString();
      this.playVideo();
      for (const f of this.viewModel.recordFilePage.list) {
        f.isSelect = false;
      }
      item.isSelect = true;
    }
  }

  async getStream() {
    try {
      const strStream = await this.userDalService.getUserConfig(
        this.userId,
        ConfigType.GisMapVideoLive.toString()
      );
      if (strStream) {
        this._stream = parseInt(strStream);
      }
    } catch (ex) {
      console.log("getStream error");
    }
  }

  initTime() {
    let date = new Date();
    this.setEndTime(date);
    date.setMinutes(date.getMinutes() - 5);
    this.setBeginTime(date);
  }

  async ngOnInit() {
    const me = this;

    this.getStream();

    document.addEventListener("fullscreenchange", () => {
      const ele = document.getElementById("videoWindowView");
      if (ele.offsetWidth <= 900 && ele.offsetHeight <= 1200) {
        ele.setAttribute("data-full", "0");
      }
    });
    if (me.hasControl) {
      me.initDateTimePicker();
      me.initPresetList();
      setTimeout(() => {
        $("#ra__").rangeslider({
          polyfill: false,
          rangeClass: "rangeslider",
          horizontalClass: "rangeslider--horizontal",
          fillClass: "rangeslider__fill",
          handleClass: "rangeslider__handle",
          onSlide: function (position, value) {
            me.viewModel.PTZ.speed = value;
          },
        });
      });
      setTimeout(() => {
        const date = new Date();
        this.date = date.format("yyyy-MM-dd");
        // $('#txt_end_time').timepicker({
        //     minuteStep: 1,
        //     showSeconds: true,
        //     showMeridian: false,
        //     defaultTime: date.getHours() + ':' + date.getMinutes() + ':' + '00'
        // });
        // date.setMinutes(date.getMinutes() - 5);
        // $('#txt_begin_time').timepicker({
        //     minuteStep: 1,
        //     showSeconds: true,
        //     showMeridian: false,
        //     defaultTime: date.getHours() + ':' + date.getMinutes() + ':' + '00'
        // });
      });
      // setTimeout(() => {
      //     if (me.playMode === me.playMode_.live) {
      //         me.playVideo();
      //     }

      // }, 1200);
    } else {
      me.playVideo();
    }
  }

  initPlayBackView() {
    this.initDateTimePicker();
  }

  getSrc(webUrl: string, url: string, cameraName?: string) {
    let result = webUrl + "?url=" + base64encode(url);
    if (cameraName) {
      let name = utf16to8(cameraName);
      result += "&name=" + base64encode(name);
    }
    return result;
  }

  playVideo() {
    const me = this;
    me.divId = "div" + me.guid;
    me.screenId = "screen" + me.guid;

    if (me.videoPlayArgs) {
      me.url = me.videoPlayArgs.toString();
      this.hdVideo = me.videoPlayArgs.stream === 1;
    }

    if (!this.url) {
      return;
    }
    setTimeout(() => {
      this.srcUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.getSrc(this.WebUrl, this.url, this.cameraName)
      );
      this.VideoPlayingEventListen.emit(true);
    }, 10);
  }

  closeWindow(): void {
    const sc = document.getElementById(this.guid);
    if (sc) {
      sc.parentElement.removeChild(sc);
    }
    if (this.closeWindowEventListen) {
      this.closeWindowEventListen.emit("");
    }
    this.modalWindowEmit.emit(false);
  }

  ngOnDestroy() {
    const sc = document.getElementById(this.guid);
    if (sc && sc.parentElement) {
      sc.parentElement.removeChild(sc);
    }
    this.closeWindowOnloadEventListen.emit("closed");
  }

  async loadRecordFileList(
    playMode: PlayModeEnum,
    cameraId: string,
    beginTime: string,
    endTime: string,
    pageIndex: number,
    pageSize: number
  ) {
    if (cameraId && beginTime && endTime && playMode === PlayModeEnum.vod) {
      // const pagedList = await this.videoSecurityDALService.getRecordsFiles(cameraId, pageIndex, pageSize, beginTime, endTime);
      // if (pagedList) {
      //     for (const d of pagedList.Data) {
      //         if (d.BeginTime && d.EndTime) {
      //             const text = this.datePipe.transform(d.BeginTime, 'HH:mm:ss')
      //                 + ' - '
      //                 + this.datePipe.transform(d.EndTime, 'HH:mm:ss');
      //             this.viewModel.recordFilePage.list.push(new PlayBackFile(text, d.BeginTime, d.EndTime));
      //         }
      //     }
      // }
    }
  }

  presetListItemClick(item: any) {
    for (const x of this.viewModel.PTZ.presetControl) {
      x.isSelect = false;
    }
    item.isSelect = true;
  }
  videoFullscreen() {
    const element = document.getElementById("videoWindowView");
    if (element.requestFullscreen && this.viewModel.isFillVideo === false) {
      this.viewModel.isFillVideo = true;
      element.requestFullscreen();
      return;
    }
    if (this.viewModel.isFillVideo) {
      document.exitFullscreen();
      this.viewModel.isFillVideo = false;
    }
  }
  searchFilesClick() {
    this.viewModel.recordFilePage.list = [];
    this.loadRecordFileList(
      this.playMode,
      this.cameraId,
      this.viewModel.recordFilePage.beginTime,
      this.viewModel.recordFilePage.endTime,
      this.viewModel.recordFilePage.index,
      20
    );
  }
  loadMoreFiles() {
    this.loadRecordFileList(
      this.playMode,
      this.cameraId,
      this.viewModel.recordFilePage.beginTime,
      this.viewModel.recordFilePage.endTime,
      this.viewModel.recordFilePage.index,
      20
    );
  }

  changeSpeed(v: string) {
    const m = v.match(/^\d{1,7}$/);
    if (m != null) {
      // tslint:disable-next-line:radix
      this.viewModel.PTZ.speed = Number.parseInt(v);
    } else {
      this.viewModel.PTZ.speed = 1;
    }
    $("#ra__").val(this.viewModel.PTZ.speed);
    $("#ra__").trigger("change");
  }

  playback_click() {
    const date = document.getElementById("txt_date") as HTMLInputElement;
    const begin = document.getElementById("txt_begin_time") as HTMLInputElement;
    const end = document.getElementById("txt_end_time") as HTMLInputElement;

    this.PlaybackClickedListen.emit({
      begin: new Date(date.value + " " + begin.value.replace(/ /g, "")),
      end: new Date(date.value + " " + end.value.replace(/ /g, "")),
    });
  }

  changeVideoStream(hd: number) {
    if (!this.url) {
      return;
    }
    this.videoPlayArgs = VideoPlayArgs.FromUrl(this.url);
    this.videoPlayArgs.stream = hd;
    this._url = this.videoPlayArgs.toString();
    this.playVideo();
    this.stream = hd;
  }

  onDownloadClicked() {
    try {
      if (this.DownloadClickedEventListen) {
        const date = document.getElementById("txt_date") as HTMLInputElement;
        const txtBegin = document.getElementById(
          "txt_begin_time"
        ) as HTMLInputElement;
        const txtEnd = document.getElementById(
          "txt_end_time"
        ) as HTMLInputElement;
        const begin = new Date(
          date.value + " " + txtBegin.value.replace(/ /g, "")
        );
        const end = new Date(date.value + " " + txtEnd.value.replace(/ /g, ""));
        this.DownloadClickedEventListen.emit({ begin: begin, end: end });
      }
    } catch (ex) {
      console.error(ex);
    }
  }
}

export enum PlayModeEnum {
  vod = "vod",
  live = "live",
}

enum DirectionEnum {
  stop,
  up,
  down,
  left,
  right,
  up_left,
  up_right,
  down_left,
  down_right,
}

enum LensEnum {
  stop,
  halo_on,
  halo_off,
  zoom_in,
  zoom_out,
  far,
  unfar,
}

enum RresetEnum {
  clear,
  set,
  do,
}

class ViewModel {
  clickTag = false;
  isFillVideo = false;
  recordFilePage = {
    index: 1,
    beginTime: "",
    endTime: "",
    list: new Array(),
  };
  PTZ = {
    direction: DirectionEnum,
    reset: RresetEnum,
    len: LensEnum,
    speed: 4,
    presetControl: new Array(),
  };
  scroll = {
    // 滚动条组件参数
    throttle: 300,
    scrollDistance: 1,
    scrollUpDistance: 2,
    scrollWindow: false,
  };
}
class PlayBackFile {
  labelText: string;
  beginTime: string;
  endTime: string;
  isSelect: boolean;
  constructor(labelText: string, beginTime: string, endTime: string) {
    this.labelText = labelText;
    this.beginTime = beginTime;
    this.endTime = endTime;
    this.isSelect = false;
  }
}

class PresetControl {
  no: number;
  isSet: boolean;
  constructor(no: number, isSet: boolean) {
    this.no = no;
    this.isSet = isSet;
  }
}
