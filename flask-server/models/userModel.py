from mongoengine import document
from mongoengine.fields import BooleanField, EmailField, StringField


class User(document):
    firstName = StringField(Required=True)
    lastName = StringField(Required=True)
    password = StringField(Required=True)
    email = EmailField(Required=True, unique=True)
    isVerified = BooleanField(default=True)
