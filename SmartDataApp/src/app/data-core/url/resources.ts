import {  IUrl} from "./IUrl";

export class Resource implements IUrl{
    create(): string {
       return 'Resources';
    }
    edit(id:string): string {
        return `Resources/${id}`;
    }
    del(id:string): string {
        return `Resources/${id}`;
    }
    get(id:string): string {
        return `Resources/${id}`;
    }
    list(): string {
       return 'Resources/List';
    }

}

export class ResourceEncodeDevice implements IUrl{
    create(): string {
       return 'Resources/EncodeDevices';
    }
    edit(devId: string): string {
        return `Resources/EncodeDevices/${devId}`;
    }
    del(devId: string): string {
        return `Resources/EncodeDevices/${devId}`;
    }
    get(devId: string): string {
        return `Resources/EncodeDevices/${devId}`;
    }
    list(): string {
      return 'Resources/EncodeDevices/List';
    }

}

export class ResourceCamera implements IUrl{
    create(): string {
       return 'Resources/Cameras';
    }
    edit(id:string): string {
       return `Resources/Cameras/${id}`;
    }
    del(id:string): string {
        return `Resources/Cameras/${id}`;
    }
    get(id:string): string {
        return `Resources/Cameras/${id}`;
    }
    list(...param: string[]): string {
        throw new Error("Method not implemented.");
    }

}

export class ResourceCameraAIModel implements IUrl{ 
    create(cameraId:string,modelId:string): string {
        return `Resources/Cameras/${cameraId}/AIModels/${modelId}`;
    }
    edit(cameraId:string,modelId:string): string {
        return ``;
    }
    del(cameraId:string,modelId:string): string {
        return `Resources/Cameras/${cameraId}/AIModels/${modelId}`;
    }
    get(cameraId:string,modelId:string): string {
        return `Resources/Cameras/${cameraId}/AIModels/${modelId}`;
    }
    list(cameraId:string): string {
        return `Resources/Cameras/${cameraId}/AIModels`;
    }
    copy(cameraId:string){
        return `Resources/Cameras/${cameraId}/AIModels/CopyTo`;
    }

}

export class  Label implements IUrl{
    create(): string {
       return 'Resources/Labels';
    }
    edit(id:string): string {
      return `Resources/Labels/${id}`;
    }
    del(id:string): string {
        return `Resources/Labels/${id}`;
    }
    get(id:string): string {
        return `Resources/Labels/${id}`;
    }
    list(): string {
        return 'Resources/Labels/List';
    }

}

export class  ResourceLabel implements IUrl{
    create(sourceId:string,labelId:string): string {
        return `Resources/${sourceId}/Labels/${labelId}`;
    }
    edit(id:string): string {
      return ``;
    }
    del(sourceId:string,labelId:string): string {
        return `Resources/${sourceId}/Labels/${labelId}`;
    }
    get(sourceId:string,labelId:string): string {
        return `Resources/${sourceId}/Labels/${labelId}`;
    }
    list(id:string): string {
        return `Resources/${id}/Labels`;
    }

}