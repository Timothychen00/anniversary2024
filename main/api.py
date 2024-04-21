from flask_restful import Resource
from flask import request,jsonify
from icecream import ic
from main.models import db_model,Customers

class customer_manage(Resource):
    def get(self):
        ic(dict(request.args))
        
        data=dict(request.args)
        
        key=data.get('key',None)
        value=data.get('value',None)
        ambiguous=data.get('ambiguous',None)
        
        ic({key:value})
        ic(ambiguous)
        result=Customers.search({key:value},ambiguous)
        return result,200
    
    def post(self):
        '''content-type json'''
        # ic('args',dict(request.args))
        ic('json',dict(request.get_json()))
        # ic('values',request.values)
        ic('post ')
        pass
    
    def delete(self):
        pass
    
    def put(self):
        pass