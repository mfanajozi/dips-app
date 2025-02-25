import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Required environment variables are not set.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const initialData = [
  {
    site: 'Kempton Park | CJ',
    building_name: 'Onyx',
    room_number: 'ON0120',
    reporter_name: 'Thandiwe Nxesi',
    date_reported: '2025-02-12',
    date_resolved: '2025-02-19',
    reference: 'DP2343',
    issue: 'Leaking Tap',
    priority: 'High',
    owner: 'Maintenance',
    notes: 'Completed Quickly',
    status: 'Closed'
  },
  {
    site: 'Pretoria CBD',
    building_name: 'Res Building',
    room_number: 'SS210',
    reporter_name: 'Lwazi Cele',
    date_reported: '2025-02-16',
    date_resolved: null,
    reference: null,
    issue: 'Res to CBD Campus',
    priority: null,
    owner: null,
    notes: null,
    status: 'Open'
  },
  {
    site: 'Capital Park',
    building_name: 'Res Building',
    room_number: 'RS421',
    reporter_name: 'Nqobile Mabasa',
    date_reported: '2025-02-19',
    date_resolved: null,
    reference: 'DP7653',
    issue: 'Window Stuck',
    priority: 'Low',
    owner: 'Handy Guy',
    notes: 'Appointment with Service Provider set',
    status: 'Open'
  },
  {
    site: 'Olievenhoutbosch',
    building_name: 'Main',
    room_number: 'OM54',
    reporter_name: 'Mpho Makhanya',
    date_reported: '2025-02-18',
    date_resolved: null,
    reference: null,
    issue: 'Res to Campus 2',
    priority: null,
    owner: null,
    notes: null,
    status: 'Open'
  },
  {
    site: 'Benoni | Tom Jones',
    building_name: 'Tom Jones',
    room_number: 'BT85',
    reporter_name: 'Banele Shabalala',
    date_reported: '2025-02-24',
    date_resolved: null,
    reference: 'DP7765',
    issue: 'Missing Bathroom Key',
    priority: 'Medium',
    owner: 'Locksmith',
    notes: 'Awaiting Service Provider',
    status: 'Open'
  }
];

async function setupMaintenanceTable() {
  try {
    const { error } = await supabase.from('maintenance').insert(initialData);
    
    if (error) {
      throw error;
    }
    
    console.log('Successfully populated maintenance table with initial data');
  } catch (error) {
    console.error('Error setting up maintenance table:', error);
    process.exit(1);
  }
}

setupMaintenanceTable();
