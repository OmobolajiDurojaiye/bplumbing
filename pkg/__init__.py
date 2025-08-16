# pkg/__init__.py

import os
from flask import Flask
from flask_wtf.csrf import CSRFProtect
from flask_mail import Mail

from .routes import register_blueprints 

csrf = CSRFProtect()
mail = Mail()

def create_app():
    app = Flask(__name__, instance_relative_config=True, static_folder='static', template_folder='templates')     

    try:
        app.config.from_pyfile("config.py")
    except FileNotFoundError:
        app.config.from_object('config')



    csrf.init_app(app)
    mail.init_app(app)

    register_blueprints(app)

    return app