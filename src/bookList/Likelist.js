import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import './css/Book.css';

function LikeList() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [likedBooks, setLikedBooks] = useState([]); // 좋아요한 책 목록 상태 추가

    useEffect(() => {
        const fetchLikedBooks = async () => {
            const childIdx = sessionStorage.getItem('child_idx'); 
            if (!childIdx) return;

            try {
                const response = await fetch(`http://localhost:8080/api/v1/book/${childIdx}/like`);
                const data = await response.json();

                if (data.success) {
                    setLikedBooks(data.response); // 좋아요한 책 목록 설정
                } else {
                    console.error("Failed to fetch liked books");
                }
            } catch (error) {
                console.error("Error fetching liked books:", error);
            }
        };

        fetchLikedBooks();
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
            <Header />
            <div className='contents'>
                <h1>좋아요 책 목록</h1>
                <div className="book-list">
                    {likedBooks.length > 0 ? (
                        likedBooks.map((book, index) => (
                            <div className="book-item" key={book.idx} onClick={() => handleBookClick(index)}>
                                <img src={`/image/book/book${book.idx}.jpg`} alt={`책 ${book.title}`} className="book-image" /> 
                                <p>{book.title}</p>
                            </div>
                        ))
                    ) : (
                        <p>좋아요한 책이 없습니다.</p>
                    )}
                </div>
            </div>
            {modalOpen && selectedBook !== null && (
                <div className='book-modal'>
                    <div className='book-modal-content'>
                        <img src={`/image/book/book${likedBooks[selectedBook].idx}.jpg`} alt={`책`} />
                        <span className='close' onClick={handleCloseModal}>&times;</span>
                        <h2>{likedBooks[selectedBook].title}</h2>
                        <p className='author'>{likedBooks[selectedBook].author}</p>
                        <div className='detail'>
                            <h2>이 책은요</h2>
                            <h3>줄거리</h3>
                            <p>{likedBooks[selectedBook].summary}</p>
                            <h3>MBTI</h3>
                            <div className='book-mbti'>
                                {likedBooks[selectedBook].mbti.split("").map((type) => (
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

export default LikeList;
