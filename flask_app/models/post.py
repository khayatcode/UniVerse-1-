from flask_app.config.mysqlconnection import connectToMySQL
# model the class after the user table from our database
from flask import flash

from flask_app.models.user import User

class Post:
    DB = "UniVerse"
    def __init__( self , data ):
        self.id = data['id']
        self.content = data['content']
        self.likes = data['likes']
        self.user_id = data['user_id']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.creator = None
        
    # save post
    @classmethod
    def save(cls, data):
        query = "INSERT INTO posts (content, likes, user_id) VALUES (%(content)s, %(likes)s, %(user_id)s);"
        return connectToMySQL(cls.DB).query_db(query, data)
    
    # UPDATE post
    @classmethod
    def update(cls, data):
        query = "UPDATE posts SET content = %(content)s, likes = %(likes)s WHERE id = %(id)s;"
        return connectToMySQL(cls.DB).query_db(query, data)
    
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
        return cls(results[0])
    
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
                "created_at": row['posts.created_at'],
                "updated_at": row['posts.updated_at'],
            }
            user_data = {
                "id": row['users.id'],
                "first_name": row['first_name'],
                "last_name": row['last_name'],
                "username": row['username'],
                "location": row['location'],
                "ocuppation": row['ocuppation'],
                "email": row['email'],
                "password": row['password'],
                "created_at": row['users.created_at'],
                "updated_at": row['users.updated_at']
            }
            one_post = cls(post_data)
            one_post.creator = User(user_data)
            all_posts.append(one_post)
        return all_posts
    
    # validate post
    @staticmethod
    def validate_post(post):
        is_valid = True
        if len(post['content']) < 1:
            flash("Content must be at least 1 character long")
            is_valid = False
        return is_valid