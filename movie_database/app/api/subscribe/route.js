import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import {getMessaging} from 'firebase-admin/messaging'
import serviceAccount from '../keys.json';

export async function POST(request) {
    
    const { token, topic } = await request.json();

    if(getApps().length == 0) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }

    try {
        const response = await getMessaging().subscribeToTopic([token], topic);
        console.log('Successfully subscribed to topic:');
        return new Response(`Successfully subscribed to topic`);
    } catch (error) {
        console.log(`Error sending message: ${error}`)
        return new Response(`Error sending message: ${error}`)
    }
}