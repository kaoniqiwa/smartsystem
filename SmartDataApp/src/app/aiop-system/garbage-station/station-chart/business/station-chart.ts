import { Injectable } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { CanTypeEnum, CameraUsageDataEnum } from '../../../../common/tool/enum-helper';
import { domCss, addClass } from '../../../../common/tool/jquery-help/jquery-help';
import { GarbageStationWindow } from '../../../../data-core/model/waste-regulation/garbage-station-window';
import { CameraSlot } from '../../../../data-core/model/waste-regulation/camera-slot';
import { MessageBar } from '../../../../common/tool/message-bar';
import { GarbageStationType } from '../../../../data-core/model/waste-regulation/garbage-station-type';
@Injectable()
export class StationChart {
    house = new House();
    /**槽位 表单只读 */
    cameraPostionFormReadOnly = false;
    /**槽位 表单 */
    cameraPostionForm: FormGroup;
    /**槽位序号 */
    positionNoMap = new Map<CanTypeEnum, number>();
    trashSelected_: { door: string, trash: string, icon: string, type: CanTypeEnum };
    /**垃圾桶 摄像机槽位下标 */
    cameraPositionIndex = -1;
    trashIcons = new Array<TrashIcon>();
    /**干垃圾 多面 摄像机槽位 */
    readonly multifacetedPostion = 15;
    constructor(private fb: FormBuilder) {
        this.positionNoMap.set(CanTypeEnum.Dry, 11);
        this.positionNoMap.set(CanTypeEnum.Wet, 12);
        this.positionNoMap.set(CanTypeEnum.Recycle, 13);
        this.positionNoMap.set(CanTypeEnum.Hazard, 14);
        this.cameraPostionForm = this.createCameraPostionForm();
    }

    /** 取出 垃圾投放窗口 */
    get stationwindow() {
        const windows = new Array<GarbageStationWindow>();
        var no = 1;
        for (const x of this.house.interior) {
            const window = new GarbageStationWindow();
            window.No = no;
            window.CanType = x.type;
            windows.push(window);
            no++;
        }
        return windows;
    }

    /**取出 摄像机槽位信息 */
    get cameraSlot() {
        var no = 1;
        const slots = new Array<CameraSlot>(),
            outside = this.cameraPostionForm.get('outside') as FormArray
            , insideLi1 = this.cameraPostionForm.get('insideLi1') as FormArray
            // , insideLi2 = this.cameraPostionForm.get('insideLi2') as FormArray
            , fillSlots = (arr: FormArray, outSide: boolean, moreWindow: boolean) => {
                var i = 0;
                for (const x of arr.controls) {
                    const slot = new CameraSlot();
                    slot.No = no;

                    slot.PositionNo = x.value;
                    slot.Inside = outSide;
                    slot.Windows = new Array();
                    if (outSide)
                        slot.CameraUsage = CameraUsageDataEnum.Other;
                    else {
                        slot.Windows.push(i);
                        /** 顺序编号 */
                        if (moreWindow)
                            slot.Windows.push(i + 1);

                        if (this.positionNoMap.get(CanTypeEnum.Dry) == x.value || this.multifacetedPostion == x.value)
                            slot.CameraUsage = CameraUsageDataEnum.Dry;
                        else if (this.positionNoMap.get(CanTypeEnum.Wet) == x.value)
                            slot.CameraUsage = CameraUsageDataEnum.Wet;
                        else slot.CameraUsage = CameraUsageDataEnum.Recycle;
                    }

                    slots.push(slot);
                    no++;
                    i++;
                }
            };
        fillSlots(outside, true, false);
        fillSlots(insideLi1, false, false);
        // fillSlots(insideLi2, false,true);
        return slots;
    }

    set changeHouseType(type: GarbageStationType) {
        const outside = this.cameraPostionForm.get('outside') as FormArray
            , insideLi1 = this.cameraPostionForm.get('insideLi1') as FormArray;
        // , insideLi2 = this.cameraPostionForm.get('insideLi2') as FormArray;

        if (type) {
            for (let i = 0; i < type.Windows.length; i++) {
                type.Windows = type.Windows.sort(function (a, b) {
                    return a.No - b.No;
                });
                const window = type.Windows[i];
                this.house.interior[i] = this.getDoorTrash(window.CanType);
            }

            for (let i = 0; i < type.CameraSlots.length; i++) {
                type.CameraSlots = type.CameraSlots.sort(function (a, b) {
                    return a.No - b.No;
                });
                const slot = type.CameraSlots[i];
                if (i <= 3) {
                    outside.controls[i].setValue(slot.PositionNo);
                    this.house.cameraPosition.outside[i].position = slot.PositionNo;
                }
                else if (i > 3 && i <= this.house.interior.length + 3) {
                    insideLi1.controls[i - 4].setValue(slot.PositionNo);
                    this.house.cameraPosition.inside.li1[i - 4].position = slot.PositionNo;
                }
                // else {
                //     insideLi2.controls[i - (this.house.interior.length + 4)].setValue(slot.PositionNo);
                //     this.house.cameraPosition.inside.li2[i - (this.house.interior.length + 4)].position = slot.PositionNo;
                // }

            }
        }
    }

    checkPositionNo() {
        var check = false;
        const outside = this.cameraPostionForm.get('outside') as FormArray
            , insideLi1 = this.cameraPostionForm.get('insideLi1') as FormArray
            // , insideLi2 = this.cameraPostionForm.get('insideLi2') as FormArray
            , fillSlots = (arr: FormArray) => {
                for (const x of arr.controls) {
                    if ((x.value >= 0 && x.value <= 9)
                        || (x.value >= 11 && x.value <= 19))
                        check = true;

                    else {
                        new MessageBar().response_warning('输入数字1-9 或 11-19');
                        check = false;
                    }
                }
            };
        fillSlots(outside);
        fillSlots(insideLi1);
        // fillSlots(insideLi2);
        return check;
    }

    createCameraPostionForm(size: number = 4) {
        const li1 = new Array(), li2 = new Array();
        for (let i = 11; i < (11 + size); i++)
            li1.push(this.fb.control(this.positionNoMap.get(CanTypeEnum.Dry)));

        for (let i = (11 + size); i < (11 + size * 2 - 1); i++)
            li2.push(this.fb.control(15));
        const form = this.fb.group({
            insideLi1: this.fb.array(li1),
            // insideLi2: this.fb.array(li2),
            outside: this.fb.array([
                this.fb.control(1),
                this.fb.control(2),
                this.fb.control(3),
                this.fb.control(4),
            ])
        });
        return form;
    }

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
                    // li2: new Array()
                }
            };
            house.cameraPosition.outside = [
                { id: '', name: '', position: 1, no: 1 },
                { id: '', name: '', position: 2, no: 2 },
                { id: '', name: '', position: 3, no: 3 },
                { id: '', name: '', position: 4, no: 4 }
            ];

            var no = 5;
            for (let i = outSideMax; i < (outSideMax + size); i++) {
                house.cameraPosition.inside.li1.push({ id: '', name: '', position: 11, no: no });
                no++;
            }

            // for (let i = (outSideMax + size); i < (outSideMax + size * 2 - 1); i++)
            //     house.cameraPosition.inside.li2.push({ id: '', name: '', position: 15 });
        }
        initInterior();
        camera();

        return house;
    }

    getDoorTrash(canType: CanTypeEnum) {
        var doorTrash: any;
        switch (canType) {
            case CanTypeEnum.Dry:
                doorTrash = {
                    door: 'wall-door1',
                    trash: 'trash1',
                    icon: 'howell-icon-residual',
                    type: CanTypeEnum.Dry
                }
                break;
            case CanTypeEnum.Recycle:
                doorTrash = {
                    door: 'wall-door2',
                    trash: 'trash2',
                    icon: 'howell-icon-recyclable',
                    type: CanTypeEnum.Recycle
                }
                break;
            case CanTypeEnum.Wet:
                doorTrash = {
                    door: 'wall-door3',
                    trash: 'trash3',
                    icon: 'howell-icon-kitchen',
                    type: CanTypeEnum.Wet
                }
                break;
            case CanTypeEnum.Hazard:
                doorTrash = {
                    door: 'wall-door4',
                    trash: 'trash4',
                    icon: 'howell-icon-hazardous',
                    type: CanTypeEnum.Hazard
                }
                break;
            default:
                break;
        }
        return doorTrash;
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
                type: CanTypeEnum.Dry
            }
        });
        icons.push({
            icon: 'howell-icon-recyclable',
            selected: false,
            doorTrashs: {
                door: 'wall-door2',
                trash: 'trash2',
                icon: 'howell-icon-recyclable',
                type: CanTypeEnum.Recycle
            }
        });
        icons.push({
            icon: 'howell-icon-kitchen',
            selected: false,
            doorTrashs: {
                door: 'wall-door3',
                trash: 'trash3',
                icon: 'howell-icon-kitchen',
                type: CanTypeEnum.Wet
            }
        });
        icons.push({
            icon: 'howell-icon-hazardous',
            selected: false,
            doorTrashs: {
                door: 'wall-door4',
                trash: 'trash4',
                icon: 'howell-icon-hazardous',
                type: CanTypeEnum.Hazard
            }
        });
        return icons;
    }

    itemClickFn = (item: TrashIcon) => {
        /**修改垃圾桶 图片类型 */
        this.trashSelected_.door = item.doorTrashs.door;
        this.trashSelected_.trash = item.doorTrashs.trash;
        this.trashSelected_.icon = item.doorTrashs.icon;
        this.trashSelected_.type = item.doorTrashs.type;
        this.house.cameraPosition.inside.li1[this.cameraPositionIndex].position
            = this.positionNoMap.get(item.doorTrashs.type);
        this.setInsideLi1Form(this.cameraPositionIndex, this.positionNoMap.get(item.doorTrashs.type));
        // this.cameraPositionInsideLi2();
    }

    setInsideLi1Form(index: number, val: number) {
        const formArr = this.cameraPostionForm.get('insideLi1') as FormArray;
        formArr.controls[index].setValue(val);
    }

    setInsideLi2Form(index: number, val: number) {
        const formArr = this.cameraPostionForm.get('insideLi2') as FormArray;
        formArr.controls[index].setValue(val);
    }

    /**设置 监控1--1 个槽位 */
    // cameraPositionInsideLi2() {
    //     for (let i = 0; i < this.house.cameraPosition.inside.li2.length; i++) {
    //         const li2 = this.house.cameraPosition.inside.li2[i];
    //         if (this.house.cameraPosition.inside.li1[i].position == this.positionNoMap.get(CanTypeEnum.Dry) &&
    //             this.house.cameraPosition.inside.li1[i + 1].position == this.positionNoMap.get(CanTypeEnum.Dry)) {
    //             li2.position = this.multifacetedPostion;
    //             this.setInsideLi2Form(i, this.multifacetedPostion);
    //         }
    //         else {
    //             li2.position = 0;
    //             this.setInsideLi2Form(i, 0);
    //         }
    //     }
    // }

    set trashSelected(index: number) {
        this.trashSelected_ = this.house.interior[index];
        this.cameraPositionIndex = index;
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
        this.cameraPostionForm = this.createCameraPostionForm(num)
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

    get positionLUp(){
      return  this.house.cameraPosition.outside[0];
    }

    
    get positionRUp(){
        return  this.house.cameraPosition.outside[1];
      }

      
    get positionLDown(){
        return  this.house.cameraPosition.outside[2];
      }

      
    get positionRDown(){
        return  this.house.cameraPosition.outside[3];
      }




    // get insideGroup2SquareW() {
    //     const baseW = 320, poor = 142, baseNum = 3;
    //     return baseW + (this.house.cameraPosition.inside.li2.length - baseNum) * poor;
    // }

    // get insideGroup2LineSquareW() {
    //     const baseW = 361, poor = 142, baseNum = 3;
    //     return baseW + (this.house.cameraPosition.inside.li2.length - baseNum) * poor;
    // }

    get insideGroup1LineSquareW() {
        const baseW = 498, poor = 142, baseNum = 4;
        return baseW + (this.house.cameraPosition.inside.li1.length - baseNum) * poor;
    }

    get insideGroup1LineSquareW2() {
        const poor = 142, padding = 10;
        return this.house.cameraPosition.inside.li1.length * poor - padding;
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
    interior: { door: string, trash: string, icon: string, type: CanTypeEnum }[] = new Array();
    cameraPosition: {
        outside: { id: string, name: string, position: number, no: number }[],
        inside: {
            li1: { id: string, name: string, position: number, no: number }[],
            // li2: { id: string, name: string, position: number }[]
        }
    };
}


export class TrashIcon {
    icon: string;
    selected: boolean;
    doorTrashs: {
        door: string,
        trash: string,
        icon: string,
        type: CanTypeEnum
    }
}


export enum HouseModeEnum {
    Trash,
    TrashCamera
}