# -*- coding:utf-8 -*-

from odoo import http
from odoo.http import request, Response
from odoo.service.common import exp_version
from odoo.tools import float_round, py_to_js_locale, SQL




class ScanningProductPrice(http.Controller):
    @staticmethod
    def _get_company(token):
        company = request.env['res.company'].sudo().search([('spp_kiosk_key', '=', token)],limit=1)
        return company
    
    @http.route('/scanning_product/<token>', type='http', auth='user', website=True)
    def scanning_product_price(self,token,from_trial_mode=False):
        """ Render the scanning product price page """
        company = self._get_company(token)
        if not company:
            return request.not_found()
        else:
            
            has_password = self.has_password()
            if not from_trial_mode and has_password:
                request.session.logout(keep_db=True)
            if (from_trial_mode or not has_password):
                kiosk_mode = "settings"
            else:
                kiosk_mode = company.attendance_kiosk_mode
            version_info = exp_version()
        return request.render('scanning_product_price.public_spp_kiosk_mode', {
            'kiosk_backend_info': {
                        'token': token,
                        'company_id': company.id,
                        'company_name': company.name,
                        'company_currency': company.currency_id.id,
                        'kiosk_mode': kiosk_mode,
                        'from_trial_mode': from_trial_mode,
                        'barcode_source': company.attendance_barcode_source,
                        'lang': py_to_js_locale(company.partner_id.lang or company.env.lang),
                        'server_version_info': version_info.get('server_version_info'),
                    },
        })
    @http.route('/scanning_product_price/kiosk_mode_menu/<int:company_id>', auth='user', type='http')
    def kiosk_spp_menu_item_action(self, company_id):
        # if request.env.user.has_group("hr_attendance.group_hr_attendance_manager"):
            if self.has_password():
                request.session.logout(keep_db=True)
            return request.redirect(request.env['res.company'].browse(company_id).spp_kiosk_url)
        # else:
        #     return request.not_found()
    
    def has_password(self):
        # With this method we try to know whether it's the user is on trial mode or not.
        # We assume that in trial, people have not configured their password yet and their password should be empty.
        request.env.cr.execute(
            SQL('''
                SELECT COUNT(password)
                  FROM res_users
                 WHERE id=%(user_id)s
                   AND password IS NOT NULL
                 LIMIT 1
                ''', user_id=request.env.user.id))
        return bool(request.env.cr.fetchone()[0])
    
    
    
    @http.route('/scanning_product_price/product_barcode_scanned', type="json", auth="public")
    def scan_barcode(self, token, barcode):
        company = self._get_company(token)
        if company:
            product = request.env['product.template'].sudo().search([('barcode', '=', barcode)], limit=1)
            if product:
    
                return {
                    'product_id': product.id,
                    'product_name': product.name,
                    'product_price': float_round(product.list_price, precision_digits=2),
                    'currency': request.env['res.currency'].search_read([('id','=',company.currency_id.id)],['name', 'symbol', 'position', 'rounding', 'decimal_places'])[0],
                    }
        return {}