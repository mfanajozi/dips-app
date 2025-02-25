-- Create maintenance table
CREATE TABLE IF NOT EXISTS maintenance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    site TEXT NOT NULL,
    building_name TEXT NOT NULL,
    room_number TEXT NOT NULL,
    reporter_name TEXT NOT NULL,
    date_reported DATE NULL,
    date_resolved DATE NULL,
    reference TEXT NULL,
    issue TEXT NULL,
    priority TEXT NULL,
    owner TEXT NULL,
    notes TEXT NULL,
    status TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies
ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON maintenance
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON maintenance
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON maintenance
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users" ON maintenance
    FOR DELETE
    TO authenticated
    USING (true);
