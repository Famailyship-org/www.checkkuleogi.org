import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from '../components/Header';
import './css/MBTI.css';

//mbti질문
const questions = [
    {
        id: 1,
        text: '어떤 것을 선호하시나요?',
        options: [
            { img: '/image/mbti/mbti1.png', text: '그림 1에 대한 설명입니다.' },
            { img: '/image/mbti/mbti2.png', text: '그림 2에 대한 설명입니다.' }
        ]
    },
    {
        id: 2,
        text: '어떤 상황이 더 편안한가요?',
        options: [
            { img: '/image/mbti/mbti2-1.jpeg', text: '그림 1에 대한 설명입니다.' },
            { img: '/image/mbti/mbti2-2.png', text: '그림 2에 대한 설명입니다.' }
        ]
    },
    // 추가 질문을 여기에 추가
];

function MBTITest() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [results, setResults] = useState([]);
    const navigate = useNavigate();


    const handleOptionClick = (option) => {
        setResults([...results, option]);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // 모든 질문이 끝났을 때 결과 처리 (예: 결과 페이지로 이동)
            console.log('결과:', results);
            // 결과 페이지로 이동하는 로직 추가 가능
            navigate('/mbti/result', { state: { results } });
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
                                onClick={() => handleOptionClick(option.text)} // 텍스트를 결과에 추가
                            >
                                <img src={option.img} alt={option.text}/>
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