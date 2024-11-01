import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import Header from '../components/Header';
import './css/MBTI.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function MBTI() {
  const navigate = useNavigate();
  const [mbtiData, setMbtiData] = useState({ mbti_e: [], mbti_j: [], mbti_s: [], mbti_t: [] });

  const handleStartTest = () => {
    navigate('/mbti/main');
  };

  const handleResetRecords = () => {
    console.log("기록이 초기화되었습니다.");
    setMbtiData({ mbti_e: [], mbti_j: [], mbti_s: [], mbti_t: [] });
  };

  useEffect(() => {
    const fetchChildMbtiData = async () => {
      const childIdx = sessionStorage.getItem('child_idx');
      const token = localStorage.getItem('jwtToken');
      console.log(childIdx);
      try {
        const response = await fetch(`http://localhost:8080/api/v1/child/mbti/logs/${childIdx}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setMbtiData({
            mbti_e: data.response.mbti_e,
            mbti_j: data.response.mbti_j,
            mbti_s: data.response.mbti_s,
            mbti_t: data.response.mbti_t,
          });
        } else {
          console.error("Failed to get mbti logs");
        }
      } catch (error) {
        console.error("Error get mbti logs:", error);
      }
    };
    fetchChildMbtiData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // 부모 컨테이너 크기에 맞게 그래프 조정
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14, // 범위에 맞게 폰트 크기 조정
            family: 'Comic Sans MS',
          },
          padding: 20, // 범례와 그래프 사이의 간격 조정
        },
      },
      title: {
        display: true,
        text: 'MBTI 변화 추이',
        font: {
          size: 18, // 제목 폰트 크기 조정
          family: 'Comic Sans MS',
        },
        color: '#333333',
        padding: {
          top: 20, // 제목과 그래프 사이의 위쪽 간격 조정
          bottom: 20, // 제목과 그래프 사이의 아래쪽 간격 조정
        },
      },
    },
    layout: {
      padding: {
        top: 20, // 그래프 위쪽 여백 조정
        bottom: 20, // 그래프 아래쪽 여백 조정
        left: 20, // 그래프 왼쪽 여백 조정
        right: 20, // 그래프 오른쪽 여백 조정
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '시간',
          font: {
            family: 'Comic Sans MS',
            size: 20,
          },
          padding: 20,
        },
        ticks: {
          display: false,
          padding: 25 // x축 레이블과 축 사이의 간격 조정
        },
      },
      y: {
        title: {
          display: false,
          text: '점수',
          font: {
            size: 12,
          },
        },
        ticks: {
          stepSize: 20, // y축 눈금 간격 조정
          font: {
            family: 'Comic Sans MS',
            size: 20,
          },
          padding: 25, // y축 레이블과 축 사이의 간격 조정
        },
        beginAtZero: true,
      },
    },
  };
  
  const chartData = {
    labels: mbtiData.mbti_e.map((_, index) => `Record ${index + 1}`),
    datasets: [
      {
        label: 'E 변화량',
        data: mbtiData.mbti_e,
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 255, 255, 1)', // 투명한 중심부를 위한 배경색 설정
        pointBorderColor: 'rgba(255, 99, 132, 1)', // 포인트 외곽선 색상
        pointBorderWidth: 1, // 포인트 외곽선의 두께
        pointRadius: 0, // 포인트 중심 크기 (작게 설정)
        lineTension: 0.4,
        fill: false,
        hidden: false
      },
      {
        label: 'J 변화량',
        data: mbtiData.mbti_j,
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 255, 255, 1)', // 투명한 중심부를 위한 배경색 설정
        pointBorderColor: 'rgba(54, 162, 235, 1)', // 포인트 외곽선 색상
        pointBorderWidth: 1, // 포인트 외곽선의 두께
        pointRadius: 0, // 포인트 중심 크기 (작게 설정)
        lineTension: 0.4,
        fill: false,
        hidden: true
      },
      {
        label: 'S 변화량',
        data: mbtiData.mbti_s,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 255, 255, 1)', // 투명한 중심부를 위한 배경색 설정
        pointBorderColor: 'rgba(75, 192, 192, 1)', // 포인트 외곽선 색상
        pointBorderWidth: 1, // 포인트 외곽선의 두께
        pointRadius: 0, // 포인트 중심 크기 (작게 설정)
        lineTension: 0.4,
        fill: false,
        hidden: true
      },
      {
        label: 'T 변화량',
        data: mbtiData.mbti_t,
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 255, 255, 1)', // 투명한 중심부를 위한 배경색 설정
        pointBorderColor: 'rgba(153, 102, 255, 1)', // 포인트 외곽선 색상
        pointBorderWidth: 1, // 포인트 외곽선의 두께
        pointRadius: 0, // 포인트 중심 크기 (작게 설정)
        lineTension: 0.4,
        fill: false,
        hidden: true
      },
    ],
  };

  return (
    <div>
      <Header />
      <div className='contents'>
        <h1>MBTI진단 기록</h1>
        <div className='mbti-box'>
          <div className='mbti-change'>
            <Line data={chartData} options={chartOptions} />
          </div>
          <div className='mbti-controls'> 
            <span className='reset-text' onClick={handleResetRecords}>
              기록 초기화
            </span>
          </div>
          <button onClick={handleStartTest}>진단 시작하기</button>
        </div>
      </div>
    </div>
  );
}

export default MBTI;