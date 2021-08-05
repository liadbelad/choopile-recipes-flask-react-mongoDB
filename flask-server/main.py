from flask import Flask, send_from_directory
from jsonData import categoriesData, measureUnitsData, ingredientsData, singleRecipeData
import mongoengine
from werkzeug.utils import secure_filename
from utills.constants import UPLOAD_FOLDER
from pymongo import MongoClient
from flask_cors import CORS
from routes.userRoutes import user
from routes.categoryRoutes import category
from routes.measureUnitsRoutes import measureUnit
from routes.ingredientsRoutes import ingredient
from routes.recipeRoutes import recipe


app = Flask(__name__)
CORS(app, supports_credentials=True, resources={
    r"/api/*": {"origins": "http://localhost:3000"}})
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

mongoengine.connect(
    host="mongodb+srv://liadb13:n9A3wDlExLxzYqtx@cluster0.b64x1.mongodb.net/choopile?retryWrites=true&w=majority")
client = MongoClient(
    'mongodb+srv://liadb13:n9A3wDlExLxzYqtx@cluster0.b64x1.mongodb.net/choopile?retryWrites=true&w=majority')
db = client.choopile
app.register_blueprint(user)
app.register_blueprint(category)
app.register_blueprint(measureUnit)
app.register_blueprint(ingredient)
app.register_blueprint(recipe)


@app.route('/images/<filename>', methods=['GET'])
def sendImageToClient(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


if __name__ == '__main__':
    app.run(port=5000, debug=True)
