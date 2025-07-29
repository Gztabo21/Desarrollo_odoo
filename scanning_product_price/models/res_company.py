# -*- coding:utf-8 -*-

from odoo import fields,models,api,_
import uuid
from werkzeug.urls import url_join


class ResCompany(models.Model):
    _inherit = "res.company"
    

    spp_kiosk_key = fields.Char(default=lambda s: uuid.uuid4().hex, copy=False)
    spp_kiosk_url = fields.Char(compute="_compute_spp_kiosk_url")
    spp_kiosk_delay = fields.Integer(default=10, string="Delay in seconds")

    @api.depends("spp_kiosk_key")
    def _compute_spp_kiosk_url(self):
        for company in self:
            company.spp_kiosk_url = url_join(self.env['res.company'].get_base_url(), '/scanning_product/%s' % company.spp_kiosk_key)


    def _action_open_spp_kiosk_mode(self):
        return {
            'type': 'ir.actions.act_url',
            'target': 'self',
            'url': f'/scanning_product_price/kiosk_mode_menu/{self.env.company.id}',
        }
