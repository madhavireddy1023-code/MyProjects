import EstimatorForm from '../components/EstimatorForm';

export default function Estimator() {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
          Housing Price Estimator
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          Get accurate housing price predictions using our powered model
        </p>
      </div>
      <EstimatorForm />
    </div>
  );
}
