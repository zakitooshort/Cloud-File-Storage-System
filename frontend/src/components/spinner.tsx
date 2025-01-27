const Spinner: React.FC = () => (
    <div style={{ backgroundColor:'#007bff', display: 'inline-block', marginLeft: '10px' }}>
        <div style={{backgroundColor:'#007bff', border: '4px solid #f3f3f3', borderTop: '4px solid #007bff', borderRadius: '50%', width: '20px', height: '20px', animation: 'spin 1s linear infinite' }}></div>
        <style>
            {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}
        </style>
    </div>
);
export default Spinner;