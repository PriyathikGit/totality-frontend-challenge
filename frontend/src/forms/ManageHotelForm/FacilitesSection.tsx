import { useFormContext } from 'react-hook-form';
import { HotelFacilites } from '../../config/hotel-type-option';
import { HotelformData } from './ManageHotelForm';

const FacilitesSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelformData>();
  return (
    <div>
      <h2 className="text-2xl font-bold">Facilites</h2>
      <div className="grid grid-cols-5 gap-3 my-3">
        {HotelFacilites.map((facilities)  => {
          return (
            <label className="text-sm flex gap-1 text-gray-700">
              <input
                type="checkbox"
                value={facilities}
                {...register('facilities', {
                  validate: (facilities) => {
                    if (facilities && facilities.length > 0) {
                      return true;
                    } else {
                      return 'Atleast one facilites is required';
                    }
                  },
                })}
              />
              {facilities}
            </label>
          );
        })}
      </div>
      {errors.facilities && (
        <span className="text-red-500 text-sm font-bold">
          {errors.facilities.message}
        </span>
      )}
    </div>
  );
};

export default FacilitesSection;
