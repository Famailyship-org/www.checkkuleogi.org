import React, { useState, useEffect } from 'react';
import './css/Home.css';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

function Home() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [books, setBooks] = useState([]); // 전체 책 목록을 저장
    const [recommendedBooks, setRecommendedBooks] = useState([]); // 추천 책 목록
    const [childIdx, setChildIdx] = useState(null); // 선택된 아이의 인덱스
    const [bookDetails, setBookDetails] = useState([]); // 책 상세 정보
    const [likedStatus, setLikedStatus] = useState([]); // 좋아요 상태
    const [dislikedStatus, setDislikedStatus] = useState([]); // 싫어요 상태
    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        const idx = sessionStorage.getItem('child_idx');
        setChildIdx(idx);
    
        fetchBooks(); // 항상 책 목록을 가져옵니다
    
        if (idx) {
            fetchLikeDislikeStatus(idx); // 좋아요 상태 가져오기
            if (token) {
                fetchRecommendedBooks(idx); // 추천 책 목록은 로그인한 경우만 가져옴
            }
        }
    }, [token]);
    
    const fetchBooks = async () => {
        try {
            const response = await fetch("https://kkuleogi.kro.kr/api/v1/book"); // JWT 토큰 없이 호출
            const data = await response.json();
            if (data.success) {
                const formattedData = data.response.map(book => ({
                    ...book,
                    mbti: book.mbti ? book.mbti.split('') : [] 
                }));
                setBooks(formattedData); // 전체 책 목록 업데이트
                setBookDetails(formattedData); // 책 상세 정보 업데이트
            }
        } catch (error) {
            console.error("Error fetching book data:", error);
        }
    };
    

    const fetchRecommendedBooks = async (childIdx) => {
        try {
            const response = await fetch(`https://kkuleogi.kro.kr/api/v1/book/${childIdx}/recommend`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setRecommendedBooks(data.response);
            } else {
                console.error("Failed to fetch recommended books");
            }
        } catch (error) {
            console.error("Error fetching recommended books:", error);
        }
    };

    const fetchLikeDislikeStatus = async (childIdx) => {
        if (!childIdx) return;
    
        try {
            const response = await fetch(`https://kkuleogi.kro.kr/api/v1/book/${childIdx}/like`, {
                headers: { 'Authorization': `Bearer ${token}` }
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
    

    const handleBookClick = async (index) => {
        if (!token) {
            alert("로그인 후 책 세부정보를 확인할 수 있습니다.");
            return;
        }

        const book = bookDetails[index];
        const childIdx = sessionStorage.getItem('child_idx');

        if (childIdx && book.idx) {
            try {
                await fetch(`https://kkuleogi.kro.kr/api/v1/book/${book.idx}?kidIdx=${childIdx}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}` // JWT 토큰을 헤더에 추가
                    }
                });
                console.log(`조회 기록 남김: book_idx=${book.idx}, kidIdx=${childIdx}`);
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
    const book = bookDetails[index];
    const childIdx = sessionStorage.getItem('child_idx');

    if (!childIdx) return;

    // 싫어요가 되어 있으면 해제
    if (dislikedStatus[index]) {
        await fetch("https://kkuleogi.kro.kr/api/v1/book/like", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 토큰 추가
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
        await fetch("https://kkuleogi.kro.kr/api/v1/book/like", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 토큰 추가
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
        await fetch("https://kkuleogi.kro.kr/api/v1/book/like", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 토큰 추가
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
        await fetch("https://kkuleogi.kro.kr/api/v1/book/like", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 토큰 추가
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
    }

    if (dislikedStatus[index]) {
        // 싫어요 취소
        await fetch("https://kkuleogi.kro.kr/api/v1/book/like", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 토큰 추가
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
    } else {
        // 싫어요 등록
        await fetch("https://kkuleogi.kro.kr/api/v1/book/like", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 토큰 추가
            },
            body: JSON.stringify({
                childIdx: childIdx,
                bookIdx: book.idx,
                isLike: false,
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
        <div className="header-container">
            <div className="search-container">
                <input type="text" placeholder="검색어를 입력하세요." className="search" />
                <button className="search-button">검색</button>
            </div>

            <div className="banner-container">
                <img src="image/eventbanner.png" alt="이벤트 배너" className="banner-image" onClick={() => window.location.href = '/event'}/>
            </div>
        </div>

        {/* jwtToken이 있을 경우 추천 책 목록을 표시합니다 */}
        {token && (
            <div className="book-container">
                <div className="content">
                    <h2>추천 책 목록</h2>
                    <a href="/book/recommend" className="view-all">전체 보기</a>
                </div>
                <div className="book-slider">
                    {recommendedBooks.slice(0, 7).map((book, index) => (
                        <div className="book-item" key={index} onClick={() => handleBookClick(index, recommendedBooks)}>
                            <img src={`/image/book/book${book.idx}.jpg`} alt={book.title} className="book-image" />
                            <p>{book.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* 전체 책 목록은 항상 표시 */}
        <div className="book-container">
            <div className="content">
                <h2>전체 책 목록</h2>
                <a href="/book" className="view-all">전체 보기</a>
            </div>
            <div className="book-slider">
                {books.slice(0, 7).map((book, index) => (
                    <div className="book-item" key={index} onClick={() => handleBookClick(index, books)}>
                        <img src={`/image/book/book${book.idx}.jpg`} alt={book.title} className="book-image" />
                        <p>{book.title}</p>
                    </div>
                ))}
            </div>
        </div>

            {modalOpen && selectedBook !== null && (
                <div className='book-modal' onClick={handleCloseModal}>
                    <div className='book-modal-content' onClick={(e) => e.stopPropagation()}>
                        <img src={`/image/book/book${bookDetails[selectedBook].idx}.jpg`} alt={bookDetails[selectedBook].title} />
                        <span className='close' onClick={handleCloseModal}>&times;</span>
                        <h2>{bookDetails[selectedBook].title}</h2>
                        <p className='author'>{bookDetails[selectedBook].author}</p>
                        <div className='detail'>
                            <h2>이 책은요</h2>
                            <h3>줄거리</h3>
                            <p>{bookDetails[selectedBook].summary}</p>
                            <h3>MBTI</h3>
                            <div className='book-mbti'>
                                {Array.isArray(bookDetails[selectedBook].mbti) ? (
                                    bookDetails[selectedBook].mbti.map((type) => (
                                        <div className='mbti-item' key={type}>
                                            <div className='circle'>{type}</div>
                                            <p className='description'>{mbtiDescriptions[type]}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>MBTI 정보가 없습니다.</p>
                                )}
                            </div>
                            {/* 좋아요 및 싫어요 버튼 */}
                            <h3>나는 이 책이</h3>
                            <div className='like-dislike'>
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

export default Home;
