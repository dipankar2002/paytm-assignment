
import {BrowserRouter, Routes, Route} from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import SendMoney from "./pages/SendMoney";
import DashBoard from "./pages/DashBoard";
import Account from "./pages/Account";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<DashBoard />} />
        <Route path="/send" element={<SendMoney />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
