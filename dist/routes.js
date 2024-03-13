import { Router } from 'express';
import { createUser, deleteAuthImg, deleteMe, deleteUserImg, getMe, getMeInfo, loginUser, updatePasswordUser, updateUser, updateUserImg, } from './controllers/UserController.js';
import { createProduct, deleteFileController, deleteProductById, deleteProducts, getAllProducts, getProductById, getProducts, updateProduct, } from './controllers/ProductController.js';
import { registerProductValidator, registerValidator, updatePasswordValidator, updateValidator, } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import multer from 'multer';
import checkAdmin from './utils/checkAdmin.js';
import { deleteAllCartById, deleteCart, deleteCartById, getProductCart, getProductCartById, pushCart, updateCart, } from './controllers/CartController.js';
import { postEmail } from './controllers/EmailController.js';
const router = Router();
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});
const userIconsStorage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads/userIcons');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });
const uploadUserIcons = multer({ storage: userIconsStorage });
router.post('/upload', upload.single('image'), (req, res) => {
    var _a;
    res.json({
        url: `${(_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname}`,
    });
});
router.post('/upload/user', uploadUserIcons.single('image'), (req, res) => {
    var _a;
    res.json({
        url: `${(_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname}`,
    });
});
router.delete('/upload/delete/:filename', deleteFileController);
router.delete('/upload/user/delete/:filename', deleteUserImg);
router.delete('/upload/auth/delete/:filename', deleteAuthImg);
router.get('/', getProducts);
router.put('/', updateProduct);
router.get('/adminpanel', checkAdmin, getAllProducts);
router.get('/:id', getProductById);
router.post('/', registerProductValidator, createProduct);
router.delete('/', checkAdmin, deleteProducts);
router.delete('/deletebyid', checkAdmin, deleteProductById);
router.post('/cart', checkAuth, pushCart);
router.get('/cart/get', checkAuth, getProductCart);
router.get('/cart/getbyid', checkAuth, getProductCartById);
router.patch('/cart/update', checkAuth, updateCart);
router.delete('/cart/deletebyid', checkAuth, deleteCartById);
router.delete('/cart/deleteallbyid', checkAuth, deleteAllCartById);
router.delete('/cart/delete', checkAuth, deleteCart);
router.get('/auth/adminme', checkAdmin, getMe);
router.patch('/auth/update', checkAuth, updateValidator, updateUser);
router.patch('/auth/updimg', checkAuth, updateUserImg);
router.patch('/auth/updpass', checkAuth, updatePasswordValidator, updatePasswordUser);
router.get('/auth/me', checkAuth, getMe);
router.get('/auth/meinfo', checkAuth, getMeInfo);
router.post('/auth/reg', registerValidator, createUser);
router.post('/auth/login', registerValidator, loginUser);
router.delete('/auth/delete', checkAuth, deleteMe);
router.post('/email', checkAuth, postEmail);
export default router;
