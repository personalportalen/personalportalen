import React from 'react';
import './SmallScreenPage.css';

const SmallScreenPage = () => {
  return (
    <div className="ssp__container">
      <div>
        <h1>Desktop only</h1>
        <p>
          Den här portfolion är för närvarande optimerad för större skärmar.
        </p>
        <p>
          Projektet är byggt för att demonstrera <strong>fullstack .NET</strong>
          ,<strong> microservices</strong>, <strong>React</strong> och
          <strong> DevSecOps</strong> — inte responsiv design i nuläget.
        </p>
        <p>Öppna gärna sidan på laptop eller desktop för bästa upplevelse.</p>
      </div>
    </div>
  );
};

export default SmallScreenPage;
