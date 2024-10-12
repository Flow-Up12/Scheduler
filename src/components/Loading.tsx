// components/Loading.jsx

const Loading = () => {
  return (
    <div style={styles.container}>
      <div style={styles.loader}></div>
    </div>
  );
};

const styles = {
  container: {
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
  },
  loader: {
    width: '50px',
    height: '50px',
    border: '8px solid #f3f3f3',
    borderRadius: '50%',
    borderTop: '8px solid #3498db',
    animation: 'spin 2s linear infinite',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};

export default Loading;