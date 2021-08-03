from typing_extensions import Required
from mongoengine import document
from mongoengine.fields import BooleanField, DateTimeField, DictField, IntField, ListField, ReferenceField, StringField
from userModel import User
import datetime


class Comment(document):
    content = StringField(Required=True)
    createdAt = DateTimeField(default=datetime.datetime.utcnow)
    userId = ReferenceField(User, dbref=True)


class Recipe(document):
    userId = ReferenceField(User, dbref=True)
    title = StringField(Required=True)
    description = StringField(Required=True)
    views = IntField(Required=True, default=0)
    prepTimeMins = IntField(Required=True)
    createdAt = DateTimeField(Required=True, default=datetime.datetime.utcnow)
    mainImageUrl = StringField(Required=True)
    isPrivate = BooleanField(Required=True, default=False)
    instructions = ListField(Required=True)
    comments = ListField(ReferenceField(Comment))
    ingredientsByTitle = ListField(DictField())
    categories = ListField()
