from flask import flash, redirect,session
from functools import wraps
from icecream import ic


def login_required(a):
    @wraps(a)
    def wrap(*args,**kwargs):
        if 'logged_in' in session and session['logged_in']:
            return a(*args,**kwargs)
        else:
            # flash('請先登入')

            ic('請先登入')
            return '請先登入','ERR'
    return wrap

def login_required_redirect(a):
    @wraps(a)
    def wrap(*args,**kwargs):
        if 'logged_in' in session and session['logged_in']:
            return a(*args,**kwargs)
        else:
            ic('請先登入')
            return redirect('/login')
    return wrap
