import json
from bson.json_util import dumps
from flask import Blueprint, request, Response
from flask_cors import cross_origin
from pymongo import MongoClient
from utills.constants import PAGES_LIMIT

client = MongoClient('mongodb://localhost:27017/')
db = client.choopile

recipe = Blueprint('recipe', __name__, url_prefix='/api/recipes')


@recipe.route('<recipeId>', methods=['POST'])
def getFullRecipeDetailsById():
    try:

        # return Response(
        #     response=json.dumps({"createdUser": f'{newUser.inserted_id}', "token": 'xxxasss'}), status=200, mimetype='application/json'
        # )
        pass
    except Exception as err:
        return Response(
            response=json.dumps({"error": True, 'message': f"{err}"}), status=401, mimetype='application/json'
        )


@recipe.route('/newest', methods=['GET'])
def getNewestRecipes():
    try:
        pageNumber = request.args.get('pageNumber', 1)
        skips = PAGES_LIMIT * (int(pageNumber) - 1)
        newestRecipes = dumps(db.recipes.find().skip(skips).limit(PAGES_LIMIT))
        print(newestRecipes)
        return Response(
            response=newestRecipes, status=200, mimetype='application/json'
        )
    except Exception as err:
        print(err)
        return Response(
            response=json.dumps({"error": True, 'message': f"{err}"}), status=404, mimetype='application/json'
        )
