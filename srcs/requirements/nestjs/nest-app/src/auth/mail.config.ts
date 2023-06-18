export const MailConfig = {
	transport: {
	  host: 'smtp.gmail.com',
	  port: 587,
	  auth: {
		user: process.env.FT_MAIL,
		pass: process.env.FT_MAIL_SECRET,
	  },
	},
}