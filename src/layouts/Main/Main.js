/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* Styled */
import styled, { createGlobalStyle } from 'styled-components';

/* Sub Components */
import Header from './Header';
import Footer from './Footer';
import SideBar from './SideBar';
import Section from './Section';

/* Global Styled */
const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%
  }
	body {
		padding: 0;
    margin: 0;
  }
  #root {
    height: 100%;
  }
`;

/* Styled Components */
const Container = styled.div`
  padding-top: 60px;
  height: 100%;
  padding-left: 190px;
`;

/* Main Compoent */
const Main = props => {
  /* Props */
  const {
    className, /*폴더 명*/
    children, /*하위 항목의 const*/
  } = props;
  
  /* Renderer */
  return (
    <Container className={ className }>
      <GlobalStyle />
      <Header />
      <SideBar/>
      <Section>
        { children }
      </Section>
      <Footer />
    </Container>
  );
}

/* Main Component Settings */
Main.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

/* Exports */
export default Main;