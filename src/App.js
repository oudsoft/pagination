import React from 'react'
import { hot } from 'react-hot-loader'
//import './App.css'

import Wrapper from "./components/Wrapper";
import CutoffDateSelector from "./components/CutoffDateSelector";

const App = () => (
	<Wrapper>
		<CutoffDateSelector/>
	</Wrapper>
)
export default hot(module)(App)
