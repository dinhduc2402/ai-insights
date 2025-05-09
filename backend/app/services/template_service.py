from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime

from ..models.template import AITemplate
from ..schemas.template import TemplateCreate, TemplateUpdate

class TemplateService:
    def create_template(self, db: Session, template: TemplateCreate) -> AITemplate:
        """Create a new AI template"""
        db_template = AITemplate(
            workspace_id=template.workspace_id,
            name=template.name,
            description=template.description,
            status=template.status,
            llmModel=template.llmModel,
            mainInstructions=template.mainInstructions,
            businessDescription=template.businessDescription,
            customerProfile=template.customerProfile,
            rulesAndFilters=template.rulesAndFilters,
            exampleOutputs=template.exampleOutputs,
            guidanceOverride=template.guidanceOverride,
            prompt=template.prompt
        )
        
        db.add(db_template)
        db.commit()
        db.refresh(db_template)
        return db_template
    
    def get_templates(
        self, 
        db: Session, 
        workspace_id: Optional[UUID] = None, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[AITemplate]:
        """Get all templates with optional workspace filtering"""
        query = db.query(AITemplate)
        
        if workspace_id:
            query = query.filter(AITemplate.workspace_id == workspace_id)
            
        return query.order_by(desc(AITemplate.updatedAt)).offset(skip).limit(limit).all()
    
    def get_template(self, db: Session, template_id: UUID) -> Optional[AITemplate]:
        """Get a template by ID"""
        return db.query(AITemplate).filter(AITemplate.id == template_id).first()
    
    def update_template(
        self, 
        db: Session, 
        template_id: UUID, 
        template_update: TemplateUpdate
    ) -> AITemplate:
        """Update an existing template"""
        db_template = self.get_template(db, template_id)
        
        # Convert Pydantic model to dict, excluding None values and unset fields
        update_data = template_update.dict(exclude_unset=True, exclude_none=True)
        
        # Update template fields
        for key, value in update_data.items():
            setattr(db_template, key, value)
            
        # Update the updatedAt timestamp
        db_template.updatedAt = datetime.now()
        
        db.commit()
        db.refresh(db_template)
        return db_template
    
    def delete_template(self, db: Session, template_id: UUID) -> None:
        """Delete a template"""
        db_template = self.get_template(db, template_id)
        db.delete(db_template)
        db.commit()
    
    def duplicate_template(self, db: Session, template_id: UUID) -> AITemplate:
        """Create a duplicate of an existing template"""
        original_template = self.get_template(db, template_id)
        
        # Create a copy with a modified name
        new_template = AITemplate(
            workspace_id=original_template.workspace_id,
            name=f"{original_template.name} (Copy)",
            description=original_template.description,
            status="draft",  # Always create copies as drafts
            llmModel=original_template.llmModel,
            mainInstructions=original_template.mainInstructions,
            businessDescription=original_template.businessDescription,
            customerProfile=original_template.customerProfile,
            rulesAndFilters=original_template.rulesAndFilters,
            exampleOutputs=original_template.exampleOutputs,
            guidanceOverride=original_template.guidanceOverride,
            prompt=original_template.prompt
        )
        
        db.add(new_template)
        db.commit()
        db.refresh(new_template)
        return new_template

# Create a singleton instance
template_service = TemplateService() 