import React from "react";
import { MainUI } from "./src";
import { AdyenProvider } from "./src/AdyenProvider";

const App = () => {
  return (
    <AdyenProvider>
      <MainUI />
    </AdyenProvider>
  );
};

export default App;
