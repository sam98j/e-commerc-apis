import sendGrid from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config()
const sendgrid_api_key = process.env.SENDGRID_API_KEY!;
sendGrid.setApiKey(sendgrid_api_key);

export default async function sendMail(data: {link: string, email: string}) {
    return sendGrid.send({
        from: "hosam98j@hotmail.com",
        to: data.email,
        text: data.link,
        subject: "e-com-app reset password",
        html: `<h1 style={color: 'red'}>click the link to complete reset password ${data.link}<h1/>`
    })
}