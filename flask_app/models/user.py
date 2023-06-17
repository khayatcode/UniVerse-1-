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
        return results

    # update user
    @classmethod
    def update(cls, data):
        query = "UPDATE users SET first_name = %(first_name)s, last_name = %(last_name)s, user_name = %(user_name)s, location = %(location)s, occupation = %(occupation)s WHERE id = %(id)s;"
        results = connectToMySQL(cls.DB).query_db(query, data)
        return results
    
    
    # get all users follows
    @classmethod
    def get_all_follows(cls, data):
        query = "SELECT * FROM users LEFT JOIN follows ON users.id = follows.follow_id WHERE follows.user_id = %(user_id)s;"
        results = connectToMySQL(cls.DB).query_db(query, data)
        follows = []
        for follow in results:
            follows.append(cls(follow))
        return follows
    
    # get all followers
    @classmethod
    def get_all_followers(cls, data):
        query = "SELECT * FROM users LEFT JOIN follows ON users.id = follows.user_id WHERE follows.follow_id = %(user_id)s;"
        results = connectToMySQL(cls.DB).query_db(query, data)
        followers = []
        for follower in results:
            followers.append(cls(follower))
        return followers
    
    # set user as follow
    @classmethod
    def save_follow(cls, data):
        query = "INSERT INTO follows (user_id, follow_id) VALUES (%(user_id)s, %(follow_id)s);"
        results = connectToMySQL(cls.DB).query_db(query, data)
        follow_data = {
            "id": results,
            "user_id": data['user_id'],
            "follow_id": data['follow_id']
        }
        return follow_data
    
    #  unfollow user
    @classmethod
    def unfollow(cls, data):
        query = "DELETE FROM follows WHERE user_id = %(user_id)s AND follow_id = %(follow_id)s;"
        results = connectToMySQL(cls.DB).query_db(query, data)
        return results
    
    # Get all users likes for a post
    @classmethod
    def get_all_users_like_post(cls, data):
        query = "SELECT * FROM likes WHERE user_id = %(user_id)s;"
        results = connectToMySQL(cls.DB).query_db(query, data)
        user_likes = []
        for row in results:
            user_like = {
                "id": row['id'],
                "user_id": row['user_id'],
                "post_id": row['post_id']
            }
            user_likes.append(user_like)
            
        return user_likes
    
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
    
    # Validate Edit
    @staticmethod
    def validate_edit(data):
        errors = {}
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
        return errors
    