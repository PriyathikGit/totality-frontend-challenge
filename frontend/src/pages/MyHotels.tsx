import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import * as apiClient from '../api-client';
import { BsBuilding, BsMap } from 'react-icons/bs';
import { BiHotel, BiMoney, BiStar } from 'react-icons/bi';

const MyHotels = () => {
  const { data: hotelData } = useQuery(
    'fetchMyHotels',
    apiClient.fetchMyHotels,
    {
      onError: () => {},
    }
  );
  if (!hotelData) {
    return <span className="text-xl font-bold">No hotel data found</span>;
  }
  return (
    <div className="space-y-5">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">My hotels</h1>
        <Link
          to="/add-hotel"
          className=" flex bg-blue-600 text-xl font-bold text-white p-2 hover:bg-blue-400 "
        >
          Add Hotels
        </Link>
      </span>
      <div className="flex flex-col">
        {hotelData.map((hotel) => (
          <div className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5">
            <h2 className="text-2xl font-bold">{hotel.name}</h2>
            <h2 className="whitespace-pre-line">{hotel.description}</h2>
            <div className="flex flex-row gap-2 justify-between ">
              <div className="border border-slate-300 rounded-md p-3 flex items-center">
                <BsMap className="mr-1" />
                {hotel.city},{hotel.country}
              </div>
              <div className="border border-slate-300 rounded-md p-3 flex items-center">
                <BsBuilding className="mr-1" />
                {hotel.type}
              </div>
              <div className="border border-slate-300 rounded-md p-3 flex items-center">
                <BiMoney className="mr-1" />${hotel.pricePerNight} per night
              </div>
              <div className="border border-slate-300 rounded-md p-3 flex items-center">
                <BiHotel className="mr-1" />
                {hotel.adultCount} adults, {hotel.childCount} childs
              </div>
              <div className="border border-slate-300 rounded-md p-3 flex items-center">
                <BiStar className="mr-1" />
                {hotel.starRating} stars
              </div>
            </div>
            <span className="flex justify-end">
              <Link
                to={`/edit-hotel${hotel._id}`}
                className=" flex bg-blue-600 text-xl font-bold text-white p-2 hover:bg-blue-400 "
              >
                View Details
              </Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotels;
