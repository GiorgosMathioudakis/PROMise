import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';

import QuestionnaireForm from './pages/QuestionnaireForm';
import UpdateQuestionnaire from './pages/UpdateQuestionnaire';
import FillQuestionnaire from './pages/FillQuestionnaire';
import ResponseType from './pages/ResponseType';
import EditResponseType from './pages/EditResponseType';

function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 min-w-screen justify-items-center">
      <header className="bg-grey text-black shadow">
        <nav className="flex gap-6 text-lg h-[60px] items-center ">
          <Link
            to="/create"
            className={`hover:text-gray-500 px-2 py-2 rounded ${location.pathname === '/create' ? 'bg-blue-200' : ''
              }`}
          >
            Create Questionnaire
          </Link>
          <Link
            to="/update"
            className={`hover:text-gray-500 px-2 py-2 rounded ${location.pathname === '/update' ? 'bg-blue-200' : ''
              }`}
          >
            Update Questionnaire
          </Link>
          <Link
            to="/fill"
            className={`hover:text-gray-500 px-2 py-2 rounded ${location.pathname === '/fill' ? 'bg-blue-200' : ''
              }`}
          >
            Fill Questionnaire
          </Link>
          <Link
            to="/create_response_type"
            className={`hover:text-gray-500 px-2 py-2 rounded ${location.pathname === '/create_response_type' ? 'bg-blue-200' : ''
              }`}
          >
            Create Response Type
          </Link>
          <Link
            to="/edit_response_type"
            className={`hover:text-gray-500 px-2 py-2 rounded ${location.pathname === '/edit_response_type' ? 'bg-blue-200' : ''
              }`}
          >
            Edit Response Type
          </Link>
        </nav>
      </header>

      <main className="p-4">
        <Routes>
          <Route path="/create" element={<QuestionnaireForm />} />
          <Route path="/update" element={<UpdateQuestionnaire />} />
          <Route path="/fill" element={<FillQuestionnaire />} />
          <Route path="/create_response_type" element={<ResponseType />} />
          <Route path='/edit_response_type' element={<EditResponseType />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
