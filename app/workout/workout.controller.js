import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'

export const createNewWorkout = asyncHandler(async (req, res) => {
	const { name, exerciseIds } = req.body
	const workout = await prisma.workout.create({
		data: {
			name,
			exercises: {
				connect: exerciseIds.map(id => ({ id: Number(id) }))
			}
		}
	})
	res.json(workout)
})
export const getWorkouts = asyncHandler(async (req, res) => {
	const workouts = await prisma.workout.findMany({
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			exercises: true
		}
	})
	res.json(workouts)
})

export const getWorkout = asyncHandler(async (req, res) => {
	try {
		const workout = await prisma.workout.findUnique({
			where: {
				id: Number(req.params.id)
			},
			include: {
				exercises: true
			}
		})
		const minutes = Math.ceil(workout.exercises.length * 3.7)
		res.json({ ...workout, minutes })
	} catch (err) {
		res.status(404)
		throw new Error('Workout not found')
	}
})

export const updateWorkout = asyncHandler(async (req, res) => {
	const { name, exerciseIds } = req.body
	try {
		const workout = await prisma.workout.update({
			where: {
				id: Number(req.params.id)
			},
			data: {
				name,
				exercises: {
					set: exerciseIds.map(id => ({ id: Number(id) }))
				}
			}
		})
		res.json(workout)
	} catch (err) {
		res.status(404)
		throw new Error('Workout not found')
	}
})

export const deleteWorkout = asyncHandler(async (req, res) => {
	try {
		const workout = await prisma.workout.delete({
			where: {
				id: Number(req.params.id)
			}
		})
		res.json({ message: 'Workout deleted successfully' })
	} catch (err) {
		res.status(404)
		throw new Error('Workout not found')
	}
})
