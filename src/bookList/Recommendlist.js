import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import './css/Book.css';

function RecommendList() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [bookDetails, setBookDetails] = useState([]);
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
        const fetchRecommendedBooks = async () => {
            const childIdx = sessionStorage.getItem('child_idx');
            const token = localStorage.getItem('jwtToken'); // JWT 토큰 가져오기

            if (!childIdx || !token) return;

            try {
                const response = await fetch(`https://kkuleogi.kro.kr/api/v1/book/${childIdx}/recommend`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Authorization 헤더 추가
                    }
                });
                const data = await response.json();

                if (data.success) {
                    setBookDetails(data.response);
                    const liked = {};
                    const disliked = {};
                    data.response.forEach(book => {
                        liked[book.idx] = book.isLike;
                        disliked[book.idx] = !book.isLike;
                    });
                    setLikedStatus(liked);
                    setDislikedStatus(disliked);
                } else {
                    console.error("추천 책 목록을 가져오는 데 실패했습니다.");
                }
            } catch (error) {
                console.error("추천 책 목록을 가져오는 중 오류 발생:", error);
            }
        };

        fetchRecommendedBooks();
    }, []);

    const handleBookClick = (index) => {
        setSelectedBook(index);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedBook(null);
    };

    const updateBookStatus = async (book, isLike) => {
        const childIdx = sessionStorage.getItem('child_idx');
        const token = localStorage.getItem('jwtToken'); // JWT 토큰 가져오기
        if (!childIdx || !token) return;

        const method = isLike ? 'POST' : 'DELETE';
        await fetch(`https://kkuleogi.kro.kr/api/v1/book/like`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` // Authorization 헤더 추가
            },
            body: JSON.stringify({ childIdx, bookIdx: book.idx, isLike }),
        });
    };

    const toggleLike = async () => {
        const book = bookDetails[selectedBook];

        if (dislikedStatus[book.idx]) {
            await updateBookStatus(book, false);
            setDislikedStatus(prev => ({ ...prev, [book.idx]: false }));
        }

        const isCurrentlyLiked = likedStatus[book.idx];
        await updateBookStatus(book, !isCurrentlyLiked);
        setLikedStatus(prev => ({ ...prev, [book.idx]: !isCurrentlyLiked }));
    };

    const toggleDislike = async () => {
        const book = bookDetails[selectedBook];

        if (likedStatus[book.idx]) {
            await updateBookStatus(book, true);
            setLikedStatus(prev => ({ ...prev, [book.idx]: false }));
        }

        const isCurrentlyDisliked = dislikedStatus[book.idx];
        await updateBookStatus(book, !isCurrentlyDisliked);
        setDislikedStatus(prev => ({ ...prev, [book.idx]: !isCurrentlyDisliked }));
    };

    return (
        <div>
            <Header />
            <div className='contents'>
                <h1>추천 책 목록</h1>
                <div className="book-list">
                    {bookDetails.map((book, index) => (
                        <div className="book-item" key={book.idx} onClick={() => handleBookClick(index)}>
                            <img src={`/image/book/book${book.idx}.jpg`} alt={`책 ${book.title}`} className="book-image" />
                            <p>{book.title}</p>
                        </div>
                    ))}
                </div>
            </div>
            {modalOpen && selectedBook !== null && (
                <div className='book-modal'>
                    <div className='book-modal-content'>
                        <img src={`/image/book/book${bookDetails[selectedBook].idx}.jpg`} alt={`책`} />
                        <span className='close' onClick={handleCloseModal}>&times;</span>
                        <h2>{bookDetails[selectedBook].title}</h2>
                        <p className='author'>{bookDetails[selectedBook].author}</p>
                        <div className='detail'>
                            <h2>이 책은요</h2>
                            <h3>줄거리</h3>
                            <p>{bookDetails[selectedBook].summary}</p>
                            <h3>MBTI</h3>
                            <div className='book-mbti'>
                                {bookDetails[selectedBook].mbti.split('').map((type) => (
                                    <div className='mbti-item' key={type}>
                                        <div className='circle'>{type}</div>
                                        <p className='description'>{mbtiDescriptions[type]}</p>
                                    </div>
                                ))}
                            </div>
                            <h3>나는 이 책이</h3>
                            <div className='like-dislike'>
                                <FaThumbsUp
                                    className={`like-icon ${likedStatus[bookDetails[selectedBook].idx] ? 'active' : ''}`}
                                    onClick={toggleLike}
                                />
                                <FaThumbsDown
                                    className={`dislike-icon ${dislikedStatus[bookDetails[selectedBook].idx] ? 'active' : ''}`}
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

export default RecommendList;
