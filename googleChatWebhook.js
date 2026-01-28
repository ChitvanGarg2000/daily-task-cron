import axios from 'axios';
import { buildMessage } from './messageFormatter.js';

export const sendToGoogleChat = async (tasks) => {
    try{
        const message = buildMessage(tasks);
        await axios.post(process.env.GOOGLE_CHAT_WEBHOOK_URL, message);
        console.log('✅ Message sent to Google Chat');
    }catch(error){
        console.error('❌ Error:', error.message);
    }
}