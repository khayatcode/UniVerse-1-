from flask_app import app
from flask import render_template,redirect,request,session,flash, Flask, jsonify
from flask_app.models.user import User
from flask_app.models.post import Post
from flask_app.models.comment import Comment
import datetime
import json


# get all posts
@app.route('/get_all_posts')
def get_all_posts():
    posts = Post.get_all()
    return jsonify([post.to_json() for post in posts]), 200

# get all posts by user
@app.route('/get_all_posts_by_user/<int:user_id>')
def get_all_posts_by_user(user_id):
    data = {
        "user_id": user_id
    }
    posts = Post.get_all_by_user(cls=Post, data=data)
    return jsonify([post.to_json() for post in posts]), 200

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
        "user_id": request.json['user_id']
    }
    # print("data is", data)
    post = Post.save(data)
    return jsonify({'success': True, 'post': post}), 201

# update a post
@app.route('/update_post/<int:post_id>', methods=['POST'])
def update_post(post_id):
    errors = Post.validate_post(request.json)
    if errors:
        return jsonify(errors), 400
    data = {
        "id": post_id,
        "content": request.json['content']
    }
    post = Post.update(data)
    return jsonify({'success': True, 'post': post}), 200

# delete a post
@app.route('/delete_post/<int:id>', methods=['DELETE'])
def delete_post(id):
    data = {
        "id": id
    }
    post = Post.delete(data)
    return jsonify({'success': True, 'message': 'Succesfully deleted post'}), 204

# create a like
@app.route('/create_like/<int:user_id>/<int:post_id>', methods=['POST'])
def create_like(user_id, post_id):
    data = {
        "user_id": user_id,
        "post_id": post_id
    }
    like = Post.create_like(data)
    return jsonify({'success': True, 'like': like}), 201

# Delete a like
@app.route('/delete_like/<int:user_id>/<int:post_id>', methods=['DELETE'])
def delete_like(user_id, post_id):
    data = {
        "user_id": user_id,
        "post_id": post_id
    }
    like = Post.delete_like(data)
    print("like is", like)
    return jsonify({'success': True, 'like': like}), 200


