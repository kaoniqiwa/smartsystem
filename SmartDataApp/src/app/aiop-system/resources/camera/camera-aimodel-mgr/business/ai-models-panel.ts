import { CameraAIModel } from "../../../../../data-core/model/aiop/camera-ai-model";
import { PanelItem } from "./panel-item";
export class AIModelsPanel {
    dataSource = new Array<PanelItem>();
    filterFn = (text: string) => {
        this.dataSource.map(x => x.hidden = false);
        this.dataSource.map(x => {
            const index = x.label.indexOf(text);
            if (index == -1) x.hidden = true;
        });
    }
    convertFromList(items: CameraAIModel[]) {
        items.map(x => {
            const p = new PanelItem();
            p.id = x.Id;
            p.label = x.ModelName;
            this.dataSource.push(p);
        });
    }

}

