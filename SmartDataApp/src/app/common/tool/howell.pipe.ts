import { Pipe, PipeTransform } from '@angular/core'; 

@Pipe({ name: 'TxtEmpty' })
export class TxtEmptyPipe implements PipeTransform {
    transform(txt: string, empatyChar: string): string {
        if (txt && txt != '0')
            return txt;
        else
            return empatyChar;
    }
}

@Pipe({ name: 'FormTitle' })
export class FormTitlePipe implements PipeTransform {
    /**
     * 
     * @param defaultTitle 
     * @param subtitle 1.比较对象 2.对象key
     */
    transform(defaultTitle: string, subtitle: any[]): string {
        if (subtitle[0]) return subtitle[0][subtitle[1]];
        else return defaultTitle;
    }
}


@Pipe({ name: 'TxtLen' })
export class TxtLenPipe implements PipeTransform {
    transform(txt: string, len: number): string { 
        if(txt.length>len)
        return txt.substr(0, len) + '...'
        else return txt;
    }
}
