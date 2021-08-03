from enum import unique
from typing_extensions import Required
from mongoengine import document
from mongoengine.fields import StringField


class Ingredient(document):
    label = StringField(Required=True, unique=True)
