import React, { useState } from 'react';
import Papa from 'papaparse';

export default function DataSubmission() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,           
      skipEmptyLines: true,
      complete: ({ data, errors }) => {
        if (errors.length) {
          setError(errors.map((err) => err.message).join('; '));
        } else {
          setError('');
          setRows(data);
        }
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rows.length) {
      setError('No data parsed from CSV.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // stub endpoint for now; replace with your real URL later
      const res = await fetch('/api/data-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: rows }),
      });
      if (!res.ok) throw new Error(await res.text());
      alert('✅ Sent successfully (stubbed).');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-8 max-w-4xl mx-auto flex-grow">
        <h1 className="text-2xl font-bold mb-4">Data Submission (CSV)</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Upload CSV file</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFile}
              className="border p-2"
              required
            />
          </div>

          {error && <div className="text-red-600">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Submitting…' : 'Submit CSV'}
          </button>
        </form>

        {rows.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Preview ({rows.length} rows)</h2>
            <div className="overflow-x-auto max-h-64 border">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    {Object.keys(rows[0]).map((col) => (
                      <th key={col} className="px-2 py-1">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 5).map((row, i) => (
                    <tr key={i} className={i % 2 ? 'bg-white' : 'bg-gray-50'}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="px-2 py-1 truncate max-w-xs">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length > 5 && <p className="p-2 text-xs text-gray-600">…and {rows.length - 5} more rows</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
