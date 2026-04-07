import { useLocation, useParams } from 'react-router-dom';
import EditWorkshiftForm from '../components/EditWorkshiftForm';
import { useEffect, useState } from 'react';
import { getWorkshift } from '../api';

const EditWorkshiftPage = () => {
  const location = useLocation();
  const { id } = useParams();
  const [workshift, setWorkshift] = useState(
    location.state?.initialWorkshift || location.state?.workshift || null,
  );
  const [loading, setLoading] = useState(!workshift);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (workshift) return;

    async function fetchWorkshift() {
      try {
        setLoading(true);
        setError(null);

        const data = await getWorkshift(id);
        setWorkshift(data);
      } catch (err) {
        console.error(err);
        setError('Kunde inte hämta arbetspasset');
      } finally {
        setLoading(false);
      }
    }

    fetchWorkshift();
  }, [id, workshift]);

  if (loading) return <CustomLoader />;
  if (error) return <ErrorMessage title={error} />;
  if (!workshift) return <ErrorMessage title={'Arbetspasset hittades inte'} />;

  return (
    <div className="standard-form_page">
      <EditWorkshiftForm workshift={workshift} />
    </div>
  );
};

export default EditWorkshiftPage;
