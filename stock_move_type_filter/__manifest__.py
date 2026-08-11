# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    "name": "MRP Stock Type Filter Main",
    "summary": "Filtrar el tipo de operacion para la bodega principal",
    "description": """
        This module extends the stock picking type model to add custom filters for MRP.
    """,
    "author": "Gustavo cacharuco",
    "website": "https://dev-odoo.team",
    "category": "stock",
    "version": "19.0.1.0.0",
    "depends": ["stock"],
    "data": [
        # XML files can be added here if needed
        "views/stock_picking_views.xml",
    ],
    "installable": True,
    "application": True,
    "price":0.0,
    "license":"LGPL-3"
}
