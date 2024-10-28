import React, { useState } from 'react';
import Header from '../components/Header';
import './css/Promotion.css'; 

function Promotion() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 응모 처리 로직 추가
    console.log('응모 완료');
    handleCloseModal();
  };

  return (
    <div>
      <Header />
      <div className='contents'>
        <h1>이벤트 응모</h1>
        <div className='event-box'>
          <img src='image/event.jpg' alt="응모이벤트 사진"/>
          <button onClick={handleOpenModal}>응모하기</button>
        </div>
      </div>

      {/* 모달 창 */}
      {isModalOpen && (
        <div className='modal'>
          <div className='modal-content'>
            <h2>응모 정보</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>회원 이름</label>
                <input type='text' required />
              </div>
              <div>
                <label>회원 전화번호</label>
                <input type='tel' required />
              </div>
              <button type='submit'>응모 완료</button>
              <button type='button' onClick={handleCloseModal}>닫기</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Promotion;
