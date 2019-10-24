import React from "react";
import styled from "styled-components";
import Header from "./layout/Header";
import Home from "./modules";
import { Context } from "./lib/Context";
import { Client } from "./lib/Client";

const URL = "https://threed-test-api.herokuapp.com/graphql/graphql";

const Wrapper = styled.div`
  min-height: 100%;
  padding: 8px 16px;
  background-color: #f6f6ef;
`;

const App = () => (
  <Context.Provider value={new Client(URL)}>
    <Header />
    <Wrapper>
      <Home />
    </Wrapper>
  </Context.Provider>
);

export default App;
