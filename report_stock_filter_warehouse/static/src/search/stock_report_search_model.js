/** @odoo-module **/

import { StockReportSearchModel } from "@stock/views/search/stock_report_search_model";
import { patch } from "@web/core/utils/patch";

patch(StockReportSearchModel.prototype, {

    applyWarehouseMultiContext(warehouse_id){
        if(this.globalContext.hasOwnProperty('warehouse_id')){
            if(warehouse_id !== 999){
                this.globalContext['warehouse_id'].push(warehouse_id)
            }else{
                this.globalContext['warehouse_id'] = []
            }
        }else{

            this.globalContext['warehouse_id'] = [warehouse_id]
        }
        this._notify();
    },
    clearWarehouseMultiContext(warehouseId){
        if(this.globalContext.hasOwnProperty('warehouse') && this.globalContext.warehouse.length > 0){
            const index = this.globalContext.warehouse.indexOf(warehouseId);
                if (index !== -1) {
                    this.globalContext.warehouse.splice(index, 1);
                }
        }
        this._notify();
    
    }
})