import { useState } from 'react';

export default function EstimatorForm() {
  const [form, setForm] = useState({
    square_footage: '',
    bedrooms: '',
    bathrooms: '',
    year_built: '',
    lot_size: '',
    distance_to_city_center: '',
    school_rating: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const validateForm = () => {
    const errors = {};
    
    if (!form.square_footage || form.square_footage < 100) {
      errors.square_footage = 'Square footage must be at least 100';
    }
    if (!form.bedrooms || form.bedrooms < 1 || form.bedrooms > 10) {
      errors.bedrooms = 'Bedrooms must be between 1 and 10';
    }
    if (!form.bathrooms || form.bathrooms < 1 || form.bathrooms > 8) {
      errors.bathrooms = 'Bathrooms must be between 1 and 8';
    }
    if (!form.year_built || form.year_built < 1800 || form.year_built > new Date().getFullYear()) {
      errors.year_built = 'Year built must be between 1800 and current year';
    }
    if (!form.lot_size || form.lot_size < 0) {
      errors.lot_size = 'Lot size cannot be negative';
    }
    if (!form.distance_to_city_center || form.distance_to_city_center < 0) {
      errors.distance_to_city_center = 'Distance cannot be negative';
    }
    if (!form.school_rating || form.school_rating < 1 || form.school_rating > 10) {
      errors.school_rating = 'School rating must be between 1 and 10';
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError(null);
  };

  const predict = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError('Please fix the validation errors');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('http://127.0.0.1:8000/predict/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          square_footage: Number(form.square_footage),
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          year_built: Number(form.year_built),
          lot_size: Number(form.lot_size),
          distance_to_city_center: Number(form.distance_to_city_center),
          school_rating: Number(form.school_rating)
        }),
      });

      const data = await res.json();

      if (data.predictions) {
        const prediction = data.predictions[0];
        const newResult = {
          ...form,
          predictedPrice: prediction,
          timestamp: new Date().toISOString(),
          id: Date.now()
        };
        
        setResult(newResult);
        setHistory(prev => [newResult, ...prev.slice(0, 9)]); // Keep last 10
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    predict();
  };

  const handleReset = () => {
    setForm({
      square_footage: '',
      bedrooms: '',
      bathrooms: '',
      year_built: '',
      lot_size: '',
      distance_to_city_center: '',
      school_rating: ''
    });
    setResult(null);
    setError(null);
  };

  const loadFromHistory = (item) => {
    setForm({
      square_footage: item.square_footage,
      bedrooms: item.bedrooms,
      bathrooms: item.bathrooms,
      year_built: item.year_built,
      lot_size: item.lot_size,
      distance_to_city_center: item.distance_to_city_center,
      school_rating: item.school_rating
    });
    setResult(item);
  };

  return (
    <div className="card">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
        Property Details
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {[
            { name: 'square_footage', label: 'Square Footage', placeholder: 'Enter square footage', type: 'number', min: '100' },
            { name: 'bedrooms', label: 'Bedrooms', placeholder: 'Number of bedrooms', type: 'number', min: '1', max: '10' },
            { name: 'bathrooms', label: 'Bathrooms', placeholder: 'Number of bathrooms', type: 'number', min: '1', max: '8', step: '0.5' },
            { name: 'year_built', label: 'Year Built', placeholder: 'Year the property was built', type: 'number', min: '1800', max: new Date().getFullYear() },
            { name: 'lot_size', label: 'Lot Size (sq ft)', placeholder: 'Size of the lot in square feet', type: 'number', min: '0' },
            { name: 'distance_to_city_center', label: 'Distance to City Center (miles)', placeholder: 'Distance in miles', type: 'number', min: '0', step: '0.1' },
            { name: 'school_rating', label: 'School Rating (1-10)', placeholder: 'School district rating', type: 'number', min: '1', max: '10', step: '0.1' }
          ].map(field => (
            <div key={field.name} className="form-group">
              <label htmlFor={field.name} style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                {field.label} *
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
                className="form-group input"
                required
                min={field.min}
                max={field.max}
                step={field.step}
              />
            </div>
          ))}
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '0.375rem', padding: '1rem', marginTop: '1rem' }}>
            <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>{error}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? (
              <>
                <span className="loading" style={{ marginRight: '0.5rem' }}></span>
                Predicting...
              </>
            ) : (
              'Get Estimate'
            )}
          </button>
          <button type="button" onClick={handleReset} className="btn btn-secondary">
            Reset Form
          </button>
        </div>
      </form>

      {result && (
        <div className="result">
          <h3>Estimated Property Value</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
            {/* Tabular Display */}
            <div>
              <h4 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>Property Details</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {Object.entries(result).filter(([key]) => key !== 'predictedPrice' && key !== 'timestamp' && key !== 'id').map(([key, value]) => (
                    <tr key={key} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem 0', fontWeight: '500', textTransform: 'capitalize' }}>
                        {key.replace(/_/g, ' ')}:
                      </td>
                      <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>{value}</td>
                    </tr>
                  ))}
                  <tr style={{ borderTop: '2px solid #155724', backgroundColor: '#d1fae5' }}>
                    <td style={{ padding: '0.75rem 0', fontWeight: 'bold', fontSize: '1.125rem' }}>Estimated Price:</td>
                    <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 'bold', fontSize: '1.125rem', color: '#155724' }}>
                      ${result.predictedPrice.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Simple Chart */}
            <div>
              <h4 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>Price Breakdown</h4>
              <div style={{ height: '200px', display: 'flex', alignItems: 'end', gap: '0.25rem' }}>
                {[
                  { label: 'Sq Ft', value: (result.square_footage * 150) / 1000, color: '#3b82f6' },
                  { label: 'Beds', value: (result.bedrooms * 10000) / 1000, color: '#10b981' },
                  { label: 'Baths', value: (result.bathrooms * 8000) / 1000, color: '#f59e0b' },
                  { label: 'Year', value: Math.max(0, (result.year_built - 2000) * 500) / 1000, color: '#ef4444' },
                  { label: 'Lot', value: (result.lot_size * 50) / 1000, color: '#8b5cf6' },
                  { label: 'Distance', value: Math.max(0, 100 - (result.distance_to_city_center * 10)), color: '#06b6d4' },
                  { label: 'School', value: (result.school_rating * 7000) / 1000, color: '#84cc16' }
                ].map(item => (
                  <div key={item.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div 
                      style={{ 
                        width: '100%', 
                        height: `${Math.min(150, item.value)}px`, 
                        backgroundColor: item.color,
                        borderRadius: '2px 2px 0 0',
                        marginBottom: '0.25rem'
                      }}
                    ></div>
                    <span style={{ fontSize: '0.75rem', textAlign: 'center' }}>{item.label}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem', textAlign: 'center' }}>
                Approximate contribution to price (in thousands)
              </p>
            </div>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Recent Estimates</h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {history.slice(0, 5).map(item => (
              <div key={item.id} style={{ 
                padding: '0.75rem', 
                border: '1px solid #e5e7eb', 
                borderRadius: '0.375rem',
                cursor: 'pointer',
                backgroundColor: '#f9fafb',
                transition: 'background-color 0.2s'
              }} onClick={() => loadFromHistory(item)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '500' }}>
                     - {item.square_footage} sq ft, {item.bedrooms} bed
                  </span>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
