 
 
class HowellExcelJS {

    createBook() {
       
        return new ExcelJS.Workbook()
    }

    addWorksheet(workbook, sheetName) {
        return workbook.addWorksheet(sheetName);
    }

    getWorksheet(workbook,sheetName){
      return workbook.getWorksheet(sheetName);
    }

      load(workbook,data,cb){
         
         workbook.xlsx.load(data).then(x=>{ 
                cb(x);
             });
    }

    setCellValue(worksheet,cellName,val){
        const cell = worksheet.getCell(cellName); 
        cell.value = val; 
    }

    mergeCells(worksheet,cellName){
       return  worksheet.mergeCells(cellName); 
    }

     
    addImageToBook(workbook, base64Image) {   
        return workbook.addImage({
            base64: base64Image,
            extension: 'png',
        });
    }

    addImageToSheet(worksheet, imageId, cell) {
        worksheet.getCell(cell).fill = {
            type: 'pattern',
            pattern:'darkTrellis', 
            bgColor:{argb:'FF0C1127'}
          };
        return worksheet.addImage(imageId, cell);
    }

     writeFile(workbook,filename,extension){
        extension = extension||'.xlsx';
        workbook.xlsx.writeBuffer().then(x=>{             
            download(new Blob([x]), filename+extension, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
             
        }); 
    }

    getBuffer(workbook,cb){
        workbook.xlsx.writeBuffer().then(x=>{             
          cb(x);             
        }); 
    }

     
}


exports.HowellExcelJS = HowellExcelJS;