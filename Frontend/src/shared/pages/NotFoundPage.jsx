import { Link } from 'react-router-dom';
import './NotFoundPage.css';
import { ROUTES } from '../../app/routes';

const NotFoundPage = () => {
  return (
    <section className="not-found-page">
      <div className="not-found-card">
        <h1>404</h1>
        <h2>Sidan kunde inte hittas</h2>
        <p>Den här sidan finns inte eller har flyttats.</p>
        <Link to={ROUTES.HOME} className="back-home-link">
          Till startsidan
        </Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
