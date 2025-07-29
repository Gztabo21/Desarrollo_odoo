/** @odoo-module **/

import {Component, onWillDestroy} from "@odoo/owl";
import { registry } from "@web/core/registry";
import { formatMonetary } from "@web/views/fields/formatters";

export class SppProductDetail extends Component {
    static template = "scanning_product_price.public_product_detail";
    static props = {
        productDetailData: { type: Object },
        currencyId: { type: Number },
        kioskReturn: { type: Function },
    };

    setup() {
        debugger;
        this.productName = this.props.productDetailData.product_name;
        this.productPrice = formatMonetary(this.props.productDetailData.product_price, {
                currencyId: this.props.productDetailData.currency['symbol'],
            });;
        this.kiosk_delay = setTimeout(() => {
            this.props.kioskReturn(true)
        }, 10000)
        
        onWillDestroy(() => clearTimeout(this.kiosk_delay));
    }
}
