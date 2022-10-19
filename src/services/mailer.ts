import sendGrid from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config()
const sendgrid_api_key = "";
console.log(sendgrid_api_key)
sendGrid.setApiKey(sendgrid_api_key!);

export default async function sendMail(data: {link: string, email: string}) {
    return sendGrid.send({
        from: "hosam98j@gmail.com",
        to: data.email,
        text: data.link,
        subject: "e-com-app reset password",
        html: `<div style="border: 1px solid gray; padding: 5px; border-radius: 5px">
                    <h1>Resturant App Email Verification</h1>
                    <p>Your veriecation code is ${data.link}</p>
                <div/>`
    })
}