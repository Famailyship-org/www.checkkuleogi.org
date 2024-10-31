import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import './css/Book.css'; 

function RecentList() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [recentBooks, setRecentBooks] = useState([]);
    const [likedStatus, setLikedStatus] = useState([]); // 각 책의 좋아요 상태
    const [dislikedStatus, setDislikedStatus] = useState([]); // 각 책의 싫어요 상태

    const fetchRecentBooks = async () => {
        const childIdx = sessionStorage.getItem('child_idx');
        if (childIdx) {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/book/${childIdx}/recent`);
                const data = await response.json();
                if (data.success) {
                    setRecentBooks(data.response);

                    // 초기 좋아요/싫어요 상태 설정
                    const liked = data.response.map(book => book.isLike === true);
                    const disliked = data.response.map(book => book.isLike === false);
                    setLikedStatus(liked);
                    setDislikedStatus(disliked);
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
        setSelectedBook(index);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedBook(null);
    };

    const toggleLike = async () => {
        const index = selectedBook;
        const book = recentBooks[index];
        const childIdx = sessionStorage.getItem('child_idx');
        if (!childIdx) return;

        const newLikedStatus = !likedStatus[index];
        setLikedStatus(prev => {
            const newStatus = [...prev];
            newStatus[index] = newLikedStatus;
            return newStatus;
        });

        if (newLikedStatus) {
            await fetch(`http://localhost:8080/api/v1/book/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ childIdx, bookIdx: book.idx, isLike: true })
            });
            setDislikedStatus(prev => {
                const newStatus = [...prev];
                newStatus[index] = false;
                return newStatus;
            });
        } else {
            await fetch(`http://localhost:8080/api/v1/book/like`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ childIdx, bookIdx: book.idx, isLike: true })
            });
        }
    };

    const toggleDislike = async () => {
        const index = selectedBook;
        const book = recentBooks[index];
        const childIdx = sessionStorage.getItem('child_idx');
        if (!childIdx) return;

        const newDislikedStatus = !dislikedStatus[index];
        setDislikedStatus(prev => {
            const newStatus = [...prev];
            newStatus[index] = newDislikedStatus;
            return newStatus;
        });

        if (newDislikedStatus) {
            await fetch(`http://localhost:8080/api/v1/book/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ childIdx, bookIdx: book.idx, isLike: false })
            });
            setLikedStatus(prev => {
                const newStatus = [...prev];
                newStatus[index] = false;
                return newStatus;
            });
        } else {
            await fetch(`http://localhost:8080/api/v1/book/like`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ childIdx, bookIdx: book.idx, isLike: false })
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
            {modalOpen && selectedBook !== null && (
                <div className='book-modal'>
                    <div className='book-modal-content'>
                        <img src={`/image/book/book${recentBooks[selectedBook].idx}.jpg`} alt={recentBooks[selectedBook].title} className="book-image" /> 
                        <span className='close' onClick={handleCloseModal}>&times;</span>
                        <h2>{recentBooks[selectedBook].title}</h2>
                        <p className='author'>{recentBooks[selectedBook].author}</p>
                        <div className='detail'>
                            <h2>이 책은요</h2>
                            <h3>줄거리</h3>
                            <p>{recentBooks[selectedBook].summary}</p>
                            <h3>MBTI</h3>
                            <div className='book-mbti'>
                                {recentBooks[selectedBook].mbti.split('').map((type) => (
                                    <div className='mbti-item' key={type}>
                                        <div className='circle'>{type}</div>
                                        <p className='description'>{mbtiDescriptions[type]}</p>
                                    </div>
                                ))}
                            </div>
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

export default RecentList;
