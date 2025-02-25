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
    chef_name: 'Gugu Hlophe',
    shift: '06:00 - 14:00',
    item: 'Juice',
    quantity: 4,
    date_reported: '2025-03-12',
    status: 'Open',
    notes: 'Experienced Chef'
  },
  {
    site: 'Pretoria CBD',
    building_name: 'Res Building',
    chef_name: 'Khanyisile Mlambo',
    shift: '06:00 - 14:00',
    item: null,
    quantity: null,
    date_reported: null,
    status: null,
    notes: null
  },
  {
    site: 'Capital Park',
    building_name: 'Res Building',
    chef_name: 'Sibusiso Nxumalo',
    shift: '07:00 - 15:00',
    item: null,
    quantity: null,
    date_reported: null,
    status: null,
    notes: null
  },
  {
    site: 'Olievenhoutbosch',
    building_name: 'Main',
    chef_name: 'Palesa Nhlapo',
    shift: '06:00 - 14:00',
    item: null,
    quantity: null,
    date_reported: null,
    status: null,
    notes: null
  },
  {
    site: 'Benoni | Tom Jones',
    building_name: 'Tom Jones',
    chef_name: 'Dumisani Sithole',
    shift: '13:00 - 21:00',
    item: null,
    quantity: null,
    date_reported: null,
    status: null,
    notes: 'Pastry Chef'
  }
];

async function setupCateringTable() {
  try {
    const { error } = await supabase.from('catering').insert(initialData);
    
    if (error) {
      throw error;
    }
    
    console.log('Successfully populated catering table with initial data');
  } catch (error) {
    console.error('Error setting up catering table:', error);
    process.exit(1);
  }
}

setupCateringTable();
