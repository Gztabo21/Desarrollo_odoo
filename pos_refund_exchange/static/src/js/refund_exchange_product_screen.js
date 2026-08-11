/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { AlertDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { _t } from "@web/core/l10n/translation";

/**
 * En reembolso: bloquear numpad solo en líneas de devolución.
 * Las líneas nuevas (producto de cambio) sí se pueden editar.
 */
patch(ProductScreen.prototype, {
    onNumpadClick(buttonValue) {
        if (["quantity", "discount", "price"].includes(buttonValue)) {
            this.numberBuffer.capture();
            this.numberBuffer.reset();
            this.pos.numpadMode = buttonValue;
            return;
        }
        const order = this.pos.selectedOrder;
        const line = order?.getSelectedOrderline();
        if (
            order?.isRefund &&
            line?.refunded_orderline_id &&
            buttonValue !== "Backspace"
        ) {
            return this.dialog.add(AlertDialog, {
                title: _t("%s update not allowed", this.pos.numpadMode),
                body: _t("You can not change the %s of the refund order.", this.pos.numpadMode),
            });
        }
        this.numberBuffer.sendKey(buttonValue);
    },
});
