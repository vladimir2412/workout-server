import 'colors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'

import { errorHandler, notFound } from './app/middleware/error.middleware.js'

import authRoutes from './app/auth/auth.routes.js'
import { prisma } from './app/prisma.js'
import userRoutes from './app/user/user.routes.js'

dotenv.config()

const app = express()

async function main() {
	if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))
	app.use(express.json())
	app.use('/api/auth', authRoutes)
	app.use('/api/users', userRoutes)

	const PORT = process.env.PORT || 5000
	app.use(notFound)
	app.use(errorHandler)
	app.listen(PORT, console.log(`server running on port ${PORT}`.blue.bold))
}
main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
