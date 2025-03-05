
import {BrowserRouter, Routes, Route} from "react-router-dom";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import SendMoney from "./components/SendMoney";
import DashBoard from "./components/DashBoard";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" elements={<SignUp/>} />
        <Route path="/signin" elements={<SignIn />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/send" element={<SendMoney />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
