from flask_app import app
from flask import render_template,redirect,request,session,flash, Flask, jsonify
from flask_app.models.user import User
from flask_app.models.post import Post
from flask_app.models.comment import Comment
import datetime
import json



# @app.route('/members')
# def members():
#     return {"members": "Adam"}

# dashboard to get logged in user
@app.route('/dashboard')


# get all posts
@app.route('/get_all_posts')
def get_all_posts():
    posts = Post.get_all()
    return jsonify([post.to_json() for post in posts]), 200

# get all posts by user
@app.route('/get_all_posts_by_user/<int:id>')
def get_all_posts_by_user(id):
    data = {
        "id": id
    }
    posts = Post.get_all_by_user(data)
    return jsonify([post for post in posts]), 200

# get one post
@app.route('/get_one_post/<int:id>')
def get_one_post(id):
    data = {
        "id": id
    }
    post = Post.get_one(cls=Post, data=data)
    return jsonify(post), 200

# get all post with creator
@app.route('/get_all_posts_with_creator')
def get_all_posts_with_creator():
    posts = Post.get_all_posts_with_creator()
    
    return jsonify([post.to_json() for post in posts]), 200

# create a post
@app.route('/create_post', methods=['POST'])
def create_post():
    errors = Post.validate_post(request.json)
    if errors:
        return jsonify(errors), 400
    data = {
        "content": request.json['content'],
        "likes": request.json['likes'],
        "user_id": request.json['user_id']
    }
    print("data is", data)
    post = Post.save(data)
    return jsonify({'success': True, 'post': post}), 201

# update a post
@app.route('/update_post', methods=['PUT'])
def update_post():
    if not Post.validate_post(request.json):
        return jsonify({'message': 'Invalid post data'}), 400
    data = {
        "id": request.json['id'],
        "content": request.json['content'],
        "likes": request.json['likes'],
        "user_id": request.json['user_id']
    }
    post = Post.update(data)
    return jsonify(post), 200

# delete a post
@app.route('/delete_post/<int:id>', methods=['DELETE'])
def delete_post(id):
    data = {
        "id": id
    }
    post = Post.delete(data)
    return jsonify({'success': True, 'message': 'Succesfully deleted post'}), 204


