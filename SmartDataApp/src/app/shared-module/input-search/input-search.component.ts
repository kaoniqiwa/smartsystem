import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { fromEvent } from "rxjs";
import { throttleTime } from "rxjs/operators";
import { FormControl } from "@angular/forms";
@Component({
  selector: "hw-input-search",
  templateUrl: "./input-search.component.html",
  styleUrls: ["./input-search.component.styl"],
})
export class InputSearchComponent implements OnInit {
  searchInput = new FormControl("");

  @ViewChild("searchBtn")
  searchBtn: ElementRef;

  @ViewChild("input")
  input: ElementRef;

  @Input() placeholder = "";

  @Input() searchEvent: (text: string) => void;

  @Input()
  focusToSelectContent = false;

  /**
   * pmx 20211-08-18
   */
  // 双向绑定抛出内容
  searctText: string = "";

  @Output() searchChange = new EventEmitter<string>();

  constructor() {}

  focus(current: InputSearchComponent) {
    if (this.focusToSelectContent) {
      current.input.nativeElement.select();
    }
  }

  ngOnInit() {
    const clicks = fromEvent(this.searchBtn.nativeElement, "click");
    const result = clicks.pipe(throttleTime(500));
    result.subscribe((x) => {
      if (this.searchEvent) this.searchEvent(this.searchInput.value);
    });
    const keyUp = fromEvent(this.input.nativeElement, "keyup");
    const keyUpEvent = keyUp.pipe(throttleTime(500));
    keyUpEvent.subscribe((x) => {
      if (x["key"] == "Enter" && this.searchEvent)
        this.searchEvent(this.searchInput.value);
    });

    result.subscribe((x) => this.searchChange.emit(this.searctText));
    keyUpEvent.subscribe((x: KeyboardEvent) => {
      if (x.key.toLocaleLowerCase() == "enter") {
        this.searchChange.emit(this.searctText);
      }
    });
  }
}
