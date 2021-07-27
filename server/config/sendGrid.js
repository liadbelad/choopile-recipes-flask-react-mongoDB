require("dotenv").config()
const sgMail = require("@sendgrid/mail")
sgMail.setApiKey(process.env.SEND_GRID_API_KEY)

const generateEmailMessage = (token) => {
  return {
    from: "liadb13@gmail.com",
    to: "liadb13@gmail.com",
    subject: "אשר את המשתמש שלך ב-CHOOPILE",
    html: `<html>
      
        <head>
          
          <link rel="stylesheet" href="/stylesheets/style.css">
        </head>
        
        <body style=' font-family: Arial, Helvetica, 
          sans-serif;'>
          <div style='text-align: center;'>
            <h3>קישור לאישור מייל</h3>
            <a style="font-size: 16px;
          letter-spacing: 2px;
          font-weight: 400 !important;
          background-color: rgb(239, 66, 41);
          color: #fff;
          padding: 23px 50px;
          margin: auto;
          border-radius:24px;
          text-align: center;
          display: inline-block !important;
          text-decoration: none;
          border: 0px;
          width: max-content;
          cursor: pointer;
          transition: all 0.3s 0s ease-in-out; " href=http://localhost:3000/verify?${token} target="_blank"> אישור מייל </a>
          </div>
          
        </body>
        
        </html>`,
  }
}

const sendMail = () => {
  sgMail.send(msg, (err, info) => {
    if (err) {
      console.log(`Email not sent`)
    } else {
      console.log(`Email sent success`)
    }
  })
}

module.exports = { sendMail, generateEmailMessage }
