import { Route, Routes } from "react-router-dom"
import HomePage from "./components/home/HomePage"
import Authentication from "./components/authentication/Authentication"

function App() {
  

  return (
    <>
      <Routes>

        <Route path="/*" element={true?<HomePage/>:<Authentication/>}/>

      </Routes>
    </>
  )
}

export default App
