from flask_app.config.mysqlconnection import connectToMySQL
# model the class after the user table from our database
from flask import flash
import re

password_regex = re.compile(r'^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$')

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')

class User:
    DB = "UniVerse"
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
        
    # Do a class method to get one user
    @classmethod
    def get_one(cls, data):
        query = "SELECT * FROM users WHERE id = %(id)s;"
        results = connectToMySQL(cls.DB).query_db(query, data)
        return cls(results[0])
    
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
        return connectToMySQL(cls.DB).query_db(query, data)
    
    # get all users friends
    @classmethod
    def get_all_friends(cls, data):
        query = "SELECT * FROM users JOIN friends ON users.id = friends.user_id WHERE friends.user_id = %(user_id)s;"
        results = connectToMySQL(cls.DB).query_db(query, data)
        return results

    
    # static method to validate user registration
    @staticmethod
    def validate_user(user):
        is_valid = True
        if len(user['first_name']) < 2:
            print("First name must be at least 2 characters.")
            flash("First name must be at least 2 characters.")
            is_valid = False
        if len(user['last_name']) < 2:
            print("Last name must be at least 2 characters.")
            flash("Last name must be at least 2 characters.")
            is_valid = False
        if len(user['user_name']) < 2:
            print("Username must be at least 2 characters.")
            flash("Username must be at least 2 characters.")
            is_valid = False
        if len(user['location']) < 2:
            print("Location must be at least 2 characters.")
            flash("Location must be at least 2 characters.")
            is_valid = False
        if len(user['occupation']) < 2:
            print("occupation must be at least 2 characters.")
            flash("occupation must be at least 2 characters.")
            is_valid = False
        if not EMAIL_REGEX.match(user['email']):
            print("Invalid email address!")
            flash("Invalid email address!")
            is_valid = False
        if not password_regex.match(user['password']):
            print("Password must be at least 8 characters, have one capital letter and one number.")
            flash("Password must be at least 8 characters, have one capital letter and one number.")
            is_valid = False
        if user['password'] != user['confirm_password']:
            print("Passwords do not match!")
            flash("Passwords do not match!")
            is_valid = False
        return is_valid
    