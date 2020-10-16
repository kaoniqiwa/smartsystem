import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GarbageStation } from 'src/app/data-core/model/waste-regulation/garbage-station';



@Component({
    selector: 'app-map-list-panel',
    templateUrl: './map-list-panel.component.html',
    styleUrls: ['./map-list-panel.component.css'],

})
export class MapListPanelComponent implements OnInit {

    visibility: boolean;

    @Input()
    dataSource: GarbageStation[];

    @Output()
    OnItemClicked: EventEmitter<GarbageStation> = new EventEmitter();


    @Input()
    VisibilityChange = (val: boolean) => {
        this.visibility = val;
    }


    constructor(

    ) {

    }

    ngOnInit() {

    }

    ButtonClick() {
        this.visibility = !this.visibility;
    }

    itemClick(item: GarbageStation) {
        if (this.OnItemClicked) {
            this.OnItemClicked.emit(item);
        }
    }

}

