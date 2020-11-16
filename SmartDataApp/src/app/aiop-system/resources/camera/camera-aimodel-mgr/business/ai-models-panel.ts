import { CameraAIModel } from "../../../../../data-core/model/aiop/camera-ai-model";
import { PanelItem } from "./panel-item";
import { ListAttribute } from '../../../../../common/tool/table-form-helper';
export class AIModelsPanel extends ListAttribute{
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
            if(x.Label>=1&&x.Label<=10)
              p.icon=  this.imgUrlRoot+this.aiModelIcon+'ai-m'+x.Label+'.png';
            this.dataSource.push(p);
        });
    }

}

