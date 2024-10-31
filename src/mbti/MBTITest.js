import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import questions from './questions'; // questions 데이터를 가져옴
import './css/MBTI.css';

function MBTITest() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [results, setResults] = useState([0, 0, 0, 0]); // idx가 0과 1이므로 초기값을 배열로 설정
    const navigate = useNavigate();

    const handleOptionClick = (option) => {
        const updatedResults = [...results];
        const question = questions[currentQuestionIndex];

        // 선택한 질문의 idx를 기준으로 결과 배열에 value를 누적
        updatedResults[question.idx] += option.value;
        setResults(updatedResults);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // 모든 질문이 끝났을 때 결과 처리 (예: 결과 페이지로 이동)
            console.log('결과:', updatedResults);
            navigate('/mbti/result', { state: { results: updatedResults } }); // results를 state로 전달
        }
    };

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div>
            <Header />
            <div className='contents'>
                <div className='mbti-box'>
                    <h1>{currentQuestion.text}</h1>
                    <div className='options'>
                        {currentQuestion.options.map((option, index) => (
                            <div
                                key={index}
                                className='option'
                                onClick={() => handleOptionClick(option)}
                            >
                                <img src={option.img} alt={option.text} />
                                <p>{option.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MBTITest;
