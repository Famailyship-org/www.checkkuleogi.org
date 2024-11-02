// src/data/questions.js
const questions = [
    {
        id: 1,
        text: '나는 이런 놀이가 더 좋아요!',
        idx: 1,
        options: [
            { img: '/image/mbti/1-1.png', text: '나는 내가 할 줄 아는 놀이가<br />편안해요.', value: 1 },
            { img: '/image/mbti/1-2.png', text: '나는 해보지 않은 새로운 놀이에 좀 더 호기심이 생겨요.', value: -1 }
        ]
        
    },
    {
        id: 2,
        text: '새로운 모둠 반에 처음 들어가게 되었어요!',
        idx: 0,
        options: [
            { img: '/image/mbti/2-1.png', text: '이때 나는 새로운 친구들과 <br/>어떻게 지낼까 걱정이 돼요.', value: -1 },
            { img: '/image/mbti/2-2.png', text: '이때 나는 새로운 친구들을 <br/>만나게 되어 신이 나요.', value: 1 }
        ]
    },
    {
        id: 3,
        text: '나는 친구를 이렇게 대해요!',
        idx: 2,
        options: [
            { img: '/image/mbti/3-1.png', text: '나는 친구에게 친절하게 <br/>대하는 것이 더 중요해요.', value: -1 },
            { img: '/image/mbti/3-2.png', text: '나는 친구에게 공평하게 <br/>대하는 것이 더 중요해요.', value: 1 }
        ]
    },
    {
        id: 4,
        text: '나는 하루를 보낼 때 이렇게 보내요!',
        idx: 3,
        options: [
            { img: '/image/mbti/4-1.png', text: '나는 하루를 보낼 때 <br/>특별한 계획 없이 <br/>즐겁게 보내는 것이 좋아요', value: -1 },
            { img: '/image/mbti/4-2.png', text: '나는 미리 정해 놓은 계획에 따라 하루를 즐겁게 보내는 것이 <br/>좋아요', value: 1 }
        ]
    },
    {
        id: 5,
        text: '나는 물건을 여기에 두어요!',
        idx: 3,
        options: [
            { img: '/image/mbti/5-1.png', text: '나는 하고 있던 놀이나 숙제를 <br/>계속 이어서 하기 위해 <br/>물건을 사용하고 나서 <br/>우선 적당한 곳에 두는 편이에요.', value: -1 },
            { img: '/image/mbti/5-2.png', text: '나는 사용했던 물건을 다음번에도 <br/>잘 찾을 수 있도록 <br/>사용하고 나서 정해진 자리에 <br/>두는 편이에요.', value: 1 }
        ]
    },
    {
        id: 6,
        text: '친구들과 블록쌓기 대회에 나갔어요!',
        idx: 2,
        options: [
            { img: '/image/mbti/6-1.png', text: '블록쌓기 대회에서 <br/>우리 모둠이 이기는 것보다 <br/>친구들과 함께 다투지 않고 <br/>즐겁게 협동하는 것이 더 중요해요.', value: -1 },
            { img: '/image/mbti/6-2.png', text: '친구들과 함께 블록쌓기 대회를 할 때 우리 모둠이 멋지게 만들어서 <br/>승리하는 것이 더 중요해요.', value: 1 }
        ]
    },
    {
        id: 7,
        text: '재미있는 생각을 해보았어요!',
        idx: 0,
        options: [
            { img: '/image/mbti/7-1.png', text: '나는 재미있는 생각이 떠오르면 <br/>친구나 가족에게 이야기를 <br/>나누는 것이 더 좋아요.', value: 1 },
            { img: '/image/mbti/7-2.png', text: '나는 나의 생각을 <br/>친구들에게 이야기하는 것보다 <br/>혼자서 생각하는 것이 더 좋아요.', value: -1 }
        ]
    },
    {
        id: 8,
        text: '오늘 수업 시간에 게임이나 만들기를 한대요!',
        idx: 1,
        options: [
            { img: '/image/mbti/8-1.png', text: '오늘은 새로운 방법으로 해보는 것이 더 재미있어요.', value: -1 },
            { img: '/image/mbti/8-2.png', text: '오늘 나는 전에 배웠던 방법으로 <br/>하는 것이 편해요.', value: 1 }
        ]
    },
    {
        id: 9,
        text: '친구가 울고있어요!',
        idx: 2,
        options: [
            { img: '/image/mbti/9-1.png', text: '친구가 울고 있을 때 나는 <br/>“친구와, 왜 울어?” 하고 <br/>왜 우는지 물어보는 편이에요.', value: 1 },
            { img: '/image/mbti/9-2.png', text: '친구가 울고 있을 때 나는 <br/>“친구야 울지마”하고 <br/>우선 달래주는 편이에요.', value: -1 }
        ]
    },
    {
        id: 10,
        text: '그림 그리기 시간에 종이를 받았어요!',
        idx: 1,
        options: [
            { img: '/image/mbti/10-1.png', text: '나는 흰 종이를 받아서 <br/>내가 그리고 싶은 그림을 <br/>멋지게 상상하여 그리는 것이 <br/>더 좋아요.', value: -1 },
            { img: '/image/mbti/10-2.png', text: '나는 미리 그려져 있는 종이를 받아서 예쁘게 색칠하고 꾸미는 것이 <br/>더 좋아요.', value: 1 }
        ]
    },
    {
        id: 11,
        text: '숙제 먼저? 놀이 먼저?',
        idx: 3,
        options: [
            { img: '/image/mbti/11-1.png', text: '나는 숙제를 해야할 때 <br/>빨리 시작해서 끝내놓고, <br/>그 뒤에 재미있게 노는 것이 <br/>더 좋아요.', value: 1 },
            { img: '/image/mbti/11-2.png', text: '나는 우선 재미있게 놀이를 하고, <br/>마지막에 집중해서 숙제를 하는 것이 더 좋아요.', value: -1 }
        ]
    },
    {
        id: 12,
        text: '친구와 이야기를 나누고 있어요!',
        idx: 0,
        options: [
            { img: '/image/mbti/12-1.png', text: '나는 친한 몇 명의 친구들과 <br/>이야기하는 것을 좋아하는 편이에요.', value: -1 },
            { img: '/image/mbti/12-2.png', text: '나는 친한 친구뿐만 아니라, <br/>처음 보는 친구들과도 <br/>쉽게 이야기를 하는 편이에요.', value: 1 }
        ]
    },
];

export default questions;
