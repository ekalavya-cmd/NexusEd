import React, { useState } from 'react';
import axios from 'axios';
import { Button, Alert } from 'react-bootstrap';

function TestAPI() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/test`);
      setResult({ success: true, data: response.data });
    } catch (error) {
      setResult({ 
        success: false, 
        error: error.response?.data || error.message,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3">
      <h5>API Test</h5>
      <Button onClick={testAPI} disabled={loading}>
        {loading ? 'Testing...' : 'Test API Connection'}
      </Button>
      
      {result && (
        <Alert 
          variant={result.success ? 'success' : 'danger'} 
          className="mt-3"
        >
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </Alert>
      )}
    </div>
  );
}

export default TestAPI;