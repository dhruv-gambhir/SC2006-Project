import express from 'express';
import { addRestaurants, getRestaurants } from '../controllers/restaurant-controller';


const router = express.Router();

router.get('/',getRestaurants);
router.post('/add', addRestaurants);
router.put('restrictions/update',)


export default router;



