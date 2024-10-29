import React, { useState } from 'react';
import Header from '../components/Header';
import './css/Admin.css';

const data = [
  { title: '책 먹는 여우', author: '프란치스카 비어만', publisher: '주니어김영사', mbti: 'ENFJ' },
  { title: '다시 만난 세계', author: '이선정', publisher: '문학동네', mbti: 'INFP' },
  { title: '변화의 시기', author: '홍길동', publisher: '한빛미디어', mbti: 'INTJ' },
  { title: '하루', author: '이수진', publisher: '웅진씽크빅', mbti: 'ISFJ' },
  { title: '부의 추월차선', author: 'MJ 드마코', publisher: '부크온', mbti: 'ENTP' },
  { title: '소설가 구보 씨의 일일', author: '유시민', publisher: '비채', mbti: 'ISFP' },
  { title: '나무를 심는 사람', author: '장 드 포르', publisher: '이프', mbti: 'INFJ' },
  { title: '하리포터', author: 'JK 롤링', publisher: '문학사상', mbti: 'ESFJ' },
  { title: '지금 알고 있는 걸 그때도 알았더라면', author: '최인호', publisher: '문학과지성사', mbti: 'ESTP' },
  { title: '이상한 나라의 앨리스', author: '루이스 캐럴', publisher: '범우사', mbti: 'ENTJ' },
  { title: '상실의 시대', author: '무라카미 하루키', publisher: '문학동네', mbti: 'ISFJ' },
  { title: '책 먹는 여우', author: '프란치스카 비어만', publisher: '주니어김영사', mbti: 'ENFJ' },
  { title: '다시 만난 세계', author: '이선정', publisher: '문학동네', mbti: 'INFP' },
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

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 페이지 변경 함수
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 현재 페이지의 데이터 가져오기
  const currentItems = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenModal = () => {
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
      const response = await fetch('http://localhost:8080/api/v1/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        console.log('등록 완료:', result.response);
        handleCloseModal();
      } else {
        throw new Error(result.error || '다시 시도해주세요.');
      }
    } catch (error) {
      console.error('등록 실패:', error);
      setErrorMessage('등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 페이지 수 계산
  const totalPages = Math.ceil(data.length / itemsPerPage);

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
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{item.title}</td>
                <td>{item.author}</td>
                <td>{item.publisher}</td>
                <td>{item.mbti}</td>
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

        <button className='admin-add' onClick={handleOpenModal}>추가하기</button>
      </div>

      {isModalOpen && (
        <div className='modal'>
          <div className='modal-content'>
            <h2>책 등록</h2>
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
                {loading ? '책MBTI 생성중...' : '등록 완료'}
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
