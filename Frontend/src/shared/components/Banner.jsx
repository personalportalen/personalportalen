import React, { useState } from 'react';
import { X } from 'lucide-react';
import './Banner.css';

const Banner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return <div className="banner-container"></div>;
  }

  return (
    <div className="banner-container">
      <div>
        <p>
          Personalportalen är en demo för portfolioändamål. Ange inte
          personuppgifter eller annan känslig information. Använd istället gärna
          fiktiva uppgifter.
        </p>
        <button
          className="close-button"
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Stäng"
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default Banner;
