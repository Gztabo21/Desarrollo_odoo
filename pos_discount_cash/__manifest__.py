# -*- coding:utf-8 -*-
{
    "name":"Pos Discount Cash",
    "version":"1.0.0",
    "description":"Manejo de descuentos en el punto de venta al utilizar efectivo como método de pago.",
    "author":"Proandsys",
    "category":"sale",
    "depends":[
        'base',
        'point_of_sale',
    ],
    "data":[
        "views/res_config_settings_views.xml",
        "views/pos_payment_method_views.xml",
        "views/pos_order_views.xml",

    ],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_discount_cash/static/src/xml/*.xml',
            'pos_discount_cash/static/src/js/*.js',
        ]
        },
    "images":['static/description/banner.png'],
    'price':100.0,
    "currency":"USD",
    "application":True,
    "installable":True
}