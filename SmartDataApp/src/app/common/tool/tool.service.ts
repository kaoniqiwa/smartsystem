import { Injectable } from "@angular/core";
@Injectable()
export class ToolService {
  windowScreen: { width: number; height: number };
  constructor() {
    this.windowScreen = {
      width: window.screen.width,
      height: window.screen.height,
    };
  }
}

export function ToHoursMinutes(val: number) {
  const hours = parseInt((val / 60).toString());
  const minutes = parseInt((Math.ceil(val) % 60).toString());
  return {
    hours: hours,
    minutes: minutes,
  };
}

export function ArrayPagination<T>(
  pageNo: number,
  pageSize: number,
  array: T[]
) {
  var offset = (pageNo - 1) * pageSize;
  return offset + pageSize >= array.length
    ? array.slice(offset, array.length)
    : array.slice(offset, offset + pageSize);
}

export function Decimal(num: number) {
  return Math.floor(num * 100) / 100;
}

export function GetIntegerNum(num: string) {
  return parseInt(num.substring(0, num.indexOf(".") + 2));
}

export function GetDecimalNum(num: string) {
  if (num.indexOf(".") > -1) return num.substr(0, num.indexOf(".") + 3);
  else return num;
}

export function IntegerDecimalNum(num: string) {
  if (num.indexOf(".") > -1) return num.substr(0, num.indexOf(".") + 3);
  else return num;
}

/**
 *  JS 计算两个时间间隔多久（时分秒）
 */
export function DateDifference(faultDate: string, completeTime: Date) {
  // let d1 = new Date(faultDate);
  // let d2 = new Date(completeTime);
  var stime = new Date(faultDate).getTime();
  var etime = completeTime.getTime();

  var usedTime = etime - stime; //两个时间戳相差的毫秒数
  var days = Math.floor(usedTime / (24 * 3600 * 1000));
  //计算出小时数
  var leave1 = usedTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000));
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000));
  var time = "";
  if (days > 0) time += days + "天";
  if (hours > 0) time += hours + "时";
  if (minutes > 0) time += minutes + "分";
  //var time = days + "天"+hours+"时"+minutes+"分";
  //var time = days;
  return time;
}

export function pageCount(totalnum: number, limit: number) {
  return totalnum > 0
    ? totalnum < limit
      ? 1
      : totalnum % limit
      ? totalnum / limit + 1
      : totalnum / limit
    : 0;
}

export function TheBeforeDate(date: Date, days = 0, months = 0) {
  const y = date.getFullYear(),
    m = date.getMonth(),
    d = date.getDate();
  return {
    begin: new Date(y, m + months, d + days, 0, 0, 0),
    end: new Date(y, m + months, d + days, 23, 59, 59),
  };
}

export function TheDayTime(date: Date) {
  let y = date.getFullYear(),
    m = date.getMonth(),
    d = date.getDate();
  return {
    begin: new Date(y, m, d, 0, 0, 0),
    end: new Date(y, m, d, 23, 59, 59),
  };
}

export function TimeInterval(
  dateString: string,
  seconds = 0,
  minutes = 0,
  hours = 0,
  date = 0
) {
  const start = new Date(dateString),
    end = new Date(dateString);
  start.setSeconds(start.getSeconds() + seconds);
  start.setMinutes(start.getMinutes() + minutes);
  start.setHours(start.getHours() + hours);
  start.setDate(start.getDate() + date);
  return {
    start: start,
    end: end,
  };
}
export function DateInterval(
  dateString: string,
  seconds = 0,
  minutes = 0,
  hours = 0,
  date = 0
) {
  const newDate = new Date(dateString);
  newDate.setSeconds(newDate.getSeconds() + seconds);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  newDate.setHours(newDate.getHours() + hours);
  newDate.setDate(newDate.getDate() + date);
  return newDate;
}

export function MonthLastDay(year: number, month: number) {
  let date = new Date(year, month + 1);
  date.setMilliseconds(-1);
  return date.getDate();

  var new_year = year; //取当前的年份
  var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）
  if (month > 12) {
    new_month -= 12; //月份减
    new_year++; //年份增
  }
  var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天
  return new Date(new_date.getTime() - 1000 * 60 * 60 * 24).getDate(); //获取当月最后一天日期
}

//获取周1 - 周7
export function OneWeekDate(now: Date) {
  var week = now.getDay(); //获取时间的星期数
  var minus = week ? week - 1 : 6;
  var monday = new Date(now);
  monday.setDate(now.getDate() - minus); //获取minus天前的日期
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    monday: monday,
    sunday: sunday,
  };
}

//获取周1 - 周7
export function OneWeekDay(now: Date) {
  var week = now.getDay(); //获取时间的星期数
  var minus = week ? week - 1 : 6;
  var monday = new Date(now);
  monday.setDate(now.getDate() - minus); //获取minus天前的日期
  let days = new Array<string>();
  for (let i = 0; i < 7; i++)
    days.push(
      `${monday.getFullYear()}-${monday.getMonth() + 1}-${monday.getDate() + i}`
    );
  return days;
}

export function Percentage(num: number, total: number) {
  if (num == total) return 100;
  else if (total == 0) return 0;
  return Math.round((num / total) * 10000) / 100.0; // 小数点后两位百分比
}

export function isIPAddressOrLocalhost() {
  return (
    /(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/.test(location.hostname) ||
    location.hostname == "localhost"
  );
}
