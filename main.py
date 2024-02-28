from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from random import randint
from datetime import datetime, timedelta
from pydantic import BaseModel
import pytz

class GyroScopeData(BaseModel):
    x: int
    y: int
    z: int
    name: str

class AccelerometerData(BaseModel):
    x: int
    y: int
    z: int
    name: str

class Data(BaseModel):
    gyroscope: GyroScopeData
    accelerometer: AccelerometerData

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

datas = []

@app.post("/append_data")
async def append_data(data: Data):
    data = dict(data)
    data["gyroscope"] = dict(data["gyroscope"])
    data["accelerometer"] = dict(data["accelerometer"])
    data["gyroscope"]["name"] = datetime.now().strftime("%I:%M:%S %p")
    data["accelerometer"]["name"] = datetime.now().strftime("%I:%M:%S %p")
    datas.append(data)
    print(datas)

    return {"message": "Data appended successfully"}

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/data")
async def get_random_data():
    return {
        "gyroscope": [
            {
                "x": randint(0, 10),
                "y": randint(0, 10),
                "z": randint(0, 10),
                "name": (datetime.now() - timedelta(seconds=10-i)).strftime("%I:%M:%S %p"),
            }
            for i in range(10)
        ],
        "accelerometer": [
            {
                "x": randint(0, 10),
                "y": randint(0, 10),
                "z": randint(0, 10),
                "name": (datetime.now() - timedelta(seconds=10-i)).strftime("%I:%M:%S %p"),
            }
            for i in range(10)
        ]
    }
