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
      .withMessage('Price per night is required and must be a number'),
    body('facilities')
      .notEmpty()
      .isArray()
      .withMessage('Facilities are required'),
  ],
  upload.array('imageFiles', 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      const imageUrls = await uploadImages(imageFiles);

      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      const hotel = new Hotel(newHotel);
      await hotel.save();

      res.status(201).send(hotel);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Something went wrong' });
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

router.get('/:id', verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: 'Error while fetching hotels' });
  }
});

router.put(
  '/:hotelId',
  verifyToken,
  upload.array('imageFiles'),
  async (req: Request, res: Response) => {
    try {
      const updateHotel: HotelType = req.body;
      updateHotel.lastUpdated = new Date();

      const hotel = await Hotel.findOneAndUpdate(
        { _id: req.params.hotelId, userId: req.userId },
        updateHotel,
        { new: true }
      );
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
      const files = req.files as Express.Multer.File[];
      const updateImagesUrls = await uploadImages(files);
      hotel.imageUrls = [...updateImagesUrls, ...(updateHotel.imageUrls || [])];

      await hotel.save();
      res.status(201).json(hotel);
    } catch (error) {
      res.status(500).json({ message: 'something went wrong' });
    }
  }
);
async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromies = imageFiles.map(async (image) => {
    // converting image into base64 string
    const b64 = Buffer.from(image.buffer).toString('base64');
    let dataURI = 'data:' + image.mimetype + ';base64,' + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  // waiting all promise to get resolved and then saving to the variable
  const imageUrls = await Promise.all(uploadPromies);
  return imageUrls;
}
