{
    'name': 'POS Cash Control Permissions',
    'version': '18.0.1.0.0',
    'summary': 'Control cash in/out permissions in POS - only authorized users can withdraw cash',
    'description': 'Adds a specific security group for cash withdrawal in POS. Only users with the "POS Cash Withdrawal" permission can perform cash out operations.',
    'author': 'Gustavo Cacharuco',
    'website': 'https://www.linkedin.com/in/gustavo-cacharuco26/',
    'category': 'Point of Sale',
    'license': 'LGPL-3',
    'depends': [
        'point_of_sale',
    ],
    'data': [
        'security/pos_cash_security.xml',
        'security/ir.model.access.csv',
        'views/cash_withdrawal_views.xml',
    ],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_cash_control_permissions/static/src/js/cash_move_popup.js',
            'pos_cash_control_permissions/static/src/xml/cash_move_popup.xml',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
    'price': 0,
    'currency': 'USD',
}
