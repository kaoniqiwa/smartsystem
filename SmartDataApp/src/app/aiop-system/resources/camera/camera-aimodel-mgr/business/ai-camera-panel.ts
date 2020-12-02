import { Camera } from "../../../../../data-core/model/aiop/camera";
import { CardListPanel, AccessoryIcon, AccessoryIconLabel, PanelView, ViewPagination, EventTypeEnum } from "../../../../../shared-module/card-list-panel/card-list-panel";
import { CameraAIModel } from "../../../../../data-core/model/aiop/camera-ai-model";
import { Page } from "../../../../../data-core/model/page";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { PanelItem } from "./panel-item";
import { MessageBar } from "../../../../../common/tool/message-bar";
import { ListAttribute } from "../../../../../common/tool/table-form-helper";

export class AICameraPanel extends ListAttribute {
    messageBar = new MessageBar();
    cardListSelectedIdFn: () => Array<string>;
    underCamerasAIModels_: Map<string, string[]>;
    cardListPanelView_ = new PanelView();
    dropItemState = false;
    clearSelectedIds: () => void;
    viewPaginationFn: (page: Page) => ViewPagination;
    addAIModelToCameraFn: (cameraId: string, aiModelId: string, successFn: (success: boolean) => void) => void;
    delAIModelToCameraFn: (cameraId: string, aiModelId: string, successFn: (success: boolean) => void) => void;
    findCameraAIModel: (cameraId: string, resultFn: (models: CameraAIModel[]) => void) => void;
    copyCameraId = '';
    constructor() {
        super();
        this.underCamerasAIModels_ = new Map<string, string[]>();
        this.cardListPanelView_.event = (event, listId, itemId) => {
            if (event == EventTypeEnum.ListItemDel) {
                this.delAIModelToCameraFn(listId, itemId, (ok) => {
                    if (ok) {
                        this.messageBar.response_success();
                        this.delUnderCameraAIModel(listId, itemId);
                        this.delCardListItem(listId, itemId);
                    }
                });
            }
        }
    }
    set underCamerasAIModels(items: Camera[]) {
        items.map(x => {
            this.underCamerasAIModels_.set(x.Id, new Array<string>());
        });
    }

    set clearUnderCameraAIModel(cameraId: string) {
        var s = this.underCamerasAIModels_.get(cameraId);
        s = new Array();
    }

    setUnderCameraAIModel(cameraId: string, aiModelId: string) {
        const s = this.underCamerasAIModels_.get(cameraId);
        s.push(aiModelId);
    }

    delUnderCameraAIModel(cameraId: string, aiModelId: string) {
        var s = this.underCamerasAIModels_.get(cameraId);
        s = s.filter(x => x != aiModelId);
        this.underCamerasAIModels_.set(cameraId, s);
    }

    delCardListItem(listId: string, itemId: string) {
        this.cardListPanelView_.listPanel.map(l => {
            if (listId == l.id) {
                const index = l.barBody.findIndex(x => x.id == itemId);
                if (index > -1) l.barBody.splice(index, 1);
            }
        })
    }

    addCards(cameraId: string, model: { id: string; label: string; icon: string }) {
        const item = this.cardListPanelView_.listPanel.find(x => x.id == cameraId);
        item.barBody.push(model);
    }

    dropItem(event: CdkDragDrop<PanelItem[]>) {
        const copyItem = event.container.data[event.currentIndex];
        this.cardListSelectedIdFn().map(i => {
            const list = this.underCamerasAIModels_.get(i);
            if (list.length > 3) { }
            else {
                const index = list.findIndex(c => c == copyItem.id);
                if (index == -1) {
                    this.addAIModelToCameraFn(i, copyItem.id, (ok) => {
                        if (ok) this.messageBar.response_success();
                    });
                    this.addCards(i, copyItem);
                    list.push(copyItem.id);
                }
            }
        });
        this.dropItemState = false;
    }

    get cardListPanelV() {
        return this.cardListPanelView_;
    }

    clearPanelView() {
        this.cardListPanelView_.listPanel = new Array();
        this.clearSelectedIds();
    }

    set cardListPanelView(items: Camera[]) {
        items.map(x => {
            const card = new CardListPanel();
            card.id = x.Id;
            card.barTitle = {
                icon: new AccessoryIcon(),
                label: new AccessoryIconLabel()
            }
            card.barTitle.label.label = x.Name;
            card.barTitle.icon.colorClass = 'light-blue-text';
            card.barTitle.icon.icon = 'howell-icon-video';

            card.barEqualAccessorys = new Array();
            x.Labels.map(l => {
                const icon = new AccessoryIcon(), iconLabel = new AccessoryIconLabel();
                icon.colorClass = 'sky-blue-text';
                icon.icon = 'mdi mdi-tag';
                iconLabel.colorClass = 'light-blue-text';
                iconLabel.label = l.Name;
                card.barEqualAccessorys.push({
                    icon: icon,
                    label: iconLabel
                });
            });
            card.barOtherAccessorys = new Array();
            var icon = new AccessoryIcon();
            icon.colorClass = 'sky-blue-text';
            icon.icon = 'mdi mdi-content-copy';
            icon.callBack = (id: string) => {
                this.copyCameraId = id;
            }
            card.barOtherAccessorys.push(icon);
            icon = new AccessoryIcon();
            icon.colorClass = x.OnlineStatus == 0 ? 'green-text' : 'text-danger';
            icon.icon = x.OnlineStatus == 0 ? 'howell-icon-signal2' : 'howell-icon-no_signal';
            card.barOtherAccessorys.push(icon);

            card.barBody = new Array();
            this.findCameraAIModel(x.Id, (models: CameraAIModel[]) => {
                models.map(m => {
                    card.barBody.push({
                        id: m.Id,
                        label: m.ModelName,
                        icon: this.imgUrlRoot + this.aiModelIcon + 'ai-m' + m.Label + '.png'
                    });
                    this.setUnderCameraAIModel(x.Id, m.Id);
                });

            });
            this.cardListPanelView_.listPanel.push(card);

        });
    }

    setEditListPanel(tagCameraId: string, targetCameraIds: string[]) {

        this.findCameraAIModel(tagCameraId, (models: CameraAIModel[]) => {
            if (models)
                //更新
                targetCameraIds.map(x => {
                    const findItem = this.cardListPanelV.listPanel.find(f => f.id == x);
                    if (findItem) {
                        this.clearUnderCameraAIModel = x;
                        findItem.barBody = new Array();
                        models.map(m => {
                            findItem.barBody.push({
                                id: m.Id,
                                label: m.ModelName,
                                icon: this.imgUrlRoot + this.aiModelIcon + 'ai-m' + m.Label + '.png'
                            });
                            this.setUnderCameraAIModel(x, m.Id);
                        });
                    }
                });
        });
    }
}