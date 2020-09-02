 
export class FormMustField{
    resource = [
        'Name','ResourceType','Id'
    ];
    encodeDevice = [
        'Name','ResourceType', 'Url','Id'
    ];
    camera=[
        'CameraType','CameraState','ChannelNo','EncodeDeviceId','Id'
    ];

    region = ['Id','Name','IsLeaf','RegionType'];
    
    platform =['Id','ProtocolType','Url','State'];

    srServer  = ['Id','Name','ProtocolType','Addresses'];
  
}