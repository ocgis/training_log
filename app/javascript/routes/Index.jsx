import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
    <Switch>
      <Route
        path="/"
        exact
        component={Home}
      />

      <Route
        path="/people/:id"
        exact
        component={ShowPerson}
      />

      <Route
        path="/trainings/new"
        exact
        component={NewTraining}
      />

      <Route
        path="/trainings/:id"
        exact
        component={ShowTraining}
      />

      <Route
        path="/trainings/:id/edit"
        exact
        component={EditTraining}
      />

      <Route
        path="/routes/:id"
        exact
        component={ShowRoute}
      />

      <Route
        path="/routes"
        exact
        component={IndexRoutes}
      />

      <Route
        path="/rawfiles/new"
        exact
        component={UploadRawfile}
      />

      <Route
        path="/rawfiles/:id"
        exact
        component={ShowRawfile}
      />

      <Route
        path="/rawfiles"
        exact
        component={IndexRawfiles}
      />

    </Switch>
  </Router>
);
