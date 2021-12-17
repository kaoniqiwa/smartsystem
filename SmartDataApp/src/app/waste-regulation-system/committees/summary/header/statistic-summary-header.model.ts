export class StatisticSummaryHeaderViewModel {
  /** 垃圾处置达标率 */
  Garde: number = 100;
  /** 垃圾滞留任务处置率 */
  GarbageHandleRatio: number = 100;
  /** 垃圾滞留任务总数 */
  GarbageTotal: number = 0;
  /** 垃圾滞留任务完成数 */
  GarbageHandle: number = 0;

  /** 垃圾滞留时长(小时) */
  GarbageTimeHour: number = 0;
  /** 垃圾滞留时长(分钟) */
  GarbageTimeMinute: number = 0;
  /** 垃圾落地总数量 */
  IllegalDrop: number = 0;
  /** 混合投放总数量 */
  MixedInto: number = 0;
}
