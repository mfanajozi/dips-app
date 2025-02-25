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

// Initial rooms data
const initialRooms = [
    {
        site: "Kempton Park | CJ",
        building_name: "The Diamond",
        room_type: "Bachelor S",
        room_number: "DM0101",
        occupant: "Mabel Mulaudzi",
        status: "Occupied"
    },
    {
        site: "Kempton Park | CJ",
        building_name: "Elavate",
        room_type: "2 Bedroom S",
        room_number: "EL0106",
        occupant: "Sikhumbuzo Malanga",
        status: "Occupied"
    },
    {
        site: "Kempton Park | CJ",
        building_name: "Onyx",
        room_type: "2 Bedroom M",
        room_number: "ON0120",
        occupant: "Dirk Steenkamp",
        status: "Occupied"
    },
    {
        site: "Kempton Park | CJ",
        building_name: "Purchase Place",
        room_type: "Bachelor L",
        room_number: "PU0002",
        occupant: "Pinky Mabasa",
        status: "Occupied"
    },
    {
        site: "Pretoria CBD",
        building_name: "Students",
        room_type: "Bachelor S",
        room_number: "SS210",
        occupant: "Sifiso Ngwane",
        status: "Occupied"
    },
    {
        site: "Pretoria CBD",
        building_name: "Res Building",
        room_type: "2 Bedroom S",
        room_number: "RS443",
        occupant: "Henrie Schalk",
        status: "Occupied"
    },
    {
        site: "Pretoria CBD",
        building_name: "Res Building",
        room_type: "Bachelor L",
        room_number: "RS421",
        occupant: "Desiree Grootboom",
        status: "Occupied"
    },
    {
        site: "Capital Park",
        building_name: "Students",
        room_type: "Bachelor S",
        room_number: "CS43",
        occupant: "Zingisa Mabe",
        status: "Occupied"
    },
    {
        site: "Capital Park",
        building_name: "Res Building",
        room_type: "2 Bedroom",
        room_number: "CR34",
        occupant: "Phathiswa Ngwane",
        status: "Occupied"
    },
    {
        site: "Capital Park",
        building_name: "Res Building",
        room_type: "Bachelor L",
        room_number: "CR67",
        occupant: "Nomvula Ngubane",
        status: "Occupied"
    },
    {
        site: "Capital Park",
        building_name: "Capital Buidling",
        room_type: "2 Bedroom M",
        room_number: "CC29",
        occupant: "Ayanda Khumalo",
        status: "Occupied"
    },
    {
        site: "Olievenhoutbosch",
        building_name: "Main",
        room_type: "2 Bedroom S",
        room_number: "OM438",
        occupant: "Thandolwethu Maseko",
        status: "Occupied"
    },
    {
        site: "Olievenhoutbosch",
        building_name: "Main",
        room_type: "2 Bedroom M",
        room_number: "OM54",
        occupant: "Sipho Dlamini",
        status: "Occupied"
    },
    {
        site: "Olievenhoutbosch",
        building_name: "Main",
        room_type: "Bachelor L",
        room_number: "OM97",
        occupant: "Themba Nkosi",
        status: "Occupied"
    },
    {
        site: "Benoni | Tom Jones",
        building_name: "Tom Jones",
        room_type: "Bachelor S",
        room_number: "BT57",
        occupant: "Kagiso Mokoena",
        status: "Occupied"
    },
    {
        site: "Benoni | Tom Jones",
        building_name: "Tom Jones",
        room_type: "2 Bedroom",
        room_number: "BT85",
        occupant: "Nandi Ndlovu",
        status: "Occupied"
    },
    {
        site: "Benoni | Tom Jones",
        building_name: "Tom Jones",
        room_type: "Bachelor L",
        room_number: "BT78",
        occupant: "Siyabonga Tshabalala",
        status: "Occupied"
    }
];

async function setupRoomsTable() {
    try {
        console.log('Please execute the SQL file in Supabase Dashboard SQL Editor first');
        console.log('Now attempting to insert initial rooms...');

        // Insert initial rooms
        for (const room of initialRooms) {
            const { error: insertError } = await supabase
                .from('rooms')
                .insert(room);

            if (insertError) {
                console.error(`Error inserting room ${room.room_number}:`, insertError);
                continue;
            }
            console.log(`✅ Room ${room.room_number} created successfully`);
        }

        console.log('✅ Setup completed successfully');

        // Verify the rooms were created
        const { data: rooms, error: selectError } = await supabase
            .from('rooms')
            .select('site, building_name, room_number, room_type, occupant, status')
            .order('site, building_name, room_number');

        if (selectError) {
            throw selectError;
        }

        console.log('\nVerifying created rooms:');
        console.table(rooms);
    } catch (error) {
        console.error('❌ Error during setup:', error);
        process.exit(1);
    }
}

// Run the setup
setupRoomsTable();
