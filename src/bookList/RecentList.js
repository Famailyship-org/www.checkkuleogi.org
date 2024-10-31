import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import './css/Book.css'; 

function RecentList() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [recentBooks, setRecentBooks] = useState([]);

    // 서버에서 최근 본 책 목록 가져오기
    const fetchRecentBooks = async () => {
        const childIdx = sessionStorage.getItem('child_idx');
        if (childIdx) {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/book/${childIdx}/recent`);
                const data = await response.json();
                if (data.success) {
                    setRecentBooks(data.response);
                } else {
                    console.error('최근 본 책 목록 불러오기 실패:', data.error);
                }
            } catch (error) {
                console.error('API 호출 오류:', error);
            }
        }
    };

    useEffect(() => {
        fetchRecentBooks();
    }, []);

    const handleBookClick = (index) => {
        setSelectedBook(recentBooks[index]);
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
            <Header />
            <div className='contents'>
                <h1>최근 본 책 목록</h1>
                <div className="book-list">
                    {recentBooks.map((book, index) => (
                        <div className="book-item" key={book.idx} onClick={() => handleBookClick(index)}>
                             <img src={`/image/book/book${book.idx}.jpg`} alt={book.title} className="book-image" /> 
                            <p>{book.title}</p>
                        </div>
                    ))}
                </div>
            </div>
            {modalOpen && selectedBook && (
                <div className='book-modal'>
                    <div className='book-modal-content'>
                        <img src={`/image/book/book${selectedBook.idx}.jpg`} alt={selectedBook.title} className="book-image" /> 
                        <span className='close' onClick={handleCloseModal}>&times;</span>
                        <h2>{selectedBook.title}</h2>
                        <p className='author'>{selectedBook.author}</p>
                        <div className='detail'>
                            <h2>이 책은요</h2>
                            <h3>줄거리</h3>
                            <p>{selectedBook.summary}</p>
                            <h3>MBTI</h3>
                            <div className='book-mbti'>
                                {selectedBook.mbti.split('').map((type) => (
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

export default RecentList;
