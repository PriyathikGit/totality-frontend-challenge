import { v2 } from 'cloudinary';
import express, { Request, Response } from 'express';
import multer from 'multer';
import { buffer } from 'stream/consumers';
import cloudinary from 'cloudinary';
import verifyToken from '../middleware/auth';
import { body } from 'express-validator';
import { HotelType } from '../shared/Types';
import Hotel from '../models/Hotel';

const router = express.Router();

// saving images
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 5 * 1024 * 1024, //5mb
  },
});

// making api for adding hotels with images
// imageFIles is array containing images upto 6
router.post(
  '/',
  verifyToken,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('type').notEmpty().withMessage('Hotel type is required'),
    body('pricePerNight')
      .notEmpty()
      .isNumeric()
      .withMessage('price per night is required and must be a number'),
    body('facilities')
      .notEmpty()
      .isArray()
      .withMessage('Facilites are required'),
  ],
  upload.array('imageFiles', 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      // 1. upload images to cloudinary

      //upload images asynchronously thats why waiting
      const uploadPromies = imageFiles.map(async (image) => {
        // converting image into base64 string
        const b64 = Buffer.from(image.buffer).toString('base64');
        let dataURI = 'data:' + image.mimetype + ';base64,' + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
      });

      // waiting all promise to get resolved and then saving to the variable
      const imageUrls = await Promise.all(uploadPromies);
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      //3. save the new hotel in our database
      const hotel = new Hotel(newHotel);
      await hotel.save();

      //4. return a 201 status
      res.status(201).send(hotel);
    } catch (error) {
      console.log('Error creating hotel: ', error);
      res.status(500).json({ message: 'something went wrong' });
    }
  }
);

router.get('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hotels' });
  }
});
export default router;
