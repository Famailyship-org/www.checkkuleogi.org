import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

import './css/Login.css'

function Login() {
   // 각 입력 필드에 대한 상태 변수
   const [userId, setUserId] = useState('');
   const [password, setPassword] = useState('');
   const navigate = useNavigate();
 
   const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      
      const response = await fetch('http://localhost:8080/user/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              id: userId,
              password: password
          })
      });
    
      const data = await response.json();
            
      if (data.success && data.response && data.response.token) {
          const token = data.response.token;
          
          localStorage.setItem('jwtToken', token);

          navigate('/login/child');
      } else {
          alert('로그인에 실패했습니다.');
      }
  } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인에 실패했습니다.');
  }
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
          
           <button type='submit'>로그인</button>
         </form>
       </div>
     </div>
   );
 }
 

export default Login;