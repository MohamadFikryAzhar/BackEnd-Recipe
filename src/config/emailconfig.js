import SibApiV3SDK from 'sib-api-v3-sdk';
import dotenv from 'dotenv';
dotenv.config();

let sibClient = SibApiV3SDK.ApiClient.instance;
const apiKey = sibClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const transactionalEmailApi = new SibApiV3SDK.TransactionalEmailsApi();
const sender = {
    email: 'azharfikry6@gmail.com'
}

export {transactionalEmailApi, sender};