import { Request, Response } from 'express'
import { QueryResult } from 'pg'
import { pool } from '../db.js'
import { v4 as uuidv4 } from 'uuid'
import { validationResult } from '../../node_modules/express-validator/src/validation-result.js'

export const getProducts = (req: Request, res: Response) => {
	let sortBy = req.query.sortBy || 'id'
	let order = req.query.order || 'ASC'
	let category = req.query.categoryid !== undefined ? parseInt(req.query.categoryid as string) : 3
	let search = req.query.search || ''
	let page = parseInt(req.query.page as string) || 1
	let limit = parseInt(req.query.limit as string) || 8
	let fromRange = parseInt(req.query.fromRange as string) || 0
	let toRange = parseInt(req.query.toRange as string)
	let selectedRating = req.query.selectedRatingFilter
	let parseSelectedRating = ''
	// console.log(category)

	switch (selectedRating) {
		case '0':
			parseSelectedRating = 'rating >= 4'
			break
		case '1':
			parseSelectedRating = 'rating <= 3'
			break

		default:
			parseSelectedRating = ''
			break
	}

	let queryString = `SELECT * FROM product ${
		!search && category ? `WHERE category=${category}` : ''
	} ${search ? `WHERE title ILIKE ${"'%" + search + "%'"} ` : ''}`

	if (!category && !search) {
		queryString += toRange
			? `WHERE price >= ${fromRange} AND price <= ${toRange} `
			: `WHERE price >= ${fromRange} `

		queryString += parseSelectedRating !== '' ? `AND ${parseSelectedRating} ` : ''
	}

	if (category || search) {
		queryString += toRange
			? `AND price >= ${fromRange} AND price <= ${toRange} `
			: `AND price >= ${fromRange} `

		queryString += Boolean(parseSelectedRating) ? `AND ${parseSelectedRating} ` : ''
	}

	queryString += `ORDER BY ${sortBy} ${order}`

	// console.log('category', category)
	// console.log(queryString)

	pool.query(queryString, (error: Error, results: QueryResult) => {
		if (error) throw error

		let startIndex = (page - 1) * limit
		let endIndex = page * limit
		let paginatedResults = results.rows.slice(startIndex, endIndex)

		console.log(results.rows.length)

		let totalProducts = results.rows.length
		let totalPages = Math.ceil(totalProducts / limit)
		// console.log('totalpages', totalProducts / limit)
		// console.log('totalproducts', results.rows)
		// console.log('limit', limit)

		console.log(totalPages)

		res.json({
			products: paginatedResults,
			totalPages: totalPages,
		})
	})
}

export const getProductById = (req: Request, res: Response) => {
	pool.query(
		'SELECT * FROM product WHERE id = $1',
		[req.params.id],
		(error: Error, results: QueryResult) => {
			if (error) throw error
			res.status(200).json(results.rows)
		},
	)
}

export const createProduct = (req: Request, res: Response) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}

		pool.query(
			'INSERT INTO product (id, title, description, price, category, imgurl, rating, totalcount) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
			[
				uuidv4(),
				req.body.title,
				req.body.description,
				req.body.price,
				req.body.category,
				`http://localhost:8080${req.body.fileimg}`,
				req.body.rating,
				req.body.totalcount,
			],
			(error: Error, results: QueryResult) => {
				if (error) throw error
				res.status(200).json({
					message: 'Продукт был успешно добавлен',
				})
			},
		)
	} catch (error) {
		console.log(error)
	}
}
