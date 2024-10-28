import React from 'react';
import Header from '../components/Header';
import './css/MBTI.css';

function MBTIResult() {
    const mbtiType = "조용하고 신비로운 INFJ"; // 결과 예시
    const description = "인내심이 많고 통찰력과 직관력이 뛰어나며, 화합을 추구하는 유형이다. 창의력이 좋으며, 성숙한 경우에는 강한 직관력으로 타인에게 말없이도 큰 영향을 끼친다.";
    const percentages = {
        EI: { E: 36, I: 64 },
        SN: { S: 45, N: 55 },
        TF: { T: 20, F: 80 },
        JP: { J: 95, P: 5 },
    };

    const renderProgressBar = (label1, value1, label2, value2) => {
        return (
            <div className='percentage-item'>
                <span>{label1} {value1}%</span>
                <div className='progress-bar' style={{ flexGrow: 1, margin: '0 10px', position: 'relative', backgroundColor: '#e0e0e0' }}>
                    {value1 > value2 ? (
                        <div 
                            className='progress' 
                            style={{ width: `${value1}%`, backgroundColor: '#fcbf1e', height: '100%', borderRadius: '5px' }} 
                        ></div>
                    ) : (
                        <div 
                            className='progress' 
                            style={{ 
                                width: `${value2}%`, 
                                backgroundColor: '#fcbf1e', 
                                position: 'absolute', 
                                right: 0,
                                transform: 'scaleX(-1)', 
                                height: '100%', 
                                borderRadius: '5px' 
                            }} 
                        ></div>
                    )}
                </div>
                <span>{value2}% {label2}</span>
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
                <button className='submit-button'>진단 기록하기</button>
            </div>
        </div>
    );
}

export default MBTIResult;
