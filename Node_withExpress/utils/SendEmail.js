const nodemailer=require('nodemailer');
const dotenv=require('dotenv');

dotenv.config();
const sendEmail=async(option)=>{

    console.log(process.env.EMAIL_HOST, process.env.EMAIL_USER, process.env.EMAIL_PORT);
    const transporter=nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    console.log(transporter,"TTTTTT");

    const emailOptions={
        from: 'chevlijay70@gmail.com',
        to: option.email,
        subject: option.subject,
        text: option.message
    }
    console.log(emailOptions,"QEQEQEQE");
    return await transporter.sendMail(emailOptions);
    console.log("AA");
}

module.exports=sendEmail;