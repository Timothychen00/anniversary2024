from flask import Flask,render_template
from flask_restful import Api
from dotenv import load_dotenv

from main.api import customer_manage
from main.decorators import login_required
from main.routes import app_route

load_dotenv()

app = Flask(__name__)
api = Api(app)

api.add_resource(customer_manage,'/api/customers')
print('\n\n\n\nbefore_first_request!!!!!\n\n\n\n')
app.secret_key = 'os.environ.get("SECRET") or os.urandom(24)'

app.register_blueprint(app_route)

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/example')
def example():
    return render_template('example.html')


if __name__ == '__main__':  
    app.run(debug=True,host='0.0.0.0',port=8000)