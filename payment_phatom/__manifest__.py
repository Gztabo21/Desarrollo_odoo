# -*- coding: utf-8 -*-
{
    "name":"Payment Phatom",
    "version":"1.0",
    "author":"Gustavo Cacharuco",
    "category":"Accounting/Payment Acquirers",
    "description":"""
    Payment Phatom
    ===================
    This module integrates a checkout form and allows you to make payments through this payment gateway.
    Supports automated payments without CVV for subscriptions and card authorizations.  
    """,
    "website":"Gustavo Cacharuco",
    "depends":["payment",
               "website_sale",
               "web"
               ],
    "data":[
        # 'views/payment_views.xml',
        # 'views/payment_phatom_templates.xml',
        # 'data/payment_acquirer_data.xml',
    ],
    "demo":[
        # 'demo/payment_acquirer_demo.xml',
    ],
    "assets":{
        'web.assets_frontend': [
            # 'payment_phatom/static/src/scss/payment_phatom.scss',
            # 'payment_phatom/static/src/js/payment_phatom.js',
        ],  
    },
    "application":True,
    "installable":True,
    "license":"LGPL-3",
    "price":119.99,
    "currency":"USD",
}