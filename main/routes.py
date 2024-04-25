from flask import render_template,redirect,session,Blueprint,request
from main.decorators import login_required
import datetime
from main.models import Employee
from icecream import ic

app_route=Blueprint('app_route',__name__)

@app_route.route("/login",methods=['GET','POST'])#login
def login():
    
    if 'logged_in' in session and session['logged_in']:
        return redirect('/employee')
    
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
        return redirect('/')
    return render_template("login.html")

@app_route.route('/logout')
@login_required
def logout():
    Employee().logout()
    return redirect('/')

@app_route.route('/employee')
@login_required
def employee():
    return render_template('employee.html')