import re
import json
from bson.objectid import ObjectId
from flask import Blueprint, request, Response
from flask_cors import cross_origin
from pymongo import MongoClient
from werkzeug.security import check_password_hash, generate_password_hash

client = MongoClient('mongodb://localhost:27017/')
db = client.choopile

user = Blueprint('user', __name__, url_prefix='/api/users')


@cross_origin
@user.route('', methods=['POST'])
def register():
    try:
        firstName = request.json['firstName']
        lastName = request.json['lastName']
        email = request.json['email']
        password = request.json['password']

        userExist = db.users.find_one(
            {"email": re.compile(email, re.IGNORECASE)})
        if userExist:
            raise Exception("משתמש קיים,התחבר")

        hashedPassword = generate_password_hash(password)
        user = {"firstName": firstName, "lastName": lastName,
                "email": email, "password": hashedPassword}

        newUser = db.users.insert_one(user)

        return Response(
            response=json.dumps({"createdUser": f'{newUser.inserted_id}', "token": 'xxxasss'}), status=200, mimetype='application/json'
        )
    except Exception as err:
        return Response(
            response=json.dumps({"error": True, 'message': f"{err}"}), status=401, mimetype='application/json'
        )


@user.route('/login', methods=['POST'])
def login():
    try:
        email = request.json['email']
        password = request.json['password']

        userExist = db.users.find_one(
            {"email": re.compile(email, re.IGNORECASE)})
        if not userExist:
            raise Exception("אימייל או סיסמא אינם נכונים")

        isSamePassword = check_password_hash(userExist['password'], password)

        if not isSamePassword:
            raise Exception("אימייל או סיסמא אינם נכונים")

        res = Response(response=json.dumps({"id": f'{userExist["_id"]}', "firstName": userExist['firstName'],
                                            "lastName": userExist['lastName'], "email": userExist['email']}), status=200, mimetype='application/json')
        res.set_cookie('userId', f'{userExist["_id"]}')

        return res

    except Exception as err:
        return Response(
            response=json.dumps({"error": True, 'message': f"{err}"}), status=401, mimetype='application/json'
        )


@user.route('', methods=['PUT'])
def updateUserDetails():
    try:
        email = request.json['email']
        oldPassword = request.json['password']
        newPassword = request.json['newPassword']
        firstName = request.json['firstName']
        lastName = request.json['lastName']

        userId = request.cookies['userId']

        print(userId)
        print(firstName)

        userExist = db.users.find_one(
            {"email": re.compile(email, re.IGNORECASE)})
        if not userExist:
            raise Exception("אימייל או סיסמא אינם נכונים")

        isSamePassword = check_password_hash(
            userExist['password'], oldPassword)

        if not isSamePassword:
            raise Exception("אימייל או סיסמא אינם נכונים")

        newHashedPassword = generate_password_hash(newPassword)

        updatedUserData = {"firstName": firstName,
                           "lastName": lastName, "email": email, "password": newHashedPassword}
        updatedUser = db.users.find_one_and_update(
            {'_id': ObjectId(userId)}, {"$set": updatedUserData})

        return Response(response=json.dumps({"id": f"{updatedUser['_id']}", "firstName": updatedUser['firstName'], "lastName": updatedUser['lastName'], "email": updatedUser['email']}), status=200, mimetype='application/json')

    except Exception as err:
        return Response(
            response=json.dumps({"error": True, 'message': f"{err}"}), status=401, mimetype='application/json'
        )


@user.route('', methods=['GET'])
def getUserDetails():
    try:
        userId = request.cookies['userId']

        userExist = db.users.find_one(
            {"_id": ObjectId(userId)})
        if not userExist:
            raise Exception("משתמש לא קיים")

        return Response(response=json.dumps({"id": f"{userExist['_id']}", "firstName": userExist['firstName'], "lastName": userExist['lastName'], "email": userExist['email']}), status=200, mimetype='application/json')

    except Exception as err:
        print(err)
        return Response(
            response=json.dumps({"error": True, 'message': f"{err}"}), status=401, mimetype='application/json'
        )
