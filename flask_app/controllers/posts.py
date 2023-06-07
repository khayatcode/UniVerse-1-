from flask_app import app
from flask import render_template,redirect,request,session,flash, Flask, jsonify
from flask_app.models.user import User
from flask_app.models.post import Post
from flask_app.models.comment import Comment

from flask_cors import CORS
CORS(app, support_credentials=True)

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
    return jsonify([post.to_json() for post in posts]), 200

# get one post
@app.route('/get_one_post/<int:id>')
def get_one_post(id):
    data = {
        "id": id
    }
    post = Post.get_one(data)
    return jsonify(post.to_json()), 200

# create a post
@app.route('/create_post', methods=['POST'])
def create_post():
    if not Post.validate_post(request.form):
        return jsonify({'message': 'Invalid post data'}), 400
    data = {
        "content": request.form['content'],
        "likes": request.form['likes'],
        "user_id": session['user_id']
    }
    post = Post.save(data)
    return jsonify(post.to_json()), 200

# update a post
@app.route('/update_post', methods=['PUT'])
def update_post():
    if not Post.validate_post(request.form):
        return jsonify({'message': 'Invalid post data'}), 400
    data = {
        "id": request.form['id'],
        "content": request.form['content'],
        "likes": request.form['likes']
    }
    post = Post.update(data)
    return jsonify(post.to_json()), 200

# delete a post
@app.route('/delete_post', methods=['DELETE'])
def delete_post():
    data = {
        "id": request.form['id']
    }
    post = Post.delete(data)
    return jsonify(post.to_json()), 200


