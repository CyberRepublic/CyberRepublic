import * as _ from 'lodash'
import * as nodemailer from 'nodemailer'

export default {
  async send(options) {
    const { to, toName, subject, body } = options

    const data = {
      from: 'Cyber Republic - Elastos <no-reply@cyberrepublic.org>',
      to: _.isArray(to) ? to : `${toName} <${to}>`,
      subject: subject,
      html: body
    }

    if (process.env.NODE_ENV === 'dev') {
      console.log('Debug - Sending Mail:', data)
    }

    let testAccount = await nodemailer.createTestAccount()

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass // generated ethereal password
      }
    })

    // send mail with defined transport object
    const info = await transporter.sendMail(data)

    console.log('Message sent: %s', info.messageId)
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  }
}
