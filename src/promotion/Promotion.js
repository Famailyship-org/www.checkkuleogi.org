import React, { useState } from 'react';
import Header from '../components/Header';
import './css/Promotion.css';

function Promotion() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckModalOpen, setCheckModal] = useState(false);

  const [userName, setUserName] = useState(''); // 회원 이름 상태
  const [phoneNum, setPhoneNum] = useState(''); // 회원 전화번호 상태

  const [userNameCheck, setUserNameCheck] = useState('');
  const [phoneNumCheck, setPhoneNumCheck] = useState('');

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await fetch(`http://localhost:8080/event/attempt`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userName: userName,
          phoneNum: phoneNum,
          eventName: "무료구독권"
        })
      });

      const data = await response.json();
      if (data.success) {
        alert("응모에 성공했습니다.");
      } else {
        alert("응모에 실패했습니다.");
      }
    } catch (error) {
      console.log(error);
    }

    console.log('응모 완료');
    handleCloseModal();
  };

  const handleCheckSubmit = async (e) =>{
    e.preventDefault(); // 기본 폼 제출 동작 방지
    const token = localStorage.getItem('jwtToken');

    try {
      const response = await fetch(`localhost:8081/event/winner`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userName: userNameCheck,
          phoneNum: phoneNumCheck,
        })
      });

      const data = await response.json();
      if (data.success) {
        alert("당첨되었습니다.");
      } else {
        alert("다음 기회에 도전해주세요.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleOpenCheckModal = () => {
    setCheckModal(true);
  };

  const handleCloseCheckModal = () => {
    setCheckModal(false);
  };

  return (
    <div>
      <Header />
      <div className='contents'>
        <h1>이벤트 응모</h1>
        <div className='event-box'>

          <img src='/image/event.png' alt="응모이벤트 사진"/>
          <button onClick={handleOpenModal}>응모하기</button>
          <button onClick={handleOpenCheckModal} style={{marginBottom:"30px"}}>확인하기</button>
        </div>
      </div>

      {/* 응모 모달 창 */}
      {isModalOpen && (
        <div className='modal'>
          <div className='modal-content'>
            <h2>응모 정보</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>회원 이름</label>
                <input
                  type='text'
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>회원 전화번호</label>
                <input
                  type='tel'
                  value={phoneNum}
                  onChange={(e) => setPhoneNum(e.target.value)}
                  required
                />
              </div>
              <button type='submit'>응모 완료</button>
              <button type='button' onClick={handleCloseModal}>닫기</button>
            </form>
          </div>
        </div>
      )}

      {/* 확인 모달 창 */}
      {isCheckModalOpen && (
        <div className='modal'>
          <div className='modal-content'>
            <h2>회원 정보</h2>
            <form onSubmit={handleCheckSubmit}>
              <div>
                <label>회원 이름</label>
                <input
                  type='text'
                  value={userNameCheck}
                  onChange={(e) => setUserNameCheck(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>회원 전화번호</label>
                <input
                  type='tel'
                  value={phoneNumCheck}
                  onChange={(e) => setPhoneNumCheck(e.target.value)}
                  required
                />
              </div>
              <button type='submit'>조회 하기</button>
              <button type='button' onClick={handleCloseCheckModal}>닫기</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Promotion;
