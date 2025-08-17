-- Initialize Keycloak database
CREATE DATABASE keycloak;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE keycloak TO postgres;

-- Create user table for the app (example)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    keycloak_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create meal plans table (example)
CREATE TABLE IF NOT EXISTS meal_plans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    planned_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create recipes table (example)
CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    ingredients TEXT[],
    instructions TEXT,
    prep_time INTEGER, -- in minutes
    cook_time INTEGER, -- in minutes
    servings INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT INTO users (email, name, keycloak_id) VALUES 
('test@example.com', 'Test User', 'test-keycloak-id')
ON CONFLICT (email) DO NOTHING;
