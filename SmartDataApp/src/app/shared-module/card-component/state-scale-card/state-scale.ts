import { ColorEnum } from "../card-content-factory";
export class StateScale {
    title: string;
    stateLabel: {
        subTitle: string;
        scaleNumber: string;
        state: string;
        // arc: number;
    }
    arc: {
        white: number;
        color: number;
    };

    detail: {
        label: string;
        number: string;
        color:ColorEnum;
        tag:any;
    }[];
    constructor() {
        this.title = '';
        this.stateLabel = {
            subTitle: '',
            scaleNumber: '0',
            state: '-',
            // arc: 0
        }
        this.arc = Arc._100;
        this.detail = new Array();
    }
}

export class Arc {
    static readonly _0 = {
        white: 100,
        color: 0
    }
    static readonly _20 = {
        white: 80,
        color: 20
    }
    static readonly _40 = {
        white: 60,
        color: 40
    }
    static readonly _80 = {
        white: 26,
        color: 46
    }

    static readonly _100 = {
        white: 26,
        color: 74
    }
}  