  
import pkg from '@supabase/supabase-js';
const { createClient } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: join(process.cwd(), '.env.local') });

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initial users data
const initialUsers = [
    {
        "Name": "Mzi Masitla",
        "Email": "masitlaem@gmail.com",
        "Username": "masitla",
        "Password": "Password123",
        "Role": "Admin",
        "Avatar": "url_to_avatar_image"
    },
    {
        "Name": "Jane Smith",
        "Email": "janesmith@example.com",
        "Username": "janesmith",
        "Password": "anothersecurepassword456",
        "Role": "Super User",
        "Avatar": "url_to_avatar_image"
    },
    {
        "Name": "Alice Johnson",
        "Email": "alicej@example.com",
        "Username": "alicej",
        "Password": "yetanotherpassword789",
        "Role": "Management",
        "Avatar": "url_to_avatar_image"
    },
    {
        "Name": "Bob Brown",
        "Email": "bobbrown@example.com",
        "Username": "bobbrown",
        "Password": "password1234",
        "Role": "User",
        "Avatar": "url_to_avatar_image"
    }
];

async function setupUsersTable() {
    try {
        console.log('Please execute the SQL file in Supabase Dashboard SQL Editor first');
        console.log('Now attempting to insert initial users...');

        // Insert initial users with hashed passwords
        for (const user of initialUsers) {
            const hashedPassword = await bcrypt.hash(user.Password, 10);
            
            const { error: insertError } = await supabase
                .from('users')
                .insert({
                    name: user.Name,
                    email: user.Email,
                    username: user.Username,
                    password: hashedPassword,
                    role: user.Role,
                    avatar: user.Avatar
                });

            if (insertError) {
                console.error(`Error inserting user ${user.Email}:`, insertError);
                continue;
            }
            console.log(`✅ User ${user.Email} created successfully`);
        }

        console.log('✅ Setup completed successfully');

        // Verify the users were created
        const { data: users, error: selectError } = await supabase
            .from('users')
            .select('name, email, role')
            .order('role');

        if (selectError) {
            throw selectError;
        }

        console.log('\nVerifying created users:');
        console.table(users);
    } catch (error) {
        console.error('❌ Error during setup:', error);
        process.exit(1);
    }
}

// Run the setup
setupUsersTable();
