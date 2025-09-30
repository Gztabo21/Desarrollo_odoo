# -*- coding: utf-8 -*-

from odoo import models, fields, api  
from odoo.tools import SQL


class PosConfig(models.Model):
    _inherit = 'pos.config'

    # @api.model
    # def _load_pos_data_fields(self):
    #     res = super()._load_pos_data_fields()
    #     res += ['id', 'name', 'stock_warehouse_id']
    #     return res
    
    def get_limited_products_loading(self, fields):
        self = self.with_context(warehouse_id=self.warehouse_id.id)
        res = super(PosConfig, self).get_limited_products_loading(fields)
        product_ids = [p['id'] for p in res]
        code_ware = '%{0}/%'.format(self.warehouse_id.code)
        sql = SQL("""
            SELECT pp.id as product_id, sum(sq.quantity - sq.reserved_quantity) FROM stock_quant sq
            JOIN product_product pp ON pp.id = sq.product_id
            where sq.location_id IN (
                SELECT id FROM stock_location WHERE usage = 'internal' AND complete_name LIKE %s
            )
            AND sq.product_id in %s
            GROUP BY pp.id""", code_ware,tuple(product_ids)) 
        result = self.env.execute_query(sql)
        for r in result:
            for p in res:
                if p['id'] == r[0]:
                    p['free_qty'] = r[1]
                    break
        return res