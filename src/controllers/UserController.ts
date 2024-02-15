import { Request, Response } from 'express'
import { QueryResult } from 'pg'
import { pool } from '../db.js'
import { validationResult } from '../../node_modules/express-validator/src/validation-result.js'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'

export const loginUser = async (req: Request, res: Response) => {
	try {
		let passwordByEmail: QueryResult = {
			command: 'SELECT',
			rowCount: 0,
			oid: 0,
			fields: [],
			rows: [],
		}

		if (req.path == '/auth/login') {
			passwordByEmail = await pool.query('SELECT id, password FROM users WHERE email = $1', [
				req.body.email,
			])
		} else {
			res.status(400)
		}
		if (req.path == '/auth/admin') {
			passwordByEmail = await pool.query(
				'SELECT id, password FROM users WHERE email = $1 AND access = true',
				[req.body.email],
			)
		} else {
			res.status(400)
		}

		const isValidPass = await bcrypt.compare(
			req.body.password,
			passwordByEmail.rows.length > 0 ? passwordByEmail.rows[0].password : '',
		)

		if (!isValidPass) {
			return res.json({
				message: 'Неверный логин или пароль',
			})
		}

		const token = jwt.sign(
			{
				id: passwordByEmail.rows[0].id,
				email: req.body.email,
			},
			'secret123',
			{
				expiresIn: '30d',
			},
		)

		res.status(200).json({
			success: true,
			token,
			email: req.body.email,
		})
	} catch (error) {
		if (error) throw error
	}
}

export const createUser = async (req: Request, res: Response) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(403).json({ error: errors.array() })
		}

		const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [req.body.email])
		if (existingUser.rows.length > 0) {
			return res
				.status(400)
				.json({ success: false, message: 'Пользователь с таким именем уже существует' })
		}

		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const passwordHash = await bcrypt.hash(password, salt)

		const id = uuidv4()

		pool.query(
			'INSERT INTO users (id, name_user, fname_user, oname_user, password, phone_number, email, access) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);',
			[
				id,
				req.body.name,
				req.body.fname,
				req.body.oname,
				passwordHash,
				req.body.phone,
				req.body.email,
				false,
			],
			(error: Error, results: QueryResult) => {
				if (error) throw error
			},
		)

		const token = jwt.sign(
			{
				id,
				email: req.body.email,
			},
			'secret123',
			{
				expiresIn: '30d',
			},
		)

		res.status(200).json({
			success: true,
			token,
			email: req.body.email,
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Не удалось зарегистрироваться',
		})
	}
}

export const getMe = async (req: Request, res: Response) => {
	try {
		const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

		jwt.verify(token, 'secret123', (err: jwt.VerifyErrors | null, decoded: any) => {
			if (err) {
				res.json({ error: 'Неверный токен' })
			} else {
				return res.status(200).json({
					decoded,
				})
			}
		})
	} catch (error) {
		res.status(403).json({
			message: 'Нет доступа',
		})
	}
}

// export const getMeAdmin = async (req: Request, res: Response) => {
// 	try {
// 		const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

// 		jwt.verify(token, 'secret123', (err: jwt.VerifyErrors | null, decoded: any) => {
// 			if (err) {
// 				res.json({ error: 'Неверный токен' })
// 			} else {
// 				pool.query('SELECT FROM users WHERE id = $1 AND access = true', [decoded.id], () => {
// 					res.status(200).json({
// 						success: true,
// 						decoded,
// 					})
// 				})
// 			}
// 		})
// 	} catch (error) {
// 		res.status(400).json({
// 			message: 'Нет доступа',
// 		})
// 	}
// }

export const deleteMe = async (req: Request, res: Response) => {
	try {
		const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

		jwt.verify(token, 'secret123', (err: jwt.VerifyErrors | null, decoded: any) => {
			if (err) {
				res.status(401).json({ error: 'Неверный токен' })
			} else {
				pool.query(
					'DELETE FROM users WHERE id=$1',
					[decoded.id],
					(error: Error, results: QueryResult) => {
						if (error) throw error
					},
				)
			}
			res.json({
				access: true,
			})
		})
	} catch (error) {
		res.status(403).json({
			message: 'Нет доступа',
		})
	}
}
