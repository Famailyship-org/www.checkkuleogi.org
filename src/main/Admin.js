import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import './css/Admin.css';

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
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookData, setBookData] = useState([]);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/v1/book');
        const result = await response.json();
        if (result.success) {
            // 최신 등록 순으로 정렬
            const sortedBooks = result.response.sort((a, b) => b.idx - a.idx); // idx가 높은 책이 먼저 오도록 정렬
            setBookData(sortedBooks); // 서버에서 받은 데이터로 상태 업데이트
        } else {
            throw new Error(result.error || '책 목록을 불러오는 데 실패했습니다.');
        }
    } catch (error) {
        console.error('책 목록 가져오기 실패:', error);
        setErrorMessage('책 목록을 불러오는 데 실패했습니다.');
    }
};


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
      setFormData({
        title: '',
        author: '',
        publisher: '',
        summary: '',
        mbti: '' // MBTI는 초기화
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

    //수정 & 등록
    try {
      const response = await fetch(selectedBook ? `http://localhost:8080/api/v1/book/admin/${selectedBook.idx}` : 'http://localhost:8080/api/v1/book/admin', {
        method: selectedBook ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        if (selectedBook) {
          // 수정된 책 데이터로 상태 업데이트
          setBookData(bookData.map(book => (book.idx === selectedBook.idx ? { ...book, ...formData } : book)));
        } else {
          // 새 책 추가
          setBookData(prevData => [...prevData, result.response]); // 서버에서 받아온 데이터로 상태 업데이트
        }
        handleCloseModal();
        fetchBooks(); // 새로 추가된 책 목록을 가져옴
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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/book/admin/${id}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (result.success) {
          setBookData(bookData.filter(book => book.idx !== id)); // 상태 업데이트
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
              <tr key={item.idx} onClick={() => handleOpenModal(item)}>
                <td>{bookData.length - (currentPage - 1) * itemsPerPage - index}</td>
                <td>{item.title}</td>
                <td>{item.author}</td>
                <td>{item.publisher}</td>
                <td>{item.mbti}</td> {/* MBTI 값이 잘 출력되는지 확인 */}
                <td>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(item.idx); }}>삭제</button>
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
