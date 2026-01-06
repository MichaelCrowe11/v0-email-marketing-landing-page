-- Azure SQL Database Schema Migration
-- Run this script in the Azure Portal Generic Query Editor or using sqlcmd

-- 1. Users & Authentication
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
BEGIN
    CREATE TABLE users (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        email NVARCHAR(255) UNIQUE NOT NULL,
        password_hash NVARCHAR(255) NOT NULL,
        name NVARCHAR(255),
        avatar_url NVARCHAR(500),
        is_admin BIT DEFAULT 0,
        stripe_customer_id NVARCHAR(255),
        created_at DATETIME2 DEFAULT GETUTCDATE(),
        updated_at DATETIME2 DEFAULT GETUTCDATE()
    );
END

-- 2. AI Conversations
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ai_conversations')
BEGIN
    CREATE TABLE ai_conversations (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        user_id UNIQUEIDENTIFIER REFERENCES users(id),
        title NVARCHAR(255),
        model NVARCHAR(50),
        created_at DATETIME2 DEFAULT GETUTCDATE(),
        updated_at DATETIME2 DEFAULT GETUTCDATE()
    );
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ai_messages')
BEGIN
    CREATE TABLE ai_messages (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        conversation_id UNIQUEIDENTIFIER REFERENCES ai_conversations(id) ON DELETE CASCADE,
        role NVARCHAR(20) CHECK (role IN ('user', 'assistant', 'system')),
        content NVARCHAR(MAX),
        created_at DATETIME2 DEFAULT GETUTCDATE()
    );
END

-- 3. Cultivation Projects (Dashboard Data)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'cultivation_projects')
BEGIN
    CREATE TABLE cultivation_projects (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        user_id UNIQUEIDENTIFIER REFERENCES users(id),
        project_name NVARCHAR(255) NOT NULL,
        mushroom_species NVARCHAR(100),
        strain NVARCHAR(100),
        status NVARCHAR(50) CHECK (status IN ('colonizing', 'fruiting', 'harvested', 'contaminated', 'inactive')),
        start_date DATETIME2 DEFAULT GETUTCDATE(),
        estimated_harvest_date DATETIME2,
        notes NVARCHAR(MAX),
        created_at DATETIME2 DEFAULT GETUTCDATE()
    );
END

-- 4. Environmental Readings
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'environmental_readings')
BEGIN
    CREATE TABLE environmental_readings (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        project_id UNIQUEIDENTIFIER REFERENCES cultivation_projects(id),
        temperature DECIMAL(5, 2), -- Degrees Fahrenheit or Celsius
        humidity DECIMAL(5, 2),    -- Percentage
        co2_ppm INT,
        recorded_at DATETIME2 DEFAULT GETUTCDATE()
    );
END

-- 5. Harvest Records
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'harvest_records')
BEGIN
    CREATE TABLE harvest_records (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        project_id UNIQUEIDENTIFIER REFERENCES cultivation_projects(id),
        user_id UNIQUEIDENTIFIER REFERENCES users(id),
        flush_number INT DEFAULT 1,
        wet_weight DECIMAL(10, 2), -- In grams
        dry_weight DECIMAL(10, 2), -- In grams
        harvest_date DATETIME2 DEFAULT GETUTCDATE(),
        quality_rating INT CHECK (quality_rating BETWEEN 1 AND 5),
        notes NVARCHAR(MAX)
    );
END

-- 6. User Subscriptions (Dashboard Critical)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'user_subscriptions')
BEGIN
    CREATE TABLE user_subscriptions (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        user_id UNIQUEIDENTIFIER REFERENCES users(id),
        stripe_subscription_id NVARCHAR(255),
        status NVARCHAR(50), -- active, canceled, past_due
        plan_id NVARCHAR(255),
        credits_remaining INT DEFAULT 0,
        usage_this_month INT DEFAULT 0,
        created_at DATETIME2 DEFAULT GETUTCDATE(),
        updated_at DATETIME2 DEFAULT GETUTCDATE()
    );
END

-- 7. Forum System
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'forum_categories')
BEGIN
    CREATE TABLE forum_categories (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        name NVARCHAR(100) NOT NULL,
        slug NVARCHAR(100) UNIQUE NOT NULL,
        description NVARCHAR(500),
        created_at DATETIME2 DEFAULT GETUTCDATE()
    );
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'forum_posts')
BEGIN
    CREATE TABLE forum_posts (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        user_id UNIQUEIDENTIFIER REFERENCES users(id),
        category_id UNIQUEIDENTIFIER REFERENCES forum_categories(id),
        title NVARCHAR(255) NOT NULL,
        content NVARCHAR(MAX) NOT NULL,
        view_count INT DEFAULT 0,
        slug NVARCHAR(255) UNIQUE,
        created_at DATETIME2 DEFAULT GETUTCDATE(),
        updated_at DATETIME2 DEFAULT GETUTCDATE()
    );
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'forum_replies')
BEGIN
    CREATE TABLE forum_replies (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        post_id UNIQUEIDENTIFIER REFERENCES forum_posts(id) ON DELETE CASCADE,
        author_id UNIQUEIDENTIFIER, -- Can be User ID or 'ai-crowe-logic'
        content NVARCHAR(MAX) NOT NULL,
        is_ai_generated BIT DEFAULT 0,
        created_at DATETIME2 DEFAULT GETUTCDATE(),
        updated_at DATETIME2 DEFAULT GETUTCDATE()
    );
END

-- 8. Knowledge Base Documents
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'documents')
BEGIN
    CREATE TABLE documents (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        author_id UNIQUEIDENTIFIER REFERENCES users(id),
        title NVARCHAR(255) NOT NULL,
        content NVARCHAR(MAX) NOT NULL,
        category NVARCHAR(100),
        is_published BIT DEFAULT 0,
        view_count INT DEFAULT 0,
        tags NVARCHAR(MAX), -- JSON string or comma-separated
        created_at DATETIME2 DEFAULT GETUTCDATE(),
        updated_at DATETIME2 DEFAULT GETUTCDATE()
    );
END

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);

CREATE INDEX idx_conversations_user ON ai_conversations(user_id);
CREATE INDEX idx_messages_conversation ON ai_messages(conversation_id);
CREATE INDEX idx_projects_user ON cultivation_projects(user_id);
CREATE INDEX idx_readings_project ON environmental_readings(project_id);
