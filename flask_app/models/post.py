from flask_app.config.mysqlconnection import connectToMySQL
# model the class after the user table from our database
from flask import flash
import datetime
import json

from flask_app.models.user import User
from flask_app.models.base_model import BaseModel

class Post(BaseModel):
    
    DB = "UniVerse"

    json_fields = ['id', 'content', 'likes', 'user_id', 'created_at', 'updated_at', 'creator']
    def __init__( self , data ):
        self.id = data['id']
        self.content = data['content']
        self.likes = data['likes']
        self.user_id = data['user_id']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.creator = None
    
    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "likes": self.likes,
            "user_id": self.user_id,
            "creator": self.creator,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
    # save post
    @classmethod
    def save(cls, data):
        query = "INSERT INTO posts (content, likes, user_id, created_at, updated_at) VALUES (%(content)s, %(likes)s, %(user_id)s, NOW(), NOW());"
        result = connectToMySQL(cls.DB).query_db(query, data)
        print("result: ", result)
        post_data = {
            "id": result,
            "content": data['content'],
            "likes": data['likes'],
            "user_id": data['user_id'],
        }
        # print("post_data: ", post_data)
        return post_data
    
    # UPDATE post
    @classmethod
    def update(cls, data):
        query = "UPDATE posts SET content = %(content)s, likes = %(likes)s WHERE id = %(id)s;"
        result = connectToMySQL(cls.DB).query_db(query, data)
        print("result: ", result)
        post_data = {
            "id": data['id'],
            "content": data['content'],
            "likes": data['likes'],
            "user_id": data['user_id']
        }
        # print("post_data: ", post_data)
        return post_data
    
    # update likes
    def update_likes(self):
        data = {
            "id": self.id,
            "likes": self.likes
        }
        query = "UPDATE posts SET likes = %(likes)s WHERE id = %(id)s;"
        return connectToMySQL(self.DB).query_db(query, data)
    
    # get all posts
    @classmethod
    def get_all(cls):
        query = "SELECT * FROM posts;"
        results = connectToMySQL(cls.DB).query_db(query)
        posts = []
        for post in results:
            posts.append(cls(post))
        return posts
    
    # get all posts by user
    def get_all_by_user(cls, data):
        query = "SELECT * FROM posts WHERE user_id = %(user_id)s;"
        results = connectToMySQL(cls.DB).query_db(query, data)
        posts = []
        for post in results:
            posts.append(cls(post))
        return posts
    
    # get one post
    def get_one(cls, data):
        query = "SELECT * FROM posts WHERE id = %(id)s;"
        results = connectToMySQL(cls.DB).query_db(query, data)
        print("results: ", results)
        post_data = {
            "id": results[0]['id'],
            "content": results[0]['content'],
            "likes": results[0]['likes'],
            "user_id": results[0]['user_id']
        }
        # print("post_data: ", post_data)
        return post_data
    
    # delete post
    @classmethod
    def delete(cls, data):
        query = "DELETE FROM posts WHERE id = %(id)s;"
        return connectToMySQL(cls.DB).query_db(query, data)
    
    # get all posts with creator
    @classmethod
    def get_all_posts_with_creator(cls):
        query = "SELECT * FROM posts LEFT JOIN users ON posts.user_id = users.id;"
        results = connectToMySQL(cls.DB).query_db(query)
        print(results)
        all_posts = []
        for row in results:
            post_data = {
                "id": row['id'],
                "content": row['content'],
                "likes": row['likes'],
                "user_id": row['user_id'],
                "created_at": row['created_at'],
                "updated_at": row['updated_at']
            }
            user_data = {
                "id": row['users.id'],
                "first_name": row['first_name'],
                "last_name": row['last_name'],
                "user_name": row['user_name'],
                "location": row['location'],
                "occupation": row['occupation'],
                "email": row['email'],
                "password": row['password'],
                "created_at": row['users.created_at'],
                "updated_at": row['users.updated_at']
            }
            one_post = cls(post_data)
            one_post.creator = User(user_data).to_json()
            all_posts.append(one_post)
        return all_posts
    
    # validate post
    @staticmethod
    def validate_post(data):
        errors = {}
        if len(data['content']) < 1:
            errors['content'] = "Content must be at least 1 character."
        return errors