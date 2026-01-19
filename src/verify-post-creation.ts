
import { createQuestion } from './lib/supabase-database';
import { supabase } from './lib/supabase';

async function verify() {
    console.log('Verifying Post Creation...');

    // 1. Get a user
    const { data: users, error: userError } = await supabase.from('profiles').select('id').limit(1);

    var userId;
    if (userError || !users || users.length === 0) {
        console.log('No users found. Creating a test user...');
        const email = `testuser${Date.now()}@gmail.com`;
        const password = 'password123';

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: 'Test User'
                }
            }
        });

        if (authError || !authData.user) {
            console.error('Failed to create test user:', authError);
            return;
        }

        console.log(`Created test user: ${email} (${authData.user.id})`);

        // Create profile manually since we are not in the app
        const { error: profileError } = await supabase.from('profiles').insert({
            id: authData.user.id,
            username: `testuser${Date.now()}`,
            email: email,
            plan: 'free',
            airesponsestoday: 0,
            airesponsesthisweek: 0,
            lastlogin: new Date().toISOString(),
        });

        if (profileError) {
            console.error('Error creating profile:', profileError);
        } else {
            console.log('Profile created successfully.');
        }

        userId = authData.user.id;
    } else {
        userId = users[0].id;
    }
    console.log(`Using user ID: ${userId}`);

    // 2. Create a question
    const newQuestion = {
        title: `Debug Test ${Date.now()}`,
        description: 'Testing DB persistence via script',
        code_snippet: 'console.log("Hello World")',
        language: 'typescript',
        tags: ['test', 'debug']
    };

    console.log('Creating question...');
    const created = await createQuestion(newQuestion, userId);

    if (!created) {
        console.error('Failed to create question (check previous logs for details).');
    } else {
        console.log(`Question created successfully with ID: ${created.id}`);
    }
}

verify().catch(console.error);
