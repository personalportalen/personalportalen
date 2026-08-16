import { usePopup } from './PopupContext';
import './ContactPopup.css';
import { ArrowRight, X } from 'lucide-react';
import profilePhoto from '../../assets/profile_photo.jpg';
import smallProfilePhoto from '../../assets/profile_small.jpg';

const GlobalPopup = () => {
  const { isOpen, closePopup } = usePopup();

  return (
    <div className={`popup ${isOpen ? 'popup-visible' : ''}`}>
      <button type="button" onClick={closePopup} aria-label="Stäng">
        <X />
      </button>
      <h2>Hej!</h2>
      <div className="popup-image">
        <img src={smallProfilePhoto} />
      </div>
      <h1>Va roligt att du hittat hit!</h1>
      <p>
        Vill du höra mer om projektet? Isåfall hörs jag jättegärna över telefon
        eller mail. Du når mig på:{' '}
      </p>
      <div className="contact-information">
        <p>076-394 12 12 </p>
        <p>rasmus.waleij@gmail.com</p>
        <a href="www.linkedin.com/in/rasmus-waleij-4791a7128">
          LinkedIn <ArrowRight className="arrow-right" />
        </a>
        <a href="https://github.com/personalportalen/personalportalen">
          GitHub
          <ArrowRight className="arrow-right" />
        </a>
      </div>
    </div>
  );
};

export default GlobalPopup;
