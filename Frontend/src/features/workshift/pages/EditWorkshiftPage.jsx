import { useParams } from 'react-router-dom';
import EditWorkshiftForm from '../components/EditWorkshiftForm';
import { useEffect, useState } from 'react';
import { getWorkshift } from '../api';

const EditWorkshiftPage = () => {
  const { id } = useParams();
  const [workshift, setWorkshift] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWorkshift(id);
        setWorkshift(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData(id);
  }, []);

  return (
    <div className="standard-form_page">
      <EditWorkshiftForm workshift={workshift} />
    </div>
  );
};

export default EditWorkshiftPage;
