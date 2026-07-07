from odoo import _, models
from odoo.exceptions import UserError


class PosSession(models.Model):
    _inherit = 'pos.session'

    def _load_pos_data(self, data):
        data = super()._load_pos_data(data)
        data['data'][0]['_has_cash_withdrawal_perm'] = self.env.user.has_group(
            'pos_cash_control_permissions.group_pos_cash_withdrawal'
        )
        return data

    def try_cash_in_out(self, _type, amount, reason, extras):
        if _type == 'out':
            has_perm = self.env.user.has_group(
                'pos_cash_control_permissions.group_pos_cash_withdrawal'
            )
            if not has_perm:
                raise UserError(
                    _("You do not have permission to withdraw cash from the POS. "
                      "Please contact your administrator.")
                )
        res = super().try_cash_in_out(_type, amount, reason, extras)
        self.env['pos.cash.withdrawal'].create({
            'user_id': self.env.user.id,
            'session_id': self.id,
            'type': _type,
            'amount': amount,
            'reason': reason or extras.get('translatedType', ''),
        })
        return res
