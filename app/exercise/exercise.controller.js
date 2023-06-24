import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'
import { userFields } from '../utils/user.utils.js'

export const createNewExercise = asyncHandler(async (req, res) => {
	const { name, sets, iconPath } = req.body
	const exercise = await prisma.exercise.create({
		data: {
			name,
			sets,
			iconPath
		}
	})
	res.json(exercise)
})
export const getExercises = asyncHandler(async (req, res) => {
	const exercises = await prisma.exercise.findMany()
	res.json(exercises)
})
