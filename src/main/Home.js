import React, { useState, useEffect } from 'react';
import './css/Home.css';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

function Home() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/book")
            .then(response => response.json())
            .then(data => setBooks(data.response.slice(0, 7))) // 전체 목록에서 7개만 가져옴
            .catch(error => console.error("Error fetching books:", error));
    }, []);

    const handleBookClick = (index) => {
        setSelectedBook(index);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedBook(null);
    };

    const toggleLike = () => {
        setLiked(!liked);
        if (disliked) setDisliked(false); // 싫어요가 눌려 있으면 해제
    };

    const toggleDislike = () => {
        setDisliked(!disliked);
        if (liked) setLiked(false); // 좋아요가 눌려 있으면 해제
    };

    const mbtiDescriptions = {
        "E": "외향",
        "I": "내향",
        "N": "직관",
        "S": "감각",
        "F": "감정",
        "T": "사고",
        "P": "탐색",
        "J": "계획"
    };

    return (
        <div>
            <div className="header-container">
                <div className="search-container">
                    <input type="text" placeholder="검색어를 입력하세요." className="search" />
                    <button className="search-button">검색</button>
                </div>

                <div className="banner-container">
                    <img src="image/main.png" alt="이벤트 배너" className="banner-image" />
                </div>
            </div>

            <div className="book-container"> 
                <div className="header">
                    <h2>추천 책 목록(이거는 로그인 사람만 보임)</h2>
                    <a href="/book/recommend" className="view-all">전체 보기</a>
                </div>
                <div className="book-slider">
                    {Array.from({ length: 7 }).map((_, index) => (
                        <div className="book-item" key={index} onClick={() => handleBookClick(index)}>
                            <img src={'/image/book.webp'} alt={`책 ${index + 1}`} className="book-image" /> 
                            <p>책 제목 {index + 1}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="book-container"> 
                <div className="header">
                    <h2>전체 책 목록</h2>
                    <a href="/book" className="view-all">전체 보기</a>
                </div>
                <div className="book-slider">
                    {books.map((book, index) => (
                        <div className="book-item" key={index} onClick={() => handleBookClick(index)}>
                            <img src={`/image/book/book${book.idx}.jpg`} alt={book.title} className="book-image" /> 
                            <p>{book.title}</p>
                        </div>
                    ))}
                </div>
            </div>

            {modalOpen && selectedBook !== null && (
                <div className='book-modal'>
                    <div className='book-modal-content'>
                        <img src={`/image/book/book${books[selectedBook].idx}.jpg`} alt="책" /> 
                        <span className='close' onClick={handleCloseModal}>&times;</span>
                        <h2>{books[selectedBook].title}</h2>
                        <p className='author'>{books[selectedBook].author}</p>
                        <div className='detail'>
                          <h2>이 책은요</h2>
                          <h3>줄거리</h3>
                          <p>{books[selectedBook].summary}</p>
                          <h3>MBTI</h3>
                          <div className='book-mbti'>
                            {books[selectedBook].mbti && books[selectedBook].mbti.split("").map((type) => (
                                <div className='mbti-item' key={type}>
                                    <div className='circle'>{type}</div>
                                    <p className='description'>{mbtiDescriptions[type]}</p>
                                </div>
                            ))}
                          </div>
                          {/* 좋아요 및 싫어요 버튼 */}
                          <h3>나는 이 책이</h3>
                          <div className='like-dislike'>
                                <FaThumbsUp
                                    className={`like-icon ${liked ? 'active' : ''}`}
                                    onClick={toggleLike}
                                />
                                <FaThumbsDown
                                    className={`dislike-icon ${disliked ? 'active' : ''}`}
                                    onClick={toggleDislike}
                                />
                          </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
