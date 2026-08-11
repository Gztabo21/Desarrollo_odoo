# -*- coding: utf-8 -*-
{
    "name": "POS Refund Exchange",
    "version": "19.0.1.1.0",
    "category": "Sales/Point of Sale",
    "images": ["pos_refund_exchange/static/description/banner.png"],
    "summary": "Odoo POS refund exchange app for product return and replacement in one order",
    "description": """
POS Refund Exchange
===================

The easiest way to handle product return and replacement in Odoo Point of Sale.

This app restores the classic refund exchange flow for Odoo 19 and allows cashiers to
process a refund and immediately add a replacement product in the same POS order.

It is ideal for store operations that need a fast Odoo refund with replacement product,
return and replace workflow, or product exchange in POS without forcing a simple refund.

Key benefits:

* Open the product screen right after refund instead of jumping directly to payment
* Add a replacement product during the same refund exchange flow
* Keep natural line signs for exchange transactions: refunded product negative, new item positive
* Show the real net amount so the customer pays or receives the correct difference
* Prevent PaymentScreen issues during navigation when the order is temporarily unavailable

Use cases:

* Retail stores replacing a defective product with a new one
* Electronics shops handling product exchange at checkout
* Fashion stores performing return and replace sales in the POS
* Businesses that need a practical Odoo POS exchange workflow for customer service

This module does not depend on Chilean localization and is designed for standard Odoo 19 POS.

Do not install it together with duplicate exchange patches from l10n_cl_fe_pos_nc if those
would load the same overrides twice.
""",
    "author": "Personales",
    "license": "LGPL-3",
    "depends": [
        "point_of_sale",
    ],
    "assets": {
        "point_of_sale._assets_pos": [
            "pos_refund_exchange/static/src/js/refund_exchange_ticket_screen.js",
            "pos_refund_exchange/static/src/js/refund_exchange_order.js",
            "pos_refund_exchange/static/src/js/refund_exchange_product_screen.js",
            "pos_refund_exchange/static/src/js/pos_store.js",
        ],
    },
    "installable": True,
    "price": 10.0,
    "currency": "USD",
    "application": False,
    "auto_install": False,
}
