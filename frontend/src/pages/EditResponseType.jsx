import React, { useState, useEffect } from "react";

function EditResponseType() {
    const [responseTypes, setResponseTypes] = useState([]);
    const [selectedName, setSelectedName] = useState("");
    const [responseType, setResponseType] = useState(null);
    const [options, setOptions] = useState([]);
    const [successMsg, setSuccessMsg] = useState("");

    // Fetch all response types on mount
    useEffect(() => {
        fetch("http://localhost:8080/api/responseTypes")
            .then(res => res.json())
            .then(setResponseTypes)
            .catch(console.error);
    }, []);

    const fetchResponseType = (e) => {
        e.preventDefault();
        if (!selectedName) return;

        fetch(`http://localhost:8080/api/responseTypes/byName?name=${selectedName}`)
            .then(res => res.json())
            .then(data => {
                if (!data) return;
                setResponseType(data);
                setOptions(data.options || []);
                setSuccessMsg("");
            })
            .catch(console.error);
    };

    const handleOptionChange = (id, field, value) => {
        const updated = options.map((opt) =>
            opt.responseOptionId === id
                ? { ...opt, [field]: value }
                : opt
        );
        setOptions(updated);
    };

    const handleNameChange = (e) => {
        setResponseType(prev => ({ ...prev, responseTypeName: e.target.value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const payload = {
            responseTypeId: responseType.id || responseType.responseTypeId,
            responseTypeName: responseType.responseTypeName,
            inputType: responseType.inputType,
            options
        };

        const res = await fetch("http://localhost:8080/api/responseTypes/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const msg = await res.text();
        setSuccessMsg(msg);
    };

    return (
        <div className="p-6 text-black">
            {!responseType ? (
                <div>
                    <h2 className="text-xl font-bold mb-4 text-slate-700">Select a Response Type to Edit</h2>
                    <div className="space-y-2 mb-6 overflow-y-auto border p-2 rounded">
                        {responseTypes.map((rt) => (
                            <div
                                key={rt.responseTypeId}
                                onClick={() => setSelectedName(rt.responseTypeName)}
                                className={`cursor-pointer border border-black p-2 rounded ${selectedName === rt.responseTypeName
                                    ? "bg-indigo-200 font-semibold"
                                    : "hover:bg-gray-100"
                                    }`}
                            >
                                {rt.responseTypeName}
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={fetchResponseType}
                        disabled={!selectedName}
                        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                    >
                        Fetch Selected Response Type
                    </button>
                </div>
            ) : (
                <form onSubmit={handleUpdate} className="text-black bg-white shadow-lg rounded-xl p-8 w-full">
                    <h2 className="text-2xl font-bold text-center mb-4 text-slate-500">Edit Response Type</h2>
                    <div className="mb-4 flex flex-wrap gap-4">
                        <label className="font-semibold mb-1 p-2 w-[200px]">Response Type Name</label>
                        <input
                            type="text"
                            value={responseType.responseTypeName}
                            onChange={handleNameChange}
                            className="border p-2 w-full rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Input Type (not editable)</label>
                        <input
                            type="text"
                            value={responseType.inputType}
                            disabled
                            className="border p-2 w-full rounded bg-gray-100"
                        />
                    </div>

                    {(responseType.inputType === "radio" || responseType.inputType === "checkbox" || responseType.inputType === "number") && (
                        <div>
                            <label className="block font-medium mb-2">Options</label>
                            {[...options]
                                .sort((a, b) => a.option_index - b.option_index)
                                .map((opt) => (
                                    <input
                                        key={opt.responseOptionId}
                                        type="text"
                                        className="border p-2 w-full rounded mb-2"
                                        value={opt.option_value}
                                        onChange={(e) =>
                                            handleOptionChange(opt.responseOptionId, "option_value", e.target.value)
                                        }
                                    />
                                ))}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                    >
                        Update Response Type
                    </button>

                    {successMsg && <p className="text-green-700 font-medium mt-4">{successMsg}</p>}
                </form>
            )}
        </div>
    );
}

export default EditResponseType;
