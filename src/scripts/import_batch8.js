import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const csvPath = path.resolve('Batch 8 Interns Names.csv');
const csvData = fs.readFileSync(csvPath, 'utf8');

const lines = csvData.split('\n').filter(line => line.trim() !== '');

async function importInterns() {
    console.log(`Starting import of ${lines.length} interns...`);

    for (const line of lines) {
        const [lastName, firstName] = line.split(',').map(s => s.trim());

        const username = `${firstName.toLowerCase().replace(/\s+/g, '')}_${lastName.toLowerCase().replace(/\s+/g, '')}_b8`;
        const email = `${firstName.toLowerCase().replace(/\s+/g, '.')}@example.com`;
        const password = '1234'; // Default password

        try {
            // 1. Insert into 'users' table
            const { data: userData, error: userError } = await supabase
                .from('users')
                .insert([{ username, password, role: 'Intern' }])
                .select()
                .single();

            if (userError) {
                console.error(`Error creating user ${username}:`, userError.message);
                continue;
            }

            const userId = userData.id;

            // 2. Insert into 'intern_profile' table
            const { error: profileError } = await supabase
                .from('intern_profile')
                .insert([{
                    user_id: userId,
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    mobile_number: '09xxxxxxxxx',
                    address: 'Default Address',
                    gender: 'Not Specified',
                    civil_status: 'Single',
                    school: 'Lifewood Academy',
                    course: 'OJT Program',
                    ojt_program: 'Batch 8',
                    required_ojt_hours: 600
                }]);

            if (profileError) {
                console.error(`Error creating profile for ${firstName} ${lastName}:`, profileError.message);
            } else {
                console.log(`Successfully imported: ${firstName} ${lastName} (${username})`);
            }
        } catch (err) {
            console.error(`Unexpected error for ${firstName} ${lastName}:`, err);
        }
    }

    console.log('Import completed.');
}

importInterns();
