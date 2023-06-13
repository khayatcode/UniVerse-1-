from flask_app.config.mysqlconnection import connectToMySQL
# model the class after the user table from our database
from flask import flash

from flask_app.models.user import User
from flask_app.models.post import Post
from flask_app.models.base_model import BaseModel

class Comment(BaseModel):
    DB = "UniVerse"
    def __init__( self , data ):
        self.id = data['id']
        self.description = data['description']
        self.post_id = data['post_id']
        self.user_id = data['user_id']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.creator = None
        self.post = None
        
    # save comment
    @classmethod
    def save(cls, data):
        query = "INSERT INTO comments (description, post_id, user_id) VALUES (%(description)s, %(post_id)s, %(user_id)s);"
        return connectToMySQL(cls.DB).query_db(query, data)
    
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
        query = "SELECT * FROM comments WHERE post_id = %(post_id)s;"
        results = connectToMySQL(cls.DB).query_db(query, data)
        comments = []
        for comment in results:
            comments.append(cls(comment))
        return comments
    
    # delete comment
    @classmethod
    def delete(cls, data):
        query = "DELETE FROM comments WHERE id = %(id)s;"
        return connectToMySQL(cls.DB).query_db(query, data)
    
    # validate comment
    @staticmethod
    def validate_comment(data):
        is_valid = True
        if len(data['description']) < 1:
            flash("Comment must be at least 1 character long.", "comment")
            is_valid = False
        return is_valid