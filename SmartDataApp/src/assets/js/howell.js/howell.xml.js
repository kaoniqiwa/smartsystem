loadXML = function (xmlFile) {
    var xmlDoc;

    try //Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.load(xmlFile);
    }
    catch (e) {
        try {

            var xhr = new XMLHttpRequest();
            xhr.open("GET", xmlFile, false);
            xhr.send(null);
            xmlDoc = xhr.responseXML;

        }
        catch (e) {
            alert(e.message);

        }
    }
    return xmlDoc;
}


function readXmlByAttributes(xmlElement, obj) {
    var i;
    if (xmlElement.attributes != null) {
        for (i = 0; i < xmlElement.attributes.length; i++) {
            obj[xmlElement.attributes[i].name] = xmlElement.attributes[i].value;
        }
    }
    if (xmlElement.childNodes.length > 0) {
        for (var j = 0, i = 0 ; i < xmlElement.childNodes.length; i++, j++) {
            if (xmlElement.childNodes[i].nodeName == "#text") {
                j--;
                continue;
            }
            else if (obj[xmlElement.childNodes[i].nodeName] == undefined)
                obj[xmlElement.childNodes[i].nodeName] = new Array();
            obj[xmlElement.childNodes[i].nodeName][j] = new Object();
            readXmlByAttributes(xmlElement.childNodes[i], obj[xmlElement.childNodes[i].nodeName][j]);
        }
    }

    return obj;
}