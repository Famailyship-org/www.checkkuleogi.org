import React from 'react';
import { useNavigate } from 'react-router-dom'; // 추가
import Header from '../components/Header';
import './css/MBTI.css';

function MBTIStart() {
  const navigate = useNavigate(); 

  const handleStartTest = () => {
    navigate('/mbti/test'); 
  };

  return (
    <div>
      <Header />
      <div className='contents'>
        <h1>MBTI진단</h1>
        <div className='mbti-box'>
          <img src='/image/mbtiTest.png' alt="mbti진단 사진"/><br/>
          <button onClick={handleStartTest}>진단 시작하기</button>
          <p className='mbti-warning'>유의해주세요.<br/>9세 이상의 아이라면 스스로 진단할 수 있도록 해주세요.<br/>
          스스로 질문지를 읽기 어려운 아이라면 부모님께서 진단에 함께 해주세요<br/>
          질문을 이해하기 어려운 아이라면 부모님께서 대신 응답해주세요.</p>
          <p>출처 : 라라클래스의 mbti검사</p>
        </div>
      </div>
      <br/><br/>
    </div>
  );
}

export default MBTIStart;
