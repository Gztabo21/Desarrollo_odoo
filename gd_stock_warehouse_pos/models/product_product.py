# -*- coding:utf-8 -*-

from odoo import models, fields, api,_
from odoo.exceptions import UserError



class ProductProduct(models.Model):
    _inherit = 'product.product'

    @api.model
    def _load_pos_data_fields(self, config_id):
        result = super(ProductProduct, self)._load_pos_data_fields(config_id)
        return result + [
            'free_qty',
            'qty_available'
        ]
    
    