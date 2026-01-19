import { createSupabaseServerClient } from '@/lib/supabase-server';
import { generateForumAnswer } from '@/ai/flows/generate-forum-answer';
import { NextResponse } from 'next/server';
import { Database } from '@/lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic'; // Ensure this route is not cached

export async function GET() {
    try {
        const supabase = createSupabaseServerClient() as any;

        // Calculate the timestamp for 15 minutes ago
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
        // Calculate the timestamp for 24 hours ago (to avoid processing very old posts)
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        // Define interfaces for the data structure
        interface Answer {
            count: number;
        }

        interface Question {
            id: string;
            title: string;
            description: string;
            code_snippet?: string;
            language?: string;
            created_at: string;
            answers: Answer[];
        }

        // Fetch questions created between 24 hours ago and 15 minutes ago
        // We also fetch answers to check if there are any
        const { data: rawQuestions, error } = await supabase
            .from('questions')
            .select('*, answers(count)')
            .lt('created_at', fifteenMinutesAgo)
            .gt('created_at', twentyFourHoursAgo)
            .order('created_at', { ascending: false });

        const questions = rawQuestions as unknown as Question[];

        if (error) {
            console.error('Error fetching questions:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!questions || questions.length === 0) {
            return NextResponse.json({ message: 'No questions found to process.' });
        }

        const processedQuestions = [];

        for (const question of questions) {
            // Check if the question has 0 answers
            // Note: Supabase returns answers as an array of objects or count depending on query
            // With select('*, answers(count)'), question.answers[0].count should give the count
            const answersCount = question.answers && question.answers[0] ? question.answers[0].count : 0;

            if (answersCount === 0) {
                console.log(`Processing question: ${question.title} (${question.id})`);

                // Generate AI answer with fallback logic
                let answerContent = '';
                let modelUsed = 'gemini-flash';

                // Strategy: Try Claude Sonnet (if key exists) -> Mistral Large -> Gemini Flash
                const modelsToTry = ['claude-sonnet', 'mistral-large', 'gemini-flash'];

                for (const model of modelsToTry) {
                    try {
                        console.log(`Trying model: ${model} for question ${question.id}`);
                        const result = await generateForumAnswer({
                            title: question.title,
                            description: question.description,
                            codeSnippet: question.code_snippet || undefined,
                            language: question.language || undefined,
                            model: model,
                        });
                        answerContent = result.answer;
                        modelUsed = result.modelUsed || model;
                        break; // Success!
                    } catch (err) {
                        console.warn(`Model ${model} failed for question ${question.id}:`, err);
                        // Continue to next model
                    }
                }

                if (!answerContent) {
                    console.error(`All models failed for question ${question.id}. Skipping.`);
                    continue;
                }

                // Insert the AI answer
                // We need a user ID for the AI.
                let aiUserId = null;
                const { data: aiUser } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('username', 'AI Assistant')
                    .single();

                if (aiUser) {
                    aiUserId = aiUser.id;
                } else {
                    // Fallback: Use the first user found
                    const { data: anyUser } = await supabase.from('profiles').select('id').limit(1).single();
                    if (anyUser) aiUserId = anyUser.id;
                }

                if (aiUserId) {
                    // Append model attribution
                    const finalContent = `${answerContent}\n\n*Answered by AI (${modelUsed})*`;

                    const { error: insertError } = await supabase
                        .from('answers')
                        .insert({
                            question_id: question.id,
                            user_id: aiUserId,
                            content: finalContent,
                            created_at: new Date().toISOString(),
                        });

                    if (insertError) {
                        console.error(`Error inserting answer for question ${question.id}:`, insertError);
                    } else {
                        processedQuestions.push(question.id);
                    }
                } else {
                    console.error('No user found to attribute AI answer to.');
                }
            }
        }

        return NextResponse.json({
            message: 'Auto-response check completed.',
            processedCount: processedQuestions.length,
            processedQuestionIds: processedQuestions,
        });

    } catch (error) {
        console.error('Internal server error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
