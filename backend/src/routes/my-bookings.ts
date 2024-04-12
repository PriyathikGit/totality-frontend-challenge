import express, { Response, Request } from 'express';
import verifyToken from '../middleware/auth';
import Hotel from '../models/Hotel';
import { HotelType } from '../shared/Types';

const router = express.Router();

// /api/my-bookings
router.get('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({
      // finding booking array with the matching userId
      bookings: { $elemMatch: { userId: req.userId } },
    });
    const result = hotels.map((hotel) => {
      // filtering booking for the matching userId
      const userBookings = hotel.bookings.filter(
        (booking) => booking.userId === req.userId
      );
      const hotelWithUserBookings : HotelType={
        ...hotel.toObject(),
        bookings:userBookings
      }
      return hotelWithUserBookings
    });
    res.status(200).send(result)
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'unable to fetch booking' });
  }
});

export default router