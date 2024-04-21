import functools

def a(func):
    print(func.__name__)
    print('a')
    
    @functools.wraps(func)
    def wrapper(*args,**kwargs):#target function
        print('wrapper')
        print(func.__name__)
        func(*args)
    return wrapper
    
@a
def b(c):
    print('b:',c)
    
    
b(2,3)
print(b.__name__)
# @a b= a(b)
# decorator 的返回值是一個原本的function
# wrapper本身的存在是為了避免在設定的時候函式被意外執行
# 在定義之後，call b的話a就不會再被執行了
# @functools.wraps
# 如果不使用wraps，那b函數的名字就會被改成wrapper
# f.__name__
# f.__doc__
# 如果參數是傳送*args就會把tuple拆開，但是如果是傳送arg就會把所有的參數當作一個tuple參數