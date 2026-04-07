import './CustomLoader.css';

const CustomLoader = ({ text = 'Laddar...' }) => {
  return (
    <div className="loader-container">
      <div className="loader-spinner"></div>
      <p>{text}</p>
    </div>
  );
};

export default CustomLoader;
