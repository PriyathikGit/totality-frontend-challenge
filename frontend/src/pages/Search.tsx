import { useQuery } from 'react-query';
import { useSearchContext } from '../context/SearchContext';
import * as apiClient from '../api-client';
import { useState } from 'react';
import SearchResultCard from '../components/SearchResultsCard';
import Pagination from '../components/Pagination';
import StarRating from '../components/StarRatingFilter';
import HotelTypesFilter from '../components/HotelTypesFilter';
import HotelFacilityType from '../components/HotelFacilityType';
import PriceFilter from '../components/PriceFilter';

const Search = () => {
  const search = useSearchContext();
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStar] = useState<string[]>([]);
  const [selectedHotelType, setSelectedHotelType] = useState<string[]>([]);
  const [facilityType, SetFaciltyType] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOption, setSortOption] = useState<string>('');
  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    page: page.toString(),
    stars: selectedStars,
    types: selectedHotelType,
    facilities: facilityType,
    maxPrice: selectedPrice?.toString(),
    sortOption,
  };
  const handleStarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;
    setSelectedStar((prevStar) =>
      event.target.checked
        ? [...prevStar, starRating]
        : prevStar.filter((star) => star !== starRating)
    );
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hotelType = event.target.value;
    setSelectedHotelType((prevHotelType) =>
      event.target.checked
        ? [...prevHotelType, hotelType]
        : prevHotelType.filter((type) => type !== hotelType)
    );
  };
  const handleFaciltyTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const faciltyType = event.target.value;
    SetFaciltyType((prevFacilityType) =>
      event.target.checked
        ? [...prevFacilityType, faciltyType]
        : prevFacilityType.filter((facility) => facility !== faciltyType)
    );
  };
  const { data: HotelData } = useQuery(['searchHotels', searchParams], () =>
    apiClient.searchHotels(searchParams)
  );
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter by:
          </h3>
          <StarRating
            selectedStars={selectedStars}
            onChange={handleStarChange}
          />
          <HotelTypesFilter
            selectedTypeHotels={selectedHotelType}
            onChange={handleTypeChange}
          />
          <HotelFacilityType
            selectedFacilityType={facilityType}
            onChange={handleFaciltyTypeChange}
          />
          <PriceFilter
            selectedPrice={selectedPrice}
            onChange={(value?: number) => setSelectedPrice(value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {HotelData?.pagination.total} Hotels found
            {search.destination ? ` in ${search.destination}` : ''}
          </span>
          <select
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
            className="p-2 border rounded-md "
          >
            <option value="">Sort By</option>
            <option value="starRating">Star Rating</option>
            <option value="pricePerNightAsc">
              Price Per Night (Low to High)
            </option>
            <option value="pricePerNightDesc">
              Price Per Night (HIgh to Low)
            </option>
          </select>
        </div>
        {HotelData?.data.map((hotel) => (
          <SearchResultCard hotel={hotel} />
        ))}
        <div>
          <Pagination
            page={HotelData?.pagination.page || 1}
            pages={HotelData?.pagination.pages || 1}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
