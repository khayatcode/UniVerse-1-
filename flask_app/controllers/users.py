from flask_app import app
from flask import render_template,redirect,request,session,flash, Flask, jsonify
from flask_app.models.user import User
from flask_app.models.post import Post
from flask_app.models.comment import Comment

from flask_bcrypt import Bcrypt        
bcrypt = Bcrypt(app)



@app.route('/register', methods=['POST'])
def register():
    errors = User.validate_user(request.json)
    if errors:
        return jsonify(errors), 400
    # continue with registration process
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
    session['user_id'] = user
    return jsonify({'success': True, 'user': user}), 200

@app.route('/login', methods=['POST'])
def login():
    data = {"email": request.json['email']}
    user_in_db = User.get_by_email(data)
    print("user in db is", user_in_db)
    if not user_in_db:
        return jsonify({'success': False, 'message': 'Email not found'}), 400
    if not bcrypt.check_password_hash(user_in_db.password, request.json['password']):
        return jsonify({'success': False, 'message': 'Incorrect password'}), 400
    return jsonify({'success': True, 'user': user_in_db.to_dict()}), 200

@app.route('/logout')
def logout():
    session.clear()
    return jsonify({'message': 'User logged out'}), 200

@app.route('/get_user/<int:id>')
def get_user(id):
    data = {
        "id": id
    }
    user = User.get_one(data)
    return jsonify(user), 200

# save a friend
@app.route('/add_friend', methods=['POST'])
def add_friend():
    data = {
        "user_id": request.json['user_id'],
        "friend_id": request.json['friend_id']
    }
    friend = User.save_friend(data)
    return jsonify({'success': True}), 200

# get all friends
@app.route('/get_all_friends/<int:id>')
def get_all_friends(id):
    data = {
        "user_id": id
    }
    friends = User.get_all_friends(data)
    return jsonify([friend for friend in friends]), 200
