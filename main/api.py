import json

from flask_restful import Resource
from flask import request,jsonify
from icecream import ic

from main.decorators import login_required
from main.models import db_model,Customers

class customer_manage(Resource):
    def get(self):
        # ic(dict(request.args))
        
        data=dict(request.args)
        
        key=data.get('key',None)
        value=data.get('value',None)
        ambiguous=data.get('ambiguous',None)
        mask=data.get('mask',None)
        specific=int(data.get('specific',None))
        # ic(data)
        if mask and key and value:
            mask=list(map(str,mask.split(',')))
            key=list(map(str,key.split(',')))
            value=list(map(str,value.split(',')))
            ambiguous=list(map(int,ambiguous.split(',')))
        else:
            return ('key, value, mask are required!','ERR'),513
            
        
        # ic({key:value})
        # ic(ambiguous)
        # key,key
        # key={key+key},{key+key}
        # value={value+value}
        # 
        result=Customers.search(key,value,ambiguous,mask,specific)
        return result,200
    
    @login_required
    def post(self):
        '''content-type json'''
        # ic('args',dict(request.args))
        args=dict(request.get_json())
        ic('json',args)
    
        data=args.get('data',None)
        
        result=Customers.add(data)
        if 'ERR' in result:
            return result,513
        return result,200
    
    @login_required
    def delete(self):
        ic(dict(request.args))
        
        data=dict(request.args)
        
        key=data.get('key',None)
        value=data.get('value',None)
        
        ic({key:value})
        result=Customers.remove({key:value})
        if 'ERR' in result:
            return result,513
        return result,200
    
    @login_required
    def put(self):
        '''content-type json'''
        # ic('args',dict(request.args))
        args=dict(request.get_json())
        ic('json',args)
        
        key=args.get('key',None)
        value=args.get('value',None)
        data=args.get('data',None)
        
        
        result=Customers.edit({key:value},data)
        if 'ERR' in result:
            return result,513
        return result,200
    
    