/** @odoo-module **/

import { StockReportSearchPanel } from "@stock/views/search/stock_report_search_panel";
import { patch } from "@web/core/utils/patch";

patch(StockReportSearchPanel.prototype,  {
    setup(){
        super.setup(...arguments);
        Object.assign(this.state.active,{warehouse:{
            999:true
        }})
    },
    toggleFilterValueWarehousesMulti(filterId, { currentTarget }) {

        console.log(this)
        this.state.active['warehouse'][filterId] = currentTarget.checked;
        if(currentTarget.checked === true) {
            this.env.searchModel.applyWarehouseMultiContext(filterId)
        }
        else{
            this.env.searchModel.clearWarehouseMultiContext(filterId)
            delete this.state.active.warehouse[filterId]
            debugger
        }
    }
})
