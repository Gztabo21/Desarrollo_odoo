    # -*- coding: utf-8 -*-
import logging

from odoo import http, _
from odoo.http import request
from odoo.osv.expression import AND
from odoo.tools import format_amount
from odoo.addons.account.controllers.portal import PortalAccount
from datetime import timedelta, datetime

_logger = logging.getLogger(__name__)
from odoo import http
from odoo.http import request
import json


class PosAutoServiceController(PortalAccount):

    @http.route(['/pos_self_service/', '/pos_self_service/ui'], type='http', auth='user')
    def pos_web(self, config_id=False, from_backend=False, **k):
        """Open a pos session for the given config.

        The right pos session will be selected to open, if non is open yet a new session will be created.

        /pos_self_service/ui and /pos_self_service/ both can be used to access the POS. On the SaaS,
        /pos_self_service/ui uses HTTPS while /pos_self_service/ uses HTTP.

        :param debug: The debug mode to load the session in.
        :type debug: str.
        :param config_id: id of the config that has to be loaded.
        :type config_id: str.
        :returns: object -- The rendered pos session.
        """
        is_internal_user = request.env.user._is_internal()
        pos_config = False
        if not is_internal_user:
            return request.not_found()
        domain = [
                ('state', 'in', ['opening_control', 'opened']),
                ('user_id', '=', request.session.uid),
                ('rescue', '=', False)
                ]
        if config_id and request.env['pos.config'].sudo().browse(int(config_id)).exists():
            domain = AND([domain,[('config_id', '=', int(config_id))]])
            pos_config = request.env['pos.config'].sudo().browse(int(config_id))
        pos_session = request.env['pos.session'].sudo().search(domain, limit=1)

        # The same POS session can be opened by a different user => search without restricting to
        # current user. Note: the config must be explicitly given to avoid fallbacking on a random
        # session.
        if not pos_session and config_id:
            domain = [
                ('state', 'in', ['opening_control', 'opened']),
                ('rescue', '=', False),
                ('config_id', '=', int(config_id)),
            ]
            pos_session = request.env['pos.session'].sudo().search(domain, limit=1)

        if not pos_config or not pos_config.active or pos_config.has_active_session and not pos_session:
            return request.redirect('/odoo/action-point_of_sale.action_client_pos_menu')

        if not pos_config.has_active_session:
            pos_config.open_ui()
            pos_session = request.env['pos.session'].sudo().search(domain, limit=1)

        # The POS only works in one company, so we enforce the one of the session in the context
        session_info = pos_session._update_session_info(request.env['ir.http'].session_info())
        context = {
            'from_backend': 1 if from_backend else 0,
            'use_pos_fake_tours': True if k.get('tours', False) else False,
            'session_info': session_info,
            'login_number': pos_session.with_company(pos_session.company_id).login(),
            'pos_session_id': pos_session.id,
            'pos_config_id': pos_session.config_id.id,
            'access_token': pos_session.config_id.access_token,
        }
        response = request.render('point_of_sale.index', context)
        response.headers['Cache-Control'] = 'no-store'
        return response
    
    @http.route(['/pos_auto_service'], type='http', auth='public', website=True)
    def index(self, **kw):
        # Render a simple page; the frontend JS will request products via JSON
        return request.render('pos_auto_service.index', {})

    @http.route(['/pos_auto_service/products'], type='json', auth='public', methods=['GET'])
    def products(self, **kw):
        # Return simple product list usable by frontend
        products = request.env['product.product'].sudo().search([('sale_ok', '=', True)], limit=100)
        res = []
        for p in products:
            res.append({
                'id': p.id,
                'name': p.name,
                'price': p.lst_price,
            })
        return res

    @http.route(['/pos_auto_service/create_order'], type='json', auth='public', methods=['POST'])
    def create_order(self, **kw):
        # Expect kw to contain 'items' as a list of {product_id, qty}
        items = kw.get('items') or []
        try:
            # Determine partner: logged in user's partner or public partner
            partner = request.env.user.partner_id
            partner_id = partner.id or False

            SaleOrder = request.env['sale.order'].sudo()
            OrderLine = request.env['sale.order.line'].sudo()

            order_vals = {
                'partner_id': partner_id,
                'note': 'Pedido creado desde POS Auto Service',
            }
            order = SaleOrder.create(order_vals)

            for it in items:
                pid = int(it.get('product_id'))
                qty = float(it.get('qty') or 1.0)
                product = request.env['product.product'].sudo().browse(pid)
                line_vals = {
                    'order_id': order.id,
                    'product_id': product.id,
                    'product_uom_qty': qty,
                    'price_unit': product.lst_price,
                }
                OrderLine.create(line_vals)

            order.message_post(body='Pedido creado automáticamente desde la página pública.')

            return {'success': True, 'order_id': order.id, 'order_name': order.name}
        except Exception as e:
            return {'success': False, 'error': str(e)}
