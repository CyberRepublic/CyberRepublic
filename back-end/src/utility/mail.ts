import * as _ from 'lodash'
import * as nodemailer from 'nodemailer'

export default {
  async send(options) {
    try {
      const { to, toName, subject, body } = options
      const data = {
        from: 'Cyber Republic - Elastos <no-reply@cyberrepublic.org>',
        to: _.isArray(to) ? to : `${toName} <${to}>`,
        subject: subject,
        html: body
      }
      console.log('Debug - Sending Mail:', data)

      //   if (process.env.NODE_ENV === 'dev') {
      //     console.log('Debug - Sending Mail:', data)
      //   }

      // create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.NODEMAILER_USER, // generated ethereal user
          pass: process.env.NODEMAILER_PASS // generated ethereal password
        }
      })

      // send mail with defined transport object
      await transporter.sendMail(data)
    } catch (err) {
      console.log('nodemiler sending email err...', err)
    }
  }
}
