import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

import './css/Child.css'

function LoginChild() {
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleAddProfile = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('아이 등록');
        handleCloseModal();
    };

    const handleProfileClick = () => {
        navigate('/');
    };

    return (
        <div>
            <Header />
            <div className='contents'>
                <h1>아이 프로필 선택</h1>
                <div className='profile-container'>
                    <div className='profile-child' onClick={handleProfileClick}>
                        <img src='/image/profile.png' alt='프로필' className='profile-image' />
                        <p><span className="name">꾸러기</span>어린이</p>
                    </div>
                    <button className='add-profile' onClick={handleAddProfile}>+</button>
                </div>
            </div>

            {/* 아이 등록 모달 창 */}
            {modalOpen && (
                <div className='modal'>
                    <div className='modal-content'>
                        <span className='close' onClick={handleCloseModal}>&times;</span>
                        <h2>아이 정보 입력</h2>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>아이 이름</label>
                                <input type='text' required />
                            </div>
                            <div>
                                <label>아이 나이</label>
                                <input type='age' required />
                            </div>
                            <div>
                                <label>아이 생년월일</label>
                                <input type='date' required />
                            </div>
                            <div>
                                <label>아이 성별</label>
                                <select name='gender' required>
                                    <option value=''>성별</option>
                                    <option value='male'>남자아이</option>
                                    <option value='female'>여자아이</option>
                                </select>
                            </div>
                            <button type='submit'>아이등록</button>
                            <button type='button' onClick={handleCloseModal}>닫기</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginChild;
