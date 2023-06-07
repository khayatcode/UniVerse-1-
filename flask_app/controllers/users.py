from flask_app import app
from flask import render_template,redirect,request,session,flash, Flask, jsonify
from flask_app.models.user import User
from flask_app.models.post import Post
from flask_app.models.comment import Comment

from flask_bcrypt import Bcrypt        
bcrypt = Bcrypt(app)

from flask_cors import CORS
CORS(app, support_credentials=True)

@app.route('/register', methods=['POST'])
def register():
    if not User.validate_register(request.form):
        return jsonify({'message': 'Invalid registration data'}), 400
    pw_hash = bcrypt.generate_password_hash(request.form['password'])
    data = {
        "first_name": request.form['first_name'],
        "last_name": request.form['last_name'],
        "username": request.form['username'],
        "location": request.form['location'],
        "occupation": request.form['occupation'],
        "email": request.form['email'],
        "password" : pw_hash
    }
    user = User.save(data)
    session['user_id'] = user
    return jsonify(user.to_jason()), 200

@app.route('/login', methods=['POST'])
def login():
    data = {"email": request.form['email']}
    user_in_db = User.get_by_email(data)
    if not user_in_db:
        return jsonify({'message': 'Email not found'}), 400
    if not bcrypt.check_password_hash(user_in_db.password, request.form['password']):
        return jsonify({'message': 'Incorrect password'}), 400
    session['user_id'] = user_in_db.id
    return jsonify(user_in_db.to_json()), 200

@app.route('/logout')
def logout():
    session.clear()
    return jsonify({'message': 'User logged out'}), 200
