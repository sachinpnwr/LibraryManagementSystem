declare var bootstrap: any;


export abstract class SharedComponenet {
    _model: any;
    showModal(htmlCtrl: any) {
        return bootstrap.Modal.getOrCreateInstance(document.getElementById(htmlCtrl), {
            keyboard: false,
            backdrop: 'static'
        });
    }

    showCanvasModal(htmlCtrl: any) {
        return bootstrap.Offcanvas.getOrCreateInstance(document.getElementById(htmlCtrl), {
            keyboard: false,
            backdrop: 'static'
        });
    }

    addUpdateDataList(dataList: any, dataObject: any, condition :any, addToEnd = false) {
        var item = dataList.filter(condition);
        if (item.length == 0) {
            if (addToEnd)
                dataList.unshift(dataObject);
            else
                dataList.push(dataObject);
        }
        else {
            Object.assign(item[0], dataObject);
        }
        return [].concat(dataList);
    }
}