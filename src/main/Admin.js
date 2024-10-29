import React, { useState } from 'react';
import Header from '../components/Header';
import './css/Admin.css';

// 데이터 배열에 ID 추가
const initialData = [
  { id: 1, title: '책 먹는 여우', author: '프란치스카 비어만', publisher: '주니어김영사', mbti: 'ENFJ' },
  { id: 2, title: '다시 만난 세계', author: '이선정', publisher: '문학동네', mbti: 'INFP' },
  { id: 3, title: '변화의 시기', author: '홍길동', publisher: '한빛미디어', mbti: 'INTJ' },
  { id: 4, title: '하루', author: '이수진', publisher: '웅진씽크빅', mbti: 'ISFJ' },
  { id: 5, title: '부의 추월차선', author: 'MJ 드마코', publisher: '부크온', mbti: 'ENTP' },
  { id: 6, title: '소설가 구보 씨의 일일', author: '유시민', publisher: '비채', mbti: 'ISFP' },
  { id: 7, title: '나무를 심는 사람', author: '장 드 포르', publisher: '이프', mbti: 'INFJ' },
  { id: 8, title: '하리포터', author: 'JK 롤링', publisher: '문학사상', mbti: 'ESFJ' },
  { id: 9, title: '지금 알고 있는 걸 그때도 알았더라면', author: '최인호', publisher: '문학과지성사', mbti: 'ESTP' },
  { id: 10, title: '이상한 나라의 앨리스', author: '루이스 캐럴', publisher: '범우사', mbti: 'ENTJ' },
  { id: 11, title: '상실의 시대', author: '무라카미 하루키', publisher: '문학동네', mbti: 'ISFJ' },
  // 더 많은 데이터...
];

function Admin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    summary: '',
    mbti: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedBook, setSelectedBook] = useState(null); // 수정용 상태
  const [bookData, setBookData] = useState(initialData); // 상태 관리용 데이터

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 페이지 변경 함수
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 현재 페이지의 데이터 가져오기
  const currentItems = bookData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenModal = (book = null) => {
    if (book) {
      setFormData(book); // 선택한 책 정보로 formData 채우기
      setSelectedBook(book); // 수정할 책 정보 설정
    } else {
      // 새로운 책을 추가하는 경우
      setFormData({
        title: '',
        author: '',
        publisher: '',
        summary: '',
        mbti: ''
      });
      setSelectedBook(null);
    }
    setIsModalOpen(true);
    setErrorMessage('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      title: '',
      author: '',
      publisher: '',
      summary: '',
      mbti: ''
    });
    setLoading(false);
    setSelectedBook(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(selectedBook ? `http://localhost:8080/api/v1/book/${selectedBook.id}` : 'http://localhost:8080/api/v1/book', {
        method: selectedBook ? 'PUT' : 'POST', // 선택한 책이 있을 때는 PUT으로 수정, 없을 때는 POST로 추가
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        console.log(selectedBook ? '수정 완료:' : '등록 완료:', result.response);
        // 수정된 책 데이터로 상태 업데이트
        if (selectedBook) {
          setBookData(bookData.map(book => (book.id === selectedBook.id ? { ...book, ...formData } : book)));
        } else {
          setBookData([...bookData, { ...formData, id: bookData.length + 1 }]); // 새 책 추가
        }
        handleCloseModal();
      } else {
        throw new Error(result.error || '다시 시도해주세요.');
      }
    } catch (error) {
      console.error(selectedBook ? '수정 실패:' : '등록 실패:', error);
      setErrorMessage(selectedBook ? '수정에 실패했습니다. 다시 시도해주세요.' : '등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 삭제
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/book/${id}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (result.success) {
          setBookData(bookData.filter(book => book.id !== id)); // 상태 업데이트
          console.log('삭제 완료:', result.response);
        } else {
          throw new Error(result.error || '삭제에 실패했습니다.');
        }
      } catch (error) {
        console.error('삭제 실패:', error);
        setErrorMessage('삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 페이지 수 계산
  const totalPages = Math.ceil(bookData.length / itemsPerPage);

  return (
    <div>
      <Header />
      <div className='contents'>
        <h1>관리자페이지</h1>
        
        <table className="admin-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>저자</th>
              <th>출판사</th>
              <th>MBTI</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item.id} onClick={() => handleOpenModal(item)}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{item.title}</td>
                <td>{item.author}</td>
                <td>{item.publisher}</td>
                <td>{item.mbti}</td>
                <td>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}>삭제</button> {/* 삭제 버튼 추가 */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              disabled={currentPage === index + 1}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button className='admin-add' onClick={() => handleOpenModal()}>추가하기</button>
      </div>

      {isModalOpen && (
        <div className='modal'>
          <div className='modal-content'>
            <h2>{selectedBook ? '책 수정' : '책 등록'}</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>제목</label>
                <input
                  type='text'
                  name='title'
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>저자</label>
                <input
                  type='text'
                  name='author'
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>출판사</label>
                <input
                  type='text'
                  name='publisher'
                  value={formData.publisher}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>줄거리</label>
                <textarea
                  name='summary'
                  value={formData.summary}
                  onChange={handleChange}
                  rows="4"
                  style={{ width: '100%' }}
                  required
                />
              </div>
              <button type='submit' disabled={loading}>
                {loading ? '처리중...' : selectedBook ? '수정 완료' : '등록 완료'}
              </button>
              <button type='button' onClick={handleCloseModal} disabled={loading}>
                닫기
              </button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
