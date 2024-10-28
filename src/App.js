import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from "./components/Sidebar";
import Home from "./main/Home";
import Signup from "./accounts/Signup";
import SignupChild from './accounts/SignupChild';
import LoginChild from './accounts/LoginChild';
import Login from "./accounts/Login";
import MBTI from "./mbti/MBTI";
import MBTITest from "./mbti/MBTITest";
import MBTIResult from "./mbti/MBTIResult";
import Promotion from './promotion/Promotion';
import Admin from './main/Admin';
import Likelist from './bookList/Likelist';
import Booklist from './bookList/Booklist';
import Recommendlist from './bookList/Recommendlist';

import './App.css';


//화면 전체 틀 - 왼쪽 사이드바 + 오른쪽 메인화면
function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar /> 
        <div className="main">
          <Routes>
            <Route path="/" element={ <Home/> }/>
            <Route path="/signup" element={ <Signup/> }/>
            <Route path="/signup/child" element={ <SignupChild/> }/>
            <Route path="/login" element={ <Login/> }/>
            <Route path="/login/child" element={ <LoginChild/> }/>
            <Route path="/mbti" element={<MBTI />} />
            <Route path="/mbti/test" element={<MBTITest />} />
            <Route path="/mbti/result" element={<MBTIResult />} />
            <Route path="/event" element={<Promotion />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/like" element={<Likelist />} />
            <Route path="/book" element={ <Booklist />} />
            <Route path="/book/recommend" element={ <Recommendlist />} />
          </Routes>
        </div>
    </div>
    </Router>
  );
}

export default App;
