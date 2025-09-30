# -*- coding: utf-8 -*-

from odoo import models, fields, api


class StockWarehouse(models.Model):
    _inherit = 'stock.warehouse'

    @api.model
    def _load_pos_data_fields(self):
        return ['id', 'name', 'code']
    
    @api.model
    def _load_pos_data_domain(self,data):
        warehouse_id = data['pos.config']['data'][0]['warehouse_id']
        return [('id', '=', warehouse_id)]

    def _load_pos_data(self, data):
        domain = self._load_pos_data_domain(data)
        fields = self._load_pos_data_fields()
        return {
            'data': self.search_read(domain, fields, load=False),
            'fields': fields,
        }