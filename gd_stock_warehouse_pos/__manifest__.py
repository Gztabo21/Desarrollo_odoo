{
    "name": "GD Stock Warehouse POS",
    "version": "1.0.0",
    "summary": "Review stock of warehouse POS",
    "description": "Module to review stock of warehouse POS",
    "author": "Gustavo Cacharuco",
    'website': "https://www.linkedin.com/in/gustavocacharuco/",
    "category": "Point of Sale",
    "depends": [
        "base",
        "point_of_sale",
        "stock",
    ],
    "data": [
    ],
    "assets": {
        'point_of_sale._assets_pos': [
            'gd_stock_warehouse_pos/static/src/js/*.js',
            'gd_stock_warehouse_pos/static/src/xml/*.xml',
            'gd_stock_warehouse_pos/static/src/css/*.css',
        ]
    },
    "installable": True,
    "application": True,
    "auto_install": False,
    'license': 'LGPL-3',
    'price':25.00,
    'currency':'USD',
    'image':'static/description/banner.png',
}