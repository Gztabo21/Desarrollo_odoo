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
    get_total_without_discount_payment(){
        let total = this.get_total_with_tax();
        if (this.company_id.pos_active_discount_cash_payment && 
            this.payment_ids.length == 1 && this.payment_ids[0].payment_method_id.type === 'cash') {
            let paymentLine = this.payment_ids[0];
            let existProductDiscount = this.lines.filter(line => line.product_id.id == this.company_id.pos_product_discount_id.id );
            if(this.has_discount_payment && existProductDiscount.length > 0){

                // se sumara el valor del producto de descuento al total.
                total = total + Math.abs(existProductDiscount[0].price_unit);
            }
            else if (!this.has_discount_payment && this.company_id.pos_discount_cash_payment && 
                this.company_id.pos_discount_cash_payment > 0) {
                debugger;
                total = total - (total * ( this.company_id.pos_discount_cash_payment / 100) );
            }
            return total
        }
        return 0;
    },
    set_has_discount_payment(has_discount_payment){
        
        this.has_discount_payment = has_discount_payment;
        
        return this.has_discount_payment;
    },
    getDefaultAmountDueToPayIn(paymentMethod) {
        let res = super.getDefaultAmountDueToPayIn(paymentMethod);
        if(this.company_id.pos_active_discount_cash_payment && 
            this.company_id.pos_discount_cash_payment && 
            this.company_id.pos_discount_cash_payment > 0){

                const { order_remaining, order_sign } = this.taxTotals;
                const amount = this.shouldRound(paymentMethod)
                    ? this.getRoundedRemaining(this.config.rounding_method, order_remaining)
                    : order_remaining;

                   res = order_sign * (amount - (amount * (this.company_id.pos_discount_cash_payment / 100)))            
        }
        return res
    },
    is_paid(){
        let res = super.is_paid();
        
        if (this.company_id.pos_active_discount_cash_payment && 
            this.payment_ids.length == 1) {
            let paymentLine = this.payment_ids[0];
            if (paymentLine.payment_method_id.type === 'cash' ) {

                return true;
            }
        }
        
        return res;
    }
});