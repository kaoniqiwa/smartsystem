import { Injectable } from "@angular/core";
import { CanTypeEnum } from "../../../../common/tool/enum-helper";

@Injectable()
export class GarbageStationMap {

    createHouse(size: number = 4) {
        const house = new House(),outSideMax = 11;
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

            for (let i = (outSideMax + size); i < (outSideMax + size*2-1); i++)
                house.cameraPosition.inside.li2.push({ id: '', name: '', position: i });
        }
        initInterior();
        camera();
        console.log(house);
        
        return house;
    }

    getDoorTrash(canType: CanTypeEnum) {
        const doorTrashs = [{
            door: 'wall-door1',
            trash: 'trash1'
        }, {
            door: 'wall-door2',
            trash: 'trash2'
        }, {
            door: 'wall-door3',
            trash: 'trash3'
        }, {
            door: 'wall-door4',
            trash: 'trash4'
        }
        ];
        return doorTrashs[canType-1];
    }
}

export class House {
    interior: { door: string, trash: string }[] = new Array();
    cameraPosition: {
        outside: { id: string, name: string, position: number }[],
        inside: {
            li1: { id: string, name: string, position: number }[],
            li2: { id: string, name: string, position: number }[]
        }
    };
}