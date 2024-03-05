import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { QueryResult } from 'pg'
import { pool } from '../db.js'
import { v4 as uuidv4 } from 'uuid'

export const pushCart = (req: Request, res: Response) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

	jwt.verify(token, 'secret123', (err: jwt.VerifyErrors | null, decoded: any) => {
		if (err) {
			res.status(400).json({ error: 'Неверный токен' })
		} else {
			if (req.body.act === 'push') {
				pool.query(
					'INSERT INTO carts (id, user_id, product_id, totalcount, product_price, product_img, product_title) VALUES ($1, $2, $3, 1, $4, $5, $6)',
					[
						uuidv4(),
						decoded.id,
						req.body.product,
						Number(req.body.price),
						req.body.imgurl,
						req.body.title,
					],
					(error: Error, results: QueryResult) => {
						if (error) throw error
						res.status(200).json({
							message: 'product has been create',
						})
					},
				)
			}
		}
	})
}

export const updateCart = (req: Request, res: Response) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

	jwt.verify(token, 'secret123', (err: jwt.VerifyErrors | null, decoded: any) => {
		if (err) {
			res.status(400).json({ error: 'Неверный токен' })
		} else {
			if (req.body.act === 'plus') {
				pool.query(
					`UPDATE carts SET totalcount = totalcount + 1 WHERE user_id = $1 AND product_id = $2`,
					[decoded.id, req.body.productid],
					(error: Error, results: QueryResult) => {
						if (error) throw error
						pool.query(
							'SELECT * FROM carts WHERE user_id = $1',
							[decoded.id],
							(error: Error, results: QueryResult) => {
								return res.status(200).json({ results: results.rows })
							},
						)
					},
				)
			}

			if (req.body.act === 'minus') {
				pool.query(
					'UPDATE carts SET totalcount = totalcount - 1 WHERE user_id=$1 AND product_id=$2',
					[decoded.id, req.body.productid],
					(error: Error, results: QueryResult) => {
						if (error) throw error
						pool.query(
							'SELECT * FROM carts WHERE user_id = $1',
							[decoded.id],
							(error: Error, results: QueryResult) => {
								return res.status(200).json({ results: results.rows })
							},
						)
					},
				)
			}
		}
	})
}

export const getProductCart = (req: Request, res: Response) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
	try {
		jwt.verify(token, 'secret123', (err: jwt.VerifyErrors | null, decoded: any) => {
			if (err) {
				res.status(400).json({ error: 'Неверный токен' })
			} else {
				let totalPrice = 0
				pool.query(
					'SELECT * FROM carts WHERE user_id = $1',
					[decoded.id],
					(error: Error, results: QueryResult) => {
						if (error) throw error

						if (results.rows.length) {
							return res.status(200).json({
								value: true,
								results: results.rows,
								totalPrice,
							})
						}
						if (!results.rows.length) {
							return res.json({
								value: false,
								results: results.rows,
							})
						}
					},
				)
			}
		})
	} catch (error) {
		if (error) throw error
	}
}

export const getProductCartById = (req: Request, res: Response) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
	try {
		jwt.verify(token, 'secret123', (err: jwt.VerifyErrors | null, decoded: any) => {
			if (err) {
				res.status(400).json({ error: 'Неверный токен' })
			} else {
				let totalPrice = 0
				pool.query(
					'SELECT * FROM carts WHERE product_id = $1 AND user_id = $2',
					[req.query.product, decoded.id],
					(error: Error, results: QueryResult) => {
						if (error) throw error

						if (results.rows.length) {
							return res.status(200).json({
								value: true,
								results: results.rows,
								totalPrice,
							})
						}
						if (!results.rows.length) {
							return res.json({
								value: false,
								results: results.rows,
							})
						}
					},
				)
			}
		})
	} catch (error) {
		if (error) throw error
	}
}

export const deleteCartById = (req: Request, res: Response) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

	jwt.verify(token, 'secret123', (err: jwt.VerifyErrors | null, decoded: any) => {
		if (err) {
			res.status(400).json({ error: 'Неверный токен' })
		} else {
			pool.query(
				`DELETE FROM carts WHERE user_id = $1 AND product_id = $2`,
				[decoded.id, req.query.product],
				(error: Error, results: QueryResult) => {
					if (error) throw error
					return res.status(200).json({ message: 'product from cart has been deleted' })
				},
			)
		}
	})
}

export const deleteCart = (req: Request, res: Response) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

	jwt.verify(token, 'secret123', (err: jwt.VerifyErrors | null, decoded: any) => {
		if (err) {
			res.status(400).json({ error: 'Неверный токен' })
		} else {
			pool.query(
				`DELETE FROM carts WHERE user_id = $1`,
				[decoded.id],
				(error: Error, results: QueryResult) => {
					if (error) throw error
					return res.status(200).json({ message: 'cart has been cleaned' })
				},
			)
		}
	})
}

export const deleteAllCartById = (req: Request, res: Response) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

	jwt.verify(token, 'secret123', (err: jwt.VerifyErrors | null, decoded: any) => {
		if (err) {
			res.status(400).json({ error: 'Неверный токен' })
		} else {
			pool.query(
				`DELETE FROM carts WHERE user_id = $1`,
				[decoded.id],
				(error: Error, results: QueryResult) => {
					if (error) throw error
					return res.status(200).json({ message: 'all products from cart has been deleted' })
				},
			)
		}
	})
}
