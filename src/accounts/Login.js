import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

import './css/Login.css'

function Login() {
   // 각 입력 필드에 대한 상태 변수
   const [userId, setUserId] = useState('');
   const [password, setPassword] = useState('');
   const navigate = useNavigate();
 
   // 폼 제출 처리 함수
   const handleSubmit = (event) => {
     event.preventDefault();
     // 폼 제출 로직 추가
     console.log({ userId, password });
   };

   const handleButtonClick = () => {
    navigate('/login/child');
  };
 
   return (
     <div>
       <Header />
       <div className='contents'>
         <h1>로그인</h1>
         <form className='form-container' onSubmit={handleSubmit}>
           <div>
             <label>아이디</label>
             <input 
               type='text'
               name='userId'
               placeholder='아이디'
               value={userId}
               onChange={(e) => setUserId(e.target.value)}
               required 
             />
           </div>
           <div>
           <label>비밀번호</label>
             <input 
               type='password' 
               name='password' 
               placeholder='비밀번호'
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required 
             />
           </div>
          
           <button type='submit' onClick={handleButtonClick}>로그인</button>
         </form>
       </div>
     </div>
   );
 }
 

export default Login;