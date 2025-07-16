import React, { useState, useEffect } from "react";

function QuestionnaireForm() {
  const [questionnaire, setQuestionnaire] = useState({
    title: "",
    description: "",
    version: "",
    type: "",
    formula: ""
  });

  const [questions, setQuestions] = useState([]);
  const [sections, setSections] = useState([]);
  const [responseTypes, setResponseTypes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/responseTypes")
      .then((res) => res.json())
      .then((data) => {
        setResponseTypes(data);
        console.log("Fetched response types:", data);
      })
      .catch((err) => console.error("Error fetching response types:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionnaire({ ...questionnaire, [name]: value });
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now() + Math.random(),
      text: "",
      order: questions.length + sections.length,
      responseTypeId: null
    };
    setQuestions([...questions, newQuestion]);
  };

  const addSection = () => {
    const newSection = {
      id: Date.now() + Math.random(),
      text: "",
      order: questions.length + sections.length,
      responseTypeId: null
    };
    setSections([...sections, newSection]);
  };

  const handleItemChange = (itemType, id, value) => {
    if (itemType === "section") {
      const updated = sections.map((s) =>
        s.id === id ? { ...s, text: value } : s
      );
      setSections(updated);
    } else if (itemType === "question") {
      const updated = questions.map((q) =>
        q.id === id ? { ...q, text: value } : q
      );
      setQuestions(updated);
    }
  };

  const handleResponseTypeChange = (id, value) => {
    const updated = questions.map((q) =>
      q.id === id ? { ...q, responseTypeId: parseInt(value) } : q
    );
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    // Title existence check
    const response = await fetch(`http://localhost:8080/api/questionnaires/existsByTitle?title=${encodeURIComponent(questionnaire.title)}`);
    const titleExists = await response.json();

    if (titleExists) {
      alert("A questionnaire with this title already exists.");
      return;
    }

    // Combine and sort items by visual order
    const combinedItems = [
      ...questions.map((q) => ({ ...q, type: "question" })),
      ...sections.map((s) => ({ ...s, type: "section" }))
    ].sort((a, b) => a.order - b.order);

    // Assign sequential order and build final payload
    const finalQuestions = [];
    const finalSections = [];

    combinedItems.forEach((item, index) => {
      if (item.type === "question") {
        finalQuestions.push({
          text: item.text,
          questionOrder: index,
          responseTypeId: item.responseTypeId
        });
      } else if (item.type === "section") {
        finalSections.push({
          text: item.text,
          sectionOrder: index
        });
      }
    });

    const payload = {
      ...questionnaire,
      questions: finalQuestions,
      sections: finalSections
    };

    console.log("Submitting:", payload);

    fetch("http://localhost:8080/api/questionnaires", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => res.text())
      .then((msg) => console.log("Backend response:", msg))
      .catch((err) => console.error("Error submitting questionnaire:", err));
  };


  const combinedItems = [
    ...questions.map((q) => ({ ...q, type: "question" })),
    ...sections.map((s) => ({ ...s, type: "section" }))
  ].sort((a, b) => a.order - b.order);

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 mt-8 flex flex-col w-[900px]"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-slate-500">
          Create a Questionnaire
        </h2>

        <div className="mb-4 text-slate-500 flex justify-left">
          <label className="font-semibold mb-1 p-2 w-[100px]">Title:</label>
          <input
            type="text"
            name="title"
            value={questionnaire.title}
            onChange={handleChange}
            required
            className="w-[200px] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4 text-slate-500 flex justify-left">
          <label className="font-semibold mb-1 w-[100px]">Description:</label>
          <textarea
            name="description"
            value={questionnaire.description}
            onChange={handleChange}
            required
            className="w-[500px] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="grid grid-cols-12 mb-4 flex justify-left gap-4 text-slate-500">
          <div className="flex col-span-12">
            <label className="font-semibold mb-1 w-[100px]">Version:</label>
            <input
              type="text"
              name="version"
              value={questionnaire.version}
              onChange={handleChange}
              className="w-[100px] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex col-span-12">
            <label className="font-semibold mb-1 w-[100px]">Type:</label>
            <input
              type="text"
              name="type"
              value={questionnaire.type}
              onChange={handleChange}
              className="w-[150px] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {/* <div className="flex col-span-12">
            <label className="font-semibold mb-1 w-[100px]">Formula Name:</label>
            <input
              type="text"
              name="formulaName"
              onChange={handleChange}
              className="w-[150px] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div> */}
          <div className="flex col-span-12">
            <label className="font-semibold mb-1 w-[100px]">Formula:</label>
            <input
              type="text"
              name="formula"
              value={questionnaire.formula}
              onChange={handleChange}
              className="w-[150px] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <h3 className="text-xl flex items-center justify-center font-semibold mb-2 text-slate-500">
          Sections & Questions
        </h3>
        <div className="grid grid-cols-12 gap-4">
          {combinedItems.map((item) =>
            item.type === "section" ? (
              <div
                key={item.id}
                className="col-span-12 text-slate-500 p-3 rounded font-black"
              >
                <label className="font-black mb-1">
                  Section {item.order + 1}:
                </label>
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) =>
                    handleItemChange(item.type, item.id, e.target.value)
                  }
                  required
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black"
                />
              </div>
            ) : (
              <React.Fragment key={item.id}>
                <div className="col-span-9 text-slate-500 p-3 rounded font-medium">
                  <label className="font-medium mb-1">
                    Question {item.order + 1}:
                  </label>
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) =>
                      handleItemChange(item.type, item.id, e.target.value)
                    }
                    required
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black"
                  />
                </div>
                <div className="col-span-3 text-slate-500 p-3">
                  <label className="font-medium mb-1">Response Type</label>
                  <select
                    className="border rounded p-2 w-full"
                    value={item.responseTypeId || ""}
                    onChange={(e) =>
                      handleResponseTypeChange(item.id, e.target.value)
                    }
                  >
                    {responseTypes.map((type) => (
                      <option
                        key={type.responseTypeId}
                        value={type.responseTypeId}
                      >
                        {type.responseTypeName}
                      </option>
                    ))}
                  </select>
                </div>
              </React.Fragment>
            )
          )}
        </div>

        <div className="flex gap-4 mt-4 justify-center">
          <button
            type="button"
            onClick={addSection}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Add Section
          </button>
          <button
            type="button"
            onClick={addQuestion}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            + Add Question
          </button>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded mt-6 w-[300px] hover:bg-indigo-700"
          >
            Submit Questionnaire
          </button>
        </div>
      </form>
    </div>
  );
}

export default QuestionnaireForm;
