/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { PosOrder } from "@point_of_sale/app/models/pos_order";

/**
 * Odoo 19 bloquea qty > 0 en órdenes is_refund y aplica orderSign = -1
 * a todas las líneas (diseño para reembolso puro).
 *
 * En un cambio (reembolso + producto nuevo) eso invierte los montos:
 * qty -1 se ve positivo y qty +1 negativo. Usar signos naturales.
 */
patch(PosOrder.prototype, {
    isSaleDisallowed(values, options) {
        return false;
    },

    /** True si hay al menos una línea de venta (qty > 0) junto al reembolso. */
    get isRefundExchange() {
        return Boolean(this.is_refund && this.lines?.some((l) => (l.qty || 0) > 0));
    },

    get orderSign() {
        if (this.isRefundExchange) {
            return 1;
        }
        return super.orderSign;
    },

    _computeAllPrices(opts = {}) {
        const result = super._computeAllPrices(...arguments);
        if (this.isRefundExchange && result?.taxDetails) {
            result.taxDetails.order_sign = 1;
        }
        return result;
    },
});
