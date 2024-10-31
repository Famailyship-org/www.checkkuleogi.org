import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import './css/Book.css'; 

function BookList() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [bookDetails, setBookDetails] = useState([]);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);

    const fetchBooks = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/book");
            const data = await response.json();
            if (data.success) {
                const formattedData = data.response.map(book => ({
                    ...book,
                    mbti: book.mbti ? book.mbti.split('') : []  // MBTI 문자열을 배열로 변환
                }));
                setBookDetails(formattedData);
            }
        } catch (error) {
            console.error("Error fetching book data:", error);
        }
    };

    useEffect(() => {
        fetchBooks();
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
                <h1>전체 책 목록</h1>
                <div className="book-list">
                    {bookDetails.map((book, index) => (
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
                                {bookDetails[selectedBook].mbti.map((type) => (
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

export default BookList;
