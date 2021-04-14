import { Component, Input, OnInit} from '@angular/core';
import { GarbageStation } from 'src/app/data-core/model/waste-regulation/garbage-station';


@Component({
    selector: 'app-point-info-panel',
    templateUrl: './point-info-panel.component.html',
    styleUrls: ['./point-info-panel.component.css'],

})
export class PointInfoPanelComponent implements OnInit {

    visibility: boolean;

    @Input()
    GarbageStation: GarbageStation;


    @Input()
    VisibilityChange = (val: boolean) => {
        this.visibility = val;
    }


    constructor(

    ) {
        // this.GarbageStation.Members
    }

    ngOnInit() {

    }

}

