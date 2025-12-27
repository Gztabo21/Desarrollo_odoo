/** @odoo-module */

import { PosOrder } from '@point_of_sale/app/models/pos_order';
import { patch } from '@web/core/utils/patch';
import {roundPrecision} from '@web/core/utils/numbers';
import { AlertDialog, ConfirmationDialog } from "@web/core/confirmation_dialog/confirmation_dialog";

patch(PosOrder.prototype, {
    setup(vals){
        super.setup(vals);
        this.has_discount_payment = vals.has_discount_payment || false;
        this.child_partner_id = vals.child_partner_id || null;
        
    },
    set_has_discount_payment(has_discount_payment){
        
        this.has_discount_payment = has_discount_payment;
        
        return this.has_discount_payment;
    },
    getDefaultAmountDueToPayIn(paymentMethod) {
        let res = super.getDefaultAmountDueToPayIn(paymentMethod);
        if(this.company_id.pos_active_discount_payment_method && 
            paymentMethod.pos_discount_payment_method && 
            paymentMethod.pos_discount_payment_method > 0){

                const { order_remaining, order_sign } = this.taxTotals;
                const amount = this.shouldRound(paymentMethod)
                    ? this.getRoundedRemaining(this.config.rounding_method, order_remaining)
                    : order_remaining;

                   res = order_sign * (amount - (amount * paymentMethod.pos_discount_payment_method))            
        }
        return res
    },
    export_for_printing(base_url, headerData){
        let res = super.export_for_printing(base_url, headerData);
        res.has_discount_payment = this.has_discount_payment;
        res.child_partner_id = this.models['res.partner'].getBy('id',this.child_partner_id) || false;
        res.headerData.child_partner_id = res.child_partner_id ? res.child_partner_id : null;
        return res;
    },
    is_paid(){
        let res = super.is_paid();
        
        if (this.company_id.pos_active_discount_payment_method && 
            this.payment_ids.length == 1) {
            let paymentLine = this.payment_ids[0];
            if (paymentLine.payment_method_id.pos_discount_payment_method && 
                paymentLine.payment_method_id.pos_discount_payment_method > 0) {

                return true;
            }
        }
        
        return res;
    }
});