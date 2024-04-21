from flask import Flask,render_template
from flask_restful import Api
from main.api import customer_manage
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
api = Api(app)
# app.register_blueprint(app_route)

api.add_resource(customer_manage,'/api/customers')

app.secret_key = 'os.environ.get("SECRET") or os.urandom(24)'

@app.route('/')
def home():
    return render_template('index.html')



if __name__ == '__main__':  
    app.run(debug=True)