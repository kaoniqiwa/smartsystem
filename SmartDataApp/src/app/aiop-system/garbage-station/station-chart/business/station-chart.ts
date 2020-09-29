import { Injectable } from "@angular/core";
import { CanTypeEnum } from "../../../../common/tool/enum-helper";

import { domCss, addClass } from "../../../../common/tool/jquery-help/jquery-help";
@Injectable()
export class StationChart {
    house = new House();
    trashSelected_: { door: string, trash: string, icon: string };
    trashIcons = new Array<TrashIcon>();
    createHouse(size: number = 4) {
        const house = new House(), outSideMax = 11;
        const initInterior = () => {
            house.interior.push(this.getDoorTrash(CanTypeEnum.Dry));
            for (let i = 0; i < size - 2; i++)
                house.interior.push(this.getDoorTrash(CanTypeEnum.Dry));
            house.interior.push(this.getDoorTrash(CanTypeEnum.Dry));
        }, camera = () => {
            house.cameraPosition = {
                outside: new Array(),
                inside: {
                    li1: new Array(),
                    li2: new Array()
                }
            };
            house.cameraPosition.outside = [
                { id: '', name: '', position: 1 },
                { id: '', name: '', position: 2 },
                { id: '', name: '', position: 3 },
                { id: '', name: '', position: 4 }
            ];

            for (let i = outSideMax; i < (outSideMax + size); i++)
                house.cameraPosition.inside.li1.push({ id: '', name: '', position: i });

            for (let i = (outSideMax + size); i < (outSideMax + size * 2 - 1); i++)
                house.cameraPosition.inside.li2.push({ id: '', name: '', position: i });
        }
        initInterior();
        camera();

        return house;
    }

    getDoorTrash(canType: CanTypeEnum) {
        const doorTrashs = [{
            door: 'wall-door1',
            trash: 'trash1',
            icon: 'howell-icon-residual',
        }, {
            door: 'wall-door2',
            trash: 'trash2',
            icon: 'howell-icon-recyclable',
        }, {
            door: 'wall-door3',
            trash: 'trash3',
            icon: 'howell-icon-kitchen',
        }, {
            door: 'wall-door4',
            trash: 'trash4',
            icon: 'howell-icon-hazardous',
        }
        ];
        return doorTrashs[canType - 1];
    }

    initTrashIcon() {
        const icons = new Array<TrashIcon>();
        icons.push({
            icon: 'howell-icon-residual',
            selected: false,
            doorTrashs: {
                door: 'wall-door1',
                trash: 'trash1',
                icon: 'howell-icon-residual',
            }
        });
        icons.push({
            icon: 'howell-icon-recyclable',
            selected: false,
            doorTrashs: {
                door: 'wall-door2',
                trash: 'trash2',
                icon: 'howell-icon-recyclable',
            }
        });
        icons.push({
            icon: 'howell-icon-kitchen',
            selected: false,
            doorTrashs: {
                door: 'wall-door3',
                trash: 'trash3',
                icon: 'howell-icon-kitchen',
            }
        });
        icons.push({
            icon: 'howell-icon-hazardous',
            selected: false,
            doorTrashs: {
                door: 'wall-door4',
                trash: 'trash4',
                icon: 'howell-icon-hazardous',
            }
        });
        return icons;
    }

    itemClickFn = (item: TrashIcon) => {
        /**修改垃圾桶 图片类型 */
        this.trashSelected_.door = item.doorTrashs.door;
        this.trashSelected_.trash = item.doorTrashs.trash;
        this.trashSelected_.icon = item.doorTrashs.icon;
    }

    set trashSelected(index: number) {
        this.trashSelected_ = this.house.interior[index];
        /**勾选图标 */
        this.trashIcons.map(x => x.selected = x.doorTrashs.door == this.trashSelected_.door);
    }

    trashIconClick(dom: any, index: number) {
        const top = 50, left = 4;
        addClass('iconList', 'in');
        domCss('iconList', { 'left': dom.offsetLeft - left, 'top': dom.offsetTop + top });
        this.trashIcons.map(x => x.selected = false);
        this.trashSelected = index;
    }

    changeTrashNum(val: string) {
        const num = Number.parseInt(val);
        this.house = this.createHouse(num);
    }


    get configGarbageTrash() {
        const trashs = new Array<number>();
        for (var i = 4; i <= 5; i++)
            trashs.push(i);
        return trashs;
    }

    get outSidePosition() {
        return {
            left: {
                up: this.house.cameraPosition.outside[0],
                down: this.house.cameraPosition.outside[2]
            },
            right: {
                up: this.house.cameraPosition.outside[1],
                down: this.house.cameraPosition.outside[3]
            }
        }
    }


    get insideGroup2SquareW() {
        const baseW = 320, poor = 142, baseNum = 3;
        return baseW + (this.house.cameraPosition.inside.li2.length - baseNum) * poor;
    }

    get insideGroup2LineSquareW() {
        const baseW = 361, poor = 142, baseNum = 3;
        return baseW + (this.house.cameraPosition.inside.li2.length - baseNum) * poor;
    }

    get insideGroup1LineSquareW() {
        const baseW = 498, poor = 142, baseNum = 4;
        return baseW + (this.house.cameraPosition.inside.li1.length - baseNum) * poor;
    }

    get tableTdW() {
        return 142 * this.house.interior.length;
    }

    get tableW() {
        const wallW = 150, insideWallW = 142;
        return wallW * 2 + insideWallW * this.house.interior.length;
    }
}

export class House {
    interior: { door: string, trash: string, icon: string }[] = new Array();
    cameraPosition: {
        outside: { id: string, name: string, position: number }[],
        inside: {
            li1: { id: string, name: string, position: number }[],
            li2: { id: string, name: string, position: number }[]
        }
    };
}

export class TrashIcon {
    icon: string;
    selected: boolean;
    doorTrashs: {
        door: string,
        trash: string,
        icon: string
    }
}


export enum HouseModeEnum {
    Trash,
    TrashCamera
}