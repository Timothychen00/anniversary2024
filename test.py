import pandas as pd
from icecream import ic
dataframe=pd.read_excel('0.xlsx')
ic(dataframe)
ic(dataframe.columns)
ic(len(dataframe))
length=len(dataframe)

for i in range(length):
    ic(dict(dataframe.iloc[i]))
    dataframe.iloc[i]
labels = [('流水號','_id'), ('姓名','name'), ('畢業年','year'), ('素食','eat'), ('桌次','table_num'), ('桌名','table_name'), ('桌長','table_owner'), ('備註','note')]
