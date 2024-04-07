import { useMutation } from 'react-query';
import ManageHotelForm from '../forms/ManageHotelForm/ManageHotelForm';
import { useAppContext } from '../context/AppContext';
import * as apiClient from '../api-client';

const AddHotel = () => {
  const { showToast } = useAppContext();
  const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
    onSuccess: () => {
      showToast({ message: 'Hotel Saved', type: 'SUCCESS' });
    },
    onError: () => {
      showToast({ message: 'Error creating hotel', type: 'ERROR' });
    },
  });
  const handleSave = (HotelformData: FormData) => {
    mutate(HotelformData);
  };
  return <ManageHotelForm onSave={handleSave} isLoading={isLoading} />;
};

export default AddHotel;
