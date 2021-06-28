import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";

export interface ICoordinate {
  lon: string;
  lat: string;
}

@Component({
  selector: "app-coordinate-manage",
  templateUrl: "./coordinate-manage.component.html",
  styleUrls: ["./coordinate-manage.component.css"],
})
export class CoordinateManageComponent implements OnInit {
  @Input()
  title: string;

  @Input()
  message: string;

  @Output() CancelClickedEvent: EventEmitter<string> = new EventEmitter();

  @Output() YesClickedEvent: EventEmitter<ICoordinate> = new EventEmitter();

  @ViewChild("lon")
  txtLon: ElementRef;

  @ViewChild("lat")
  txtLat: ElementRef;

  @ViewChild("confirm")
  confirm: ElementRef;

  constructor() {}

  OnYesClicked() {
    if (this.YesClickedEvent) {
      this.YesClickedEvent.emit({
        lon: this.txtLon.nativeElement.value,
        lat: this.txtLat.nativeElement.value,
      });
    }
  }

  OnCancelClicked() {
    if (this.CancelClickedEvent) {
      this.CancelClickedEvent.emit("");
    }
  }

  ngOnInit(): void {}
}
