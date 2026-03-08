from database.db_connection import db

class MarketPrice(db.Model):
    __tablename__ = 'market_prices'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.Date, nullable=False)
    crop_name = db.Column(db.String(100), nullable=False)
    market = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    rainfall = db.Column(db.Float, nullable=True)
    temperature = db.Column(db.Float, nullable=True)
    season = db.Column(db.String(50), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date.isoformat(),
            "crop_name": self.crop_name,
            "market": self.market,
            "price": self.price,
            "rainfall": self.rainfall,
            "temperature": self.temperature,
            "season": self.season
        }

class Prediction(db.Model):
    __tablename__ = 'predictions'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    crop_name = db.Column(db.String(100), nullable=False)
    market = db.Column(db.String(100), nullable=False)
    predicted_date = db.Column(db.Date, nullable=False)
    predicted_price = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "crop_name": self.crop_name,
            "market": self.market,
            "predicted_date": self.predicted_date.isoformat(),
            "predicted_price": self.predicted_price
        }
