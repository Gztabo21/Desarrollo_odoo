from odoo import api, fields, models


class PosCashWithdrawal(models.Model):
    _name = 'pos.cash.withdrawal'
    _description = 'POS Cash Move'
    _order = 'date desc'

    user_id = fields.Many2one('res.users', string='User', required=True, default=lambda self: self.env.user)
    session_id = fields.Many2one('pos.session', string='Session', required=True)
    type = fields.Selection([('in', 'Cash In'), ('out', 'Cash Out')], string='Type', required=True)
    amount = fields.Float(string='Amount', required=True)
    date = fields.Datetime(string='Date', required=True, default=fields.Datetime.now)
    reason = fields.Text(string='Reason')
    company_id = fields.Many2one('res.company', related='session_id.company_id', string='Company', store=True)


class PosSession(models.Model):
    _inherit = 'pos.session'

    cash_withdrawal_ids = fields.One2many('pos.cash.withdrawal', 'session_id', string='Cash Moves')
