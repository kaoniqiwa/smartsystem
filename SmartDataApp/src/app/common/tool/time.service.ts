import { Injectable } from "@angular/core";

@Injectable()
export class TimeToolService {
    currentTime: { YYYY: number, MM: number, dd: number, HH: number, mm: string, ss: string, week: string };
    getTimeForMat(myDate: Date) {
        let weekArray = new Array('天', '一', '二', '三', '四', '五', '六');
        let week = weekArray[myDate.getDay()];
        const fillZero = (val: number) => {
            return val < 10 ? '0' + val : val + '';
        }
        return {
            YYYY: myDate.getFullYear(),
            MM: myDate.getMonth() + 1,
            dd: myDate.getDate(),
            HH: myDate.getHours(),
            mm: fillZero(myDate.getMinutes()),
            ss: fillZero(myDate.getSeconds()),
            week: '星期' + week
        }
    }

    runTime() {  this.currentTime = this.getTimeForMat(new Date()); 
        // setInterval(() => {
        //     this.currentTime = this.getTimeForMat(new Date()); 

        // }, 1000);
    }
}