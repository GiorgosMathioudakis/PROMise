import React, { useState, useEffect } from "react";

function FillQuestionnaire() {
  const [allQuestionnaires, setAllQuestionnaires] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [questionnaire, setQuestionnaire] = useState(null);
  const [responseOptions, setResponseOptions] = useState({});
  const [answers, setAnswers] = useState({});
  const [submitMsg, setSubmitMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/questionnaires")
      .then(res => res.json())
      .then(setAllQuestionnaires)
      .catch(console.error);
  }, []);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitResponses = async () => {
    if (!questionnaire) return;

    const missingQuestions = questionnaire.questions.filter((q) => {
      const ans = answers[q.questionId];
      const inputType = q.responseType?.inputType;

      if (inputType === "text") return !ans || ans.trim() === "";
      if (inputType === "number") {
        const opts = responseOptions[q.responseTypeId] || [];
        const minOpt = opts.find(o => o.index === 1);
        const maxOpt = opts.find(o => o.index === 2);
        const min = minOpt ? parseFloat(minOpt.label) : undefined;
        const max = maxOpt ? parseFloat(maxOpt.label) : undefined;
        const numVal = parseFloat(ans);
        return !ans || isNaN(numVal) || (min !== undefined && numVal < min) || (max !== undefined && numVal > max);
      }
      if (inputType === "radio") return !ans;
      if (inputType === "checkbox") return !ans || ans.length === 0;
      return false;
    });

    if (missingQuestions.length > 0) {
      alert("Please complete all required fields before submitting.");
      return;
    }

    const payload = Object.entries(answers).map(([questionId, answer]) => ({
      questionnaireId: questionnaire.questionnaireId,
      questionId: parseInt(questionId, 10),
      answer: Array.isArray(answer) ? answer.join(", ") : answer,
      patientId: null
    }));

    try {
      const res = await fetch("http://localhost:8080/api/responses/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const msg = await res.text();
      setSubmitMsg(msg);
      setAnswers({});
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitMsg("An error occurred while submitting.");
    }
  };

  const fetchQuestionnaire = () => {
    fetch(`http://localhost:8080/api/questionnaires/byTitle?title=${selectedTitle}`)
      .then(res => res.json())
      .then(data => {
        if (!data) return;

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

        const uniqueTypeIds = [...new Set(data.questions.map(q => q.responseTypeId).filter(Boolean))];

        fetch(`http://localhost:8080/api/responseTypes/options?ids=${uniqueTypeIds.join(",")}`)
          .then(res => res.json())
          .then(optionMap => setResponseOptions(optionMap))
          .catch(console.error);
      })
      .catch(console.error);
  };

  return (
    <div className="text-black">
      {!questionnaire ? (
        <div className="bg-white shadow-lg rounded-xl p-8 mt-8 flex flex-col w-full max-w-xl">
          <h2 className="text-xl font-semibold mb-4 text-slate-700">Select a Questionnaire to Fill</h2>
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
        <form className="text-black bg-white shadow-lg rounded-xl p-8 max-w-screen-lg w-full">
          <div className="border-b mb-6">
            <h2 className="text-2xl font-bold font-serif mb-1">{questionnaire.title}</h2>
            <p className="text-sm text-gray-600 mb-2">(version {questionnaire.version})</p>
            <p className="text-gray-700">{questionnaire.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {[...questionnaire.questions, ...questionnaire.sections]
              .sort((a, b) => a.order - b.order)
              .map((item, idx) => {
                const isQuestion = item.responseTypeId !== undefined;

                if (!isQuestion) {
                  return (
                    <div key={`s-${item.id}`} className="col-span-full p-2">
                      <p className="font-bold text-xl">{item.text}</p>
                    </div>
                  );
                }

                const inputType = item.responseType?.inputType;
                const options = responseOptions[item.responseTypeId] || [];
                const sortedOptions = options.sort((a, b) => a.index - b.index);

                return (
                  <React.Fragment key={`q-${item.id}`}>
                    <div className="md:col-span-7 col-span-full p-2">
                      <div className="flex space-x-2">
                        <span className="font-semibold">{idx + 1}.</span>
                        <p className="break-words">{item.text}</p>
                      </div>
                    </div>

                    <div className="md:col-span-5 col-span-full p-2">
                      {inputType === "radio" && (
                        <div className="flex flex-wrap gap-4">
                          {sortedOptions.map(opt => (
                            <label key={opt.id} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name={`response-${item.id}`}
                                value={opt.label}
                                checked={answers[item.id] === opt.label}
                                onChange={() => handleAnswerChange(item.id, opt.label)}
                                className="appearance-none w-4 h-4 border border-gray-400 rounded-full bg-white checked:bg-black checked:border-black focus:outline-none transition-colors duration-150 ease-in-out"
                              />
                              <span className="whitespace-nowrap">{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {inputType === "checkbox" && (
                        <div className="flex flex-col gap-2">
                          {sortedOptions.map(opt => (
                            <label key={opt.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                value={opt.label}
                                checked={(answers[item.id] || []).includes(opt.label)}
                                onChange={(e) => {
                                  const prev = answers[item.id] || [];
                                  if (e.target.checked) {
                                    handleAnswerChange(item.id, [...prev, opt.label]);
                                  } else {
                                    handleAnswerChange(item.id, prev.filter(val => val !== opt.label));
                                  }
                                }}
                                className="appearance-none w-4 h-4 border border-gray-400 rounded-sm bg-white checked:bg-black checked:border-black focus:outline-none transition-colors"
                              />
                              <span>{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {inputType === "text" && (
                        <input
                          type="text"
                          value={answers[item.id] || ""}
                          onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                          className="border rounded p-2 w-full"
                        />
                      )}
                      {inputType === "number" && (() => {
                        const minOption = sortedOptions.find(o => o.index === 1);
                        const maxOption = sortedOptions.find(o => o.index === 2);
                        const min = minOption ? parseFloat(minOption.label) : undefined;
                        const max = maxOption ? parseFloat(maxOption.label) : undefined;
                        return (
                          <input
                            type="number"
                            min={min}
                            max={max}
                            value={answers[item.id] || ""}
                            onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                            className="border rounded p-2 w-full"
                          />
                        );
                      })()}
                    </div>
                  </React.Fragment>
                );
              })}
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={handleSubmitResponses}
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
            >
              Fill Questionnaire
            </button>
          </div>

          {submitMsg && (
            <p className="mt-4 text-center text-green-600 font-medium">{submitMsg}</p>
          )}
        </form>
      )}
    </div>
  );
}

export default FillQuestionnaire;
