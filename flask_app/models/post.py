from flask_app.config.mysqlconnection import connectToMySQL
# model the class after the user table from our database
from flask import flash
import datetime
import json

from flask_app.models.user import User
from flask_app.models.base_model import BaseModel

class Post(BaseModel):
    
    DB = "UniVerse"

    json_fields = ['id', 'content', 'user_id', 'created_at', 'updated_at', 'creator', 'likes', 'post_pic']
    def __init__( self , data ):
        self.id = data['id']
        self.content = data['content']
        self.post_pic = data['post_pic']
        self.user_id = data['user_id']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.creator = None
        self.comments = None
        self.likes = 0
        
    
    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "post_pic": self.post_pic,
            "user_id": self.user_id,
            "creator": self.creator,
            "likes": self.likes,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
    # save post
    @classmethod
    def save(cls, data):
        query = "INSERT INTO posts (content, user_id, post_pic, created_at, updated_at) VALUES (%(content)s, %(user_id)s, %(post_pic)s, NOW(), NOW());"
        result = connectToMySQL(cls.DB).query_db(query, data)
        print("result: ", result)
        post_data = {
            "id": result,
            "content": data['content'],
            "post_pic": data['post_pic'],
            "user_id": data['user_id']
        }
        # print("post_data: ", post_data)
        return post_data
    
    # UPDATE post
    @classmethod
    def update(cls, data):
        query = "UPDATE posts SET content = %(content)s WHERE id = %(id)s;"
        result = connectToMySQL(cls.DB).query_db(query, data)
        # print("post_data: ", post_data)
        return result
    
    # create a like
    @classmethod
    def create_like(cls, data):
        query = "INSERT INTO likes (user_id, post_id, created_at, updated_at) VALUES (%(user_id)s, %(post_id)s, NOW(), NOW());"
        result = connectToMySQL(cls.DB).query_db(query, data)
        print("result: ", result)
        like_data = {
            "id": result,
            "user_id": data['user_id'],
            "post_id": data['post_id']
        }
        return like_data
    
    # dislike a post
    @classmethod
    def delete_like(cls, data):
        query_1 = "SELECT * FROM likes WHERE user_id = %(user_id)s AND post_id = %(post_id)s;"
        result = connectToMySQL(cls.DB).query_db(query_1, data)
        print("result: ", result[0]['id'])
        like_data = {
            "id": result[0]['id'],
            "user_id": data['user_id'],
            "post_id": data['post_id']
        }
        query_2 = "DELETE FROM likes WHERE user_id = %(user_id)s AND post_id = %(post_id)s;"
        connectToMySQL(cls.DB).query_db(query_2, data)
        return like_data
    
    # get all posts
    @classmethod
    def get_all(cls):
        query = """
                SELECT posts.*, COUNT(likes.id) as likes
                FROM posts 
                LEFT JOIN likes ON posts.id = likes.post_id
                GROUP BY posts.id;
                """
        results = connectToMySQL(cls.DB).query_db(query)
        posts = []
        for post in results:
            posts.append(cls(post))
        return posts
    
    # get all posts by user
    def get_all_by_user(cls, data):
        query = """
        SELECT posts.*, COUNT(likes.id) as likes
        FROM posts 
        LEFT JOIN likes ON posts.id = likes.post_id
        WHERE posts.user_id = %(user_id)s
        GROUP BY posts.id;
        """
        results = connectToMySQL(cls.DB).query_db(query, data)
        print("post results: ", results)
        posts = []
        for post in results:
            one_post = cls(post)
            one_post.likes = post['likes'] # set likes attribute to number of likes
            posts.append(one_post)
        print("all posts: ", posts)
        return posts
    
    # get one post
    def get_one(cls, data):
        query = """
            SELECT posts.*, COUNT(likes.id) as likes
            FROM posts 
            LEFT JOIN likes ON posts.id = likes.post_id
            WHERE posts.id = %(id)s;
        """
        results = connectToMySQL(cls.DB).query_db(query, data)
        print("results: ", results)
        post_data = {
            "id": results[0]['id'],
            "content": results[0]['content'],
            "post_pic": results[0]['post_pic'],
            "user_id": results[0]['user_id'],
            "likes": results[0]['likes']
        }
        # print("post_data: ", post_data)
        return post_data
    
    # delete post
    @classmethod
    def delete(cls, data):
        # delete comments first
        query = "DELETE FROM comments WHERE post_id = %(id)s;"
        connectToMySQL(cls.DB).query_db(query, data)
        # delete likes
        query = "DELETE FROM likes WHERE post_id = %(id)s;"
        connectToMySQL(cls.DB).query_db(query, data)
        # delete post
        query = "DELETE FROM posts WHERE id = %(id)s;"
        result = connectToMySQL(cls.DB).query_db(query, data)
        print("delete post result: ", result)
        return result
    
    # get all posts with creator
    @classmethod
    def get_all_posts_with_creator(cls):
        query = """
        SELECT posts.*, users.*, COUNT(likes.id) as likes
        FROM posts 
        LEFT JOIN users ON posts.user_id = users.id
        LEFT JOIN likes ON posts.id = likes.post_id
        GROUP BY posts.id;
        """
        results = connectToMySQL(cls.DB).query_db(query)
        print(results)
        all_posts = []
        for row in results:
            post_data = {
                "id": row['id'],
                "content": row['content'],
                "post_pic": row['post_pic'],
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
                "profile_pic": row['profile_pic'],
                "created_at": row['users.created_at'],
                "updated_at": row['users.updated_at']
            }
            one_post = cls(post_data)
            one_post.creator = User(user_data).to_json()
            one_post.likes = row['likes']
            all_posts.append(one_post)
        for post in all_posts:
            print(post.to_json())
        return all_posts
    
    # validate post
    @staticmethod
    def validate_post(data):
        errors = {}
        if len(data['content']) < 1:
            errors['content'] = "Content must be at least 1 character."
        if len(data['content']) > 255:
            errors['content'] = "Content must be less than 255 characters."
        
        return errors