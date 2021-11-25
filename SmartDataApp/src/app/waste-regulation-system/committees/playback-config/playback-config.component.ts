import { DatePipe } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { PlaybackViewModel } from "./playback-config.model";

declare var $: any;

@Component({
  selector: "app-playback-config",
  templateUrl: "./playback-config.component.html",
  styleUrls: ["./playback-config.component.css"],
})
export class PlaybackConfigComponent implements OnInit, AfterViewInit {
  endTime: Date = new Date();
  beginTime: Date = new Date();

  form: FormGroup;

  date: Date = new Date();

  @ViewChild("begin")
  beginControl: ElementRef;
  @ViewChild("end")
  endControl: ElementRef;

  @Output()
  OnOKClicked: EventEmitter<PlaybackViewModel> = new EventEmitter();
  @Output()
  OnCancelClicked: EventEmitter<void> = new EventEmitter();

  constructor(private datePipe: DatePipe) {}
  ngAfterViewInit(): void {
    // let begin = this.initTimepicker(this.endControl, this.endTime);
    // let end = this.initTimepicker(this.beginControl, this.beginTime);
  }

  ngOnInit() {
    this.beginTime.setMinutes(this.endTime.getMinutes() - 5);

    this.beginControl.nativeElement.value = this.datePipe.transform(
      this.beginTime,
      "HH:mm:ss"
    );
    this.endControl.nativeElement.value = this.datePipe.transform(
      this.endTime,
      "HH:mm:ss"
    );

    // this.form = new FormGroup({
    //   begin: new FormControl(
    //     this.datePipe.transform(this.beginTime, "HH:mm:ss")
    //   ),
    //   end: new FormControl(this.datePipe.transform(this.endTime, "HH:mm:ss")),
    // });
  }

  initTimepicker(control: ElementRef, time: Date) {
    console.log(control.nativeElement);
    return $(control.nativeElement).timepicker({
      minuteStep: 1,
      showSeconds: true,
      showMeridian: false,
      defaultTime: time.getHours() + ":" + time.getMinutes() + ":" + "00",
    });
  }

  changeDate(date: Date) {
    this.date = date;
  }

  changeBeginTime(date: Date) {
    this.beginTime = date;
  }

  ok() {
    this.OnOKClicked.emit({
      begin: this.beginTime,
      end: this.endTime,
    });
  }

  cancel() {
    this.OnCancelClicked.emit();
  }
}
