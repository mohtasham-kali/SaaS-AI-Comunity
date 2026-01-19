
import { generateForumAnswer } from '../src/ai/flows/generate-forum-answer';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testFlow() {
    console.log('Testing generateForumAnswer flow...');
    try {
        const input = {
            title: 'How to center a div?',
            description: 'I am struggling to center a div in CSS. Can someone help?',
            language: 'css',
            codeSnippet: '.container { width: 100%; } .box { width: 50px; }',
        };

        const result = await generateForumAnswer(input);
        console.log('AI Response:', result.answer);
        console.log('Test Passed!');
    } catch (error) {
        console.error('Test Failed:', error);
        process.exit(1);
    }
}

testFlow();
