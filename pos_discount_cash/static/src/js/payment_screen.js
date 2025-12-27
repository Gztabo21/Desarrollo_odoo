import { PaymentScreen } from "@point_of_sale/app/screens/payment_screen/payment_screen";
import { useState, reactive } from "@odoo/owl";
import { AlertDialog, ConfirmationDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { floatIsZero, roundPrecision } from "@web/core/utils/numbers";
import { _t } from "@web/core/l10n/translation";
import { patch } from "@web/core/utils/patch";

patch(PaymentScreen.prototype, {
    setup(){
        super.setup();

        if(!this.pos.company.pos_product_discount_id){
            this.dialog.add(AlertDialog, {
                title: _t("Error: Descuento por metodo de pago"),
                body: _t("El producto descuento por metodo de pago en efectivo no esta configurado en la compañia. \
                    Por favor, contacte al administrador del sistema."),
            });
            return;
        }
    },
    /**
     * 
     * @param {object} paymentMethod 
     * @returns boolean
     */
    showDiscountPayment(paymentMethod) {
        let paymentSelected = this.paymentLines.filter(
            (payment) => payment.payment_method_id.id === paymentMethod.id && 
            payment.payment_method_id.type === 'cash'
        )
            
        if( this.paymentLines.length === 1 && paymentSelected.length > 0 ){
            return true;
        }else{
            return false;
        }
    },
    /**
     * 
     * @returns el total a pagar si el metodo de pago tiene descuento.
     */
    getDiscountCashPayment(paymentMethod) {
        
       let totalWithout = this.currentOrder.get_total_without_discount_payment();
       let totalDue = this.currentOrder.getTotalDue()
       if(this.currentOrder.has_discount_payment){
              return totalWithout - (totalWithout * (this.pos.company.pos_discount_cash_payment / 100)  );
       }
       
       return  totalDue - (totalDue * (this.pos.company.pos_discount_cash_payment / 100) );
   },
   async addNewPaymentLine(paymentMethod) {
       super.addNewPaymentLine(paymentMethod);
       if (this.pos.company.pos_discount_cash_payment > 0 && this.paymentLines.length == 1) {
           this.currentOrder.set_has_discount_payment(true);
           await this.validateHasDiscountPayment();
        }else if(this.paymentLines.length > 1){
        this.currentOrder.set_has_discount_payment(false);
        this.removeDiscountPaymentMethod();
    }
},
   async deletePaymentLine(uuid){
    let paymentLine = this.paymentLines.find(line => line.uuid === uuid);
    let hasDiscount = this.pos.company.pos_discount_cash_payment > 0;
    super.deletePaymentLine(uuid);
    if(this.paymentLines.length == 1 && !hasDiscount){
        this.currentOrder.set_has_discount_payment(true);
        await this.validateHasDiscountPayment();
    }else if(this.paymentLines.length == 0 || (this.paymentLines.length == 1 && hasDiscount)){
        this.currentOrder.set_has_discount_payment(false);
        this.removeDiscountPaymentMethod();
    }
},
   removeDiscountPaymentMethod() {
       let linesWithoutDiscount = this.currentOrder.lines
       .filter(line => line.product_id.id !== this.pos.company.pos_product_discount_id.id);
       if(linesWithoutDiscount){
           this.currentOrder.lines = linesWithoutDiscount;   
        }
    }
    ,
    async validateHasDiscountPayment(){
        if (this.paymentLines.length == 1 && this.paymentLines[0].payment_method_id.type === 'cash') {
            
            
            if(!this.pos.company.pos_product_discount_id){
                
                this.dialog.add(AlertDialog, {
                    title: _t("Error: Descuento por metodo de pago"),
                    body: _t("El producto para el descuento por metodo de pago no esta configurado en la compañia. Por favor, contacte al administrador del sistema."),
                });

                return;
            }
            // verificar si ya existe una linea de descuento
            let discountLine = this.currentOrder.lines.find(line => line.product_id.id === this.pos.company.pos_product_discount_id.id);
            // Crear linea de descuento si no existe.
            if(!discountLine){
                await reactive(this.pos)
                .addLineToCurrentOrder({ product_id: this.pos.company.pos_product_discount_id}, {});
                // Actualizar el monto del producto descuento.
                this.currentOrder.lines.forEach(line => {
                    if(line.product_id.id === this.pos.company.pos_product_discount_id.id) {
                        let paymentSelected = this.paymentLines[0]
                        let totalDue = this.currentOrder.getTotalDue() - line.price_unit;
                        let discountAmount =  (totalDue   * (this.pos.company.pos_discount_cash_payment / 100)).toFixed(2); ;
                        debugger;
                                line.price_unit = -discountAmount;
                                line.price_subtotal = -discountAmount
                                line.price_subtotal_incl = -discountAmount
                            }
                });
            }
            
        }
        
   }
});
