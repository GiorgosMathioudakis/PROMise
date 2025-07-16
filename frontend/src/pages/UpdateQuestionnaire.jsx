import React, { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";

function UpdateQuestionnaire() {
  const [questionnaire, setQuestionnaire] = useState(null);
  const [responseTypes, setResponseTypes] = useState([]);
  const [allQuestionnaires, setAllQuestionnaires] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");


  const titleRef = useRef();
  const descriptionRef = useRef();
  const versionRef = useRef();
  const typeRef = useRef();
  const formulaRef = useRef();
  const formulaNameRef = useRef();

  const questionRefs = useRef({});
  const sectionRefs = useRef({});
  const responseTypeRefs = useRef({});

  const fetchSuggestions = debounce((query) => {
    fetch(`http://localhost:8080/api/questionnaires/search?query=${query}`)
      .then(res => res.json())
      .then(setSuggestions)
      .catch(err => {
        console.error("Error fetching suggestions:", err);
        setSuggestions([]);
      });
  }, 400);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setTitleQuery(query);
    fetchSuggestions(query);
  };

  const handleSuggestionClick = (title) => {
    setTitleQuery(title);
    setSuggestions([]); // Close dropdown after selection
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/questionnaires")
      .then(res => res.json())
      .then(setAllQuestionnaires)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/responseTypes")
      .then(res => res.json())
      .then(setResponseTypes)
      .catch(console.error);
  }, []);



  const fetchQuestionnaire = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8080/api/questionnaires/byTitle?title=${selectedTitle}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setQuestionnaire({
            ...data,
            questions: data.questions.map(q => ({
              ...q,
              id: q.questionId,
              order: q.questionOrder
            })),
            sections: data.sections.map(s => ({
              ...s,
              id: s.sectionId,
              order: s.sectionOrder
            }))
          });
        }
      })
      .catch(console.error);
  };

  const addQuestion = () => {
    const newQuestion = {
      text: "",
      order: questionnaire.questions.length + questionnaire.sections.length,
      responseTypeId: null
    };
    setQuestionnaire(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const addSection = () => {
    const newSection = {
      text: "",
      order: questionnaire.questions.length + questionnaire.sections.length,
    };
    setQuestionnaire(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const newTitle = titleRef.current?.value || "";

    // Only check if title was changed
    if (newTitle !== questionnaire.title) {
      const response = await fetch(
        `http://localhost:8080/api/questionnaires/title-exists-for-other?title=${encodeURIComponent(newTitle)}&idToExclude=${questionnaire.questionnaireId}`
      );
      const existsForOther = await response.json();

      if (existsForOther) {
        alert("A questionnaire with this title already exists.");
        return;
      }
    }

    const combinedItems = [
      ...questionnaire.questions.map(q => ({ ...q, type: "question" })),
      ...questionnaire.sections.map(s => ({ ...s, type: "section" }))
    ].sort((a, b) => a.order - b.order);

    const finalQuestions = [];
    const finalSections = [];

    combinedItems.forEach((item, index) => {
      if (item.type === "question") {
        finalQuestions.push({
          id: item.id < 1_000_000 ? item.id : 0, // id 0 if new
          text: questionRefs.current[item.id]?.current?.value || "",
          questionOrder: index,
          responseTypeId: parseInt(responseTypeRefs.current[item.id]?.current?.value || 0, 10)
        });
      } else {
        finalSections.push({
          id: item.id < 1_000_000 ? item.id : 0,
          text: sectionRefs.current[item.id]?.current?.value || "",
          sectionOrder: index
        });
      }
    });

    const updatedPayload = {
      ...questionnaire,
      title: titleRef.current?.value || "",
      description: descriptionRef.current?.value || "",
      version: versionRef.current?.value || "",
      type: typeRef.current?.value || "",
      formula: formulaRef.current?.value || "",
      questions: finalQuestions,
      sections: finalSections
    };

    fetch("http://localhost:8080/api/questionnaires/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPayload)
    })
      .then(res => res.text())
      .then(msg => alert("Update Success: " + msg))
      .catch(err => console.error("Update error:", err));
  };

  return (
    <div className="p-6 text-black">
      {!questionnaire ? (
        <div>
          <h2 className="text-xl font-bold mb-4 text-slate-700">Select a Questionnaire to Edit</h2>
          <div className="space-y-2 mb-6 max-h-[300px] overflow-y-auto border p-2 rounded">
            {allQuestionnaires.map((q) => (
              <div
                key={q.questionnaireId}
                onClick={() => setSelectedTitle(q.title)}
                className={`cursor-pointer border border-black p-2 rounded ${selectedTitle === q.title ? "bg-indigo-200 font-semibold" : "hover:bg-gray-100"}`}
              >
                {q.title}
              </div>
            ))}
          </div>
          <button
            onClick={fetchQuestionnaire}
            disabled={!selectedTitle}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            Fetch Selected Questionnaire
          </button>
        </div>

      ) : (
        <form onSubmit={handleUpdate} className="text-black bg-white shadow-lg rounded-xl p-8 w-full">
          <h2 className="text-2xl font-bold text-center mb-4 text-slate-500">Update Questionnaire</h2>

          <div className="mb-4 flex flex-wrap gap-4">
            <div className="grid grid-cols-12 mb-4 flex justify-left">
              <div className="mb-4 text-slate-500 flex justify-left col-span-12">
                <label className="font-semibold mb-1 p-2 w-[100px]">Title:</label>
                <input ref={titleRef} defaultValue={questionnaire.title} className="w-[200px] p-2 border rounded" />
              </div>
              <div className="mb-4 text-slate-500 flex justify-left block col-span-12">
                <label className="font-semibold mb-1 w-[100px]">Description:</label>
                <textarea ref={descriptionRef} defaultValue={questionnaire.description} className="w-[500px] p-2 border rounded" />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 text-slate-500">
              <div className="flex col-span-3">
                <label className="font-semibold mb-1 w-[100px]">Version:</label>
                <input ref={versionRef} defaultValue={questionnaire.version} className="w-[100px] p-2 border rounded" />
              </div>
              <div className="flex col-span-12">
                <label className="font-semibold mb-1 w-[100px]">Type:</label>
                <input ref={typeRef} defaultValue={questionnaire.type} className="w-[150px] p-2 border rounded" />
              </div>
              <div className="flex col-span-12">
                <label className="font-semibold mb-1 w-[100px]">Formula Name:</label>
                <input ref={formulaNameRef} defaultValue={""} className="w-[200px] p-2 border rounded" />
              </div>
              <div className="flex col-span-12">w
                <label className="font-semibold mb-1 w-[100px]">Formula:</label>
                <input ref={formulaRef} defaultValue={questionnaire.formula || ""} className="w-[200px] p-2 border rounded" />
              </div>
            </div>
          </div>

          <h3 className="text-xl flex items-center justify-center font-semibold mb-2 text-slate-500">
            Sections & Questions
          </h3>

          <div className="grid grid-cols-12 gap-4">
            {[...questionnaire.questions, ...questionnaire.sections]
              .sort((a, b) => a.order - b.order)
              .map((item, idx) => {
                const isQuestion = item.responseTypeId !== undefined;

                if (!questionRefs.current[item.id] && isQuestion) {
                  questionRefs.current[item.id] = React.createRef();
                  responseTypeRefs.current[item.id] = React.createRef();
                }

                if (!sectionRefs.current[item.id] && !isQuestion) {
                  sectionRefs.current[item.id] = React.createRef();
                }

                return isQuestion ? (
                  <React.Fragment key={`q-${item.id}`}>
                    <div className="col-span-9 text-slate-500 p-3 rounded font-medium">
                      <label className="font-medium mb-1">Question {idx + 1}:</label>
                      <input
                        ref={questionRefs.current[item.id]}
                        defaultValue={item.text}
                        className="w-full p-2 border rounded text-black"
                      />
                    </div>
                    <div className="col-span-3 text-slate-500 p-3">
                      <label className="font-medium mb-1">Response Type</label>
                      <select
                        ref={responseTypeRefs.current[item.id]}
                        defaultValue={item.responseTypeId || ""}
                        className="border rounded p-2 w-full"
                      >
                        {responseTypes.map(rt => (
                          <option key={rt.responseTypeId} value={rt.responseTypeId}>
                            {rt.responseTypeName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </React.Fragment>
                ) : (
                  <div key={`s-${item.id}`} className="col-span-12 text-slate-500 p-3 rounded font-black">
                    <label className="font-black mb-1">Section {idx + 1}:</label>
                    <input
                      ref={sectionRefs.current[item.id]}
                      defaultValue={item.text}
                      className="w-full p-2 border rounded text-black"
                    />
                  </div>
                );
              })}
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

          <div className="flex justify-center mt-6">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
              Update Questionnaire
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default UpdateQuestionnaire;
