
import { Camera } from "../../../../../data-core/model/camera";
import { CameraAIModel } from "../../../../../data-core/model/camera-ai-model";
import { CdkDragDrop,copyArrayItem} from '@angular/cdk/drag-drop';
import { CardListPanel ,AccessoryIconLabel,AccessoryIcon,PanelView,ViewPagination,EventTypeEnum} 
from "../../../../../shared-module/card-list-panel/card-list-panel";
import { Page } from "../../../../../data-core/model/page";
import { MessageBar } from "../../../../../common/tool/message-bar";
export class PanelControl {
    fromDataSource: PanelItem[];    
    messageBar = new MessageBar();
    toDataSource: Map<string, string[]>;
    cardListDataSource =new  PanelView();
    cardListSelectedId:Array<string>;
    findCameraAIModel:(cameraId:string, resultFn:(models:CameraAIModel[])=>void)=>void;
    viewPaginationFn:(page:Page)=>ViewPagination;
    addAIModelToCameraFn:(cameraId: string, aiModelId: string,successFn:(success:boolean)=>void)=>void;
    delAIModelToCameraFn:(cameraId: string, aiModelId: string,successFn:(success:boolean)=>void)=>void;
    private fromistConnectedTo_ = new Array<string>();

    constructor() {
        this.fromDataSource = new Array<PanelItem>();
        this.toDataSource = new Map<string, string[]>();
        this.cardListDataSource.event = (event,listId,itemId)=>{
            if(event==EventTypeEnum.ListItemDel){
                this.delAIModelToCameraFn(listId,itemId,(ok)=>{
                    if(ok){
                        this.delToListItem(listId,itemId);
                        this.delCardListItem(listId,itemId);
                    }
                });
            }
        }
    } 

    get fromistConnectedTo() {
        return this.fromistConnectedTo_;
    }

    set fromistConnectedTo(id: string[]) {
        this.fromistConnectedTo_.push(id[0]);
    }

    get fromList() {
        return this.fromDataSource;
    }

    toList(id: string) {
        return this.toDataSource.get(id); 
    }

    delCardListItem(listId: string, itemId: string){
        this.cardListDataSource.listPanel.map(l=>{
            if(listId == l.id){
              const index =   l.barBody.findIndex(x=>x.id==itemId);
              if(index>-1)l.barBody.splice(index,1);
            }
        })
    }

    convertCardList(items: Camera[]){
        items.map(x => {
           const card = new CardListPanel();
           card.id=x.Id;
           card.barTitle = {
            icon: new  AccessoryIcon(),
            label:new AccessoryIconLabel()
           } 
           card.barTitle.label.label = x.Name; 
           card.barTitle.icon.colorClass = 'light-blue-text';
           card.barTitle.icon.icon='howell-icon-video';

           card.barEqualAccessorys = new Array();
           x.Labels.map(l=>{
              const icon =  new AccessoryIcon(),iconLabel =  new AccessoryIconLabel();
              icon.colorClass = 'sky-blue-text';
              icon.icon= 'mdi mdi-tag';
              iconLabel.colorClass ='light-blue-text';
              iconLabel.label = l.Name;
              card.barEqualAccessorys.push({
                  icon:icon,
                  label:iconLabel
              });
           })
           card.barOtherAccessorys = new Array();
           var icon =  new AccessoryIcon();
           icon.colorClass = 'sky-blue-text';
           icon.icon= 'mdi mdi-content-copy';
           card.barOtherAccessorys.push(icon);
           icon =  new AccessoryIcon();
           icon.colorClass = 'text-danger';
           icon.icon= 'mdi mdi-signal';
           card.barOtherAccessorys.push(icon);

           card.barBody = new Array();
           this.findCameraAIModel(x.Id,(models:CameraAIModel[])=>{
                models.map(m=>{
                    card.barBody.push({
                        id:m.Id,
                        label:m.ModelName
                    });
                });
           }); 
           this.cardListDataSource.listPanel.push(card);
        });
    }

    convertFromList(items: CameraAIModel[]) {
        items.map(x => {
            const p = new PanelItem();
            p.id = x.Id;
            p.label = x.ModelName;
            this.fromDataSource.push(p);
        });
    }

    convertToList(items: Camera[]) {
        items.map(x => {
            this.toDataSource.set(x.Id, new Array<string>());
            this.fromistConnectedTo = [x.Id];
        });
    }

    addCards(cameraId:string,model:{id: string;label: string;}){
      const item=  this.cardListDataSource.listPanel.find(x=>x.id == cameraId);
      item.barBody.push(model);
    }

    delToListItem(listId: string, itemId: string) {
        const list = this.toDataSource.get(listId);
        const index = list.findIndex(x => x == itemId);
        list.splice(index, 1);
    }

    dropItem(event: CdkDragDrop<PanelItem[]>) {
        const copyItem = event.container.data[event.currentIndex];
   
        this.cardListSelectedId.map(i=>{
            const list = this.toDataSource.get(i); 
            if(list.length>3){}
            else{ 
                this.addAIModelToCameraFn(i,copyItem.id,(ok)=>{
                    if(ok)  this.messageBar.response_success();
                });
                this.addCards(i,copyItem);
                list.push(i);
            }

          
        });
      
        
    }
}

export class PanelItem {
    id: string;
    label: string;
    hidden: boolean;
    constructor() {
        this.hidden = false;
    }
}