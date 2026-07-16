import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'growledger-secret-key-change-me')
    DEBUG = True
