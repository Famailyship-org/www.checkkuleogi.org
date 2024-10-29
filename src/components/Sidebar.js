import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

//왼쪽 사이드 바
function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <div className="sidebar">
        <div className='logo'>
          <img src="/image/checkkuleogi_logo.png" alt='책꾸러기 로고'/>
        </div>
  
        <div className='auth'>
          {/* 미로그인 시 */}
          {/* <button id='signup' onClick={() => navigate("/signup")} className={location.pathname === '/signup' ? 'active' : ''}>회원가입</button>
          <button id='login' onClick={() => navigate("/login")} className={location.pathname === '/login' ? 'active' : ''}>로그인</button> */}
          {/* 로그인 시 */}
          <div className="auth-profile">
            <img 
              src="image/profile.png" 
              alt="프로필 이미지" 
              onMouseEnter={() => setShowTooltip(true)} 
              onMouseLeave={() => setShowTooltip(false)} 
            />
            <div className="profile-text">
              <h3>꾸러기</h3>
              <p>어린이</p>
            </div>
            {showTooltip && <div className="tooltip">INFJ</div>}
          </div> 
        </div>
  
        <div className='menubar'>
          <MenuItem logosrc="/image/menubar/home.png" label="홈" 
          onClick={() => navigate("/")} className={location.pathname === '/' ? 'active' : ''}/>
          <MenuItem logosrc="/image/menubar/like.png" label="좋아요 책"
          onClick={() => navigate("/book/like")} className={location.pathname === '/book/like' ? 'active' : ''}/>
          <MenuItem logosrc="/image/menubar/book.png" label="최근 본 책"
          onClick={() => navigate("/book/recent")} className={location.pathname === '/book/recent' ? 'active' : ''}/>
          <MenuItem logosrc="/image/menubar/test.png" label="MBTI진단"
          onClick={() => navigate("/mbti")} className={location.pathname.includes('/mbti') ? 'active' : ''}/>
          <MenuItem logosrc="/image/menubar/promotion.png" label="이벤트 응모"
          onClick={() => navigate("/event")} className={location.pathname === '/event' ? 'active' : ''}/>
          <MenuItem logosrc="/image/menubar/settings.png" label="Admin"
          onClick={() => navigate("/admin")} className={location.pathname === '/admin' ? 'active' : ''}/>
        </div>
        
      </div>
    );
  }
  
  //메뉴바 컴포넌트
  function MenuItem({ logosrc, label, onClick, className }) {
    return (
      <div id='menu' onClick={onClick} className={className}>
        <img src={logosrc} alt="메뉴 로고"/>
        <p>{label}</p>
      </div>
    );
  }
  
  export default Sidebar;