export class Hint {
    title: string;
    subTitle: string;
    subTitleColor: ColorEnum;
}

export class HintList{
    items:Hint[];
}

export enum ColorEnum {
    'sky-blue-text2' = 'sky-blue-text2',
    'green-text' = 'green-text',
    'light-purple-text' = 'light-purple-text',
    'powder-red-text' = 'powder-red-text',
    'orange-text' = 'orange-text'
}
