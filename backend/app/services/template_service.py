from typing import List, Optional, Dict, Any, Tuple, AsyncGenerator
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime
import logging
import asyncio

from ..models.template import AITemplate
from ..schemas.template import TemplateCreate, TemplateUpdate
from ..services.assistant_service import assistant_service
from ..services.pinecone_service import pinecone_service

logger = logging.getLogger(__name__)

class TemplateService:
    def create_template(self, db: Session, template: TemplateCreate) -> AITemplate:
        """Create a new AI template"""
        db_template = AITemplate(
            workspace_id=template.workspace_id,
            name=template.name,
            description=template.description,
            status=template.status,
            llm_model=template.llm_model,
            main_instructions=template.main_instructions,
            business_description=template.business_description,
            customer_profile=template.customer_profile,
            rules_and_filters=template.rules_and_filters,
            example_outputs=template.example_outputs,
            guidance_override=template.guidance_override,
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
            
        return query.order_by(desc(AITemplate.updated_at)).offset(skip).limit(limit).all()
    
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
            llm_model=original_template.llm_model,
            main_instructions=original_template.main_instructions,
            business_description=original_template.business_description,
            customer_profile=original_template.customer_profile,
            rules_and_filters=original_template.rules_and_filters,
            example_outputs=original_template.example_outputs,
            guidance_override=original_template.guidance_override,
            prompt=original_template.prompt
        )
        
        db.add(new_template)
        db.commit()
        db.refresh(new_template)
        return new_template
    
    def _combine_template_with_user_input(
        self, 
        template: AITemplate, 
        user_input: Optional[str] = None,
        additional_context: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Combine template content with user input and additional context
        """
        # Start with the template content
        prompt_parts = []
        
        # Add template content
        if template.prompt:
            prompt_parts.append(template.prompt)
        else:
            # Build from the template fields
            if template.main_instructions:
                prompt_parts.append(f"# Main Instructions\n{template.main_instructions}\n\n")
            if template.business_description:
                prompt_parts.append(f"# Business Description\n{template.business_description}\n\n")
            if template.customer_profile:
                prompt_parts.append(f"# Customer Profile\n{template.customer_profile}\n\n")
            if template.rules_and_filters:
                prompt_parts.append(f"# Rules and Filters\n{template.rules_and_filters}\n\n")
            if template.example_outputs:
                prompt_parts.append(f"# Example Outputs\n{template.example_outputs}\n\n")
            if template.guidance_override:
                prompt_parts.append(f"# Additional Guidance\n{template.guidance_override}\n\n")
        
        # Add additional context if provided
        if additional_context:
            prompt_parts.append("# Additional Context\n")
            for key, value in additional_context.items():
                prompt_parts.append(f"{key}: {value}\n")
            prompt_parts.append("\n")
        
        # Add user input if provided
        if user_input:
            prompt_parts.append(f"# User Input\n{user_input}\n\n")
        
        return "".join(prompt_parts)
    
    async def process_workspace_with_template(
        self,
        db: Session,
        template_id: UUID,
        workspace_id: UUID,
        user_input: Optional[str] = None,
        additional_context: Optional[Dict[str, Any]] = None
    ) -> Tuple[str, Dict[str, Any]]:
        """
        Process a workspace using a template
        """
        try:
            # Get template
            template = self.get_template(db, template_id)
            if not template:
                raise ValueError(f"Template with ID {template_id} not found")
            
            # Combine template with user input
            prompt = self._combine_template_with_user_input(
                template, 
                user_input, 
                additional_context
            )
            
            # Get relevant metadata from Pinecone
            embedding_query = user_input if user_input else prompt[:1000]  # Use first 1000 chars if no user input
            metadata = await self._get_workspace_metadata(str(workspace_id), embedding_query)
            
            # Process prompt with the assistant service
            result = await assistant_service.process_prompt(
                workspace_id=str(workspace_id),
                prompt=prompt,
                model=template.llm_model
            )
            
            # Track usage
            self._track_template_usage(db, template_id, workspace_id)
            
            return result, metadata
        except Exception as e:
            logger.error(f"Error processing workspace with template: {str(e)}", exc_info=True)
            raise
    
    async def process_workspace_with_template_stream(
        self,
        db: Session,
        template_id: UUID,
        workspace_id: UUID,
        user_input: Optional[str] = None,
        additional_context: Optional[Dict[str, Any]] = None
    ) -> AsyncGenerator[str, None]:
        """
        Process a workspace using a template and stream the response
        """
        try:
            # Get template
            template = self.get_template(db, template_id)
            if not template:
                raise ValueError(f"Template with ID {template_id} not found")
            
            # Combine template with user input
            prompt = self._combine_template_with_user_input(
                template, 
                user_input, 
                additional_context
            )
            
            # Get relevant metadata from Pinecone (do this before streaming starts)
            embedding_query = user_input if user_input else prompt[:1000]
            metadata = await self._get_workspace_metadata(str(workspace_id), embedding_query)
            
            # Yield metadata as the first chunk
            yield {"metadata": metadata}
            
            # Process prompt with streaming
            async for chunk in assistant_service.process_prompt_stream(
                workspace_id=str(workspace_id),
                prompt=prompt,
                model=template.llm_model
            ):
                yield chunk
            
            # Track usage (after streaming is complete)
            self._track_template_usage(db, template_id, workspace_id)
            
        except Exception as e:
            logger.error(f"Error processing workspace with template stream: {str(e)}", exc_info=True)
            yield {"error": str(e)}
            raise
    
    async def _get_workspace_metadata(self, workspace_id: str, query: str) -> Dict[str, Any]:
        """
        Get relevant metadata from Pinecone for the workspace
        """
        try:
            # Use the assistant service to get embeddings
            embeddings = await assistant_service.embeddings.aembed_query(query)
            
            # Query Pinecone for relevant vectors
            results = pinecone_service.query_vectors(
                vector=embeddings,
                top_k=5,
                namespace=workspace_id
            )
            
            # Extract and organize metadata
            sources = []
            for match in results:
                if "source" in match.metadata:
                    sources.append({
                        "source": match.metadata["source"],
                        "score": match.score,
                        "content": match.metadata.get("text", ""),
                    })
            
            return {
                "sources": sources,
                "timestamp": datetime.now().isoformat(),
                "workspace_id": workspace_id,
            }
        except Exception as e:
            logger.error(f"Error getting workspace metadata: {str(e)}", exc_info=True)
            return {"error": str(e)}
    
    def _track_template_usage(self, db: Session, template_id: UUID, workspace_id: UUID) -> None:
        """
        Track template usage statistics
        """
        # This could be expanded to store usage metrics in the database
        logger.info(f"Template {template_id} used with workspace {workspace_id}")
        
        # For now, just update the template's updated_at timestamp
        template = self.get_template(db, template_id)
        template.updated_at = datetime.now()
        db.commit()

# Create a singleton instance
template_service = TemplateService() 