import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import mbtiDescriptions from './mbtiDescription';
import './css/MBTI.css';

function MBTIResult() {
    const location = useLocation();
    const navigate = useNavigate(); // useNavigate 추가
    const { results } = location.state;

    const getMBTIResult = (results) => {
        const [EI, SN, TF, JP] = results;
        const mbtiType = [
            EI > 0 ? 'E' : 'I',
            SN > 0 ? 'S' : 'N',
            TF > 0 ? 'T' : 'F',
            JP > 0 ? 'J' : 'P'
        ].join('');

        const description = mbtiDescriptions[mbtiType] || "MBTI 결과를 확인할 수 없습니다.";
        return { mbtiType, description };
    };

    const { mbtiType, description } = getMBTIResult(results);

    const percentages = {
        EI: { 
            E: Math.round((Math.abs(results[0]) / 3) * 100), 
            I: Math.round(100 - (Math.abs(results[0]) / 3) * 100) 
        },
        SN: { 
            S: Math.round((Math.abs(results[1]) / 3) * 100), 
            N: Math.round(100 - (Math.abs(results[1]) / 3) * 100) 
        },
        TF: { 
            T: Math.round((Math.abs(results[2]) / 3) * 100), 
            F: Math.round(100 - (Math.abs(results[2]) / 3) * 100) 
        },
        JP: { 
            J: Math.round((Math.abs(results[3]) / 3) * 100), 
            P: Math.round(100 - (Math.abs(results[3]) / 3) * 100) 
        },
    };
    
    const [childName, setChildName] = useState('');

    useEffect(() => {
        const fetchChildData = async () => {
            const childIdx = sessionStorage.getItem('child_idx');
            try {
                const token = localStorage.getItem('jwtToken'); // JWT 토큰 가져오기
                const response = await fetch(`http://localhost:8080/api/v1/child/${childIdx}`, {
                    headers: {
                        'Authorization': `Bearer ${token}` // JWT를 Authorization 헤더에 추가
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setChildName(data.response.name);
                } else {
                    console.error("Failed to fetch child data");
                }
            } catch (error) {
                console.error("Error fetching child data:", error);
            }
        };

        fetchChildData();
    }, []);

    const handleSubmit = async () => {
        const surveys = results;
    
        try {
            const token = localStorage.getItem('jwtToken'); // JWT 토큰 가져오기
            const response = await fetch("http://localhost:8080/api/v1/child/mbti", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // JWT를 Authorization 헤더에 추가
                },
                body: JSON.stringify({
                    childName: childName,
                    surveys: surveys
                }),
            });
    
            const data = await response.json();
            if (data.success) {
                alert("MBTI 결과가 성공적으로 등록되었습니다.");
                window.location.href = '/';  // 성공 시 페이지 이동
            } else {
                alert("등록에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("서버와의 통신 중 오류가 발생했습니다.");
        }
    };
    
    

    const renderProgressBar = (label1, value1, label2, value2) => {
        return (
            <div className='percentage-item'>
                <span className='label'>{label1} {value1}%</span>
                <div className='progress-bar'>
                    {value1 > value2 ? (
                        <div 
                            className='progress' 
                            style={{ width: `${value1}%`, backgroundColor: '#fcbf1e' }} 
                        ></div>
                    ) : (
                        <div 
                            className='progress' 
                            style={{ 
                                width: `${value2}%`, 
                                backgroundColor: '#fcbf1e', 
                                position: 'absolute', 
                                right: 0,
                                transform: 'scaleX(-1)' 
                            }} 
                        ></div>
                    )}
                </div>
                <span className='value'>{value2}% {label2}</span>
            </div>
        );
    };

    return (
        <div>
            <Header />
            <div className='contents'>
                <h1>우리 아이 성향은?</h1>
                <div className='result-box'>
                    <div className='description-container'>
                        <div className='image-container'>
                            <img 
                                src='/image/profile.png'
                                alt='mbti이미지'
                                className='circular-image'
                            />
                        </div>
                        <div className='text-container'>
                            <h2>{mbtiType}</h2>
                            <p>{description}</p>
                        </div>
                    </div>
                    <div className='percentages'>
                        {renderProgressBar('E', percentages.EI.E, 'I', percentages.EI.I)}
                        {renderProgressBar('S', percentages.SN.S, 'N', percentages.SN.N)}
                        {renderProgressBar('T', percentages.TF.T, 'F', percentages.TF.F)}
                        {renderProgressBar('J', percentages.JP.J, 'P', percentages.JP.P)}
                    </div>
                </div>
                <button className='submit-button' onClick={handleSubmit}>진단 기록하기</button>
            </div>
        </div>
    );
}

export default MBTIResult;
