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
    employee_name: 'Chantelle Johnson',
    phone: '+27 81 225 5489',
    email: 'chantelle@dipapa.co.za',
    date_started: '2023-02-12',
    date_exited: null,
    designation: 'Driver',
    employment_status: 'Active',
    notes: 'Loyal employee'
  },
  {
    site: 'Pretoria CBD',
    building_name: 'Res Building',
    employee_name: 'Eddie Malatjie',
    phone: '+27 75 985 2462',
    email: 'eddie@dipapa.co.za',
    date_started: '2015-11-17',
    date_exited: '2021-11-30',
    designation: 'Chef',
    employment_status: 'Retired',
    notes: 'Great employee'
  },
  {
    site: 'Capital Park',
    building_name: 'Res Building',
    employee_name: 'Lebohang Mthembu',
    phone: '+27 74 856 9241',
    email: 'lebo@dipapa.co.za',
    date_started: '2020-02-19',
    date_exited: '2024-04-06',
    designation: 'Maintenance',
    employment_status: 'Resigned',
    notes: 'Hardworking'
  },
  {
    site: 'Olievenhoutbosch',
    building_name: 'Main',
    employee_name: 'Themba Sibanda',
    phone: '+27 65 224 8796',
    email: 'themba@dipapa.co.za',
    date_started: '2022-08-12',
    date_exited: null,
    designation: 'Cleaner',
    employment_status: 'Active',
    notes: 'Extremely neat'
  },
  {
    site: 'Benoni | Tom Jones',
    building_name: 'Tom Jones',
    employee_name: 'Kavita Govender',
    phone: '+27 72 554 8964',
    email: 'kavita@dipapa.co.za',
    date_started: '2018-02-24',
    date_exited: null,
    designation: 'Receptionist',
    employment_status: 'Active',
    notes: 'Good with people'
  }
];

async function setupEmployeesTable() {
  try {
    const { error } = await supabase.from('employees').insert(initialData);
    
    if (error) {
      throw error;
    }
    
    console.log('Successfully populated employees table with initial data');
  } catch (error) {
    console.error('Error setting up employees table:', error);
    process.exit(1);
  }
}

setupEmployeesTable();
