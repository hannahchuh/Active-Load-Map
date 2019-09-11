import React from "react";
import ActiveLoadMapApp from "./active-load-map";
import MenuBar from "./active-load-map/MenuBar";
import ReactDOM from "react-dom";

import 'semantic-ui-css/semantic.min.css'

// ES modules
import ReactDOMServer from 'react-dom/server';

import "./index.css";

const App: React.FC = () => {
  const [isLoggedIn, setLoggedIn] = React.useState(true);

  return (
    <div>
      <MenuBar isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />
      <ActiveLoadMapApp isLoggedIn = {isLoggedIn} />
    </div>
  );
};

// console.log(ReactDOMServer.renderToString(<App/>));
const rootElement = document.getElementById("root");

ReactDOM.hydrate(<App/>, rootElement);
