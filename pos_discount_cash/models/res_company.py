# -*- coding:utf-8 -*-

from odoo import fields,api,models,_




class ResCompanyInherit(models.Model):
    _inherit = "res.company"

    pos_discount_cash_payment = fields.Float(string="Descuento por pago en efectivo",
                                             digits=(16,2),
                                             default=5.00)
    pos_active_discount_cash_payment = fields.Boolean(
        string='Activar descuento por pago en efectivo',
        help='Si está activado, se aplicará un descuento según el método de pago en efectivo.',
        default=True,
    )
    pos_product_discount_id = fields.Many2one(
        'product.product',
        string='Producto de descuento por pago en efectivo',
        domain=[('type', 'in', ['consu', 'service'])],
        help='Producto utilizado para registrar el descuento aplicado cuando se utiliza efectivo como método de pago en el punto de venta.',
    )   

    @api.model
    def _load_pos_data_fields(self, config_id):
        res = super(ResCompanyInherit,self)._load_pos_data_fields(config_id)
        res += ['pos_active_discount_cash_payment','pos_discount_cash_payment','pos_product_discount_id']
        return res