from site import db
from sqlalchemy.dialects.postgresql import JSON


class Result(db.Model):
    __tablename__ = 'results'

    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String())
    posting_date = db.Column(db.String())
    filename = db.Column(db.String())

    def __init__(self, url, posting_date, filename):
        self.url = url
        self.posting_date = posting_date
        self.filename = filename

    def __repr__(self):
        return '<id {}>'.format(self.id)