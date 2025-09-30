/** @odoo-module */

import {patch} from '@web/core/utils/patch';
import { ProductCard } from "@point_of_sale/app/generic_components/product_card/product_card";



patch(ProductCard.prototype, {
    get productQtyAvailable() {
        return this.env.utils.formatProductQty(this.props.product.free_qty ?? 0, false);
    }
})