-- Fix Article Description Field Max Length
-- This script updates the database to remove the 80 character limit on description field

-- First, check current schema
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'articles' AND column_name = 'description';

-- Increase description field to accept longer text (1000 characters)
ALTER TABLE articles 
MODIFY COLUMN description VARCHAR(1000);

-- Verify the change
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'articles' AND column_name = 'description';

-- Alternative: If VARCHAR not working, use TEXT (unlimited)
-- ALTER TABLE articles 
-- MODIFY COLUMN description TEXT;

