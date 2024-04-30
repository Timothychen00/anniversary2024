from functools import wraps
import time

from flask import flash, redirect,session
from icecream import ic

def timeit(func):
    @wraps(func)
    def timeit_wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        end_time = time.perf_counter()
        total_time = end_time - start_time
        # first item in the args, ie `args[0]` is `self`
        print(f'Function {func.__name__} Took {total_time:.4f} seconds')
        return result
    return timeit_wrapper

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
