from flask_app import app
from flask_app.controllers import users, posts, comments
from flask_cors import CORS


CORS(app, support_credentials=True)


if __name__=="__main__":
    app.run(debug=True)
    
