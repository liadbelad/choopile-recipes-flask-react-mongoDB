import json
import math
import os
from time import time
from bson.json_util import dumps
from bson.objectid import ObjectId
from flask import Blueprint, request, Response
from flask_cors import cross_origin
from pymongo import MongoClient
from pymongo.message import delete
from utills.constants import PAGES_LIMIT, UPLOAD_FOLDER
import datetime
from werkzeug.utils import secure_filename
from utills.functions import addUserDataToCommentsByUserId, isValidFileExtension, filterRecipesByGivenQueryParams

client = MongoClient(
    'mongodb+srv://liadb13:n9A3wDlExLxzYqtx@cluster0.b64x1.mongodb.net/choopile?retryWrites=true&w=majority')
db = client.choopile

recipe = Blueprint('recipe', __name__, url_prefix='/api/recipes')


@recipe.route('/<recipeId>', methods=['GET'])
def getFullRecipeDetailsById(recipeId):
    try:
        recipe = db.recipes.find_one({'_id': ObjectId(recipeId)})
        addUserDataToCommentsByUserId(recipe['comments'])
        return Response(
            response=dumps(recipe), status=200, mimetype='application/json'
        )
    except Exception as err:
        return Response(
            response=json.dumps({"error": True, 'message': f"{err}"}), status=500, mimetype='application/json'
        )


@recipe.route('/newest', methods=['GET'])
def getNewestRecipes():
    try:
        pageNumber = request.args.get('pageNumber', 1)
        skips = PAGES_LIMIT * (int(pageNumber) - 1)
        newestRecipes = dumps(db.recipes.find({}, {"_id": 1, "title": 1, "description": 1,
                                                   "mainImageUrl": 1, "views": 1, "createdAt": 1}).skip(skips).limit(PAGES_LIMIT))
        return Response(
            response=newestRecipes, status=200, mimetype='application/json'
        )
    except Exception as err:
        print(err)
        return Response(
            response=json.dumps({"error": True, 'message': f"{err}"}), status=404, mimetype='application/json'
        )


@recipe.route('/users', methods=['GET'])
def getUserRecipes():
    try:
        pageNumber = request.args.get('pageNumber')
        if not pageNumber:
            pageNumber = 1
        keyword = request.args.get('keyword')
        category = request.args.get('category')
        userId = request.cookies['userId']
        skips = PAGES_LIMIT * (int(pageNumber) - 1)
        print(userId)

        filterRecipes = filterRecipesByGivenQueryParams(
            category=category, keyword=keyword, userId=userId)
        numberOfRecipes = db.recipes.count_documents({})
        pagesCount = math.ceil(
            numberOfRecipes / PAGES_LIMIT)
        userRecipes = db.recipes.find(filterRecipes, {"_id": 1, "title": 1, "description": 1,
                                                      "mainImageUrl": 1, "views": 1, "createdAt": 1}).skip(skips).limit(PAGES_LIMIT)
        return Response(
            response=dumps({'userRecipes': userRecipes, 'pagesCount': pagesCount}), status=200, mimetype='application/json'
        )

    except Exception as err:
        print(err)
        return Response(
            response=json.dumps({"error": True, 'message': f"{err}"}), status=404, mimetype='application/json'
        )


@recipe.route('', methods=['GET'])
def getRecipes():
    try:
        pageNumber = request.args.get('pageNumber')
        if not pageNumber:
            pageNumber = 1
        keyword = request.args.get('keyword')
        category = request.args.get('category')
        skips = PAGES_LIMIT * (int(pageNumber) - 1)

        filterRecipes = filterRecipesByGivenQueryParams(
            category=category, keyword=keyword)
        numberOfRecipes = db.recipes.count_documents({})
        pagesCount = math.ceil(
            numberOfRecipes / PAGES_LIMIT)
        recipes = db.recipes.find(filterRecipes, {"_id": 1, "title": 1, "description": 1,
                                                  "mainImageUrl": 1, "views": 1, "createdAt": 1}).skip(skips).limit(PAGES_LIMIT)
        return Response(
            response=dumps({'recipes': recipes, 'pagesCount': pagesCount}), status=200, mimetype='application/json'
        )

    except Exception as err:
        return Response(
            response=json.dumps({"error": True, 'message': f"{err}"}), status=404, mimetype='application/json'
        )

# @desc    add recipe comment by user
# @route   POST /api/recipes/comments/:recipeId
# @access  Public


@cross_origin
@recipe.route('/comments/<recipeId>', methods=['PUT'])
def addRecipeComment(recipeId):
    try:
        content = request.json['comment']
        userId = request.cookies['userId']

        filterRecipesQuery = filterRecipesByGivenQueryParams(
            recipeId=recipeId)
        today = str(datetime.datetime.now())
        newComment = {'content': content, 'userId': userId, 'createdAt': today}
        addUserDataToCommentsByUserId([newComment])
        db.recipes.update_one(filterRecipesQuery,
                              {'$push': {'comments': newComment}})
        updatedComments = db.recipes.find_one(
            filterRecipesQuery, {'_id': 0, 'comments': 1})

        return Response(
            response=dumps({'msg': 'תודה, תגובתך הוספה', 'comments': updatedComments['comments']}), status=200, mimetype='application/json'
        )

    except Exception as err:
        return Response(
            response=json.dumps({"error": True, 'message': f"{err}"}), status=404, mimetype='application/json'
        )


@cross_origin
@recipe.route('/add', methods=['POST'])
def addNewRecipe():
    try:
        if 'imageFiles' not in request.files:
            raise Exception('חסר תמונה')

        file = request.files.get('imageFiles')
        if file.filename == '':
            raise Exception('חסר תמונה')

        newRecipe = dict(request.form)

        if file and isValidFileExtension(file.filename):
            filename = str(round(time()) * 1000) + \
                secure_filename(file.filename)
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            newRecipe['mainImageUrl'] = filename
            newRecipe['comments'] = []

        categoryID = int(newRecipe['category'])
        category = db.categories.find_one({'value': categoryID}, {'_id': 0})
        newRecipe['category'] = category
        newRecipe['categories'] = newRecipe.pop('category')

        insertedRecipe = db.recipes.insert_one(newRecipe)
        print(insertedRecipe)
        return Response(
            response=dumps({'msg': 'תודה, המתכון נוסף בהצלחה', 'comments': []}), status=200, mimetype='application/json'
        )

    except Exception as err:
        return Response(
            response=json.dumps({"error": True, 'message': f"{err}"}), status=404, mimetype='application/json'
        )
