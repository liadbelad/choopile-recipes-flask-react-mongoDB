from logging import Logger
import os
from flask import Flask, request, session, send_from_directory
# from jsonData import recipesData
import mongoengine
from werkzeug.utils import secure_filename
from utills.constants import UPLOAD_FOLDER, ALLOWED_EXTENSIONS
from pymongo import MongoClient
from flask_cors import CORS
from routes.userRoutes import user
from routes.categoryRoutes import category
from routes.measureUnitsRoutes import measureUnit
from routes.ingredientsRoutes import ingredient
from routes.recipeRoutes import recipe


app = Flask(__name__)
cors = CORS(app, supports_credentials=True, resources={
            r"/api/*": {"origins": "http://localhost:3000"}})
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

mongoengine.connect(host="mongodb://127.0.0.1:27017/choopile")
client = MongoClient('mongodb://localhost:27017/')
db = client.choopile
app.register_blueprint(user)
app.register_blueprint(category)
app.register_blueprint(measureUnit)
app.register_blueprint(ingredient)
app.register_blueprint(recipe)


# @app.route('/upload', methods=['POST'])
# def fileUpload():
#     target = os.path.join(app.config['UPLOAD_FOLDER'], 'images')
#     if not os.path.isdir(target):
#         os.mkdir(target)
#     Logger.info("welcome to upload`")
#     file = request.files['file']
#     filename = secure_filename(file.filename)
#     destination = "/".join([target, filename])
#     file.save(destination)
#     session['uploadFilePath'] = destination
#     response = "Whatever you wish too return"
#     return response


@app.route('/images/<filename>', methods=['GET'])
def fileUpload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


if __name__ == '__main__':
    app.run(port=5000, debug=True)
