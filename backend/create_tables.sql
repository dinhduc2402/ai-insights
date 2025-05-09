-- Create database (run this separately if you haven't created the database yet)
-- CREATE DATABASE ai_insights;

-- Connect to the database
-- \c ai_insights;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_superuser BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create prompts table
CREATE TABLE IF NOT EXISTS prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE
);

-- Create files table for managing uploaded files
CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    file_size BIGINT NOT NULL,
    content_type VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Create chats table to represent conversations
CREATE TABLE IF NOT EXISTS chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Optional: Add a name for group chats
    name VARCHAR(255),
    -- Link to workspace if it's a workspace-specific chat
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create chat_participants table to link users to chats
CREATE TABLE IF NOT EXISTS chat_participants (
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (chat_id, user_id) -- Composite primary key
);

-- Create messages table to store individual messages
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Optional: Status like 'read', 'delivered'
    status VARCHAR(50) DEFAULT 'sent',
    -- Optional: Reply to a specific message
    reply_to_message_id UUID REFERENCES messages(id) ON DELETE SET NULL
);

DROP TABLE IF EXISTS "ai_templates";
CREATE TABLE "public"."ai_templates" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description text,
    status VARCHAR(20) DEFAULT 'draft' NOT NULL,
    llm_model VARCHAR(100),
    main_instructions text,
    business_description text,
    customer_profile text,
    rules_and_filters text,
    example_outputs text,
    guidance_override text,
    prompt text,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_prompts_workspace ON prompts(workspace_id);
CREATE INDEX idx_files_workspace ON files(workspace_id);
CREATE INDEX idx_files_user ON files(user_id);
CREATE INDEX idx_chats_workspace ON chats(workspace_id);
CREATE INDEX idx_chat_participants_chat ON chat_participants(chat_id);
CREATE INDEX idx_chat_participants_user ON chat_participants(user_id);
CREATE INDEX idx_messages_chat ON messages(chat_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_sent_at ON messages(sent_at);
CREATE INDEX idx_ai_templates_workspace ON ai_templates(workspace_id);
