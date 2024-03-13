import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { QueryResult } from 'pg'
import { pool } from '../db.js'
import nodemailer from 'nodemailer'

export const postEmail = (req: Request, res: Response) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

	jwt.verify(token, 'secret123', (err: jwt.VerifyErrors | null, decoded: any) => {
		if (err) {
			res.status(400).json({ error: 'Неверный токен' })
		} else {
			pool.query(
				'SELECT carts.*, users.name_user AS user_name, users.fname_user AS user_fname, users.oname_user AS user_oname FROM carts INNER JOIN users ON carts.user_id = users.id WHERE carts.user_id = $1',
				[decoded.id],
				(error: Error, results: QueryResult) => {
					if (error) throw error

					const promises = results.rows.map((row: any) => {
						return pool.query('SELECT title FROM product WHERE id = $1', [row.product_id])
					})

					Promise.all(promises).then((titlesResults: QueryResult[]) => {
						const titles = titlesResults.map(
							(titleResult: QueryResult) => titleResult.rows[0].title,
						)
						const counts = results.rows
							.map((row: any) => `Продукт ${titles.shift()} Количество ${row.totalcount}`)
							.join(', \n')

						const transporter = nodemailer.createTransport({
							service: 'Gmail',
							auth: {
								user: 'vladsteet96@gmail.com',
								pass: 'pvcmnpmwswvosyja',
							},
						})

						const mailOptions = {
							from: 'vladsteet96@gmail.com',
							to: 'vladsteet96@gmail.com',
							subject: 'Заказ',
							text: `ФИО пользователя: ${results.rows[0].user_name}, ${results.rows[0].user_fname}, ${results.rows[0].user_oname}.\n\n${counts}`,
						}

						transporter.sendMail(mailOptions, function (error: Error, info: any) {
							if (error) {
								console.log(error)
							} else {
								console.log('Email sent: ' + info.response)
							}
						})
						return res.status(200).json({ message: 'email has been posted' })
					})
				},
			)
		}
	})
}
