# -*- codign: utf-8 -*- 
{
    "name":"Filtro de almacenes en Informe Stock",
    "version":"1.0.0",
    "description":" Selectionar los almacenes para el informe",
    "author":"Gustavo Cacharuco",
    "data":[],
    "depends":['base','stock','product','web'],
    "assets":{
        'web.assets_backend':[
            'report_stock_filter_warehouse/static/src/search/*.js',
            'report_stock_filter_warehouse/static/src/search/*.xml',
        ]
    },
    "images":['static/description/banner.png'],
    "installable": True,
    "application": True,
    "licenses":"LGPL-3",
    "price":50.0,
    "currency":"USD"
}