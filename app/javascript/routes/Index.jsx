import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/Home";
import ShowPerson from "../components/ShowPerson";
import ShowTraining from "../components/ShowTraining";
import NewTraining from "../components/NewTraining";
import EditTraining from "../components/EditTraining";

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

    </Switch>
  </Router>
);
