import json
from bson.json_util import dumps
from flask import Blueprint, Response
from pymongo import MongoClient

client = MongoClient(
    'mongodb+srv://liadb13:n9A3wDlExLxzYqtx@cluster0.b64x1.mongodb.net/choopile?retryWrites=true&w=majority')
db = client.choopile

measureUnit = Blueprint('measureUnit', __name__,
                        url_prefix='/api/measure_units')


@measureUnit.route('', methods=['GET'])
def getAllMeasureUnits():
    try:
        measureUnits = dumps(db.measureUnits.find())
        if not measureUnits:
            raise Exception("אין יחידות מידה")
        return Response(response=measureUnits, status=200, mimetype='application/json')

    except Exception as err:
        print(err)
        return Response(
            response=json.dumps({"error": True, 'message': f"{err}"}), status=401, mimetype='application/json'
        )
