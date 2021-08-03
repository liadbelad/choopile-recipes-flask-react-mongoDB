from mongoengine import document
from mongoengine.fields import StringField


class MeasureUnit(document):
    name = StringField(Required=True, unique=True)
