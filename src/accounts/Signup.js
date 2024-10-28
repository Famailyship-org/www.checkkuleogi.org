import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './css/Signup.css';

function Signup() {
  const navigate = useNavigate();

  // 각 입력 필드에 대한 상태 변수
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentBirthdate, setParentBirthdate] = useState('');
  const [gender, setGender] = useState('');

  // 폼 제출 처리 함수
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ userId, password, confirmPassword, parentName, parentEmail, parentBirthdate, gender });
    
    // 페이지 이동
    navigate('/signup/child');
  };

  // // 폼 제출 처리 함수 -- 백엔드 연결 버전
  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   // POST 요청 데이터
  //   const userData = {
  //     id: userId,
  //     password: password,
  //     name: parentName,
  //   };

  //   try {
  //     const response = await fetch('http://localhost:8080/user/join', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(userData),
  //     });

  //     if (!response.ok) {
  //       throw new Error('회원가입 요청이 실패했습니다.');
  //     }

  //     // 회원가입 성공 시 페이지 이동
  //     navigate('/signup/child');
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  return (
    <div>
      <Header />
      <div className='contents'>
        <h1>회원가입</h1>
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
          <div>
            <label>비밀번호 확인</label>
            <input
              type='password'
              name='confirmPassword'
              placeholder='비밀번호 확인'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>이름</label>
            <input
              type='text'
              name='parentName'
              placeholder='이름'
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>이메일</label>
            <input
              type='email'
              name='parentEmail'
              placeholder='이메일'
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>생년월일</label>
            <input
              type='date'
              name='parentBirthdate'
              value={parentBirthdate}
              onChange={(e) => setParentBirthdate(e.target.value)}
              required
            />
          </div>
          <div>
            <label>성별</label>
            <select 
              name='gender' 
              value={gender} 
              onChange={(e) => setGender(e.target.value)} 
              required
            >
              <option value=''>성별</option>
              <option value='male'>남성</option>
              <option value='female'>여성</option>
            </select>
          </div>
          <button type='submit'>다음 단계</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
