from pymongo import MongoClient
from utills.constants import ALLOWED_EXTENSIONS
from bson.objectid import ObjectId

client = MongoClient(
    'mongodb+srv://liadb13:n9A3wDlExLxzYqtx@cluster0.b64x1.mongodb.net/choopile?retryWrites=true&w=majority')
db = client.choopile


def addUserDataToCommentsByUserId(comments):
    for comment in comments:
        print(comment['userId'])
        userData = db.users.find_one(
            {'_id': ObjectId(comment['userId'])}, {"firstName": 1, "lastName": 1})
        comment['firstName'] = userData['firstName']
        comment['lastName'] = userData['lastName']


def filterRecipesByGivenQueryParams(*args, **kwargs):
    category = kwargs.get('category')
    keyword = kwargs.get('keyword')
    userId = kwargs.get('userId')
    recipeId = kwargs.get('recipeId')
    filterRecipes = {}
    if category:
        filterRecipes['categories.value'] = int(category)
    if keyword:
        filterRecipes['title'] = {'$regex': keyword, '$options': "$i"}
    if userId:
        filterRecipes['userId'] = userId
    if recipeId:
        filterRecipes['_id'] = ObjectId(recipeId)
    return filterRecipes


def arrangeCategoriesData(userRecipesCategories):
    transformedUserCategories = []
    cachedCategories = {}

    for categoryData in userRecipesCategories:
        category = categoryData['categories']
        if category['value'] not in cachedCategories:
            transformedUserCategories.append(category)
            key = category['value']
            value = category['label']
            cachedCategories[key] = value

    return transformedUserCategories


def isValidFileExtension(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
