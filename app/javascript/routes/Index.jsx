import React from 'react';
import {
  BrowserRouter as Router, Route, Routes,
} from 'react-router-dom';
import Home from '../components/Home';
import ShowPerson from '../components/ShowPerson';
import ShowTraining from '../components/ShowTraining';
import NewTraining from '../components/NewTraining';
import EditTraining from '../components/EditTraining';
import IndexRoutes from '../components/IndexRoutes';
import ShowRoute from '../components/ShowRoute';
import IndexRawfiles from '../components/IndexRawfiles';
import ShowRawfile from '../components/ShowRawfile';
import UploadRawfile from '../components/UploadRawfile';

export default (
  <Router>
    <Routes>
      <Route
        path="/"
        exact
        element={<Home />}
      />

      <Route
        path="/people/:id"
        exact
        element={<ShowPerson />}
      />

      <Route
        path="/trainings/new"
        exact
        element={<NewTraining />}
      />

      <Route
        path="/trainings/:id"
        exact
        element={<ShowTraining />}
      />

      <Route
        path="/trainings/:id/edit"
        exact
        element={<EditTraining />}
      />

      <Route
        path="/routes/:id"
        exact
        element={<ShowRoute />}
      />

      <Route
        path="/routes"
        exact
        element={<IndexRoutes />}
      />

      <Route
        path="/rawfiles/new"
        exact
        element={<UploadRawfile />}
      />

      <Route
        path="/rawfiles/:id"
        exact
        element={<ShowRawfile />}
      />

      <Route
        path="/rawfiles"
        exact
        element={<IndexRawfiles />}
      />

    </Routes>
  </Router>
);
