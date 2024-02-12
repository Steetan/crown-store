import { Router } from 'express'
import { createUser, deleteMe, getMe, getMeAdmin, loginUser } from './controllers/UserController.js'
import { createProduct, getProductById, getProducts } from './controllers/ProductController.js'
import { registerProductValidator, registerValidator } from './validations.js'
import checkAuth from './utils/checkAuth.js'
import multer from 'multer'
import checkAdmin from './utils/checkAdmin.js'

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

router.get('/auth/adminme', checkAdmin, getMe)

router.get('/auth/me', checkAuth, getMe)
router.post('/auth/reg', registerValidator, createUser)
router.post('/auth/login', registerValidator, loginUser)
router.delete('/auth/delete', checkAuth, deleteMe)

export default router
