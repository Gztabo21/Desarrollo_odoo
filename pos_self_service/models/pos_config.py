# -*- coding: utf-8 -*-

from odoo import models, fields, api, _
from odoo.exceptions import UserError                               
from odoo.http import request


class PosConfig(models.Model):
    _inherit = 'pos.config'

    is_self_service = fields.Boolean(string="POS Auto Service", default=False,
        help="If checked, this POS will be used as Auto Service POS where customers can create sale order by themselves from public page.")     
    
    def _action_to_open_ui(self):
        if not self.is_self_service :
            super(PosConfig, self)._action_to_open_ui()
        else:
            if not self.current_session_id:
                self.env['pos.session'].create({'user_id': self.env.uid, 'config_id': self.id})
            pos_url = '/pos_self_service?config_id=%s' % self.id
            debug = request and request.session.debug
            if debug:
                pos_url += '&debug=%s' % debug
            return{
                'type': 'ir.actions.act_url',
                'url': pos_url,
                'target': 'self',
            }