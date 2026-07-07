/** @odoo-module **/
import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";
import { useService } from "@web/core/utils/hooks";
import { CashMovePopup } from "@point_of_sale/app/navbar/cash_move_popup/cash_move_popup";
import { Navbar } from "@point_of_sale/app/navbar/navbar";

patch(Navbar.prototype, {
    get showCashMoveButton() {
        return Boolean(
            this.pos.config.cash_control &&
            (this.pos.session._has_cash_move_perm || this.pos.session._has_cash_withdrawal_perm)
        );
    }
});

patch(CashMovePopup.prototype, {
    setup() {
        super.setup(...arguments);
        this.notification = useService("notification");
        this.showCashOut = this.pos.session._has_cash_withdrawal_perm;
    },
    onClickButton(type) {
        if (type === "out" && !this.showCashOut) {
            this.notification.add(
                _t("You do not have permission to withdraw cash. Only authorized users can perform cash out."),
                { type: "warning" }
            );
            return;
        }
        super.onClickButton(...arguments);
    },
});
