# -*- coding: utf-8 -*-

from odoo import models, fields, api, _


class StockPickingType(models.Model):
    _inherit = "stock.picking.type"


    @api.depends('code')
    def _compute_show_picking_type(self):
        show_picking_type_general = True
        for record in self:
            if record.warehouse_id.show_in_dashboard:
                record.show_picking_type = True
                show_picking_type_general = False
            else:
                record.show_picking_type = False
        
        if show_picking_type_general:
            super(StockPickingType,self)._compute_show_picking_type()

