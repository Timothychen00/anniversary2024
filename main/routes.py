import datetime

from flask import render_template,redirect,session,Blueprint,request,jsonify
from icecream import ic

from main.models import Employee
from main.decorators import login_required,login_required_redirect


app_route=Blueprint('app_route',__name__)

@app_route.route("/login",methods=['GET','POST'])#login
def login():
    
    # if 'logged_in' in session and session['logged_in']:
    #     # return redirect('/employee')
    
    if request.method=='POST':
        form=request.get_json()

        username=form.get('username',None)
        password=form.get('password',None)
        remember=form.get('remember',True)
        if not username or not password:
            return "username or password is empty!","ERR"

        ic(form)
        result=Employee().login(username,password)
        ic(result)
        if remember:
            session.permanent = True
            app_route.permanent_session_lifetime = datetime.timedelta(days=30)
        else:
            session.permanent=True
            app_route.permanent_session_lifetime = datetime.timedelta(minutes=5)
        return jsonify(result)
        # return redirect('/')
    return render_template("login.html")

@app_route.route('/logout')
@login_required_redirect
def logout():
    Employee().logout()
    return redirect('/')

@app_route.route('/employee')
@login_required_redirect
def employee():
    return render_template('employee.html')

@app_route.route('/donate')
@login_required_redirect
def donate():
    return render_template('donate.html')

@app_route.route('/checkin')
@login_required_redirect
def checkin():
    return render_template('checkin.html')

@app_route.route('/reward')
@login_required_redirect
def reward():
    return render_template('reward.html')