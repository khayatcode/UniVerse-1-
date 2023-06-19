from flask_app import app
from flask import render_template,redirect,request,session,flash, Flask, jsonify
from flask_app.models.comment import Comment

@app.route('/create_comment', methods=['POST'])
def create_comment():
    errors = Comment.validate_comment(request.json)
    if errors:
        return jsonify(errors), 400
    data = {
        "description": request.json['description'],
        "post_id": request.json['post_id'],
        "user_id": request.json['user_id']
    }
    comment = Comment.save(data)
    return jsonify({'success': True, 'comment': comment}), 201

@app.route('/delete_comment/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    data = {
        "id": comment_id
    }
    comment = Comment.delete(data)
    return jsonify({'success': True, "message": "Comment deleted"}), 204

@app.route('/get_all_comments_for_post/<int:post_id>')
def get_all_comments_for_post(post_id):
    data = {
        "post_id": post_id
    }
    comments = Comment.get_all_comments_for_post(data)
    return jsonify([comment.to_json() for comment in comments]), 200