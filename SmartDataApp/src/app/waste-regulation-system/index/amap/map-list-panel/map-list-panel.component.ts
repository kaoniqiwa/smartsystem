import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Division } from 'src/app/data-core/model/waste-regulation/division';
import { GarbageStation } from 'src/app/data-core/model/waste-regulation/garbage-station';
import { MapListItem } from './map-list-item';



@Component({
    selector: 'app-map-list-panel',
    templateUrl: './map-list-panel.component.html',
    styleUrls: ['./map-list-panel.component.css'],

})
export class MapListPanelComponent implements OnInit {

    visibility: boolean;

    @Input()
    dataSource: Array<MapListItem<Division | GarbageStation>>;

    @Output()
    OnItemClicked: EventEmitter<MapListItem<Division | GarbageStation>> = new EventEmitter();


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

    itemClick(item: MapListItem<Division | GarbageStation>) {
        if (this.OnItemClicked) {
            this.OnItemClicked.emit(item);
        }
    }

}

