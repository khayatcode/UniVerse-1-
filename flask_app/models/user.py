from flask_app.config.mysqlconnection import connectToMySQL
# model the class after the user table from our database
from flask import flash
import re
from flask_app.models.base_model import BaseModel
import json

password_regex = re.compile(r'^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$')

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')

class User(BaseModel):
    DB = "UniVerse"
    
    json_fields = ['id', 'first_name', 'last_name', 'user_name', 'location', 'occupation', 'email', 'password', 'created_at', 'updated_at']
    def __init__( self , data ):
        self.id = data['id']
        self.first_name = data['first_name']
        self.last_name = data['last_name']
        self.user_name = data['user_name']
        self.location = data['location']
        self.occupation = data['occupation']
        self.email = data['email']
        self.password = data['password']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        
    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'user_name': self.user_name,
            'location': self.location,
            'occupation': self.occupation,
            'email': self.email,
            'password': self.password,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

    # Do a class method to get one user
    @classmethod
    def get_one(cls, data):
        query = "SELECT * FROM users WHERE id = %(id)s;"
        results = connectToMySQL(cls.DB).query_db(query, data)
        print("results: ", results)
        user_data = {
            'id': results[0]['id'],
            'first_name': results[0]['first_name'],
            'last_name': results[0]['last_name'],
            'user_name': results[0]['user_name'],
            'location': results[0]['location'],
            'occupation': results[0]['occupation'],
            'email': results[0]['email']
        }
        return user_data
    
    # Do a class method to get all users
    @classmethod
    def get_all(cls):
        query = "SELECT * FROM users;"
        results = connectToMySQL(cls.DB).query_db(query)
        users = []
        for user in results:
            users.append(cls(user))
        return users
    
    # get by email
    @classmethod
    def get_by_email(cls, data):
        query = "SELECT * FROM users WHERE email = %(email)s;"
        results = connectToMySQL(cls.DB).query_db(query, data)
        if len(results) < 1:
            return False
        return cls(results[0])
    
    # save user
    @classmethod
    def save(cls, data):
        query = "INSERT INTO users (first_name, last_name, user_name, location, occupation, email, password) VALUES (%(first_name)s, %(last_name)s, %(user_name)s, %(location)s, %(occupation)s, %(email)s, %(password)s);"
        results = connectToMySQL(cls.DB).query_db(query, data)
        user_data = {
            "id": results,
            "first_name": data['first_name'],
            "last_name": data['last_name'],
            "user_name": data['user_name'],
            "location": data['location'],
            "occupation": data['occupation'],
            "email": data['email']
        }
        return user_data
    
    # get all users friends
    @classmethod
    def get_all_friends(cls, data):
        query = "SELECT * FROM users LEFT JOIN friends ON users.id = friends.friend_id WHERE friends.user_id = %(user_id)s;"
        results = connectToMySQL(cls.DB).query_db(query, data)
        friends = []
        for friend in results:
            friends.append(cls(friend))
        return friends
    
    # set user as friend
    @classmethod
    def save_friend(cls, data):
        query = "INSERT INTO friends (user_id, friend_id) VALUES (%(user_id)s, %(friend_id)s);"
        results = connectToMySQL(cls.DB).query_db(query, data)
        friend_data = {
            "id": results,
            "user_id": data['user_id'],
            "friend_id": data['friend_id']
        }
        return friend_data
    
    #  unfriend user
    @classmethod
    def unfriend(cls, data):
        query = "DELETE FROM friends WHERE user_id = %(user_id)s AND friend_id = %(friend_id)s;"
        results = connectToMySQL(cls.DB).query_db(query, data)
        return results
    
    # static method to validate user registration
    @staticmethod
    def validate_user(data):
        errors = {}
        query = "SELECT * FROM users WHERE email = %(email)s;"
        # data is a dictionary that will be passed into the save method from server.py
        result = connectToMySQL('belt_exam').query_db( query, data)
        if len(data['first_name']) < 2:
            errors['first_name'] = "First name must be at least 2 characters."
        if len(data['last_name']) < 2:
            errors['last_name'] = "Last name must be at least 2 characters."
        if len(data['user_name']) < 2:
            errors['user_name'] = "Username must be at least 2 characters."
        if len(data['location']) < 2:
            errors['location'] = "Location must be at least 2 characters."
        if len(data['occupation']) < 2:
            errors['occupation'] = "Occupation must be at least 2 characters."
        if len(result) >= 1:
            errors['email_exist'] = "Email already in use."
        if not EMAIL_REGEX.match(data['email']):
            errors['email'] = "Invalid email address!"
        if not password_regex.match(data['password']):
            errors['password'] = "Password must be at least 8 characters, have one capital letter and one number."
        if data['password'] != data['confirm_password']:
            errors['confirm_password'] = "Passwords do not match!"
        print("errors are", errors)
        return errors
    