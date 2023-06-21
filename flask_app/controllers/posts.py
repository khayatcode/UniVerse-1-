from flask_app import app
from flask import render_template,redirect,request,session,flash, Flask, jsonify, url_for, send_from_directory
from flask_app.models.user import User
from flask_app.models.post import Post
from flask_app.models.comment import Comment
import datetime
import json
from werkzeug.utils import secure_filename
import os
import tempfile

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')

# @app.route('/uploads/<filename>')
# def uploaded_file(filename):
#     return send_from_directory(UPLOAD_FOLDER, filename)

# create a post
@app.route('/create_post', methods=['POST'])
def create_post():
    errors = Post.validate_post(request.form)
    if errors:
        return jsonify(errors), 400

    if 'post_pic' in request.files:
        file = request.files['post_pic']
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        post_pic_url = url_for('uploaded_file', filename=filename, _external=True)
    else:
        post_pic_url = ''
    
    data = {
        "content": request.form['content'],
        "user_id": request.form['user_id'],
        "post_pic": post_pic_url
        
    }
    # print("data is", data)
    post = Post.save(data)
    return jsonify({'success': True, 'post': post}), 201

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


