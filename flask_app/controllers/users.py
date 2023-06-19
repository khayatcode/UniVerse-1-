from flask_app import app
from flask import render_template,redirect,request,session,flash, Flask, jsonify, url_for, send_from_directory
from flask_app.models.user import User
from flask_app.models.post import Post
from flask_app.models.comment import Comment
import boto3
from botocore.exceptions import NoCredentialsError
from io import BytesIO
import uuid
from werkzeug.utils import secure_filename
import os
import tempfile

from flask_bcrypt import Bcrypt        
bcrypt = Bcrypt(app)

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/register', methods=['POST'])
def register():
    errors = User.validate_user(request.form)
    if errors:
        return jsonify(errors), 400

    # continue with registration process
    pw_hash = bcrypt.generate_password_hash(request.form['password'])
    
    
    file = request.files['profile_pic']
    filename = secure_filename(file.filename)
    file.save(os.path.join(UPLOAD_FOLDER, filename))
    profile_pic_url = url_for('uploaded_file', filename=filename, _external=True)
    print("profile pic url is", profile_pic_url)
    data = {
        "first_name": request.form['first_name'],
        "last_name": request.form['last_name'],
        "user_name": request.form['user_name'],
        "location": request.form['location'],
        "occupation": request.form['occupation'],
        "email": request.form['email'],
        "password" : pw_hash,
        "profile_pic": profile_pic_url
    }
    print("data is", data)
    user = User.save(data)
    return jsonify({'success': True, 'user_id': user}), 200

@app.route('/login', methods=['POST'])
def login():
    data = {"email": request.json['email']}
    user_in_db = User.get_by_email(data)
    # print("user in db is", user_in_db)
    if not user_in_db:
        return jsonify({'success': False, 'message': 'Email not found'}), 400
    if not bcrypt.check_password_hash(user_in_db.password, request.json['password']):
        return jsonify({'success': False, 'message': 'Incorrect password'}), 400
    return jsonify({'success': True, 'user': user_in_db.to_dict()}), 200

@app.route('/update_user/<int:user_id>', methods=['POST'])
def update_user(user_id):
    errors = User.validate_edit(request.json)
    if errors:
        return jsonify(errors), 400
    data = {
        "id": user_id,
        "first_name": request.json['first_name'],
        "last_name": request.json['last_name'],
        "user_name": request.json['user_name'],
        "location": request.json['location'],
        "occupation": request.json['occupation']
    }
    user = User.update(data)
    return jsonify({'success': True, 'user': user}), 200



@app.route('/get_user/<int:id>')
def get_user(id):
    data = {
        "id": id
    }
    user = User.get_one(data)
    return jsonify(user), 200

# follow a user
@app.route('/follow_user', methods=['POST'])
def follow_user():
    data = {
        "user_id": request.json['user_id'],
        "follow_id": request.json['follow_id']
    }
    user_save_follow = User.save_follow(data)
    # print("follow Id is", request.json['follow_id'])
    follow = User.get_one({"id": request.json['follow_id']})
    return jsonify({'success': True, 'follow': follow}), 200

# unfollow a user
@app.route('/unfollow', methods=['POST'])
def unfollow():
    data = {
        "user_id": request.json['user_id'],
        "follow_id": request.json['follow_id']
    }
    user_remove_follow = User.unfollow(data)
    follow = User.get_one({"id": request.json['follow_id']})
    print("unfollowed")
    return jsonify({'success': True, 'follow': follow}), 200

# get all follows
@app.route('/get_all_follows/<int:id>')
def get_all_follows(id):
    data = {
        "user_id": id
    }
    follows = User.get_all_follows(data)
    # for follow in follows:
    #     print("follow is", follow.to_json())
    return jsonify([follow.to_json() for follow in follows]), 200

# get all followers
@app.route('/get_all_followers/<int:user_id>')
def get_all_followers(user_id):
    data = {
        "user_id": user_id
    }
    followers = User.get_all_followers(data)
    # for follower in followers:
    #     print("follower is", follower.to_json())
    return jsonify([follower.to_json() for follower in followers]), 200

# get all users like a post
@app.route('/get_all_users_like_post/<int:user_id>')
def get_all_users_like_post(user_id):
    data = {
        "user_id": user_id
    }
    users = User.get_all_users_like_post(data)
    return jsonify([user for user in users]), 200
