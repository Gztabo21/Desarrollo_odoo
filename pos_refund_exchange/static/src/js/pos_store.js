/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { PosStore } from "@point_of_sale/app/services/pos_store";

/**
 * Evita OwlError en PaymentScreen si currentOrder aún no está disponible
 * durante la navegación del flujo de cambio.
 */
patch(PosStore.prototype, {
    getPaymentMethodFmtAmount(pm, order) {
        if (!order || typeof order.getDefaultAmountDueToPayIn !== "function") {
            return;
        }
        return super.getPaymentMethodFmtAmount(...arguments);
    },
});
