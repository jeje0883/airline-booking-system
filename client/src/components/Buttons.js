import React from 'react';
import { useNavigate } from 'react-router-dom';
import searchIcon from '../assets/searchicon.png';
import '../styles/buttons.css';

// BaseButton component for common button styles
function BaseButton({ className, onClick, type = "button", disabled = false, children }) {
  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function SearchFlightButton({ link, type = "button" }) {
  const navigate = useNavigate();
  const handleNavigation = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <BaseButton className="search-flight-button-link" onClick={handleNavigation} type={type}>
      <div className="search-flight-button-container">
        <span className="search-flight-button-text">Search Flights</span>
        <img className="search-flight-button-icon" src={searchIcon} alt="flight search" />
      </div>
    </BaseButton>
  );
}

function ContinueButton({ onClick = () => {}, link, type = "button", disabled = false }) {
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (link) {
      navigate(link);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    handleNavigation();
  };

  return (
    <BaseButton className="continue-button-link" onClick={handleClick} type={type} disabled={disabled}>
      <div className="continue-button-container">
        <span className="continue-button-text">CONTINUE</span>
      </div>
    </BaseButton>
  );
}

function BackButton({ link, type = "button" }) {
  const navigate = useNavigate();
  const handleNavigation = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <BaseButton className="back-button-link" onClick={handleNavigation} type={type}>
      <div className="back-button-container">
        <span className="back-button-text">BACK</span>
      </div>
    </BaseButton>
  );
}

function SelectButton({ isSelected, onClick, type = "button", disabled = false }) {
  return (
    <BaseButton 
      className={`select-button ${isSelected ? 'selected' : ''}`} 
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      <span className="select-button-text">{isSelected ? 'SELECTED' : 'SELECT'}</span>
    </BaseButton>
  );
}

function SubmitButton({ type = "submit", onClick, disabled = false }) {
  return (
    <BaseButton className="submit-button-link" type={type} onClick={onClick} disabled={disabled}>
      <div className="submit-button-container">
        <span className="submit-button-text">Submit</span>
      </div>
    </BaseButton>
  );
}

function PayButton({ type = "submit", onClick, disabled = false }) {
  return (
    <BaseButton className="submit-button-link" type={type} onClick={onClick} disabled={disabled}>
      <div className="submit-button-container">
        <span className="submit-button-text">Proceed to payment</span>
      </div>
    </BaseButton>
  );
}

export default SearchFlightButton;
export { ContinueButton, BackButton, SelectButton, SubmitButton, PayButton };
