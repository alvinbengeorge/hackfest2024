from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from random import randint
from datetime import datetime, timedelta
from pydantic import BaseModel
from pytz import timezone
from dotenv import load_dotenv
from os import environ
from twilio.rest import Client
from joblib import load
import numpy as np

# print(datetime.now().astimezone(timezone('Asia/Kolkata')).strftime("%I:%M:%S %p"))
load_dotenv()
svc = load('parkinsons.joblib')

ACCOUNT_SID = environ.get("ACCOUNT_SID")
AUTH_TOKEN = environ.get("AUTH_TOKEN")
FROM_NUMBER = environ.get("TWILIO_NUMBER")
TO_NUMBER = environ.get("TARGET_NUMBER")

client = Client(ACCOUNT_SID, AUTH_TOKEN)


class GyroScopeData(BaseModel):
    x: float
    y: float
    z: float

class AccelerometerData(BaseModel):
    x: float
    y: float
    z: float

class Data(BaseModel):
    gyroscope: GyroScopeData
    accelerometer: AccelerometerData
    steps: int    

class PredictData(BaseModel):
    data: list[float]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

datas = {
    "gyroscope": [
        {'x': 0, 'y': 0, 'z': 0}
    ],
    "accelerometer": [
        {'x': 0, 'y': 0, 'z': 0}
    ],
    "steps": 0,
    "sos": 0,
}

steps = 0

@app.post("/append_data")
async def append_data(data: Data):
    data = dict(data)
    data["gyroscope"] = dict(data["gyroscope"])
    data["accelerometer"] = dict(data["accelerometer"])
    data["gyroscope"]["name"] = datetime.now().astimezone(timezone('Asia/Kolkata')).strftime("%I:%M:%S %p")
    data["accelerometer"]["name"] = datetime.now().astimezone(timezone('Asia/Kolkata')).strftime("%I:%M:%S %p")
    datas["gyroscope"].append(data["gyroscope"])
    datas["accelerometer"].append(data["accelerometer"])
    datas['steps'] = data['steps']
    return {"message": "Data appended successfully"}

@app.get("/send_message")
async def send_messsage():
    datas["sos"]+=1
    message = client.messages.create(
        body="SOS Message from Parkinsons Message, please check on the patient",
        from_=FROM_NUMBER,  
        to=TO_NUMBER
    )
    return {"message": message.body}


@app.get("/data")
async def get_random_data():
    return datas

@app.post("/predict")
async def getData(data: PredictData):
    input_data = data.data
    np_data = np.asanyarray(input_data)
    prediction = svc.predict(np_data.reshape(1,-1))
    return {"prediction": int(prediction[0])}