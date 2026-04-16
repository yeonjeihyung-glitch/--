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

/**
 * 로그인 기록을 저장하는 함수
 */
function recordLogin(user) {
    const history = JSON.parse(localStorage.getItem('loginHistory') || '[]');
    const newEntry = {
        name: user.name,
        email: user.email,
        loginTime: new Date().toLocaleString()
    };
    
    // 최근 5개만 유지 (필요에 따라 조절)
    history.unshift(newEntry);
    localStorage.setItem('loginHistory', JSON.stringify(history.slice(0, 5)));
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

    // 로그인 정보 기록 저장
    recordLogin(user);

    // 로그인 세션 저장 및 애니메이션 플래그 설정
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

/**
 * 로그인 기록을 화면에 표시할 HTML 생성
 */
function getLoginHistoryHTML() {
    const history = JSON.parse(localStorage.getItem('loginHistory') || '[]');
    if (history.length === 0) return '';

    let html = `
        <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); width: 100%;">
            <p style="font-size: 11px; color: var(--petronas-cyan); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">최근 로그인 기록</p>
            <ul style="list-style: none; font-size: 13px; color: var(--text-muted);">
    `;
    
    history.forEach(entry => {
        html += `<li style="margin-bottom: 5px;">${entry.loginTime}</li>`;
    });

    html += `</ul></div>`;
    return html;
}

document.addEventListener('DOMContentLoaded', () => {
    const welcomeArea = document.getElementById('welcomeArea');
    const authButtons = document.getElementById('authButtons');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const playAnim = sessionStorage.getItem('playLoginAnimation');

    if (loggedInUser && welcomeArea && authButtons) {
        authButtons.style.display = 'none';

        const welcomeContent = `
            <div class="welcome-content">
                <h2 style="font-size: 28px; margin-bottom: 10px;">${loggedInUser.name}님, 환영합니다!</h2>
                <p style="color: rgba(255,255,255,0.7); margin-bottom: 20px;">오늘도 즐거운 하루 되세요.</p>
                <button onclick="handleLogout()" class="btn btn-secondary">로그아웃</button>
                ${getLoginHistoryHTML()}
            </div>
        `;

        if (playAnim === 'true') {
            sessionStorage.removeItem('playLoginAnimation');
            welcomeArea.classList.add('welcome-hidden');
            welcomeArea.innerHTML = welcomeContent;
            
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

            setTimeout(() => {
                car.classList.add('driving');
                setTimeout(() => {
                    welcomeArea.classList.remove('welcome-hidden');
                    welcomeArea.classList.add('welcome-visible');
                    setTimeout(() => car.remove(), 500);
                }, 1000);
            }, 100);
        } else {
            welcomeArea.innerHTML = welcomeContent;
        }
    }
});
