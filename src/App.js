import React from 'react'
import { hot } from 'react-hot-loader'
//import './App.css'

import Wrapper from "./components/Wrapper";
import Pagination from "./components/Pagination";

const App = () => (
	<Wrapper>
		<Pagination/>
	</Wrapper>
)
export default hot(module)(App)
