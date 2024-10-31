import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import './css/Child.css';

function LoginChild() {
    const [modalOpen, setModalOpen] = useState(false);
    const [childInfo, setChildInfo] = useState([]); // 등록된 아이 정보를 저장
    useEffect(() => {
        const fetchChildren = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                console.error('로그인이 필요합니다.');
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/v1/child/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({}) // 로그인한 사용자 정보를 전달
                });

                const data = await response.json();
                if (data.success) {
                    const childrenIds = data.response.id; // 아이 ID 목록
                    // 아이의 정보를 가져오기 위해 비동기 요청을 보냄
                    const childrenDetails = await Promise.all(childrenIds.map(async (id) => {
                        const childResponse = await fetch(`http://localhost:8080/api/v1/child/${id}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        const childData = await childResponse.json();
                        return childData.success ? childData.response : null;
                    }));

                    // 유효한 응답만 필터링하여 상태에 저장
                    setChildInfo(childrenDetails.filter(child => child));
                } else {
                    console.error('아이 정보 가져오기 실패:', data.error);
                }
            } catch (error) {
                console.error('API 호출 오류:', error);
            }
        };

        fetchChildren();
    }, []);

    const handleAddProfile = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 입력값 가져오기
        const name = e.target.name.value;
        const age = e.target.age.value;
        const birth = e.target.birth.value;
        const gender = e.target.gender.value;

        // 토큰 가져오기
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error('토큰이 존재하지 않습니다. 로그인 후 시도하세요.');
            return;
        }

        // API 요청
        const response = await fetch('http://localhost:8080/api/v1/child', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, gender, age, birth })
        });

        const data = await response.json(); // 응답을 한 번만 읽기

        if (!response.ok) {
            console.error('API 호출 오류:', data); // 오류 내용 출력
            return; // 함수를 종료
        }

        if (data.success) {
            setChildInfo((prev) => [...prev, data.response]);
            handleCloseModal(); // 모달 닫기
        } else {
            console.error('아이 등록 실패:', data.error);
        }
    };

    const handleProfileClick = (child) => {
        // 클릭한 어린이의 idx를 세션 저장소에 저장
        sessionStorage.setItem('child_idx', child.idx);
        window.location.href = '/';
    };

    return (
        <div>
            <Header />
            <div className='contents'>
                <h1>아이 프로필 선택</h1>
                <div className='profile-container'>
                    {childInfo.map((child) => (
                        <div key={child.idx} className='profile-child' onClick={() => handleProfileClick(child)}>
                            <img src='/image/profile.png' alt='프로필' className='profile-image' />
                            <p><span className="name">{child.name}</span> 어린이</p>
                        </div>
                    ))}
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
                                <input type='text' name='name' required />
                            </div>
                            <div>
                                <label>아이 나이</label>
                                <input type='number' name='age' required />
                            </div>
                            <div>
                                <label>아이 생년월일</label>
                                <input type='date' name='birth' required />
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
