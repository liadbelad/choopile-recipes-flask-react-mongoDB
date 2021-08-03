import json
from bson.json_util import dumps
from flask import Blueprint, Response
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client.choopile

category = Blueprint('category', __name__, url_prefix='/api/categories')


@category.route('', methods=['GET'])
def getAllCategories():
    try:
        categories = dumps(db.categories.find())
        if not categories:
            raise Exception("אין קטגוריות")
        return Response(response=categories, status=200, mimetype='application/json')

    except Exception as err:
        print(err)
        return Response(
            response=json.dumps({"error": True, 'message': f"{err}"}), status=401, mimetype='application/json'
        )
