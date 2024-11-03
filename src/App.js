// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./main/Home";
import Signup from "./accounts/Signup";
import SignupChild from './accounts/SignupChild';
import LoginChild from './accounts/LoginChild';
import Login from "./accounts/Login";
import MBTI from "./mbti/MBTI";
import MBTIStart from "./mbti/MBTIStart";
import MBTITest from "./mbti/MBTITest";
import MBTIResult from "./mbti/MBTIResult";
import Promotion from './promotion/Promotion';
import Admin from './main/Admin';
import LikeList from './bookList/Likelist';
import BookList from './bookList/BookList';
import RecommendList from './bookList/Recommendlist';
import RecentList from './bookList/Recentlist';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Sidebar />
        <div className="container">
          <div className="main-content">
            <Routes>
              <Route path="/" element={ <Home/> }/>
              <Route path="/signup" element={ <Signup/> }/>
              <Route path="/signup/child" element={ <SignupChild/> }/>
              <Route path="/login" element={ <Login/> }/>
              <Route path="/login/child" element={ <LoginChild/> }/>
              <Route path="/mbti" element={<MBTI />} />
              <Route path="/mbti/main" element={<MBTIStart />} />
              <Route path="/mbti/test" element={<MBTITest />} />
              <Route path="/mbti/result" element={<MBTIResult />} />
              <Route path="/event" element={<Promotion />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/book" element={ <BookList />} />
              <Route path="/book/like" element={<LikeList />} />
              <Route path="/book/recommend" element={ <RecommendList />} />
              <Route path="/book/recent" element={ <RecentList />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
