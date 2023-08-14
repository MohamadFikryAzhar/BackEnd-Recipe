import { sender, transactionalEmailApi } from "../config/emailconfig.js";

const sendToMail = (toMail, subject, text) => {
    const receivers = [{
        email: toMail
    }]
    transactionalEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: subject,
        textContent: text
    }).then(res => console.log(res))
    .catch(err => console.error(err.message));
}

export default sendToMail;