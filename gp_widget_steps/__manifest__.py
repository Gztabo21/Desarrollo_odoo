{
    'name': 'Widget Steps Bar',
    'version': '1.0',
    'depends': ['base', 'web'],
    'author': 'Gustavo Cacharuco',
    'summary': 'Widget to show steps in forms',
    'description': """
        This module provides a widget to display steps in form views.
    """,
    'license': 'LGPL-3',
    'website': 'https://www.github.com/Gztabo21',
    'category': 'Tools',
    "images":['static/description/banner.png'],
    'data': [
        'views/sale_order_views.xml'
    ],
    'assets': {
        'web.assets_backend': [
            'gp_widget_steps/static/src/js/*.js',
            'gp_widget_steps/static/src/xml/*.xml',
            'gp_widget_steps/static/src/css/*.css',
        ],
    },
    'installable': True,
    'application': False,
    'price': 00.0,
    'currency': 'USD',
}