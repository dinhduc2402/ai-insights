from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.job import Job, JobStatus
from ..schemas.job import JobCreate, JobUpdate, JobInDB

router = APIRouter()

@router.post("/", response_model=JobInDB)
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    db_job = Job(**job.model_dump())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.get("/", response_model=List[JobInDB])
def read_jobs(
    skip: int = 0,
    limit: int = 100,
    workspace_id: str = None,
    user_id: str = None,
    status: JobStatus = None,
    db: Session = Depends(get_db)
):
    query = db.query(Job)
    
    if workspace_id:
        query = query.filter(Job.workspace_id == workspace_id)
    if user_id:
        query = query.filter(Job.user_id == user_id)
    if status:
        query = query.filter(Job.status == status)
    
    jobs = query.offset(skip).limit(limit).all()
    return jobs

@router.get("/{job_id}", response_model=JobInDB)
def read_job(job_id: str, db: Session = Depends(get_db)):
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return db_job

@router.put("/{job_id}", response_model=JobInDB)
def update_job(job_id: str, job: JobUpdate, db: Session = Depends(get_db)):
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    update_data = job.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_job, field, value)
    
    db.commit()
    db.refresh(db_job)
    return db_job

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(job_id: str, db: Session = Depends(get_db)):
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    db.delete(db_job)
    db.commit()
    return None 