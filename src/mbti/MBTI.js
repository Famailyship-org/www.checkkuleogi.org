import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './css/MBTI.css';

function MBTI() {
  const navigate = useNavigate(); 

  const handleStartTest = () => {
    navigate('/mbti/main'); 
  };

  const handleResetRecords = () => {
    // 기록 초기화 로직 구현
    console.log("기록이 초기화되었습니다."); // 기능 구현을 위한 자리
  };

  return (
    <div>
      <Header />
      <div className='contents'>
        <h1>MBTI진단 기록</h1>
        <div className='mbti-box'>
          <div className='mbti-change'>mbti변화추이 보여줄 거임</div>
          <div className='mbti-controls'> 
            <span className='reset-text' onClick={handleResetRecords}>
              기록 초기화
            </span>
          </div>
          <button onClick={handleStartTest}>진단 시작하기</button>
        </div>
      </div>
    </div>
  );
}

export default MBTI;
