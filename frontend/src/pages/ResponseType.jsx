import React, { useState } from "react";

function ResponseType() {
  const [inputType, setInputType] = useState("");
  const [responseTypeName, setResponseTypeName] = useState("");
  const [responseScale, setResponseScale] = useState("");
  const [options, setOptions] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAddOption = () => {
    setOptions([...options, { index: options.length + 1, value: "" }]);
  };

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index].value = value;
    setOptions(updated);
  };

  const checkIfNameExists = async (name) => {
    const res = await fetch(`http://localhost:8080/api/responseTypes/existsByName?name=${encodeURIComponent(name)}`);
    return res.ok ? await res.json() : false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    const nameExists = await checkIfNameExists(responseTypeName);
    if (nameExists) {
      setErrorMsg("A response type with that name already exists.");
      return;
    }

    const payload = {
      inputType,
      responseTypeName,
      responseScale,
      options: (inputType === "radio" || inputType === "checkbox" || inputType === "number") ? options : []
    };

    const res = await fetch("http://localhost:8080/api/responseTypes/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const msg = await res.text();
    setSuccessMsg(msg);
    setInputType("");
    setResponseTypeName("");
    setResponseScale("");
    setOptions([]);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 shadow rounded text-black">
      <h2 className="text-xl font-bold mb-4">Create Response Type</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Response Type Name</label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            value={responseTypeName}
            onChange={(e) => setResponseTypeName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Input Type</label>
          <select
            className="border p-2 w-full rounded"
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
            required
          >
            <option value="">-- Select --</option>
            <option value="radio">Radio</option>
            <option value="checkbox">Checkbox</option>
            <option value="text">Free Text</option>
            <option value="number">Number Input</option>
          </select>
        </div>

        {(inputType === "radio" || inputType === "checkbox") && (
          <div>
            <label className="block font-medium mb-2">Options</label>
            {options.map((opt, idx) => (
              <input
                key={idx}
                type="text"
                className="border p-2 w-full rounded mb-2"
                placeholder={`Label for option ${idx + 1}`}
                value={opt.value}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
              />
            ))}
            <button
              type="button"
              onClick={handleAddOption}
              className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded"
            >
              + Add Option
            </button>
          </div>
        )}

        {inputType === "number" && (
          <div className="space-y-2">
            <div>
              <label>Minimum Value</label>
              <input
                type="number"
                className="border p-2 w-full rounded"
                onChange={(e) => handleOptionChange(0, e.target.value)}
              />
            </div>
            <div>
              <label>Maximum Value</label>
              <input
                type="number"
                className="border p-2 w-full rounded"
                onChange={(e) => handleOptionChange(1, e.target.value)}
              />
            </div>
            {options.length === 0 && setOptions([{ index: 1, value: "" }, { index: 2, value: "" }])}
          </div>
        )}

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Create Response Type
        </button>
      </form>

      {errorMsg && <p className="mt-4 text-red-600 font-medium">{errorMsg}</p>}
      {successMsg && <p className="mt-4 text-green-700 font-medium">{successMsg}</p>}
    </div>
  );
}

export default ResponseType;
