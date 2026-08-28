const authScreen = document.querySelector('#authScreen');
const dashboard = document.querySelector('#dashboard');
const authForm = document.querySelector('#authForm');
const switchAuth = document.querySelector('#switchAuth');
const authTitle = document.querySelector('#authTitle');
const authSubtitle = document.querySelector('#authSubtitle');
const authButtonText = document.querySelector('#authButtonText');
const switchText = document.querySelector('#switchText');
const formMessage = document.querySelector('#formMessage');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const togglePassword = document.querySelector('#togglePassword');
const logoutButton = document.querySelector('#logoutButton');
const newAccountButton = document.querySelector('#newAccountButton');
const activeCount = document.querySelector('#activeCount');
const dashboardActiveCount = document.querySelector('#dashboardActiveCount');
const memberModal = document.querySelector('#memberModal');
const addMemberButton = document.querySelector('#addMemberButton');
const closeModal = document.querySelector('#closeModal');
const memberForm = document.querySelector('#memberForm');
const leaderboard = document.querySelector('#leaderboard');
let isSignup = false;

const leaderboardNames = ['Md Sayem', 'Md Asik', 'Nusrat Jahan', 'Tanvir Hasan', 'Sadia Akter', 'Rafi Islam', 'Mim Sultana', 'Shuvo Ahmed', 'Jannat Ara', 'Arif Hossain'];
const leaderboardScores = leaderboardNames.map((name, index) => ({ name, completed: 54 - index * 3, identityCode: createIdentityCode() }));

function createIdentityCode() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const numbers = '23456789';
  const randomPart = (characters, length) => Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
  return `MMO-${randomPart(letters, 2)}${randomPart(numbers, 4)}`;
}

function renderLeaderboard() {
  leaderboard.innerHTML = leaderboardScores.map(({ name, completed, identityCode }, index) => {
    const rankClass = index < 3 ? ` rank-${index + 1}` : '';
    return `<div class="leader-row${rankClass}"><strong class="leader-rank">${String(index + 1).padStart(2, '0')}</strong><span class="leader-avatar">${name.charAt(0)}</span><span class="leader-name">${name}<small>${identityCode}</small></span><span class="leader-completed">${completed} <small>works complete</small></span></div>`;
  }).join('');
}

function increaseLeaderboardScores() {
  leaderboardScores.forEach((leader) => {
    leader.completed += 1 + Math.floor(Math.random() * 3);
  });
  renderLeaderboard();
  scheduleLeaderboardUpdate();
}

function scheduleLeaderboardUpdate() {
  const delay = (60 + Math.floor(Math.random() * 241)) * 1000;
  setTimeout(increaseLeaderboardScores, delay);
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('mmo-user'));
  } catch {
    return null;
  }
}

function setText(user) {
  const displayName = user.name || user.email.split('@')[0];
  document.querySelector('#userName').textContent = displayName;
  document.querySelector('#profileName').textContent = displayName;
  document.querySelector('#profileEmail').textContent = user.email;
  document.querySelector('#profileAvatar').textContent = displayName.charAt(0).toUpperCase();
}

function showDashboard(user) {
  setText(user);
  authScreen.hidden = true;
  dashboard.hidden = false;
}

function showAuth() {
  authScreen.hidden = false;
  dashboard.hidden = true;
}

function updateActiveUsers() {
  const count = Math.floor(100 + Math.random() * 101);
  activeCount.textContent = count;
  dashboardActiveCount.textContent = count;
}

switchAuth.addEventListener('click', () => {
  isSignup = !isSignup;
  document.querySelectorAll('.signup-only').forEach((element) => { element.style.display = isSignup ? 'block' : 'none'; });
  authTitle.textContent = isSignup ? 'Create your account' : 'Welcome back';
  authSubtitle.textContent = isSignup ? 'Join the community and unlock your workspace.' : 'Log in to view your work dashboard.';
  authButtonText.textContent = isSignup ? 'Create account' : 'Enter dashboard';
  switchText.textContent = isSignup ? 'Already a member?' : 'New here?';
  switchAuth.textContent = isSignup ? 'Log in instead' : 'Create an account';
  formMessage.textContent = '';
  authForm.reset();
});

togglePassword.addEventListener('click', () => {
  const showing = passwordInput.type === 'text';
  passwordInput.type = showing ? 'password' : 'text';
  togglePassword.textContent = showing ? 'Show' : 'Hide';
  togglePassword.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
});

authForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const user = { name: nameInput.value.trim(), email: emailInput.value.trim() };
  if (isSignup && !user.name) {
    formMessage.textContent = 'Please enter your name to continue.';
    nameInput.focus();
    return;
  }
  localStorage.setItem('mmo-user', JSON.stringify(user));
  formMessage.textContent = '';
  showDashboard(user);
});

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('mmo-user');
  showAuth();
  authForm.reset();
});

newAccountButton.addEventListener('click', () => {
  localStorage.removeItem('mmo-user');
  showAuth();
  authForm.reset();
  if (!isSignup) switchAuth.click();
});

function closeMemberModal() {
  memberModal.hidden = true;
}

addMemberButton.addEventListener('click', () => {
  memberModal.hidden = false;
  document.querySelector('#memberName').focus();
});
closeModal.addEventListener('click', closeMemberModal);
memberModal.addEventListener('click', (event) => { if (event.target === memberModal) closeMemberModal(); });
memberForm.addEventListener('submit', (event) => {
  event.preventDefault();
  closeMemberModal();
  memberForm.reset();
  addMemberButton.innerHTML = '<span>✓</span> Member added';
  setTimeout(() => { addMemberButton.innerHTML = '<span>+</span> Add member'; }, 2200);
});

document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMemberModal(); });

updateActiveUsers();
renderLeaderboard();
scheduleLeaderboardUpdate();
const currentUser = getStoredUser();
if (currentUser?.email) showDashboard(currentUser);
