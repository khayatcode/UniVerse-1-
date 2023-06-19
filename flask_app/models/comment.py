from flask_app.config.mysqlconnection import connectToMySQL
# model the class after the user table from our database
from flask import flash

from flask_app.models.user import User
from flask_app.models.post import Post
from flask_app.models.base_model import BaseModel

class Comment(BaseModel):
    
    json_fields = ['id', 'description', 'post_id', 'user_id', 'created_at', 'updated_at', 'creator']
    DB = "UniVerse"
    def __init__( self , data ):
        self.id = data['id']
        self.description = data['description']
        self.post_id = data['post_id']
        self.user_id = data['user_id']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.creator = None
        
    # save comment
    @classmethod
    def save(cls, data):
        query = "INSERT INTO comments (description, post_id, user_id) VALUES (%(description)s, %(post_id)s, %(user_id)s);"
        result = connectToMySQL(cls.DB).query_db(query, data)
        print("comment result: ", result)
        comment_data = {
            "id": result,
            "description": data['description'],
            "post_id": data['post_id'],
            "user_id": data['user_id']
        }
        return comment_data
    
    # update comment
    @classmethod
    def update(cls, data):
        query = "UPDATE comments SET description = %(description)s WHERE id = %(id)s;"
        return connectToMySQL(cls.DB).query_db(query, data)
    
    # get one comment
    @classmethod
    def get_one(cls, data):
        query = "SELECT * FROM comments WHERE id = %(id)s;"
        results = connectToMySQL(cls.DB).query_db(query, data)
        if len(results) < 1:
            return False
        return cls(results[0])
    
    # get all comments for a post
    @classmethod
    def get_all_comments_for_post(cls, data):
        query = """
            SELECT * FROM comments 
            LEFT JOIN users ON comments.user_id = users.id
            WHERE post_id = %(post_id)s;
            """
        results = connectToMySQL(cls.DB).query_db(query, data)
        all_comments = []
        for comment in results:
            comment_data = {
                "id": comment['id'],
                "description": comment['description'],
                "post_id": comment['post_id'],
                "user_id": comment['user_id'],
                "created_at": comment['created_at'],
                "updated_at": comment['updated_at']
            }
            user_data = {
                "id": comment['users.id'],
                "first_name": comment['first_name'],
                "last_name": comment['last_name'],
                "user_name": comment['user_name'],
                "location": comment['location'],
                "occupation": comment['occupation'],
                "email": comment['email'],
                "profile_pic": comment['profile_pic'],
                "password": comment['password'],
                "created_at": comment['users.created_at'],
                "updated_at": comment['users.updated_at']
            }
            one_comment = cls(comment_data)
            one_comment.creator = User(user_data).to_json()
            all_comments.append(one_comment)
        return all_comments
    
    # delete comment
    @classmethod
    def delete(cls, data):
        query = "DELETE FROM comments WHERE id = %(id)s;"
        return connectToMySQL(cls.DB).query_db(query, data)
    
    # validate comment
    @staticmethod
    def validate_comment(data):
        errors = {}
        if len(data['description']) < 1:
            errors['description'] = "Description must be at least 1 character."
        return errors