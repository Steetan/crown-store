import { Router } from 'express';
import { createUser, deleteMe, getMe, getMeInfo, loginUser, updateUser, } from './controllers/UserController.js';
import { createProduct, deleteFileController, deleteProductById, getAllProducts, getProductById, getProducts, } from './controllers/ProductController.js';
import { registerProductValidator, registerValidator } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import multer from 'multer';
import checkAdmin from './utils/checkAdmin.js';
import { deleteAllCartById, deleteCart, deleteCartById, getProductCart, getProductCartById, pushCart, updateCart, } from './controllers/CartController.js';
const router = Router();
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });
router.post('/upload', upload.single('image'), (req, res) => {
    var _a;
    res.json({
        url: `${(_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname}`,
    });
});
router.delete('/upload/delete/:filename', deleteFileController);
router.get('/', getProducts);
router.get('/adminpanel', checkAdmin, getAllProducts);
router.get('/:id', getProductById);
router.post('/', registerProductValidator, createProduct);
router.delete('/deletebyid', checkAdmin, deleteProductById);
router.post('/cart', checkAuth, pushCart);
router.get('/cart/get', checkAuth, getProductCart);
router.get('/cart/getbyid', checkAuth, getProductCartById);
router.patch('/cart/update', checkAuth, updateCart);
router.delete('/cart/deletebyid', checkAuth, deleteCartById);
router.delete('/cart/deleteallbyid', checkAuth, deleteAllCartById);
router.delete('/cart/delete', checkAuth, deleteCart);
router.get('/auth/adminme', checkAdmin, getMe);
router.patch('/auth/update', checkAuth, updateUser);
router.get('/auth/me', checkAuth, getMe);
router.get('/auth/meinfo', checkAuth, getMeInfo);
router.post('/auth/reg', registerValidator, createUser);
router.post('/auth/login', registerValidator, loginUser);
router.delete('/auth/delete', checkAuth, deleteMe);
export default router;
