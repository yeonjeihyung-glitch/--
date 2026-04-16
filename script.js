function navigateTo(url) {
    window.location.href = url;
}

function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('비밀번호가 일치가 일치하지 않습니다.');
        return;
    }

    const userData = {
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.some(user => user.email === email)) {
        alert('이미 가입된 이메일입니다.');
        return;
    }

    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));

    alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
    navigateTo('login.html');
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);

    if (!user) {
        alert('가입되지 않은 이메일입니다.');
        return;
    }

    if (user.password !== password) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    // 로그인 성공 시 세션 저장 및 애니메이션 플래그 설정
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    sessionStorage.setItem('playLoginAnimation', 'true');

    alert(user.name + '님, 환영합니다!');
    navigateTo('index.html');
}

function handleLogout() {
    localStorage.removeItem('loggedInUser');
    alert('로그아웃 되었습니다.');
    location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
    const welcomeArea = document.getElementById('welcomeArea');
    const authButtons = document.getElementById('authButtons');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const playAnim = sessionStorage.getItem('playLoginAnimation');

    if (loggedInUser && welcomeArea && authButtons) {
        authButtons.style.display = 'none';

        if (playAnim === 'true') {
            // 애니메이션 실행 로직
            sessionStorage.removeItem('playLoginAnimation'); // 다시 뜨지 않게 즉시 삭제
            
            // 환영 문구를 일단 가림
            welcomeArea.classList.add('welcome-hidden');
            
            // 자동차 아이콘(SVG) 생성
            const car = document.createElement('div');
            car.className = 'f1-car';
            car.innerHTML = `
                <svg width="400" height="150" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 30 L90 30 L85 20 L25 20 Z" fill="var(--petronas-cyan)" />
                    <circle cx="25" cy="32" r="6" fill="#000" stroke="var(--petronas-cyan)" stroke-width="2"/>
                    <circle cx="75" cy="32" r="6" fill="#000" stroke="var(--petronas-cyan)" stroke-width="2"/>
                    <path d="M40 20 L50 10 L70 20 Z" fill="var(--mercedes-silver)" />
                    <path d="M85 20 L95 20 L95 15 L85 15 Z" fill="var(--petronas-cyan)" />
                    <path d="M10 20 L5 20 L5 25 L10 25 Z" fill="var(--mercedes-silver)" />
                </svg>
            `;
            document.body.appendChild(car);

            // 짧은 지연 후 애니메이션 시작
            setTimeout(() => {
                car.classList.add('driving');
                
                // 자동차가 지나간 후 (1.2초 후) 환영 문구 표시
                setTimeout(() => {
                    welcomeArea.innerHTML = `
                        <div class="welcome-content">
                            <h2 style="font-size: 28px; margin-bottom: 10px;">${loggedInUser.name}님, 환영합니다!</h2>
                            <p style="color: rgba(255,255,255,0.7); margin-bottom: 20px;">오늘도 즐거운 하루 되세요.</p>
                            <button onclick="handleLogout()" class="btn btn-secondary">로그아웃</button>
                        </div>
                    `;
                    welcomeArea.classList.remove('welcome-hidden');
                    welcomeArea.classList.add('welcome-visible');
                    
                    // 자동차 엘리먼트 제거
                    setTimeout(() => car.remove(), 500);
                }, 1000);
            }, 100);
        } else {
            // 애니메이션 없이 바로 표시
            welcomeArea.innerHTML = `
                <div class="welcome-content">
                    <h2 style="font-size: 28px; margin-bottom: 10px;">${loggedInUser.name}님, 환영합니다!</h2>
                    <p style="color: rgba(255,255,255,0.7); margin-bottom: 20px;">오늘도 즐거운 하루 되세요.</p>
                    <button onclick="handleLogout()" class="btn btn-secondary">로그아웃</button>
                </div>
            `;
        }
    }
});
