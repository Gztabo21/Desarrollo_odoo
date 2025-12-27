# -*- coding: utf-8 -*-

from odoo import models, fields, api, _ 


class PosPaymentMethod(models.Model):
    _inherit = 'pos.payment.method'

    pos_discount_payment_method = fields.Float(
        string='Discount for Payment method',
        help='If this payment method is of type cash, apply this discount to the total amount due when paying with cash.',
        default=0.0,
    )

    @api.model
    def _load_pos_data_fields(self, config_id):
        res = super(PosPaymentMethod, self)._load_pos_data_fields(config_id)
        res += ['pos_discount_payment_method']
        return res
