import React, { useState } from "react";
import PredictionForm from "../components/Prediction/PredictionForm";
import PredictionResult from "../components/Prediction/PredictionResult";
import UploadPredictForm from "../components/Prediction/UploadPredictionForm";
export default function DiseasePrediction() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-8 max-w-4xl mx-auto flex-grow">
        <h1 className="text-3xl font-bold mb-4">Disease Prediction</h1>
        <p className="mb-8">
          Enter a genetic sequence, choose your model, and see the predicted
          disease along with confidence for each class.
        </p>

        <PredictionForm
          onResult={(res) => {
            setError("");
            setResult(res);
          }}
          onError={(msg) => {
            setResult(null);
            setError(msg);
          }}
        />
        {/* <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Upload and Predict</h1>
          <p className="mb-4">
            Use the form below to upload your sequence data and get predictions.
          </p>
          <UploadPredictForm />
        </div> */}

        {error && (
          <div className="mt-4 text-red-600">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="mt-8">
            <PredictionResult result={result} />
          </div>
        )}
      </div>
    </div>
  );
}
