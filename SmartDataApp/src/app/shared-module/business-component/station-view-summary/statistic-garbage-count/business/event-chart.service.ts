import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { GarbageStationRequestService } from "../../../../../data-core/repuest/garbage-station.service";
import { IllegalDropEventRequestService } from "../../../../../data-core/repuest/Illegal-drop-event-record";
import {
  TheDayTime,
  Decimal,
  ToHoursMinutes,
} from "../../../../../common/tool/tool.service";
import { ListAttribute } from "../../../../../common/tool/table-form-helper";
import { CandlestickOption } from "../../../../../common/directive/echarts/echart";
import {
  GarbageStationGarbageCountStatistic,
  GarbageStationNumberStatisticV2,
  GetGarbageStationStatisticGarbageCountsParams,
  GetGarbageStationStatisticNumbersParamsV2,
} from "../../../../../data-core/model/waste-regulation/garbage-station-number-statistic";
import {
  GetEventRecordsParams,
  IllegalDropEventRecord,
} from "../../../../../data-core/model/waste-regulation/illegal-drop-event-record";
import { EnumHelper } from "../../../../../common/tool/enum-helper";
import { GetVodUrlParams } from "../../../../../data-core/model/aiop/video-url";
import { GarbageStation } from "../../../../../data-core/model/waste-regulation/garbage-station";
import { Division } from "../../../../../data-core/model/waste-regulation/division";
import { moveView3 } from "../../../../../common/tool/jquery-help/jquery-help";
import { AIOPMediumPictureUrl } from "../../../../../data-core/url/aiop/resources";
import { DivisionListView } from "../../../event-history/division-list-view";
import { ResourceMediumRequestService } from "../../../../../data-core/repuest/resources.service";
import { Language } from "src/app/common/tool/language";
import { Flags } from "src/app/data-core/model/flags";
import { CameraUsage } from "src/app/data-core/model/enum";

@Injectable()
export class EventChartService extends ListAttribute {
  garbageStations: Array<GarbageStation>;
  divisions: Array<Division>;
  candlestickOption: CandlestickOption;
  divisionListView: DivisionListView;
  //garbageSelectOption: SelectOption;//????????????
  //divisionSelectOption:SelectOption;//??????
  stationDivision = "";
  garbageCountStatistic: Array<GarbageStationGarbageCountStatistic>;
  datePicker = {
    startView: 2,
    minView: 2,
    formate: "yyyy-mm-dd",
    default: this.datePipe.transform(new Date(), "yyyy???MM???dd???"),
  };
  search = {
    date: this.datePipe.transform(new Date(), "yyyy-MM-dd"),
    station: "",
  };
  playVideoToUrlFn: (
    id: string,
    time: Date | string,
    cb: (webUrl: string, url: string) => void
  ) => void;
  vodVideo: (
    param: GetVodUrlParams,
    cb: (weburl: string, url: string) => void
  ) => void;

  startDate = (date: any) => {
    this.search.date = this.datePipe.transform(date, "yyyy-MM-dd");
    this.usedTime = 0;
    this.initStatistical();
    this.requestData();
    this.illegalDumpView = false;
    this.illegalDropView = false;
  };

  // selectedItemFn = (id: string) => {
  //     this.search.station = id;
  //     this.usedTime = 0;
  //     this.initStatistical();
  //     this.requestData();
  //     this.illegalDumpView = false;
  //     this.illegalDropView = false;
  // }
  changeDivisionFn = (item: { id: string }) => {
    const station = this.garbageStations.find((x) => x.Id == item.id);
    if (item && station) {
      this.search.station = item.id;
      this.stationDivision = this.getStationDivision(station);
      this.initStatistical();
      this.requestData();
      this.illegalDumpView = false;
      this.illegalDropView = false;
    }
  };

  illegalDumpView = false;
  illegalDumpVideo = false;
  illegalDropView = false;
  illegalDropVideo = false;
  videoViewBottomTool: {
    left: { label: string; color: string }[];
    right: { label: string; color: string }[];
  };
  /** ????????? ?????? ????????? ????????? ????????????*/
  illegalDumpVideoImgs: {
    id: string;
    src: string;
    name: string;
    time: Date | string;
  }[];
  playIllegalDumpVideoTitle = "";

  /**???????????? ?????? ?????? ?????? */
  illegalDropTick: Array<{
    time: string;
    tag: Array<string>;
  }>;
  // illegalDumpViewY = 0;
  /**????????? ?????????????????? */
  illegalDumpData = {
    date: "",
    time: "",
    fullTime: "",
    heapNum: "",
    stationId: "",
  };
  /**???????????? */
  illegalDropImg = "";
  /**????????????id */
  illegalDropId = "";
  /**???????????????????????? */
  illegalDropPlayVideo: {
    url: string;
    name: string;
    webUrl: string;
  };
  /**??????y?????? */
  illegalViewY = 0;
  /** ??????????????????????????? ????????????*/
  illegalViewsMap = new Map<string, number>();
  statistical = new Array<{
    key: string;
    vals: Array<{
      val: number | string;
      unit: string;
    }>;
  }>();

  usedTime = 0;

  eventDataSource: Array<IllegalDropEventRecord>;

  videoClose = () => {
    this.illegalDropPlayVideo = null;
    this.illegalDumpVideoImgs = null;
    this.videoViewBottomTool = null;
    this.playIllegalDumpVideoTitle = "";
  };
  constructor(
    private datePipe: DatePipe,
    private eventRequestService: IllegalDropEventRequestService,
    private stationRequestService: GarbageStationRequestService
  ) {
    super();

    this.initStatistical();
  }

  getStationDivision(station: GarbageStation) {
    var t1 = "",
      t2 = "";
    const d1 = this.divisions.find((d) => d.Id == station.DivisionId);
    if (d1) {
      t2 = d1.Name;
      const d2 = this.divisions.find((d) => d.Id == d1.ParentId);
      if (d2) t1 = d2.Name;
    }
    return t1 + " " + t2;
  }

  clearView() {
    this.illegalDumpView = false;
    this.illegalDropView = false;
    this.illegalDropPlayVideo = null;
    this.videoViewBottomTool = null;
    this.illegalDumpData = null;
    this.illegalDropImg = "";
    this.illegalDropId = "";
    this.illegalViewsMap = new Map<string, number>();
  }

  initStatistical() {
    this.statistical = [
      { key: "?????????", vals: [{ val: 0, unit: "???" }] },
      {
        key: "??????????????????",
        vals: [
          { val: 0, unit: Language.json.Time.hour },
          { val: 0, unit: Language.json.Time.minute },
        ],
      },
      {
        key: "??????????????????",
        vals: [
          { val: 0, unit: Language.json.Time.hour },
          { val: 0, unit: Language.json.Time.minute },
        ],
      },
      {
        key: "???????????????",
        vals: [
          { val: 0, unit: Language.json.Time.hour },
          { val: 0, unit: Language.json.Time.minute },
        ],
      },
      {
        key: Language.json.EventType.IllegalDrop,
        vals: [{ val: 0, unit: Language.json.Suffix.event }],
      },
    ];
  }

  findGarbageCountToTime(beginTime: string) {
    const bt = new Date(beginTime),
      g = this.garbageCountStatistic.filter((e) => {
        const date = new Date(e.BeginTime);
        return (
          date.getHours() == bt.getHours() &&
          date.getMinutes() == bt.getMinutes()
        );
      });
    if (g && g.length) return g[0];
    else return null;
  }

  // covertStationList(stations: GarbageStation[]) {
  //     this.garbageSelectOption = new SelectOption();
  //     this.garbageSelectOption.listNodes = new Array();
  //     stations.map(c => this.garbageSelectOption.listNodes.push({
  //         id: c.Id,
  //         name: c.Name
  //     }));
  //     this.garbageStations = stations;
  // }

  // covertDivisionList(divisions: Division[]) {
  //     this.divisionSelectOption = new SelectOption();
  //     this.divisionSelectOption.listNodes = new Array();
  //     divisions.map(c => this.divisionSelectOption.listNodes.push({
  //         id: c.Id,
  //         name: c.Name
  //     }));
  //     this.divisions = divisions;
  // }

  covertStatistical(statisticV2: Array<GarbageStationNumberStatisticV2>) {
    statisticV2.map((s) => {
      //console.log(s);
      const toHour = (val: number) => {
        const hm = ToHoursMinutes(val);
        return `${hm.hours}:${hm.minutes}`;
      };
      this.statistical[0].vals[0].val = Decimal(s.GarbageRatio);

      if (s.AvgGarbageTime < 1)
        //???????????? ????????? 0 ?????????
        this.statistical[1].vals = new Array();
      else {
        this.statistical[1].vals[0].val = toHour(s.AvgGarbageTime).split(
          ":"
        )[0];
        this.statistical[1].vals[1].val = toHour(s.AvgGarbageTime).split(
          ":"
        )[1];
      }
      if (s.MaxGarbageTime < 1) this.statistical[2].vals = new Array();
      else {
        this.statistical[2].vals[0].val = toHour(s.MaxGarbageTime).split(
          ":"
        )[0];
        this.statistical[2].vals[1].val = toHour(s.MaxGarbageTime).split(
          ":"
        )[1];
      }
      if (s.GarbageDuration < 1) this.statistical[3].vals = new Array();
      else {
        this.statistical[3].vals[0].val = toHour(s.GarbageDuration).split(
          ":"
        )[0];
        this.statistical[3].vals[1].val = toHour(s.GarbageDuration).split(
          ":"
        )[1];
      }

      // console.log(this.statistical);
    });
  }

  illegalDumpVideoImgsView(
    garbageCount: GarbageStationGarbageCountStatistic,
    time?: string
  ) {
    if (garbageCount == null) {
      const station = this.garbageStations.find((x) => {
          return x.Id == this.search.station;
        }),
        eh = new EnumHelper(),
        cameras = station.Cameras.filter((c) => {
          return c.CameraUsage == 0;
          let flags = new Flags(c.CameraUsage);
          return flags.contains(CameraUsage.None);
        });
      if (cameras.length) {
        this.illegalDumpVideoImgs = new Array();
        cameras.map((c) => {
          this.illegalDumpVideoImgs.push({
            id: c.Id,
            src: ResourceMediumRequestService.getJPG(c.ImageUrl),
            name: c.Name,
            time: this.search.date + " " + time,
          });
        });
        this.playIllegalDumpVideoTitle = station.Name;
        this.videoViewBottomTool = {
          left: [
            { label: "????????????", color: "text-white" },
            { label: "0", color: "orange-text" },
            { label: "???", color: "text-white" },
          ],
          right: [
            {
              label: this.datePipe.transform(
                this.search.date + " " + time,
                "yyyy-MM-dd"
              ),
              color: "text-white",
            },
            {
              label: this.datePipe.transform(
                this.search.date + " " + time,
                "HH:mm"
              ),
              color: "text-white",
            },
          ],
        };
      }
    } else {
      const station = this.garbageStations.find((x) => {
          return x.Id == garbageCount.Id;
        }),
        eh = new EnumHelper(),
        cameras = station.Cameras.filter((c) => {
          return c.CameraUsage == 0;
          let flags = new Flags(c.CameraUsage);
          return flags.contains(CameraUsage.MixedInto);
        });
      if (cameras.length) {
        this.illegalDumpVideoImgs = new Array();
        cameras.map((c) => {
          this.illegalDumpVideoImgs.push({
            id: c.Id,
            src: ResourceMediumRequestService.getJPG(c.ImageUrl),
            name: c.Name,
            time: garbageCount.BeginTime,
          });
        });
        this.playIllegalDumpVideoTitle = garbageCount.Name;
        this.videoViewBottomTool = {
          left: [
            { label: "????????????", color: "text-white" },
            { label: garbageCount.GarbageCount + "", color: "orange-text" },
            { label: "???", color: "text-white" },
          ],
          right: [
            {
              label: this.datePipe.transform(
                garbageCount.BeginTime,
                "yyyy-MM-dd"
              ),
              color: "text-white",
            },
            {
              label: this.datePipe.transform(garbageCount.BeginTime, "HH:mm"),
              color: "text-white",
            },
          ],
        };
      }
    }
  }

  fillCandlestickOption(
    lineDataSource: Array<GarbageStationGarbageCountStatistic>,
    eventNumberStatistic: Array<IllegalDropEventRecord>
  ) {
    this.candlestickOption = new CandlestickOption();
    this.candlestickOption.itemClick = (param) => {
      //console.log(param);
      var offsetX = param.event.offsetX - 100;
      //console.log(offsetX,this.illegalViewY);

      if (param.seriesName == "theBar" || param.seriesName == "theBarA") {
        this.illegalDropView = true;
        this.illegalDumpView = false;
        this.illegalViewY =
          this.illegalViewY == 0 ? param.event.offsetY - 0 : this.illegalViewY;
        const nameSplite = param.name.split(":"),
          events = this.eventDataSource.filter((e) => {
            const date = new Date(e.EventTime);
            return (
              date.getHours() + "" == nameSplite[0] &&
              (date.getMinutes() < 10
                ? "0" + date.getMinutes()
                : date.getMinutes()) == nameSplite[1]
            );
          });

        if (param.seriesName == "theBar") {
          this.illegalDropImg = events.length
            ? ResourceMediumRequestService.getJPG(events[0].ImageUrl)
            : "";
          this.illegalDropId = events.length ? events[0].EventId : "";
        } else if (param.seriesName == "theBarA") {
          this.illegalDropId = events.length ? events[1].EventId : "";
          this.illegalDropImg =
            events.length > 1
              ? ResourceMediumRequestService.getJPG(events[1].ImageUrl)
              : "";
        }

        if (this.illegalViewsMap.get(this.illegalDropId)) {
          moveView3(
            "illegalDropView",
            this.illegalViewsMap.get(this.illegalDropId),
            this.illegalViewY
          );
        } else {
          this.illegalViewsMap.set(this.illegalDropId, offsetX);
          moveView3("illegalDropView", offsetX, this.illegalViewY);
        }
        // console.log(offsetX, domSize('chartView'));
      } else if (param.seriesName == "theLine") {
        this.illegalDropView = false;

        const nameSpliteA = param.name.split(":"),
          toHour = (val: number) => {
            const hm = ToHoursMinutes(val);
            return `${hm.hours}:${hm.minutes}`;
          },
          garbageCount = this.garbageCountStatistic.filter((e) => {
            const date = new Date(e.BeginTime);
            return (
              date.getHours() + "" == nameSpliteA[0] &&
              (date.getMinutes() < 10
                ? "0" + date.getMinutes()
                : date.getMinutes()) == nameSpliteA[1]
            );
          });
        var offsetY = param.event.offsetY + 50;
        this.illegalDumpView = garbageCount && garbageCount.length > 0;

        garbageCount.map((g) => {
          var gd = "";
          gd +=
            toHour(g.GarbageDuration).split(":")[0] + Language.json.Time.hour;
          gd +=
            toHour(g.GarbageDuration).split(":")[1] + Language.json.Time.minute;

          this.illegalDumpData = {
            fullTime: gd,
            heapNum: g.GarbageCount + "",
            date: this.datePipe.transform(g.BeginTime, "yyyy-MM-dd"),
            time: this.datePipe.transform(g.BeginTime, "HH:mm"),
            stationId: g.Id,
          };
          //  offsetY = g.GarbageCount > 0 ? (param.event.offsetY / 3) : offsetY;
        });

        moveView3("illegalDumpView", offsetX, offsetY);
      }
    };
    this.candlestickOption.dataZoomClick = (param) => {
      //   toIllegalDropTick(param.batch[0].start, param.batch[0].end);
      this.clearView();
    };
    this.candlestickOption.dbitemClick = (param) => {
      const nameSpliteA = param.split(":"),
        garbageCount = this.garbageCountStatistic.filter((e) => {
          const date = new Date(e.BeginTime);
          return (
            date.getHours() + "" == nameSpliteA[0] &&
            (date.getMinutes() < 10
              ? "0" + date.getMinutes()
              : date.getMinutes()) == nameSpliteA[1]
          );
        }),
        gc = garbageCount.length ? garbageCount[0] : null;

      this.illegalDumpVideoImgsView(gc, param);
    };

    this.candlestickOption.barData = new Array();
    this.candlestickOption.barDataB = new Array();
    this.candlestickOption.lineData = new Array();
    this.candlestickOption.lineDataB = new Array();
    this.candlestickOption.xAxisBar = new Array();
    this.candlestickOption.xAxisLine = new Array();
    // console.log(eventNumberStatistic);
    const toFormat = function (params: { value: number }) {
      return params.value == 0 ? "" : "{Sunny|}";
    };
    const rich = {
      value: {
        // lineHeight: 18,
        align: "center",
      },
      Sunny: {
        width: 12,
        height: 18,
        align: "center",
        backgroundColor: {
          image: "/assets/img/arrow-tag-a.png",
        },
        // opacity: 0.3
      },
    };
    for (var i = 9; i <= 21; i++)
      for (var u = 0; u < 60; u++) {
        const m = u < 10 ? "0" + u : u == 60 ? "00" : u;

        this.candlestickOption.xAxisLine.push(i + ":" + m);
        this.candlestickOption.xAxisBar.push(i + ":" + m);
        this.candlestickOption.barData.push({
          value: 0,
          itemStyle: {
            color: "rgba(16,22,48,0)",
            //color: '#fff'
          },
          label: {
            show: false,
            formatter: toFormat,
            rich: rich,
          },
          emphasis: {
            label: {
              rich: {
                Sunny: {
                  width: 12,
                  height: 18,
                  align: "center",
                  backgroundColor: {
                    image: "/assets/img/arrow-tag.png",
                  },
                },
              },
            },
          },
        });
        this.candlestickOption.barDataB.push({
          value: 0,
          itemStyle: {
            color: "rgba(16,22,48,0)",
          },
          label: {
            show: false,
            formatter: toFormat,
            rich: rich,
          },
          emphasis: {
            label: {
              rich: {
                Sunny: {
                  width: 12,
                  height: 18,
                  align: "center",
                  backgroundColor: {
                    image: "/assets/img/arrow-tag.png",
                  },
                },
              },
            },
          },
        });
        if (i == 21) break;
      }

    // toIllegalDropTick(0, 100);
    var tag = 0;
    for (var i = 9; i < 21; i++)
      for (var u = 0; u < 60; u++) {
        const item = lineDataSource.find((x) => {
            const date = new Date(x.BeginTime);
            return date.getHours() == i && date.getMinutes() == u;
          }),
          events = eventNumberStatistic.filter((x) => {
            const date = new Date(x.EventTime);
            return date.getHours() == i && date.getMinutes() == u;
          });

        var garbageCount = 0;
        if (item) {
          // green  coffee
          garbageCount = item.GarbageCount > 0 ? 1 : 0;
          this.candlestickOption.lineDataB.push("-"); //??????
        } else this.candlestickOption.lineDataB.push(0); //gay ??????

        this.candlestickOption.lineData.push(garbageCount);

        // if (events && events.length == 2) {

        //     this.candlestickOption.barDataB[tag].value = 1;
        //     this.candlestickOption.barDataB[tag].label.show = true;
        //     (this.statistical[4].vals[0].val as number) += 1;
        // }
        if (events.length) {
          this.candlestickOption.barData[tag].value = 1;
          this.candlestickOption.barData[tag].label.show = true;
          (this.statistical[4].vals[0].val as number) += 1;
        }
        tag += 1;
      }

    /** 9:00 ?????? */
    this.candlestickOption.lineData.push(0);
    /**
     * ??????????????? ???
     */
    const grayIndex = new Array<number>();
    for (let i = 0; i < this.candlestickOption.lineDataB.length; i++)
      if (this.candlestickOption.lineDataB[i] == 0) grayIndex.push(i + 1);

    grayIndex.map((g) => {
      this.candlestickOption.lineDataB[g] = 0;
    });
    //???????????? ????????? 0 ?????????
    if (this.statistical[4].vals[0].val == 0)
      this.statistical[4].vals = new Array();
  }

  playingVideo() {
    const param = new GetVodUrlParams(),
      event = this.eventDataSource.find((x) => x.EventId == this.illegalDropId);
    param.BeginTime = event.EventTime;
    param.EndTime = event.EventTime;
    param.CameraId = event.ResourceId;
    this.vodVideo(param, (webUrl, url) => {
      this.illegalDropPlayVideo = {
        name: event.ResourceName,
        url: url,
        webUrl: webUrl,
      };
    });
  }

  async requestData() {
    const param = this.getRequsetParam(),
      result1 = await this.stationRequestService.statisticGarbageCount(
        param.garbageCountsParam
      ),
      eventHistory = await this.eventRequestService.list(param.eventParam);
    this.garbageCountStatistic = result1;
    //   console.log(result1.Data);

    this.eventDataSource = eventHistory.Data;
    this.fillCandlestickOption(result1, eventHistory.Data);

    const statisticNumbers2 =
      await this.stationRequestService.statisticNumberListV2(
        param.statisticNumbersParamsV2
      );

    this.covertStatistical(statisticNumbers2);
    //console.log(statisticNumbers2.Data);
    // this.toScore();
  }

  getRequsetParam() {
    const eventParam = new GetEventRecordsParams(),
      garbageCountsParam = new GetGarbageStationStatisticGarbageCountsParams(),
      statisticNumbersParamsV2 =
        new GetGarbageStationStatisticNumbersParamsV2(),
      date = new Date(this.search.date),
      theDay = TheDayTime(date);

    eventParam.BeginTime = theDay.begin;
    eventParam.EndTime = theDay.end;
    eventParam.StationIds = [this.search.station];
    eventParam.PageIndex = 1;
    eventParam.PageSize = this.maxSize;
    garbageCountsParam.Date = new Date(this.search.date);
    garbageCountsParam.GarbageStationIds = [this.search.station];
    statisticNumbersParamsV2.GarbageStationIds = [this.search.station];
    statisticNumbersParamsV2.BeginTime = theDay.begin;
    statisticNumbersParamsV2.EndTime = theDay.end;
    statisticNumbersParamsV2.TimeUnit = 1;
    return {
      eventParam: eventParam,
      garbageCountsParam: garbageCountsParam,
      statisticNumbersParamsV2: statisticNumbersParamsV2,
    };
  }
}
