/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { TicketScreen } from "@point_of_sale/app/screens/ticket_screen/ticket_screen";

/**
 * Tras crear el reembolso, abrir ProductScreen (no PaymentScreen) para permitir
 * agregar producto de reemplazo y cobrar/devolver la diferencia.
 *
 * Interceptamos navigate para no montar PaymentScreen un instante (evita OwlError
 * si currentOrder aún no está listo / props desfasadas).
 */
patch(TicketScreen.prototype, {
    async onDoRefund() {
        const pos = this.pos;
        const originalNavigate = pos.navigate.bind(pos);
        pos.navigate = (page, params = {}) => {
            if (page === "PaymentScreen" && params.orderUuid) {
                const order = pos.models["pos.order"].getBy("uuid", params.orderUuid);
                if (order) {
                    order.setScreenData({ name: "ProductScreen" });
                }
                pos.ticket_screen_mobile_pane = "left";
                return originalNavigate("ProductScreen", params);
            }
            return originalNavigate(page, params);
        };
        try {
            await super.onDoRefund(...arguments);
        } finally {
            pos.navigate = originalNavigate;
        }
    },
});
