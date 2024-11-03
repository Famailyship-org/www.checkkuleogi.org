import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import './css/Book.css';

function BookList() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [bookDetails, setBookDetails] = useState([]);
    const [likedStatus, setLikedStatus] = useState([]);
    const [dislikedStatus, setDislikedStatus] = useState([]);
    const token = localStorage.getItem('jwtToken');

    const fetchBooks = async () => {
        try {
            const response = await fetch("http://kkuleogi.kro.kr/api/v1/book", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                const formattedData = data.response.map(book => ({
                    ...book,
                    mbti: book.mbti ? book.mbti.split('') : []
                }));
                setBookDetails(formattedData);
            }
        } catch (error) {
            console.error("Error fetching book data:", error);
        }
    };

    const fetchLikeDislikeStatus = async () => {
        const childIdx = sessionStorage.getItem('child_idx');
        if (!childIdx) return;
    
        try {
            const response = await fetch(`http://kkuleogi.kro.kr/api/v1/book/${childIdx}/like`, {
                headers: {
                    Authorization: `Bearer ${token}` // JWT 토큰을 헤더에 추가
                }
            });
            const data = await response.json();
            if (data.success) {
                const liked = data.response.map(item => item.isLike);
                const disliked = data.response.map(item => !item.isLike);
                setLikedStatus(liked);
                setDislikedStatus(disliked);
            }
        } catch (error) {
            console.error("Error fetching like/dislike status:", error);
        }
    };
    

    useEffect(() => {
        fetchBooks();
        fetchLikeDislikeStatus();
    }, [token]);

    const handleBookClick = async (index) => {
        if (!token) {
            alert("로그인 후 책 세부정보를 확인할 수 있습니다.");
            return;
        }
    
        const book = bookDetails[index];
        const childIdx = sessionStorage.getItem('child_idx');
    
        if (childIdx && book.idx) {
            try {
                const response = await fetch(`http://kkuleogi.kro.kr/api/v1/book/${book.idx}?kidIdx=${childIdx}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}` // JWT 토큰을 헤더에 추가
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                console.error("Error logging view:", error);
            }
        }
    
        setSelectedBook(index);
        setModalOpen(true);
    };
    

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedBook(null);
    };

// 좋아요 등록/취소
const toggleLike = async () => {
    const index = selectedBook;
    console.log(index + "Aa"); // 수정된 부분
    const book = bookDetails[index];
    const childIdx = sessionStorage.getItem('child_idx');

    if (!childIdx) return;

    // 싫어요가 되어 있으면 해제
    if (dislikedStatus[index]) {
        await fetch("http://kkuleogi.kro.kr/api/v1/book/like", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // JWT 토큰 추가
            },
            body: JSON.stringify({
                childIdx: childIdx,
                bookIdx: book.idx,
                isLike: false,
            }),
        });
        setDislikedStatus(prev => {
            const newStatus = [...prev];
            newStatus[index] = false;
            return newStatus;
        });
    }

    if (likedStatus[index]) {
        // 좋아요 취소
        await fetch("http://kkuleogi.kro.kr/api/v1/book/like", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // JWT 토큰 추가
            },
            body: JSON.stringify({
                childIdx: childIdx,
                bookIdx: book.idx,
                isLike: true,
            }),
        });
        setLikedStatus(prev => {
            const newStatus = [...prev];
            newStatus[index] = false;
            return newStatus;
        });
    } else {
        // 좋아요 등록
        await fetch("http://kkuleogi.kro.kr/api/v1/book/like", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // JWT 토큰 추가
            },
            body: JSON.stringify({
                childIdx: childIdx,
                bookIdx: book.idx,
                isLike: true,
            }),
        });
        setLikedStatus(prev => {
            const newStatus = [...prev];
            newStatus[index] = true;
            return newStatus;
        });
    }
};


    // 싫어요 등록/취소
const toggleDislike = async () => {
    const index = selectedBook;
    const book = bookDetails[index];
    const childIdx = sessionStorage.getItem('child_idx');

    if (!childIdx) return;

    // 좋아요가 되어 있으면 해제
    if (likedStatus[index]) {
        await fetch("http://kkuleogi.kro.kr/api/v1/book/like", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // JWT 토큰 추가
            },
            body: JSON.stringify({
                childIdx: childIdx,
                bookIdx: book.idx,
                isLike: true, // 좋아요 해제
            }),
        });
        setLikedStatus(prev => {
            const newStatus = [...prev];
            newStatus[index] = false;
            return newStatus;
        });
    }

    if (dislikedStatus[index]) {
        // 싫어요 취소
        await fetch("http://kkuleogi.kro.kr/api/v1/book/like", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // JWT 토큰 추가
            },
            body: JSON.stringify({
                childIdx: childIdx,
                bookIdx: book.idx,
                isLike: false, // 싫어요 해제
            }),
        });
        setDislikedStatus(prev => {
            const newStatus = [...prev];
            newStatus[index] = false;
            return newStatus;
        });
    } else {
        // 싫어요 등록
        await fetch("http://kkuleogi.kro.kr/api/v1/book/like", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // JWT 토큰 추가
            },
            body: JSON.stringify({
                childIdx: childIdx,
                bookIdx: book.idx,
                isLike: false, // 싫어요 등록
            }),
        });
        setDislikedStatus(prev => {
            const newStatus = [...prev];
            newStatus[index] = true;
            return newStatus;
        });
    }
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
            <div className="contents">
                <h1>전체 책 목록</h1>
                <div className="book-list-container">
                    <div className="book-list">
                        {bookDetails.map((book, index) => (
                            <div className="book-item" key={index} onClick={() => handleBookClick(index)}>
                                <img src={`/image/book/book${book.idx}.jpg`} alt={book.title} className="book-image" />
                                <p>{book.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {modalOpen && selectedBook !== null && (
                <div className="book-modal" onClick={handleCloseModal}>
                    <div className="book-modal-content" onClick={(e) => e.stopPropagation()}>
                        <img src={`/image/book/book${bookDetails[selectedBook].idx}.jpg`} alt={bookDetails[selectedBook].title} />
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>{bookDetails[selectedBook].title}</h2>
                        <p className="author">{bookDetails[selectedBook].author}</p>
                        <div className="detail">
                            <h2>이 책은요</h2>
                            <h3>줄거리</h3>
                            <p>{bookDetails[selectedBook].summary}</p>
                            <h3>MBTI</h3>
                            <div className="book-mbti">
                                {bookDetails[selectedBook].mbti.map((type) => (
                                    <div className="mbti-item" key={type}>
                                        <div className="circle">{type}</div>
                                        <p className="description">{mbtiDescriptions[type]}</p>
                                    </div>
                                ))}
                            </div>
    
                            <h3>나는 이 책이</h3>
                            <div className="like-dislike">
                                <FaThumbsUp
                                    className={`like-icon ${likedStatus[selectedBook] ? 'active' : ''}`}
                                    onClick={toggleLike}
                                />
                                <FaThumbsDown
                                    className={`dislike-icon ${dislikedStatus[selectedBook] ? 'active' : ''}`}
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
export default BookList;
