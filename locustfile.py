from locust import HttpUser, between, task


class WebsiteUser(HttpUser):
    wait_time = between(5, 15)
    
    def on_start(self):
        self.client.post("/login",json= {
            "username": "902115275",
            "password": "846752"
        })
    
    @task
    def index(self):
        self.client.get("/api/customers?key=table_num,table_owner,name&value=2,2,2&ambiguous=1,1,1&mask=_id,table_num,name,table_owner,year")
        
    # @task
    # def about(self):
    #     self.client.get("/about/")