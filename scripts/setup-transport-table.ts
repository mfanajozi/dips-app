import pkg from '@supabase/supabase-js';
const { createClient } = pkg;
import dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: join(process.cwd(), '.env.local') });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initial transport data
const initialTransport = [
    {
        site: "Kempton Park | CJ",
        driver_name: "Mbali Mthembu",
        vehicle: "Iveco",
        registration_number: "SD43THGP",
        type: "Mini Bus",
        route: "Res to Campus 1",
        next_maintenance_date: "2025-03-17",
        notes: "New driver still leaning",
        mileage: 124000,
        status: "Active"
    },
    {
        site: "Pretoria CBD",
        driver_name: "Andile Mdletshe",
        vehicle: "Siyaya",
        registration_number: "LD98GHGP",
        type: "Mini Bus",
        route: "Res to CBD Campus",
        next_maintenance_date: "2025-04-05",
        notes: "Car needs tracker",
        mileage: 236000,
        status: "Active"
    },
    {
        site: "Capital Park",
        driver_name: "Nosipho Gumede",
        vehicle: "Bus",
        registration_number: "GY34FDGP",
        type: "Bus",
        route: "Res to Campus 3",
        next_maintenance_date: "2025-08-12",
        status: "Active"
    },
    {
        site: "Olievenhoutbosch",
        driver_name: "Tshepo Phiri",
        vehicle: "Quantum",
        registration_number: "GT67TDGP",
        type: "Mini Bus",
        route: "Res to Campus 2",
        next_maintenance_date: "2025-06-29",
        notes: "Experienced Driver",
        status: "Active"
    },
    {
        site: "Benoni | Tom Jones",
        driver_name: "Xolani Madikizela",
        vehicle: "Bus",
        registration_number: "DL56DGGP",
        type: "Bus",
        route: "Res to Campus Gate 3",
        next_maintenance_date: "2025-05-16",
        status: "Active"
    }
];

async function setupTransportTable() {
    try {
        console.log('Please execute the SQL file in Supabase Dashboard SQL Editor first');
        console.log('Now attempting to insert initial transport data...');

        // Insert initial transport entries
        for (const transport of initialTransport) {
            const { error: insertError } = await supabase
                .from('transport')
                .insert(transport);

            if (insertError) {
                console.error(`Error inserting transport ${transport.registration_number}:`, insertError);
                continue;
            }
            console.log(`✅ Transport ${transport.registration_number} created successfully`);
        }

        console.log('✅ Setup completed successfully');

        // Verify the transport entries were created
        const { data: transports, error: selectError } = await supabase
            .from('transport')
            .select('site, driver_name, vehicle, registration_number, type, route, next_maintenance_date')
            .order('site');

        if (selectError) {
            throw selectError;
        }

        console.log('\nVerifying created transport entries:');
        console.table(transports);
    } catch (error) {
        console.error('❌ Error during setup:', error);
        process.exit(1);
    }
}

// Run the setup
setupTransportTable();
