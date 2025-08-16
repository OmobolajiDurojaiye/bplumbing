import os
from flask import Flask
from flask_wtf.csrf import CSRFProtect
from flask_migrate import Migrate
from flask_mail import Mail

from pkg.models import db 
from pkg.routes import register_blueprints

csrf = CSRFProtect()
migrate = Migrate()
mail = Mail()

def create_app():
    app = Flask(__name__, instance_relative_config=True, static_folder='static', template_folder='templates')
    
    app.config.from_pyfile("config.py")

    app.config['UPLOAD_FOLDER_VIDEO'] = os.path.join(app.root_path, 'static/uploads/video')
    app.config['UPLOAD_FOLDER_IMAGE'] = os.path.join(app.root_path, 'static/uploads/image')

    # Create upload directories if they don't exist
    os.makedirs(app.config['UPLOAD_FOLDER_VIDEO'], exist_ok=True)
    os.makedirs(app.config['UPLOAD_FOLDER_IMAGE'], exist_ok=True)

    db.init_app(app)
    csrf.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)

    register_blueprints(app)

    return app
