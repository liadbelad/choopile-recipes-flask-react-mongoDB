import json
from bson.json_util import dumps
from flask import Blueprint, Response
from pymongo import MongoClient
from utills.functions import arrangeCategoriesData

client = MongoClient(
    'mongodb+srv://liadb13:n9A3wDlExLxzYqtx@cluster0.b64x1.mongodb.net/choopile?retryWrites=true&w=majority')
db = client.choopile

category = Blueprint('category', __name__, url_prefix='/api/categories')


@category.route('', methods=['GET'])
def getAllCategories():
    try:
        categories = dumps(db.categories.find({}, {'_id': 0}))
        print(categories)
        if not categories:
            raise Exception("אין קטגוריות")
        return Response(response=categories, status=200, mimetype='application/json')

    except Exception as err:
        print(err)
        return Response(
            response=json.dumps({"error": True, 'message': f"{err}"}), status=401, mimetype='application/json'
        )


@category.route('/users/<userId>', methods=['GET'])
def getAllCategoriesOfUserRecipes(userId):
    try:
        if not userId:
            raise Exception('משתמש לא קיים')

        userRecipesCategories = db.recipes.find(
            {}, {'_id': 0, 'categories.value': 1, 'categories.label': 1})
        if not userRecipesCategories:
            raise Exception("אין קטגוריות")

        transformedUserCategories = arrangeCategoriesData(
            userRecipesCategories)
        return Response(response=dumps(transformedUserCategories), status=200, mimetype='application/json')

    except Exception as err:
        return Response(
            response=json.dumps({"error": True, 'message': f"{err}"}), status=401, mimetype='application/json'
        )
