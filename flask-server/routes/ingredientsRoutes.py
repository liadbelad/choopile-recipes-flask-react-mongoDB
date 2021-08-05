import json
from bson.json_util import dumps
from flask import Blueprint, Response
from pymongo import MongoClient

client = MongoClient(
    'mongodb+srv://liadb13:n9A3wDlExLxzYqtx@cluster0.b64x1.mongodb.net/choopile?retryWrites=true&w=majority')
db = client.choopile

ingredient = Blueprint('ingredient', __name__,
                       url_prefix='/api/ingredients')


@ingredient.route('', methods=['GET'])
def getAllIngredients():
    try:
        ingredients = dumps(db.ingredients.find())
        if not ingredients:
            raise Exception("אין מרכיבים")
        return Response(response=ingredients, status=200, mimetype='application/json')

    except Exception as err:
        print(err)
        return Response(
            response=json.dumps({"error": True, 'message': f"{err}"}), status=401, mimetype='application/json'
        )
