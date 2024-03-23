import { Request, Response } from 'express'
import { QueryResult } from 'pg'
import { pool } from '../db.js'
import { validationResult } from '../../node_modules/express-validator/src/validation-result.js'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import fs from 'fs'

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
			'INSERT INTO users (id, name_user, fname_user, oname_user, password, phone_number, email, access, user_imgurl) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);',
			[
				id,
				req.body.name,
				req.body.fname,
				req.body.oname,
				passwordHash,
				req.body.phone,
				req.body.email,
				false,
				req.body.url,
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

export const getMeInfo = async (req: Request, res: Response) => {
	try {
		const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

		jwt.verify(token, 'secret123', (err: jwt.VerifyErrors | null, decoded: any) => {
			if (err) {
				res.json({ error: 'Неверный токен' })
			} else {
				pool.query(
					'SELECT name_user, fname_user, oname_user, user_imgurl, email, phone_number, access FROM users WHERE id = $1',
					[decoded.id],
					(error: Error, results: QueryResult) => {
						if (error) throw error
						res.json(results.rows[0])
					},
				)
			}
		})
	} catch (error) {
		res.status(403).json({
			message: 'Нет доступа',
		})
	}
}

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

export const updateUser = async (req: Request, res: Response) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(403).json({ error: errors.array() })
		}

		const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

		jwt.verify(token, 'secret123', (err: jwt.VerifyErrors | null, decoded: any) => {
			if (err) {
				res.status(401).json({ error: 'Неверный токен' })
			} else {
				pool.query(
					'UPDATE users SET name_user = $1, fname_user = $2, oname_user = $3, email = $4, phone_number = $5 WHERE id = $6',
					[
						req.body.name,
						req.body.fname,
						req.body.oname,
						req.body.email,
						req.body.phone,
						decoded.id,
					],
					(error: Error, results: QueryResult) => {
						if (error) throw error
						res.status(200).json({ message: 'Данные были обновлены успешно!' })
					},
				)
			}
		})
	} catch (error) {
		res.status(403).json({
			message: 'Нет доступа',
		})
	}
}

export const updateUserImg = async (req: Request, res: Response) => {
	try {
		const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

		jwt.verify(token, 'secret123', (err: jwt.VerifyErrors | null, decoded: any) => {
			if (err) {
				res.status(401).json({ error: 'Неверный токен' })
			} else {
				pool.query(
					'UPDATE users SET user_imgurl = $1 WHERE id=$2',
					[req.body.img, decoded.id],
					(error: Error, results: QueryResult) => {
						if (error) throw error
						res.status(200).json({ message: 'Аватарка обновилась!' })
					},
				)
			}
		})
	} catch (error) {
		res.status(403).json({
			message: 'Нет доступа',
		})
	}
}

export const updatePasswordUser = async (req: Request, res: Response) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(403).json({ error: errors.array() })
		}

		const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const passwordHash = await bcrypt.hash(password, salt)

		jwt.verify(token, 'secret123', (err: jwt.VerifyErrors | null, decoded: any) => {
			if (err) {
				res.status(401).json({ error: 'Неверный токен' })
			} else {
				pool.query(
					'UPDATE users SET password = $1 WHERE id=$2',
					[passwordHash, decoded.id],
					(error: Error, results: QueryResult) => {
						if (error) throw error
						res.status(200).json({ message: 'Пароль был обновлен успешно!' })
					},
				)
			}
		})
	} catch (error) {
		res.status(403).json({
			message: 'Нет доступа',
		})
	}
}

export const deleteUserImg = (req: Request, res: Response) => {
	try {
		const filePath = `uploads/userIcons/${req.params.filename}`

		const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

		jwt.verify(token, 'secret123', (err: jwt.VerifyErrors | null, decoded: any) => {
			if (err) {
				res.status(401).json({ error: 'Неверный токен' })
			} else {
				pool.query(
					`SELECT user_imgurl FROM users WHERE user_imgurl = $1 AND id <> $2`,
					[req.params.filename, decoded.id],
					(error: Error, results: QueryResult) => {
						if (error) throw error
						if (!results.rows.length) {
							fs.stat(filePath, (err, stats) => {
								if (err) {
									if (err.code === 'ENOENT') {
										return res.status(404).json({ message: 'File not found' })
									} else {
										console.error(err)
										return res.status(500).json({ message: 'Internal server error' })
									}
								}

								fs.unlink(filePath, (err) => {
									if (err) {
										console.error(err)
										return res.status(500).json({ message: 'Error deleting file' })
									}
									return res.json({ message: 'File deleted successfully' })
								})
							})
						} else {
							return res.json({ message: 'Не удалось удалить файл' })
						}
					},
				)
			}
		})
	} catch (error) {
		res.status(403).json({
			message: 'Нет доступа',
		})
	}
}

export const deleteAuthImg = (req: Request, res: Response) => {
	try {
		const filePath = `uploads/userIcons/${req.params.filename}`

		pool.query(
			`SELECT user_imgurl FROM users WHERE user_imgurl ILIKE ${"'%" + filePath + "%'"}`,
			(error: Error, results: QueryResult) => {
				if (error) throw error
				if (!results.rows.length) {
					fs.stat(filePath, (err, stats) => {
						if (err) {
							if (err.code === 'ENOENT') {
								return res.status(404).json({ message: 'File not found' })
							} else {
								console.error(err)
								return res.status(500).json({ message: 'Internal server error' })
							}
						}

						fs.unlink(filePath, (err) => {
							if (err) {
								console.error(err)
								return res.status(500).json({ message: 'Error deleting file' })
							}
							return res.json({ message: 'File deleted successfully' })
						})
					})
				} else {
					return res.status(400).json({ message: 'Не удалось удалить файл' })
				}
			},
		)
	} catch (error) {
		res.status(403).json({
			message: 'Нет доступа',
		})
	}
}
