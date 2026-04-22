import { useEffect, useState } from 'react';

export default function Analysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/model-info/')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch model information');
        }
        return res.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="loading" style={{ margin: '0 auto 1rem' }}></div>
          <p>Loading model information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h3 style={{ color: '#dc2626', marginBottom: '1rem' }}>Error loading model information</h3>
          <p style={{ color: '#6b7280' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
          Model Analysis
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          Detailed insights into our housing price prediction model
        </p>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'semibold', color: '#1f2937', marginBottom: '0.5rem' }}>
          Model Coefficients
        </h3>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
          Each coefficient represents the impact of the corresponding feature on the predicted price.
        </p>
        <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.375rem' }}>
          <pre style={{ fontSize: '0.875rem', color: '#1f2937', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {JSON.stringify(data.coefficients, null, 2)}
          </pre>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'semibold', color: '#1f2937', marginBottom: '0.5rem' }}>
          Model Intercept
        </h3>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
          The base price when all features are zero.
        </p>
        <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.375rem' }}>
          <pre style={{ fontSize: '0.875rem', color: '#1f2937' }}>
            {data.intercept}
          </pre>
        </div>
      </div>

      {data.performance_metrics && (
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'semibold', color: '#1f2937', marginBottom: '0.5rem' }}>
            Performance Metrics
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            Key metrics evaluating the model's predictive performance.
          </p>
          <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.375rem' }}>
            <pre style={{ fontSize: '0.875rem', color: '#1f2937', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(data.performance_metrics, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
