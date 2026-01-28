import { buildMessage } from './messageFormatter.js';

export const sendToGoogleChat = async (tasks) => {
    try{
        const message = buildMessage(tasks);
        const response = await fetch(process.env.GOOGLE_CHAT_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
        if (!response.ok) {
            throw new Error(`Google Chat API error: ${response.statusText}`);
        }
        console.log('✅ Message sent to Google Chat');
    }catch(error){
        console.error('❌ Error:', error.message);
    }
}