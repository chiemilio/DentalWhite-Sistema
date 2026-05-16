from app.models.user import User
print("User table columns:", list(User.__table__.columns.keys()))