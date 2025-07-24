# -*- coding: utf-8 -*-


from odoo import models, fields, api, _


class StockWarehouse(models.Model):
    _inherit = "stock.warehouse"


    show_in_dashboard = fields.Boolean(
        "Mostrar en el Dashboard",
        help="Indica si se mostrara en el Dashboard"
    )