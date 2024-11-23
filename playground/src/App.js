import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route
  } from "react-router-dom";
  
import { HelloWorld } from 'auth-component-library';

const App = ()  => {

    const mockAPI = 'http://localhost:3000'

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <HelloWorld/>
                }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
