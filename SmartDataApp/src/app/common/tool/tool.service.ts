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
