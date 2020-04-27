import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import UsersList from './pages/UsersList';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={UsersList} />
      <Route component={NotFound} />
    </Switch>
  );
};

App.propTypes = {
  history: PropTypes.object
};

export default App;
