from sqlalchemy.orm import Session
from app.modules.users.models import User

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, username: str, email: str, hashed_password: str):
        user = User(username=username, email=email, hashed_password=hashed_password)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_by_email(self, email: str):
        return self.db.query(User).filter(User.email == email).first()