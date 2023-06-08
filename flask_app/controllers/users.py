from flask_app import app
from flask import render_template,redirect,request,session,flash, Flask, jsonify
from flask_app.models.user import User
from flask_app.models.post import Post
from flask_app.models.comment import Comment

from flask_bcrypt import Bcrypt        
bcrypt = Bcrypt(app)


@app.route('/register', methods=['POST'])
def register():
    if not User.validate_user(request.json):
        return jsonify({'message': 'Invalid registration data'}), 400
    pw_hash = bcrypt.generate_password_hash(request.json['password'])
    data = {
        "first_name": request.json['first_name'],
        "last_name": request.json['last_name'],
        "user_name": request.json['user_name'],
        "location": request.json['location'],
        "occupation": request.json['occupation'],
        "email": request.json['email'],
        "password" : pw_hash
    }
    print("data is", data)
    user = User.save(data)
    return jsonify(user), 200

@app.route('/login', methods=['POST'])
def login():
    data = {"email": request.json['email']}
    user_in_db = User.get_by_email(data)
    if not user_in_db:
        return jsonify({'message': 'Email not found'}), 400
    if not bcrypt.check_password_hash(user_in_db.password, request.json['password']):
        return jsonify({'message': 'Incorrect password'}), 400
    session['user_id'] = user_in_db.id
    return jsonify(user_in_db.to_json()), 200

@app.route('/logout')
def logout():
    session.clear()
    return jsonify({'message': 'User logged out'}), 200
