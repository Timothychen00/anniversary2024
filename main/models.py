import pymongo
from flask import session,jsonify
import os, pymongo,sys,random
from dotenv import load_dotenv
import pandas as pd
import datetime,sys
from icecream import ic
from main.dataformat import Customer_Data
datetime.timezone(datetime.timedelta(hours=8))

def timestamp():
    
    function_name=sys._getframe().f_code.co_name
    line_name=sys._getframe().f_lineno
    username="none"
    try:
        username=session['username']
    except:
        pass
    timestamp=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8)))
    return f'{timestamp} | {username} |> '

ic.configureOutput(prefix=timestamp,includeContext=True)
# from icecream import ic


load_dotenv()

class DB():
    def __init__(self):
        if os.environ['DB_MODE']=='test':
            try:
                self.client=pymongo.MongoClient(os.environ['DB_STRING_TEST'])
            except:
                print('【本地】測試伺服器連線失敗 local failed')

        else:
            try:
                self.client=pymongo.MongoClient(os.environ['DB_STRING'],tls=True,tlsAllowInvalidCertificates=True)
            except:
                print('【雲端】伺服器連線失敗 cloud failed')
        
        self.db=self.client.anniversay
        self.collection=self.db.customer
        self.employees=self.db.employees
        
    def next_id(self):#get next id
        try:
            return int(self.collection.find().sort("_id",pymongo.DESCENDING).limit(1)[0]['_id'])+1
        except:
            return 1
        
    def save(self):     
        df = pd.DataFrame(list(self.collection.find()))
        df.to_csv('data.csv',index=False)
        # self.client=pymongo.MongoClient(os.environ['DB_STRING_TEST'])
        
        
    def load_customer_data(self,filename='customer.xlsx'):
        dataframe=pd.read_excel(filename)
        ic(dataframe)
        ic(dataframe.columns)
        ic(len(dataframe))
        length=len(dataframe)
        labels = {'流水號':('_id',str) ,'姓名':('name',str),'畢業年':('year',str),'素食':('eat',str),'桌次':('table_num',str) ,'桌名':('table_name',str),'桌長':('table_owner',str),'備註':('note',str),'出席':('present',str),'身分':('type',str)}

        for row in range(length):
            ic(type(dataframe.iloc[row]))

            data_from_excel=dict(dataframe.iloc[row])
            ic(data_from_excel)
            data={}
            
            try:
                for key in  data_from_excel:
                    data[labels[key][0]]=data_from_excel[key]
                    data[labels[key][0]]=labels[key][1](data[labels[key][0]])# converting type
                ic(data)
                Customers.add(data)
            except Exception as e:
                ic(e)
                exc_type, exc_obj, exc_tb = sys.exc_info()
                fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
                ic(exc_type, fname, exc_tb.tb_lineno)
                ic("輸入格式與設定格式不匹配！無法進行格式轉換！")
                
                
    def load_employee_data(self,filename='employee.xlsx'):
        dataframe=pd.read_excel(filename)
        ic(dataframe)
        ic(dataframe.columns)
        ic(len(dataframe))
        length=len(dataframe)
        labels = {'帳號':('username',int) ,'密碼':('password',str)}
        
        new = []
        for row in range(length):
            ic(type(dataframe.iloc[row]))

            data_from_excel=dict(dataframe.iloc[row])
            ic(data_from_excel)
            data={}
            
            try:
                for key in  data_from_excel:
                    data[labels[key][0]]=data_from_excel[key]
                    data[labels[key][0]]=labels[key][1](data[labels[key][0]])# converting type
                    if labels[key][0]=='password' and data[labels[key][0]] =='nan':
                        data[labels[key][0]]=''.join(random.sample('0123456789',6))
                        ic(data[labels[key][0]])
                    
                ic(data)
                new.append(data)
                new_dataframe=pd.DataFrame([data])
                Employee().register(data['username'],data['password'])
            except Exception as e:
                ic(e)
                exc_type, exc_obj, exc_tb = sys.exc_info()
                fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
                ic(exc_type, fname, exc_tb.tb_lineno)
                ic("輸入格式與設定格式不匹配！無法進行格式轉換！")
        ic(new)
        pd.DataFrame(new).to_csv('employee.csv',index=False)
db_model=DB()

class Customers():
    def add(data):
        template={
            '_id':db_model.next_id(),
            'name'  : 'test',
            'year' : '',
            'eat':'',
            'table_num':"",
            'tag':[0],
            'donate':'',
            'type':'normal',
            'table_owner':"",
            'present':"",
            'table_name':"",
            'note':''
        }

        if not data:
            return "data input is empty!",'ERR'

        for i in template:#only fill acccept data
            try:
                if i in data:
                    if data[i]:
                        template[i]=Customer_Data[i](data[i])
            except:
                return f"type not ",'ERR'
            
        ic(template)
        
        for i in template:
            ic(type(template[i]))
        result=db_model.collection.insert_one(template)
        ic(result.inserted_id)
        ic(result)
        return result.inserted_id,"SUCCESS"
        
    def remove(filter):
        
        if not filter :
            return "filter is empty!","ERR"
        
        db_model.collection.delete_one(filter)
        return "success",'SUCCESS'
    
    def search(filter,ambiguous=True,mask=None):
        key=(list(filter.keys())[0])
        if ambiguous:
            if filter:
                ic(filter)
                filter={key:{'$regex':".*"+filter[key]+'.*'}}
        result=db_model.collection.find(filter)
        result=list(result)
        
        ic(result)
        if mask:
            result=[{i:doc[i] for i in mask} for doc in result]
        ic(result)
        return result,'SUCCESS'
    
    def edit(filter,set_data):
        '''for not ambiguous only!'''
        if not filter or not set_data:
            return "filter or set_data is empty!","ERR"
        
        result_count=len(list(db_model.collection.find(filter)))
        ic(result_count)
        if result_count==0:
            return 'Document not found!','ERR'
        elif result_count>1:
            return 'Too many results!','ERR'
        else:
            result=db_model.collection.update_one(filter,{"$set":set_data})
            ic(result)
            return 'edit','SUCCESS'
            
        
        
class Employee():
    def start_session(self,username):
        session['logged_in']=True
        session['username']=username
    
    def login(self,username,password):
        result=db_model.employees.find_one({'username':username})
        if result:
            # if check_password_hash(result['password'],password):
            if result['password']==password:
                self.start_session(username)
                ic('login success')
                return "login success",'SUCCESS'
            else:
                ic('not correct password')
                return "password check failed",'ERR'
        else:
            ic('no employee')
            return "no employee",'ERR'

    def logout(self):
        if 'logged_in' in session:
            del session['logged_in']
        if 'username' in session:
            del session['username']
            
        ic('logout success')
    
    def register(self,username,password):#only for back-end change
        username=str(username)
        result=list(db_model.employees.find({'username':username}))
        if len(result)>0:
            return 'username existed!','ERR'

        db_model.employees.insert_one({'username':username,'password':password})
        return 'register success','SUCCESS'