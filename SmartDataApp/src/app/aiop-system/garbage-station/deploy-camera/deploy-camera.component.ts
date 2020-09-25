import { Component, OnInit } from '@angular/core';
import { House, GarbageStationMap } from "./business/garbage-station-map";
@Component({
  selector: 'app-deploy-camera',
  templateUrl: './deploy-camera.component.html',
  styleUrls: ['./deploy-camera.component.styl'],
  providers: [GarbageStationMap]
})
export class DeployCameraComponent implements OnInit {
  
  house = new House();
  constructor(private a: GarbageStationMap) {
    this.house = this.a.createHouse();
  }

  ngOnInit() {
    this.a.createHouse(); 
  }

  changeTrashNum(val:string){
    
    const num = Number.parseInt(val);
    this.house = this.a.createHouse(num);
  }

  get configGarbageTrash(){
    const trashs = new Array<number>();
    for(var i=4;i<=5;i++)
      trashs.push(i);
    return trashs;
  }

  get outSidePosition() {
    return {
      left: {
        up: this.house.cameraPosition.outside[0],
        down: this.house.cameraPosition.outside[1]
      },
      right: {
        up: this.house.cameraPosition.outside[2],
        down: this.house.cameraPosition.outside[3]
      }
    }
  }


  get insideGroup2SquareW(){
    const baseW = 320,poor=142,baseNum = 3;     
    return baseW+ (this.house.cameraPosition.inside.li2.length - baseNum)*poor;
  }

  get insideGroup2LineSquareW(){
    const baseW = 361,poor=142,baseNum = 3;     
    return baseW+ (this.house.cameraPosition.inside.li2.length - baseNum)*poor;
  }

  get insideGroup1LineSquareW(){
    const baseW = 498,poor=142,baseNum = 4;     
    return baseW+ (this.house.cameraPosition.inside.li1.length - baseNum)*poor;
  }

  get tableTdW() {
    return 142 * this.house.interior.length;
  }

  get tableW() {
    const wallW=150,insideWallW=142;
    return wallW * 2 + insideWallW * this.house.interior.length;
  }
}
