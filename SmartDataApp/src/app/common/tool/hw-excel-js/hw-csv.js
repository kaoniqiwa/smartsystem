 
class HowellCSV {    
   
    constructor(data) {
        this.data = data;
    } 
    writeCsvFile(filename) {
        
        let COLNAME = 'COLNAME',TITLEKEY='TITLEKEY';
        if (this.data) {
            let start="\uFEFF";
            var content = '';
           this.data.get(TITLEKEY).map(t => content = t + '\n');
            content += this.data.get(COLNAME).join(',') + '\n';
            for (const key of this.data.keys())
                if (key != TITLEKEY && key != COLNAME)
                    content += this.data.get(key).join(',') + '\n';

         download(new Blob([start+content]), filename+'.csv', "application/csv");
        }
    };
}
 
exports.HowellCSV = HowellCSV; 