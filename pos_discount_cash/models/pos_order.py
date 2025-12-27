# -*- coding: utf-8 -*-

from odoo import models, fields, api, _


class PosOrderInherit(models.Model):
    _inherit = 'pos.order'

    has_discount_payment = fields.Boolean(string='Tiene descuento por método de pago', default=False, copy=False)



