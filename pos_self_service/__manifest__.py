{
    "name": "POS Auto Service - Pedido Auto-gestionado",
    "version": "1.0.0",
    "summary": "Página pública para que clientes gestionen su pedido y crear una venta",
    "description": "Añade una vista independiente donde un cliente puede seleccionar productos y crear un pedido de venta (integración simple con sale.order).",
    "author": "Auto-generated",
    "category": "Point of Sale",
    "license": "LGPL-3",
    "depends": ["web",
                'base', 
                "sale",
                "product", 
                "point_of_sale"],
    "data": [
        "views/auto_service_views.xml",
        "views/templates.xml",
    ],
    "assets": {
        "web.assets_frontend": [
            # "pos_auto_service/static/src/js/pos_auto_service.js",
            # "pos_auto_service/static/src/css/pos_auto_service.css"
        ]
    },
    "installable": True,
    "auto_install": False,
}
