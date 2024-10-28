import React, { useState } from 'react';
import Header from '../components/Header';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import './css/Book.css'; 

function Likelist() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);

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

    const bookDetails = [
        {
            title: "책 먹는 여우",
            author: "프란시스카 비어만",
            description: "말 그대로 책을 읽은 후 소금과 후추를 뿌려서 먹는 여우 아저씨의 이야기. 가난한 탓에 전당포에 가구까지 팔아 가며 책을 사먹었으나, 여우 아저씨의 식탐은 더더욱 커지기만 했다. 묘책을 떠올린 여우는 국립 도서관으로 가서 도서를 대출한 뒤 마음껏 음미하기에 이르지만 도서관이 각종 민원에 시달리자 골머리를 앓던 사서의 의심이 '책을 빌릴 때마다 한 번도 돌려준 적이 없었던' 여우에게로 향한다." +
            "말 그대로 책을 읽은 후 소금과 후추를 뿌려서 먹는 여우 아저씨의 이야기. 가난한 탓에 전당포에 가구까지 팔아 가며 책을 사먹었으나, 여우 아저씨의 식탐은 더더욱 커지기만 했다. 묘책을 떠올린 여우는 국립 도서관으로 가서 도서를 대출한 뒤 마음껏 음미하기에 이르지만 도서관이 각종 민원에 시달리자 골머리를 앓던 사서의 의심이 '책을 빌릴 때마다 한 번도 돌려준 적이 없었던' 여우에게로 향한다.",
            mbti: ["E", "N", "F", "P"]
        },
        {
            title: "책 먹는 여우2",
            author: "프란시스카 비어만2",
            description: "책 그리거의 책을 읽을  기꺼이 읽을 편안한 가족의 고양이와 함께 이 책을 시작하세요.",
            mbti: ["I", "S", "T", "J"]
        },
    ];

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
                    {Array.from({ length: 10 }).map((_, index) => (
                        <div className="book-item" key={index} onClick={() => handleBookClick(index)}>
                            <img src={'/image/book.webp'} alt={`책 ${index + 1}`} className="book-image" /> 
                            <p>책 제목 {index + 1}</p>
                        </div>
                    ))}
                </div>
            </div>
            {modalOpen && selectedBook !== null && (
                <div className='book-modal'>
                    <div className='book-modal-content'>
                        <img src={'image/book.webp'} alt={`책`} /> 
                        <span className='close' onClick={handleCloseModal}>&times;</span>
                        <h2>{bookDetails[selectedBook].title}</h2>
                        <p className='author'>{bookDetails[selectedBook].author}</p>
                        <div className='detail'>
                            <h2>이 책은요</h2>
                            <h3>줄거리</h3>
                            <p>{bookDetails[selectedBook].description}</p>
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

export default Likelist;
