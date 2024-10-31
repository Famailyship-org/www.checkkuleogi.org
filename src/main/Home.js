import React, { useState, useEffect } from 'react';
import './css/Home.css';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

function Home() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [books, setBooks] = useState([]);
    const [childIdx, setChildIdx] = useState(null); // childIdx 상태 추가
    const [bookDetails, setBookDetails] = useState(null); // 선택한 책의 상세정보 저장
    const [likedStatus, setLikedStatus] = useState([]); // 각 책의 좋아요 상태 저장
    const [dislikedStatus, setDislikedStatus] = useState([]); // 각 책의 싫어요 상태 저장

    useEffect(() => {
        // sessionStorage에서 child_idx 가져오기
        const idx = sessionStorage.getItem('child_idx');
        setChildIdx(idx);

        fetch("http://localhost:8080/api/v1/book")
            .then(response => response.json())
            .then(data => {
                setBooks(data.response.slice(0, 7)); // 전체 목록에서 7개만 가져옴
                fetchLikeDislikeStatus(idx); // 좋아요/싫어요 상태 가져오기
            })
            .catch(error => console.error("Error fetching books:", error));
    }, []);

    // 좋아요 및 싫어요 상태 가져오기
    const fetchLikeDislikeStatus = async (childIdx) => {
        if (!childIdx) return;

        try {
            const response = await fetch(`http://localhost:8080/api/v1/book/${childIdx}/like`);
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
        const bookIdx = books[index].idx; // 선택한 책의 idx
        setSelectedBook(index);
        setModalOpen(true);

        // API 호출하여 책 정보 조회
        try {
            const kidIdx = sessionStorage.getItem('child_idx'); // child_idx 가져오기
            const response = await fetch(`http://localhost:8080/api/v1/book/${bookIdx}?kidIdx=${kidIdx}`);
            const data = await response.json();
            if (data.success) {
                setBookDetails(data.response); // 가져온 책 정보 저장
            } else {
                console.error("Failed to fetch book details");
            }
        } catch (error) {
            console.error("Error fetching book details:", error);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedBook(null);
        setBookDetails(null); // 모달 닫을 때 선택한 책 정보 초기화
    };

    // 좋아요 등록/취소
    const toggleLike = async () => {
        const index = selectedBook;
        const book = bookDetails; // 현재 선택된 책
        const childIdx = sessionStorage.getItem('child_idx'); // childIdx 가져오기

        if (!childIdx) return;

        // 싫어요가 되어 있으면 해제
        if (dislikedStatus[index]) {
            await fetch(`http://localhost:8080/api/v1/book/like`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
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
            await fetch(`http://localhost:8080/api/v1/book/like`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
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
            await fetch(`http://localhost:8080/api/v1/book/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
        const book = bookDetails; // 현재 선택된 책
        const childIdx = sessionStorage.getItem('child_idx'); // childIdx 가져오기

        if (!childIdx) return;

        // 좋아요가 되어 있으면 해제
        if (likedStatus[index]) {
            await fetch(`http://localhost:8080/api/v1/book/like`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
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
            await fetch(`http://localhost:8080/api/v1/book/like`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
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
            await fetch(`http://localhost:8080/api/v1/book/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
                    <img src="image/main.png" alt="이벤트 배너" className="banner-image" />
                </div>
            </div>

            {childIdx ? ( // childIdx가 있으면 추천 책 목록 표시
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
            ) : null}

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

            {modalOpen && selectedBook !== null && bookDetails && ( // 책 정보가 있을 때만 모달 표시
                <div className='book-modal'>
                    <div className='book-modal-content'>
                        <img src={`/image/book/book${bookDetails.idx}.jpg`} alt="책" /> 
                        <span className='close' onClick={handleCloseModal}>&times;</span>
                        <h2>{bookDetails.title}</h2>
                        <p className='author'>{bookDetails.author}</p>
                        <div className='detail'>
                            <h2>이 책은요</h2>
                            <h3>줄거리</h3>
                            <p>{bookDetails.summary}</p>
                            <h3>MBTI</h3>
                            <div className='book-mbti'>
                                {bookDetails.mbti && bookDetails.mbti.split("").map((type) => (
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
