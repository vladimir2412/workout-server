import express from 'express'

import { protect } from '../middleware/auth.middleware.js'

import {
	createNewWorkout,
	deleteWorkout,
	getWorkout,
	getWorkouts,
	updateWorkout
} from './workout.controller.js'

const router = express.Router()
router.route('/').post(protect, createNewWorkout).get(protect, getWorkouts)
router
	.route('/:id')
	.get(protect, getWorkout)
	.put(protect, updateWorkout)
	.delete(protect, deleteWorkout)
export default router
