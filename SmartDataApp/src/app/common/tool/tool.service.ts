import { Injectable } from "@angular/core"; 
@Injectable()
export class ToolService {
    windowScreen: { width: number, height: number };
    constructor() {
        this.windowScreen = {
            width: window.screen.width,
            height: window.screen.height
        }
    }
}

export function ArrayPagination<T>(pageNo:number, pageSize:number, array:T[]) {
    var offset = (pageNo - 1) * pageSize;
    return (offset + pageSize >= array.length) ? 
    array.slice(offset, array.length) : array.slice(offset, offset + pageSize);
    
}


/**
 * JS 计算两个时间间隔多久（时分秒）
 * @param startTime "2019-10-23 15:27:23"
 * @param endTime "2019-10-23 15:27:55"
 * @return 1天2时3分5秒
 */
export function TwoTimeInterval(startTime:string, endTime:Date) {
 
    // 开始时间
    //let d1 = startTime.replace(/\-/g, "/");
    let date1 = new Date(startTime);
   
    // 结束时间
    //let d2 = endTime.replace(/\-/g, "/");
    //let date2 = new Date(d2);
    const date2 = endTime;
    // 时间相差秒数
    let dateDiff = date2.getTime() - date1.getTime();
   
    // 计算出相差天数
    let days = Math.floor(dateDiff / (24 * 3600 * 1000));
   
    // 计算出小时数
    let residue1 = dateDiff % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
    let hours = Math.floor(residue1 / (3600 * 1000));
   
    // 计算相差分钟数
    let residue2 = residue1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
    let minutes = Math.floor(residue2 / (60 * 1000));
   
    // 计算相差秒数
    let residue3 = residue2 % (60 * 1000); // 计算分钟数后剩余的毫秒数
    let seconds = Math.round(residue3 / 1000);
   
    let returnVal =
    //   ((days == 0) ? "" : days+"天") +
      ((hours == 0) ? "" : days+"时") +
      ((minutes == 0) ? "" : minutes+"分");
      //+((seconds == 0) ? "" : seconds+"秒");
   
    return returnVal;
   
  }

export function pageCount (totalnum:number,limit:number){
    return totalnum > 0 ? 
    ((totalnum < limit) 
    ? 1 : ((totalnum % limit) 
    ? ((totalnum / limit) + 1) : (totalnum / limit))) : 0;
}


export function TheDayTime(date: Date) {
    let y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
    return {
        begin: new Date(y, m, d, 0, 0, 0)
        , end: new Date(y, m, d, 23, 59, 59)
    }
}

export function TimeInterval(dateString: string, seconds = 0, minutes = 0, hours = 0, date = 0) {
    const start = new Date(dateString), end = new Date(dateString);
    start.setSeconds(start.getSeconds() + seconds);
    start.setMinutes(start.getMinutes() + minutes);
    start.setHours(start.getHours() + hours);
    start.setDate(start.getDate() + date);
    return {
        start: start,
        end: end
    }
}
export function DateInterval(dateString: string, seconds = 0, minutes = 0, hours = 0, date = 0 ) {
    const newDate = new Date(dateString);
    newDate.setSeconds(newDate.getSeconds() + seconds);
    newDate.setMinutes(newDate.getMinutes() + minutes);
    newDate.setHours(newDate.getHours() + hours);
    newDate.setDate(newDate.getDate() + date); 
    return  newDate;
}

export function MonthLastDay(year:number, month:number) {
    var new_year = year; //取当前的年份
    var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）
    if (month > 12) {
        new_month -= 12; //月份减
        new_year++; //年份增
    }
    var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天
    return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();//获取当月最后一天日期
}

//获取周1 - 周7
export  function OneWeekDate(now:Date) {
    var nowTime = now.getTime();
    var day = now.getDay();
    var oneDayLong = 24 * 60 * 60 * 1000;
    var MondayTime = nowTime - (day - 1) * oneDayLong;
    var SundayTime = nowTime + (7 - day) * oneDayLong;
    return {
        monday: new Date(MondayTime),
        sunday: new Date(SundayTime)
    }
}

export function Percentage(num: number, total: number) {
    if (num == 0) return 100;
    else if (total == 0) return 0;
    return (Math.round(num / total * 10000) / 100.00);// 小数点后两位百分比
}
