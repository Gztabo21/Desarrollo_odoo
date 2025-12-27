import { PaymentScreen } from "@point_of_sale/app/screens/payment_screen/payment_screen";
import { useState, reactive } from "@odoo/owl";
import { AlertDialog, ConfirmationDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { _t } from "@web/core/l10n/translation";
import { patch } from "@web/core/utils/patch";

patch(PaymentScreen.prototype, {
    setup(){
        super.setup();
        this.hasDiscountPayment = false;
    },
    showDiscountPayment(paymentMethod) {
        let paymentSelected = this.paymentLines.filter(
            (payment) => payment.payment_method_id.id === paymentMethod.id && 
            payment.payment_method_id.type === 'cash'
        )

        if(this.paymentLines.length == 1 && paymentSelected.length > 0 ){
            this.hasDiscountPayment = true;
            return true;
        }else{
            this.hasDiscountPayment = false;
            return false;
        }
    },
    /**
     * 
     * @returns el total a pagar si el metodo de pago tiene descuento.
     */
   getDiscountCashPayment(paymentMethod) {
       let totalDue = this.currentOrder.getTotalDue()

       return  totalDue - (totalDue * paymentMethod.pos_discount_payment_method );
   },
   async addNewPaymentLine(paymentMethod) {
    super.addNewPaymentLine(paymentMethod);
    if (paymentMethod.pos_discount_payment_method > 0 && this.paymentLines.length == 1) {
        this.currentOrder.set_has_discount_payment(true);
    }else if(this.paymentLines.length > 1){
        this.currentOrder.set_has_discount_payment(false);
    }
   },
   async validateHasDiscountPayment(){
    if (!this.hasDiscountPayment && this.paymentLines.length == 1 ) {
         
            if(!this.pos.company.pos_product_discount_payment_id){
                
                this.dialog.add(AlertDialog, {
                    title: _t("Error: Descuento por metodo de pago"),
                    body: _t("El producto para el descuento por metodo de pago no esta configurado en la compañia. Por favor, contacte al administrador del sistema."),
                });
                return;
            }
            // verificar si ya existe una linea de descuento
            let discountLine = this.currentOrder.lines.find(line => line.product_id.id === this.pos.company.pos_product_discount_payment_id.id);
            // Crear linea de descuento si no existe.
            if(!discountLine){
                await reactive(this.pos)
                .addLineToCurrentOrder({ product_id: this.pos.company.pos_product_discount_payment_id}, {});
                // Actualizar el monto del producto descuento.
                this.currentOrder.lines.forEach(line => {
                    if(line.product_id.id === this.pos.company.pos_product_discount_payment_id.id) {
                        let paymentSelected = this.paymentLines[0]
                        let totalDue = this.currentOrder.getTotalDue();
                        let discountAmount =  Math.floor(totalDue * paymentSelected.payment_method_id.pos_discount_payment_method) ;
                                line.price_unit = -discountAmount;
                                line.price_subtotal = -discountAmount
                                line.price_subtotal_incl = -discountAmount
                            }
                });
            }
            
        }
        
   },
    async validateOrder(isForceValidate) {
        // validar si tiene descuento por metodo de pago
        await this.validateHasDiscountPayment();
        return await super.validateOrder(isForceValidate);
    },
    validate_type_document(){

        if(!this.currentOrder.has_discount_payment){
            return super.validate_type_document();
        }else{
            if (!this.currentOrder.is_to_invoice() &&
                !this.currentOrder.es_boleta() && 
                !this.currentOrder.is_noteCredit()) {
							this.dialog.add(AlertDialog, {
					        	title: _t("Error de integridad"),
					        	body: _t("Debe seleccionar un Tipo de Documento")
							});
            				return false;
            		}
        }    
    }
});
