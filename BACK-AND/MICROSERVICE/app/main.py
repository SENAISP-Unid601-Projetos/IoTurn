from thompsonSampling import ThompsonSampling
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi import HTTPException

app = FastAPI()

class Arm(BaseModel):
    id: str
    successes: int
    failures: int

class ArmsRequest(BaseModel):
    arms: list[Arm] 

@app.post("/bestArm")
def call_arm(request: ArmsRequest):
    if not request.arms:
        raise HTTPException(status_code=400, detail="A lista de braços ('arms') não pode estar vazia.")
    print(request.arms)
    ts = ThompsonSampling()
    best_arm = ts.choose_arm(request.arms)
    print(best_arm)
    return best_arm