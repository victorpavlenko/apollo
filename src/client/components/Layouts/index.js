import React from 'react';
import { Container, Typography } from '@material-ui/core';


const Layout = props => {


  return (
    <div className="layout" style={{ minHeight: '100vh', background: "#f5deb3" }}>
      <Container maxWidth="lg">
        <br/>
      <header style={{ height: 'unset', textAlign: 'center' }} ><Typography variant="h1">Header</Typography></header>
        <br/>
      <div>{props.children}</div>
        <br/>
      <footer style={{ textAlign: 'center' }}><Typography variant="h2">Footer</Typography></footer>
        <br/>
      </Container>
    </div>
  );
};

export default Layout;
