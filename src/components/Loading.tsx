import React from 'react';

const Loading: React.FC = () => {
  return (
    <div style={containerStyle}>
      <div style={loaderStyle}></div>
    </div>
  );
};

// Define the styles with correct TypeScript types
const containerStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  zIndex: 1000,
};

const loaderStyle: React.CSSProperties = {
  width: '50px',
  height: '50px',
  border: '8px solid #f3f3f3',
  borderRadius: '50%',
  borderTop: '8px solid #3498db',
  animation: 'spin 2s linear infinite',
};

// Adding keyframes for the spinner
const style = document.createElement('style');
style.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default Loading;