import { Router } from 'express'
import { createUser, deleteMe, getMe, loginUser } from './controllers/UserController.js'
import { createProduct, getProductById, getProducts } from './controllers/ProductController.js'
import { registerProductValidator, registerValidator } from './validations.js'
import checkAuth from './utils/checkAuth.js'
import multer from 'multer'
import checkAdmin from './utils/checkAdmin.js'
import {
	deleteAllCartById,
	deleteCart,
	deleteCartById,
	getProductCart,
	getProductCartById,
	pushCart,
	updateCart,
} from './controllers/CartController.js'

const router = Router()

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
})

const upload = multer({ storage })

router.post('/upload', upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file?.originalname}`,
	})
})

router.get('/', getProducts)
router.get('/:id', getProductById)
router.post('/', registerProductValidator, createProduct)

router.post('/cart', checkAuth, pushCart)
router.get('/cart/get', checkAuth, getProductCart)
router.get('/cart/getbyid', checkAuth, getProductCartById)
router.patch('/cart/update', checkAuth, updateCart)
router.delete('/cart/deletebyid', checkAuth, deleteCartById)
router.delete('/cart/deleteallbyid', checkAuth, deleteAllCartById)
router.delete('/cart/delete', checkAuth, deleteCart)

router.get('/auth/adminme', checkAdmin, getMe)

router.get('/auth/me', checkAuth, getMe)
router.post('/auth/reg', registerValidator, createUser)
router.post('/auth/login', registerValidator, loginUser)
router.delete('/auth/delete', checkAuth, deleteMe)

export default router
