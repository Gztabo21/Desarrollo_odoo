# -*- coding:utf-8 -*-

from odoo import fields,models,api,_



class ResConfigSettings(models.TransientModel):
    _inherit ="res.config.settings"

    pos_discount_cash_payment = fields.Float(string="Descuento por pago en efectivo",
                                             digits=(16,2),
                                             default=5.00,
                                             related='company_id.pos_discount_cash_payment',
                                             readonly=False
                                             )
    pos_active_discount_cash_payment = fields.Boolean(
        string='Activar descuento por pago en efectivo',
        help='Si está activado, se aplicará un descuento según el método de pago en efectivo.',
        default=True,
        related='company_id.pos_active_discount_cash_payment',
        readonly=False)
    