from mongoengine import document
from mongoengine.fields import StringField


class Category(document):
    label = StringField(Required=True, unique=True)
