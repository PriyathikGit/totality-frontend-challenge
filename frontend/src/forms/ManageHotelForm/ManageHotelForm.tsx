import { FormProvider, useForm } from 'react-hook-form';
import DetailSection from './Details';
import TypeSection from './typeSection';
import FacilitesSection from './FacilitesSection';
import GuestSection from './GuestSection';
import ImageSection from './ImageSection';
import { HotelType } from '../../../../backend/src/shared/Types';
import { useEffect } from 'react';

export type HotelformData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  imageUrls : string[];
  adultCount: number;
  childCount: number;
};
type Props = {
  hotel?: HotelType
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
};
const ManageHotelForm = ({ onSave, isLoading, hotel }: Props) => {
  const formMethods = useForm<HotelformData>();
  const { handleSubmit,reset } = formMethods;

  useEffect(()=>{
    reset(hotel)
  },[hotel,reset])

  const onSubmit = handleSubmit((formDataJson: HotelformData) => {
    const formData = new FormData();
    if(hotel){
      formData.append("hotelId",hotel._id)
    }
    formData.append('name', formDataJson.name),
      formData.append('city', formDataJson.city),
      formData.append('country', formDataJson.country),
      formData.append('description', formDataJson.description),
      formData.append('type', formDataJson.type),
      formData.append('pricePerNight', formDataJson.pricePerNight.toString()),
      formData.append('starRating', formDataJson.starRating.toString()),
      formData.append('adultCount', formDataJson.adultCount.toString()),
      formData.append('childCount', formDataJson.childCount.toString()),
      formDataJson.facilities.forEach((facilities, index) => {
        formData.append(`facilities[${index}]`, facilities);
      });
      if(formDataJson.imageUrls){
        formDataJson.imageUrls.forEach((url,index)=>{
          formData.append(`imageUrls[${index}]`,url)
        })
      }
    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append(`imageFiles`, imageFile);
    });

    onSave(formData);
  });
  return (
    <FormProvider {...formMethods}>
      <form className="flex flex-col gap-10" onSubmit={onSubmit}>
        <DetailSection />
        <TypeSection />
        <FacilitesSection />
        <GuestSection />
        <ImageSection />
        <span className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
          >
            {isLoading ? '...Saving' : 'Save'}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;
