# -*- coding: utf-8 -*-
{
    "name": "POS Refund Exchange",
    "version": "19.0.1.1.0",
    "category": "Sales/Point of Sale",
    "summary": "Odoo POS refund exchange app for product return and replacement in one order",
    "description": """
    <p><strong>POS Refund Exchange</strong></p>
    <p>The easiest way to handle product return and replacement in Odoo Point of Sale.</p>
    <p>This app restores the classic refund exchange flow for Odoo 19 and allows cashiers to process a refund and immediately add a replacement product in the same POS order.</p>
    <ul>
        <li>Open the product screen right after refund instead of jumping directly to payment</li>
        <li>Add a replacement product during the same refund exchange flow</li>
        <li>Keep natural line signs for exchange transactions: refunded product negative, new item positive</li>
        <li>Show the real net amount so the customer pays or receives the correct difference</li>
    </ul>
    <p>Use cases:</p>
    <ul>
        <li>Retail stores replacing a defective product with a new one</li>
        <li>Electronics shops handling product exchange at checkout</li>
        <li>Fashion stores performing return and replace sales in the POS</li>
    </ul>
    """,
    "author": "GUSTAVO CACHARUCO",
    "depends": ["point_of_sale"],
    "images": [
        "static/description/icon.png",
        "static/description/cover.png",
        "static/description/banner.png",
    ],
    "assets": {
        "point_of_sale._assets_pos": [
            "pos_refund_exchange/static/src/js/refund_exchange_ticket_screen.js",
            "pos_refund_exchange/static/src/js/refund_exchange_order.js",
            "pos_refund_exchange/static/src/js/refund_exchange_product_screen.js",
            "pos_refund_exchange/static/src/js/pos_store.js",
        ],
    },
    "data": [],
    "installable": True,
    "price": 30.0,
    "currency": "USD",
    "application": False,
    "auto_install": False,
    "license": "OPL-1",
    "website": "https://dev-odoo.dev",
    "support": "https://dev-odoo.dev",
}