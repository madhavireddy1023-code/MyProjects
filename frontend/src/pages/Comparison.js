import { useState } from 'react';

export default function Comparison() {
  const [properties, setProperties] = useState([]);
  const [currentForm, setCurrentForm] = useState({
    square_footage: '',
    bedrooms: '',
    bathrooms: '',
    year_built: '',
    lot_size: '',
    distance_to_city_center: '',
    school_rating: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentForm({ ...currentForm, [name]: value });
  };

  const addProperty = async () => {
    if (!currentForm.name.trim()) {
      alert('Please enter a property name');
      return;
    }

    // Check if all required fields are filled
    const requiredFields = ['square_footage', 'bedrooms', 'bathrooms', 'year_built', 'lot_size', 'distance_to_city_center', 'school_rating'];
    const missingFields = requiredFields.filter(field => !currentForm[field] || currentForm[field] === '');
    
    if (missingFields.length > 0) {
      alert(`Please fill in all fields: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        square_footage: Number(currentForm.square_footage),
        bedrooms: Number(currentForm.bedrooms),
        bathrooms: Number(currentForm.bathrooms),
        year_built: Number(currentForm.year_built),
        lot_size: Number(currentForm.lot_size),
        distance_to_city_center: Number(currentForm.distance_to_city_center),
        school_rating: Number(currentForm.school_rating)
      };

      const res = await fetch('http://127.0.0.1:8000/predict/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await res.json();

      if (data.predictions) {
        const newProperty = {
          name: currentForm.name.trim(),
          square_footage: requestData.square_footage,
          bedrooms: requestData.bedrooms,
          bathrooms: requestData.bathrooms,
          year_built: requestData.year_built,
          lot_size: requestData.lot_size,
          distance_to_city_center: requestData.distance_to_city_center,
          school_rating: requestData.school_rating,
          predictedPrice: data.predictions[0],
          id: Date.now()
        };
        
        console.log('Adding property:', newProperty); // Debug log
        setProperties(prev => [...prev, newProperty]);
        setCurrentForm({
          square_footage: '',
          bedrooms: '',
          bathrooms: '',
          year_built: '',
          lot_size: '',
          distance_to_city_center: '',
          school_rating: '',
          name: ''
        });
      } else {
        alert(data.error || 'An error occurred');
      }
    } catch (err) {
      alert('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const removeProperty = (id) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const getPriceRange = () => {
    if (properties.length === 0) return null;
    const prices = properties.map(p => p.predictedPrice);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: prices.reduce((a, b) => a + b, 0) / prices.length
    };
  };

  const priceRange = getPriceRange();

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
          Property Comparison
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          Compare multiple properties side-by-side
        </p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
          Add Property
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
              Property Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g., My Dream Home"
              value={currentForm.name}
              onChange={handleChange}
              className="form-group input"
            />
          </div>
          {[
            { name: 'square_footage', label: 'Sq Ft', placeholder: 'Enter square footage' },
            { name: 'bedrooms', label: 'Bed roos', placeholder: 'Enter number of bedrooms' },
            { name: 'bathrooms', label: 'Bath rooms', placeholder: 'Enter number of bathrooms' },
            { name: 'year_built', label: 'Year', placeholder: 'Enter year built' },
            { name: 'lot_size', label: 'Lot Size', placeholder: 'Enter lot size' },
            { name: 'distance_to_city_center', label: 'Distance', placeholder: 'Enter distance to city center' },
            { name: 'school_rating', label: 'School', placeholder: 'Enter school rating' }
          ].map(field => (
            <div key={field.name} className="form-group">
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                {field.label}
              </label>
              <input
                type="number"
                name={field.name}
                placeholder={field.placeholder}
                value={currentForm[field.name]}
                onChange={handleChange}
                className="form-group input"
              />
            </div>
          ))}
        </div>

        <button 
          onClick={addProperty} 
          className="btn btn-primary"
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Adding...' : 'Add Property'}
        </button>
      </div>

      {properties.length > 0 && (
        <div className="card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
            Property Comparison ({properties.length} properties)
          </h2>

          {priceRange && (
            <div style={{ backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Price Summary</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Lowest:</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#dc2626' }}>
                    ${priceRange.min.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Average:</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb' }}>
                    ${priceRange.avg.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Highest:</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#16a34a' }}>
                    ${priceRange.max.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Property</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Sq Ft</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Beds</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Baths</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Year</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Distance</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>School</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Price</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(property => (
                  <tr key={property.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>{property.name || 'N/A'}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>{property.square_footage || 'N/A'}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>{property.bedrooms || 'N/A'}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>{property.bathrooms || 'N/A'}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>{property.year_built || 'N/A'}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>{property.distance_to_city_center || 'N/A'}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>{property.school_rating || 'N/A'}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', color: '#16a34a' }}>
                      ${property.predictedPrice ? property.predictedPrice.toLocaleString() : 'N/A'}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <button 
                        onClick={() => removeProperty(property.id)}
                        style={{ 
                          backgroundColor: '#dc2626', 
                          color: 'white', 
                          border: 'none', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Price Comparison Chart */}
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Price Comparison</h3>
            <div style={{ height: '300px', display: 'flex', alignItems: 'end', gap: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              {properties.map(property => {
                const maxPrice = Math.max(...properties.map(p => p.predictedPrice));
                const height = (property.predictedPrice / maxPrice) * 200;
                
                return (
                  <div key={property.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div 
                      style={{ 
                        width: '100%', 
                        height: `${height}px`, 
                        backgroundColor: property.predictedPrice === priceRange.min ? '#dc2626' : 
                                       property.predictedPrice === priceRange.max ? '#16a34a' : '#3b82f6',
                        borderRadius: '4px 4px 0 0',
                        marginBottom: '0.5rem',
                        display: 'flex',
                        alignItems: 'end',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        padding: '0.25rem'
                      }}
                    >
                      k
                    </div>
                    <span style={{ fontSize: '0.75rem', textAlign: 'center', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {property.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
