# -*- coding:utf-8 -*-
{
    "name": "Product Price Checker Using Mode Kiosk",
    "version": "1.0.0",
    "description": "Scannear barcode and show details products",
    "author": "Gustavo Cacharuco",
    "website": "dev-odoo.team",
    "category": "product",
    "image": "/scanning_product_price/static/description/icon.png",
    "depends": [
        "portal",
        "web",
        "product",
        "sale",
        "base",
        "barcodes",
    ],
    "data": [
             "views/spp_kiosk_template.xml",
             "views/spp_views.xml",],
    "assets": {
        "scanning_product_price.assets_public_spp": [
            'scanning_product_price/static/src/scss/kiosk/primary_variables.scss',
            # Front-end libraries
            ("include", "web._assets_helpers"),
            ("include", "web._assets_primary_variables"),

            'scanning_product_price/static/src/scss/kiosk/bootstrap_overridden.scss',
            ("include", "web._assets_frontend_helpers"),
            "web/static/lib/jquery/jquery.js",
            "web/static/src/scss/pre_variables.scss",
            "web/static/lib/bootstrap/scss/_variables.scss",
            "web/static/lib/bootstrap/scss/_variables-dark.scss",
            "web/static/lib/bootstrap/scss/_maps.scss",
            ("include", "web._assets_bootstrap_frontend"),
            ("include", "web._assets_bootstrap_backend"),
            "/web/static/lib/odoo_ui_icons/*",
            "/web/static/lib/bootstrap/scss/_functions.scss",
            "/web/static/lib/bootstrap/scss/_mixins.scss",
            "/web/static/lib/bootstrap/scss/utilities/_api.scss",
            "web/static/src/libs/fontawesome/css/font-awesome.css",
            ("include", "web._assets_core"),
            # Public Kiosk app and its components
            "scanning_product_price/static/src/public_app/**/*",
            'scanning_product_price/static/src/components/**/*',
            'scanning_product_price/static/src/scss/kiosk/spp_style.scss',
            "web/static/src/views/fields/formatters.js",
            # document link
            "web/static/src/session.js",
            "web/static/src/views/widgets/standard_widget_props.js",
            "web/static/src/views/widgets/documentation_link/*",
            # Barcode reader utils
            "barcodes/static/src/components/barcode_scanner.js",
            "barcodes/static/src/components/barcode_scanner.xml",
            "barcodes/static/src/components/barcode_scanner.scss",
            "barcodes/static/src/barcode_service.js",
        ],
    },
    'images': ['static/description/banner.png'],
    "license": "LGPL-3",
    "price": 30.00,
    "currency": "USD",
}
