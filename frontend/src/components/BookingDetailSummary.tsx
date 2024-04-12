import { HotelType } from '../../../backend/src/shared/Types';

type Props = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  numberOfNights: number;
  hotel: HotelType;
};

const BookingDetailSummary = ({
  adultCount,
  checkIn,
  checkOut,
  childCount,
  numberOfNights,
  hotel,
}: Props) => {
  return (
    <div className="grid gap-4 border border-slate-300 rounded-lg p-5 h-fit">
      <h2 className="text-xl font-bold">Your Booking Detail</h2>
      <div className="border-b py-2">
        Location:
        <div className="font-bold">{`${hotel.name},${hotel.city},${hotel.country}`}</div>
        <div className="flex justify-between mt-2">
          <div>
            Check-In <div className="font-bold">{checkIn.toDateString()}</div>
          </div>
          <div>
            check-Out <div className="font-bold">{checkOut.toDateString()}</div>
          </div>
        </div>
        <div className="border-b border-t py-2">
          Total Length Stay:
          <div className="font-bold">{numberOfNights} Nights</div>
        </div>
        <div className="border-b border-t py-2">
          Guests:
          <div className="font-bold">
            {adultCount} Adults & {childCount} Children
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailSummary;
