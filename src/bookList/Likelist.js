import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import './css/Book.css';
import { useNavigate } from 'react-router-dom'; // navigate를 위해 useNavigate 추가

function LikeList() {
    const navigate = useNavigate(); // useNavigate 훅 사용
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [likedBooks, setLikedBooks] = useState([]);
    const [likedStatus, setLikedStatus] = useState({});
    const [dislikedStatus, setDislikedStatus] = useState({});
    
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

    useEffect(() => {
        const fetchLikedBooks = async () => {
            const childIdx = sessionStorage.getItem('child_idx');
            if (!childIdx) return;

            const token = localStorage.getItem('jwtToken'); // JWT 토큰 가져오기
            try {
                const response = await fetch(`http://localhost:8080/api/v1/book/${childIdx}/like`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Authorization 헤더 추가
                    }
                });
                const data = await response.json();

                if (data.success) {
                    setLikedBooks(data.response);

                    // 상태를 객체로 설정하여 bookIdx와 상태를 매핑
                    const liked = {};
                    const disliked = {};
                    data.response.forEach(book => {
                        liked[book.idx] = book.isLike;
                        disliked[book.idx] = !book.isLike;
                    });

                    setLikedStatus(liked);
                    setDislikedStatus(disliked);
                } else {
                    console.error("Failed to fetch liked books");
                }
            } catch (error) {
                console.error("Error fetching liked books:", error);
            }
        };

        fetchLikedBooks();
    }, []);

    const handleBookClick = (bookIdx) => {
        setSelectedBook(bookIdx);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedBook(null);
    };

    const toggleLike = async () => {
        const book = likedBooks.find(book => book.idx === selectedBook);
        const childIdx = sessionStorage.getItem('child_idx');
        if (!childIdx) return;

        const token = localStorage.getItem('jwtToken'); // JWT 토큰 가져오기
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` // Authorization 헤더 추가
        };

        if (dislikedStatus[book.idx]) {
            await fetch(`http://localhost:8080/api/v1/book/like`, {
                method: 'DELETE',
                headers,
                body: JSON.stringify({ childIdx, bookIdx: book.idx, isLike: false }),
            });
            setDislikedStatus(prev => ({ ...prev, [book.idx]: false }));
        }

        if (likedStatus[book.idx]) {
            await fetch(`http://localhost:8080/api/v1/book/like`, {
                method: 'DELETE',
                headers,
                body: JSON.stringify({ childIdx, bookIdx: book.idx, isLike: true }),
            });
            setLikedStatus(prev => ({ ...prev, [book.idx]: false }));
        } else {
            await fetch(`http://localhost:8080/api/v1/book/like`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ childIdx, bookIdx: book.idx, isLike: true }),
            });
            setLikedStatus(prev => ({ ...prev, [book.idx]: true }));
        }
    };

    const toggleDislike = async () => {
        const book = likedBooks.find(book => book.idx === selectedBook);
        const childIdx = sessionStorage.getItem('child_idx');
        if (!childIdx) return;

        const token = localStorage.getItem('jwtToken'); // JWT 토큰 가져오기
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` // Authorization 헤더 추가
        };

        if (likedStatus[book.idx]) {
            await fetch(`http://localhost:8080/api/v1/book/like`, {
                method: 'DELETE',
                headers,
                body: JSON.stringify({ childIdx, bookIdx: book.idx, isLike: true }),
            });
            setLikedStatus(prev => ({ ...prev, [book.idx]: false }));
        }

        if (dislikedStatus[book.idx]) {
            await fetch(`http://localhost:8080/api/v1/book/like`, {
                method: 'DELETE',
                headers,
                body: JSON.stringify({ childIdx, bookIdx: book.idx, isLike: false }),
            });
            setDislikedStatus(prev => ({ ...prev, [book.idx]: false }));
        } else {
            await fetch(`http://localhost:8080/api/v1/book/like`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ childIdx, bookIdx: book.idx, isLike: false }),
            });
            setDislikedStatus(prev => ({ ...prev, [book.idx]: true }));
        }
    };

    const currentBook = likedBooks.find(book => book.idx === selectedBook);

    return (
        <div>
            <Header />
            <div className='contents'>
                <h1>좋아요 책 목록</h1>
                <div className="book-list">
                    {likedBooks.length > 0 ? (
                        likedBooks
                            .filter(book => likedStatus[book.idx]) // likedStatus로 필터링
                            .map((book) => (
                                <div className="book-item" key={book.idx} onClick={() => handleBookClick(book.idx)}>
                                    <img src={`/image/book/book${book.idx}.jpg`} alt={`책 ${book.title}`} className="book-image" />
                                    <p>{book.title}</p>
                                </div>
                            ))
                    ) : (
                        <p>좋아요한 책이 없습니다.</p>
                    )}
                </div>
            </div>
            {modalOpen && currentBook && (
                <div className='book-modal'>
                    <div className='book-modal-content'>
                        <img src={`/image/book/book${currentBook.idx}.jpg`} alt={`책`} />
                        <span className='close' onClick={handleCloseModal}>&times;</span>
                        <h2>{currentBook.title}</h2>
                        <p className='author'>{currentBook.author}</p>
                        <div className='detail'>
                            <h2>이 책은요</h2>
                            <h3>줄거리</h3>
                            <p>{currentBook.summary}</p>
                            <h3>MBTI</h3>
                            <div className='book-mbti'>
                                {currentBook && currentBook.mbti ? (
                                    currentBook.mbti.split("").map((type) => (
                                        <div className='mbti-item' key={type}>
                                            <div className='circle'>{type}</div>
                                            <p className='description'>{mbtiDescriptions[type]}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>MBTI 정보가 없습니다.</p>
                                )}
                            </div>


                            <h3>나는 이 책이</h3>
                            <div className='like-dislike'>
                                <FaThumbsUp
                                    className={`like-icon ${likedStatus[currentBook.idx] ? 'active' : ''}`}
                                    onClick={toggleLike}
                                />
                                <FaThumbsDown
                                    className={`dislike-icon ${dislikedStatus[currentBook.idx] ? 'active' : ''}`}
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
