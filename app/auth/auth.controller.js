import { hash, verify } from 'argon2'
import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'
import { userFields } from '../utils/user.utils.js'

import { generateToken } from './generate-token.js'

export const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body
	const user = await prisma.user.findUnique({
		where: {
			email
		}
	})

	const isValidPassword = await verify(user.password, password)
	if (user && isValidPassword) {
		const token = generateToken(user.id)
		res.json({
			user,
			token
		})
	} else {
		res.status(401)
		throw new Error('Invalid email or password')
	}

	res.json({
		user
	})
})

export const registerUser = asyncHandler(async (req, res) => {
	const { email, password, login } = req.body
	const isUserExist = await prisma.user.findUnique({
		where: {
			email
		}
	})
	if (isUserExist) {
		res.status(400)
		throw new Error('User already exists')
	}
	const user = await prisma.user.create({
		data: {
			email,
			login,
			password: await hash(password)
		},
		select: userFields
	})
	const token = generateToken(user.id)
	res.json({ user, token })
})
