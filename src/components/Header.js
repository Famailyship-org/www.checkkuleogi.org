import React, { useState, useEffect } from 'react';
import './css/Header.css'; 

function Header() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className="Mainheader"
      style={{
        transform: `translateY(-${Math.min(scrollY, 250)}px)`, // 스크롤 위치에 따라 위로 이동
      }}
    >
      <img src='/image/main.png' alt="Header" className='Mainheader-image'/>
    </header>
  );
}

export default Header;
