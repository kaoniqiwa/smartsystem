export class TimeSpan{
    nextRefreshTime: Date;
    interval: number;
    timeElasped:()=>void;
    raise() {
        if (this.timeElasped)
            this.timeElasped();
    }
}