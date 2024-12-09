import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import {getMessaging} from 'firebase-admin/messaging'
import serviceAccount from '../keys.json';

export async function POST(request) {

    const { message } = await request.json();

    if(getApps().length == 0) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }

    const data = {
        data: {
            message: message
        },
        topic:'notification'
    }

    try {
        const response = await getMessaging().send(data)
        return new Response(`Successfully sent message: ${response}`)
    } catch(error){
        return new Response(`Error sending message: ${error}`)
    }

}