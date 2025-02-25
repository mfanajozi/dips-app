-- Create catering table
CREATE TABLE IF NOT EXISTS catering (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    site TEXT NOT NULL,
    building_name TEXT NOT NULL,
    chef_name TEXT NOT NULL,
    shift TEXT NOT NULL,
    item TEXT,
    quantity INTEGER,
    date_reported DATE,
    status TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies
ALTER TABLE catering ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON catering
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON catering
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON catering
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users" ON catering
    FOR DELETE
    TO authenticated
    USING (true);
