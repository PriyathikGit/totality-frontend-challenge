import { HotelFacilites } from "../config/hotel-type-option";

type Props = {
  selectedFacilityType: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const HotelFacilityType = ({ selectedFacilityType, onChange }: Props) => {
  return (
    <div className="border-b border-slate-300 pb-5">
      <h4 className="mb-2 text-md font-semibold">Facilities</h4>
      {HotelFacilites.map((facility) => (
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="rounded "
            value={facility}
            checked={selectedFacilityType.includes(facility)}
            onChange={onChange}
          />
          <span>{facility}</span>
        </label>
      ))}
    </div>
  );
};

export default HotelFacilityType;
