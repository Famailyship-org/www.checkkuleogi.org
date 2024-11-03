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
  const [currentMBTI, setCurrentMBTI] = useState("");
  const [childInfo, setChildInfo] = useState({ name: "" });

  const handleStartTest = () => navigate('/mbti/main');

  const handleResetRecords = async () => {
    if (window.confirm("정말로 진단 기록을 삭제하시겠습니까?")) {
      const token = localStorage.getItem('jwtToken');
      const childIdx = sessionStorage.getItem('child_idx');

      if (token && childIdx) {
        try {
          const response = await fetch("http://localhost:8080/api/v1/child/mbti", {
            method: "DELETE",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ childidx: childIdx })
          });

          const data = await response.json();
          if (response.ok && data.success) {
            console.log("기록이 초기화되었습니다.");
            setMbtiData({ mbti_e: [], mbti_j: [], mbti_s: [], mbti_t: [] });
          } else {
            console.error("기록 초기화 실패:", data.error);
          }
        } catch (error) {
          console.error("기록 삭제 중 오류 발생:", error);
        }
      }
    }
  };

  const fetchChildInfo = async () => {
    const token = localStorage.getItem('jwtToken');
    const childIdx = sessionStorage.getItem('child_idx');

    if (token && childIdx) {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/child/${childIdx}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setChildInfo(data.response);
        } else {
          console.error('아이 정보 불러오기 실패:', data.error);
        }
      } catch (error) {
        console.error('API 호출 오류:', error);
      }
    }
  };

  useEffect(() => {
    fetchChildInfo();

    const fetchData = async (url, callback) => {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) callback(data.response);
        else console.error("Failed to fetch data");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const childIdx = sessionStorage.getItem('child_idx');
    fetchData(`http://localhost:8080/api/v1/child/mbti/logs/${childIdx}`, (response) =>
      setMbtiData({
        mbti_e: response.mbti_e,
        mbti_j: response.mbti_j,
        mbti_s: response.mbti_s,
        mbti_t: response.mbti_t,
      })
    );
    fetchData(`http://localhost:8080/api/v1/child/mbti?childIdx=${childIdx}`, (response) =>
      setCurrentMBTI(response.mbti)
    );
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { size: 14, family: 'Comic Sans MS' },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'MBTI 변화 추이',
        font: { size: 18, family: 'Comic Sans MS' },
        color: '#333333',
        padding: { top: 20, bottom: 20 },
      },
    },
    layout: { padding: { top: 20, bottom: 20, left: 20, right: 20 } },
    scales: {
      x: {
        title: {
          display: true,
          text: '시간',
          font: { family: 'Comic Sans MS', size: 20 },
          padding: 20,
        },
        ticks: { display: false, padding: 25 },
      },
      y: {
        ticks: { stepSize: 20, font: { family: 'Comic Sans MS', size: 20 }, padding: 25 },
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
        pointBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointBorderColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 0,
        lineTension: 0.4,
        fill: false,
      },
      {
        label: 'J 변화량',
        data: mbtiData.mbti_j,
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointBorderColor: 'rgba(54, 162, 235, 1)',
        pointRadius: 0,
        lineTension: 0.4,
        fill: false,
        hidden: true,
      },
      {
        label: 'S 변화량',
        data: mbtiData.mbti_s,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointBorderColor: 'rgba(75, 192, 192, 1)',
        pointRadius: 0,
        lineTension: 0.4,
        fill: false,
        hidden: true,
      },
      {
        label: 'T 변화량',
        data: mbtiData.mbti_t,
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointBorderColor: 'rgba(153, 102, 255, 1)',
        pointRadius: 0,
        lineTension: 0.4,
        fill: false,
        hidden: true,
      },
    ],
  };

  return (
    <div>
      <Header />
      <div className='contents'>
        <div className='current-mbti-display'>
          <h1>MBTI진단 기록</h1>
          <h2>{childInfo.name} 어린이의 MBTI: <span>{currentMBTI}</span></h2>
        </div>
        <div className='mbti-box'>
          <div className='mbti-change' style={{ width: "800px" }}>
            <Line data={chartData} options={chartOptions} style={{ marginLeft: "-10px" }} />
          </div>
          <div className='mbti-controls'> 
            <span className='reset-text' onClick={handleResetRecords}>진단 기록 삭제하기</span>
          </div>
          <button onClick={handleStartTest}>MBTI진단하기</button>
        </div>
      </div>
    </div>
  );
}

export default MBTI;
