import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // JWT 디코딩 라이브러리 추가

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showTooltip, setShowTooltip] = useState(false);
    const [childInfo, setChildInfo] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false); // ADMIN 역할 여부 상태 추가

    // 사용자 정보를 가져오는 함수
    const fetchChildInfo = async () => {
        const token = localStorage.getItem('jwtToken');
        const childIdx = sessionStorage.getItem('child_idx');

        if (token && childIdx) {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/child/${childIdx}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (data.success) {
                    setChildInfo(data.response);
                } else {
                    console.error('아이 정보 불러오기 실패:', data.error);
                }
            } catch (error) {
                console.error('API 호출 오류:', error);
            }
        }
    };

    // 사용자 역할을 가져오는 함수
    const fetchUserRole = async () => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decodedToken = jwtDecode(token); // 토큰 디코딩
            const userId = decodedToken.sub; // 토큰에서 userId 추출

            try {
                const response = await fetch(`http://localhost:8080/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (data.success) {
                    setIsAdmin(data.response.name === 'ADMIN'); // 이름이 ADMIN인지 확인
                } else {
                    console.error('사용자 정보 불러오기 실패:', data.error);
                }
            } catch (error) {
                console.error('API 호출 오류:', error);
            }
        }
    };

    // 컴포넌트가 처음 렌더링될 때와 child_idx 또는 jwtToken이 변경될 때 호출
    useEffect(() => {
        fetchChildInfo();
        fetchUserRole(); // 사용자 역할 정보 가져오기
    }, []);

    return (
        <div className="sidebar">
            <div className='logo'>
                <img src="/image/checkkuleogi_logo.png" alt='책꾸러기 로고'/>
            </div>
            <div className='auth'>
                {!childInfo ? (
                    <>
                        <button id='signup' onClick={() => navigate("/signup")} className={location.pathname === '/signup' ? 'active' : ''}>회원가입</button>
                        <button id='login' onClick={() => navigate("/login")} className={location.pathname === '/login' ? 'active' : ''}>로그인</button>
                    </>
                ) : (
                    <div className="auth-profile">
                        <img
                            src="/image/profile.png"
                            alt="프로필 이미지"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        />
                        <div className="profile-text">
                            <h3>{childInfo.name}</h3>
                            <p>어린이</p>
                        </div>
                        {showTooltip && <div className="tooltip">{childInfo.mbti || "MBTI 정보 없음"}</div>}
                    </div>
                )}
            </div>
            <div className='menubar'>
                <MenuItem
                    logosrc="/image/menubar/home.png"
                    label="홈"
                    onClick={() => navigate("/")}
                    className={location.pathname === '/' ? 'active' : ''}
                />
                {childInfo && (
                    <>
                        <MenuItem
                            logosrc="/image/menubar/like.png"
                            label="좋아요 책"
                            onClick={() => navigate("/book/like")}
                            className={location.pathname === '/book/like' ? 'active' : ''}
                        />
                        <MenuItem
                            logosrc="/image/menubar/book.png"
                            label="최근 본 책"
                            onClick={() => navigate("/book/recent")}
                            className={location.pathname === '/book/recent' ? 'active' : ''}
                        />
                        <MenuItem
                            logosrc="/image/menubar/test.png"
                            label="MBTI진단"
                            onClick={() => navigate("/mbti")}
                            className={location.pathname.includes('/mbti') ? 'active' : ''}
                        />
                        <MenuItem
                            logosrc="/image/menubar/promotion.png"
                            label="이벤트 응모"
                            onClick={() => navigate("/event")}
                            className={location.pathname === '/event' ? 'active' : ''}
                        />
                    </>
                )}
                {isAdmin && (
                            <MenuItem
                                logosrc="/image/menubar/settings.png"
                                label="Admin"
                                onClick={() => navigate("/admin")}
                                className={location.pathname === '/admin' ? 'active' : ''}
                            />
                        )}
            </div>
        </div>
    );
}

function MenuItem({ logosrc, label, onClick, className }) {
    return (
        <div id='menu' onClick={onClick} className={className}>
            <img src={logosrc} alt="메뉴 로고"/>
            <p>{label}</p>
        </div>
    );
}

export default Sidebar;
