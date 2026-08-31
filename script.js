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
const workModal = document.querySelector('#workModal');
const addMemberButton = document.querySelector('#addMemberButton');
const closeModal = document.querySelector('#closeModal');
const closeWorkModal = document.querySelector('#closeWorkModal');
const memberForm = document.querySelector('#memberForm');
const leaderboard = document.querySelector('#leaderboard');
const workModalBody = document.querySelector('#workModalBody');
const walletPoints = document.querySelector('#walletPoints');
const walletPointsPage = document.querySelector('#walletPointsPage');
const walletPage = document.querySelector('#walletPage');
const mainDashboardContent = document.querySelector('#mainDashboardContent');
const walletBackButton = document.querySelector('#walletBackButton');
const adPageGrid = document.querySelector('#adPageGrid');
const superZeroButton = document.querySelector('#superZeroButton');
const superZeroOutput = document.querySelector('#superZeroOutput');
let isSignup = false;
let walletPointsValue = Number(localStorage.getItem('mmo-wallet-points') || 0);

const leaderboardNames = ['Sayem', 'Md Asik', 'Nusrat Jahan', 'Tanvir Hasan', 'Sadia Akter', 'Rafi Islam', 'Mim Sultana', 'Shuvo Ahmed', 'Jannat Ara', 'Arif Hossain'];
const leaderboardScores = [
  { name: 'Sayem', completed: 500, identityCode: 'MMO-SY500+' },
  { name: 'Md Asik', completed: 260, identityCode: 'MMO-AS260' },
  { name: 'Nusrat Jahan', completed: 210, identityCode: 'MMO-NJ210' },
  { name: 'Tanvir Hasan', completed: 180, identityCode: 'MMO-TH180' },
  { name: 'Sadia Akter', completed: 170, identityCode: 'MMO-SA170' },
  { name: 'Mehedy Islam', completed: 160, identityCode: 'MMO-RI160' },
  { name: 'Mim Sultana', completed: 150, identityCode: 'MMO-MS150' },
  { name: 'Shuvo Ahmed', completed: 140, identityCode: 'MMO-SH140' },
  { name: 'Jannat Ara', completed: 130, identityCode: 'MMO-JA130' },
  { name: 'Arif Hossain', completed: 120, identityCode: 'MMO-AH120' }
];

function renderLeaderboard() {
  leaderboard.innerHTML = leaderboardScores.map(({ name, completed, identityCode }, index) => {
    const rankClass = index < 3 ? ` rank-${index + 1}` : '';
    const kingBadge = index === 0 ? '<span class="leader-king" aria-label="King">👑</span>' : '';
    const displayCompleted = name === 'Sayem' ? `${completed}+` : completed;
    return `<div class="leader-row${rankClass}"><strong class="leader-rank">${String(index + 1).padStart(2, '0')}</strong><span class="leader-avatar">${name.charAt(0)}</span><span class="leader-name">${name}${kingBadge}<small>${identityCode}</small></span><span class="leader-completed">${displayCompleted} <small>works complete</small></span></div>`;
  }).join('');
}

function increaseLeaderboardScores() {
  leaderboardScores.forEach((leader) => {
    leader.completed += 1;
  });
  renderLeaderboard();
}

function scheduleLeaderboardUpdate() {
  setInterval(increaseLeaderboardScores, 5 * 60 * 1000);
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

function updateWalletDisplay() {
  const points = Number(localStorage.getItem('mmo-wallet-points') || 0);
  walletPointsValue = points;
  if (walletPoints) {
    walletPoints.textContent = points;
  }
  if (walletPointsPage) {
    walletPointsPage.textContent = points;
  }
}

function renderWalletAdPage() {
  if (!adPageGrid) return;

  adPageGrid.innerHTML = '';
  for (let i = 1; i <= 100; i += 1) {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'ad-page-item';
    item.innerHTML = `<span>Ad ${String(i).padStart(2, '0')}</span><small>+1 point</small>`;
    item.addEventListener('click', () => {
      const current = Number(localStorage.getItem('mmo-wallet-points') || 0);
      const updated = current + 1;
      localStorage.setItem('mmo-wallet-points', String(updated));
      updateWalletDisplay();
      item.disabled = true;
      item.classList.add('claimed');
      item.innerHTML = `<span>Claimed</span><small>+1 point</small>`;
    });
    adPageGrid.appendChild(item);
  }
}

function showWalletPage() {
  if (mainDashboardContent) mainDashboardContent.hidden = true;
  if (walletPage) walletPage.hidden = false;
}

function showMainDashboard() {
  if (walletPage) walletPage.hidden = true;
  if (mainDashboardContent) mainDashboardContent.hidden = false;
}

function showDashboard(user) {
  setText(user);
  if (newAccountButton) newAccountButton.hidden = true;
  updateWalletDisplay();
  authScreen.hidden = true;
  dashboard.hidden = false;
}

function showAuth() {
  if (newAccountButton) newAccountButton.hidden = false;
  authScreen.hidden = false;
  dashboard.hidden = true;
}

function initializeApp() {
  const savedUser = getStoredUser();
  if (savedUser && savedUser.email) {
    showDashboard(savedUser);
    return;
  }

  const demoUser = { name: 'Sayem', email: 'sayem@example.com' };
  localStorage.setItem('mmo-user', JSON.stringify(demoUser));
  showDashboard(demoUser);
}

function updateActiveUsers() {
  const count = Math.floor(100 + Math.random() * 101);
  activeCount.textContent = count;
  dashboardActiveCount.textContent = count;
}

const workDetails = {
  exchange: {
    title: 'Exchange Money',
    html: `
      <div class="exchange-system">
        <div class="exchange-topbar">
          <div class="exchange-title-wrap">
            <p class="eyebrow">07</p>
            <h3>Exchange</h3>
          </div>
          <span class="status-chip">Live rate</span>
        </div>

        <div class="exchange-form-grid">
          <div class="exchange-panel">
            <label>You sent</label>
            <div class="exchange-row">
              <select class="currency-select send-currency">
                <option value="USDT">USDT</option>
                <option value="ETH">ETH</option>
                <option value="BTC">BTC</option>
                <option value="BNB">BNB</option>
                <option value="TRX">TRX</option>
                <option value="SOL">SOL</option>
                <option value="XRP">XRP</option>
                <option value="USDC">USDC</option>
              </select>
              <input type="text" value="500" />
            </div>
          </div>

          <button class="swap-button" type="button" aria-label="Swap currencies">⇅</button>

          <div class="exchange-panel receive-panel">
            <label>You receive</label>
            <div class="exchange-row">
              <select class="currency-select receive-currency">
                <option value="Bkash">Bkash</option>
                <option value="Nagad">Nagad</option>
                <option value="Binance">Binance</option>
                <option value="USDT">USDT</option>
                <option value="ETH">ETH</option>
                <option value="BTC">BTC</option>
                <option value="BNB">BNB</option>
                <option value="Bank">Bank</option>
              </select>
              <input type="text" value="53,700" />
            </div>
          </div>
        </div>

        <div class="rate-banner">
          <span>Sell rate</span>
          <strong>1 USDT = 104.80 BDT</strong>
          <span>Buy rate</span>
          <strong>1 BDT = 0.0095 USDT</strong>
        </div>

        <div class="payment-methods">
          <h4>Choice method</h4>
          <div class="method-grid">
            <button class="method-card active" type="button" data-method="USDT BEP-20">
              <span class="method-icon">🔐</span>
              <span>USDT BEP-20</span>
            </button>
            <button class="method-card" type="button" data-method="USDT TRC-20">
              <span class="method-icon">🪙</span>
              <span>USDT TRC-20</span>
            </button>
            <button class="method-card" type="button" data-method="ETH">
              <span class="method-icon">Ξ</span>
              <span>ETH</span>
            </button>
            <button class="method-card" type="button" data-method="BTC">
              <span class="method-icon">₿</span>
              <span>BTC</span>
            </button>
          </div>
        </div>

        <div class="address-box">
          <div class="address-header">
            <span>Send address</span>
            <button type="button" class="copy-button">Copy</button>
          </div>
          <div class="address-value">0xf85fa968c474f661ebc37a8a60fc21a85a832f19</div>
        </div>

        <div class="trx-box">
          <label>Transaction ID</label>
          <input type="text" value="TXN-EX-20260831-0147" />
        </div>

        <div class="details-box">
          <div>
            <span>Minimum</span>
            <strong>10 USDT</strong>
          </div>
          <div>
            <span>Fee</span>
            <strong>0.50%</strong>
          </div>
          <div>
            <span>Process</span>
            <strong>5-15 min</strong>
          </div>
        </div>

        <div class="action-row">
          <button class="primary-button exchange-next" type="button">Next <span>→</span></button>
        </div>

        <div class="exchange-target-panel" hidden>
          <div class="target-box">
            <div class="target-row">
              <span>Selected receive</span>
              <strong class="selected-target">Bkash</strong>
            </div>
            <div class="target-row">
              <span>Send address / number</span>
              <strong class="selected-address">0xf85fa968c474f661ebc37a8a60fc21a85a832f19</strong>
            </div>
            <label class="txn-label">TXN</label>
            <input type="text" class="txn-input" placeholder="Enter transaction hash or reference" />
            <button class="primary-button exchange-complete" type="button">Complete</button>
            <div class="complete-message" hidden>Complete</div>
          </div>
        </div>
      </div>
    `
  },
  'data-entry': {
    title: 'Data Entry Job',
    html: `
      <div class="work-modal-header">
        <p class="eyebrow">08</p>
        <h3>ডাটা এন্ট্রি কাজ</h3>
      </div>
      <div class="content-panel">
        <p>এই কাজটি মূলত তথ্য পূরণ, ফর্ম বসানো, আপলোড, কপি-পেস্ট, ছোট ছোট ডাটা সাজানো, এবং বাংলা/ইংরেজি কনটেন্ট এন্ট্রির উপর ভিত্তি করে করা হয়।</p>
        <p>আপনি যদি দীর্ঘ সময় ধরে ফর্ম বা টেক্সট এন্ট্রি করতে পছন্দ করেন, তাহলে এই জবটি আপনার জন্য খুবই উপযোগী। কাজটি সহজ, নির্ভরযোগ্য, এবং প্রতিদিনের জন্য ভালো অর্ডার পাওয়া যায়।</p>
        <ul>
          <li>ফর্ম পূরণ ও লিস্ট আপডেট</li>
          <li>বাংলা/ইংরেজি ডাটা প্রবেশ</li>
          <li>ছোট ছোট কপি-পেস্ট ও সাজানো</li>
          <li>নির্দিষ্ট সময়ের মধ্যে টাস্ক সম্পন্ন</li>
        </ul>
      </div>
    `
  },
  'lead-generation': {
    title: 'Lead Generation',
    html: `
      <div class="work-modal-header">
        <p class="eyebrow">09</p>
        <h3>Lead Generation Work</h3>
      </div>
      <div class="content-panel">
        <p>লিড জেনারেশন কাজের মাধ্যমে আপনি নতুন ক্লায়েন্ট, গ্রাহক, বা কন্টাক্ট এর তালিকা সাজিয়ে দেন। এই কাজটি স্বল্প প্রচেষ্টায় বড় ফলাফল দেয়।</p>
        <p>আপনি প্রোফাইল খুঁজে বের করতে পারেন, তথ্য সংগ্রহ করতে পারেন, এবং সেগুলো সুন্দরভাবে সাজিয়ে দিতে পারেন, যাতে বিক্রয় বা কনট্যাক্টিং-এ ব্যবহার করা যায়।</p>
        <ul>
          <li>গবেষণা ও কন্টাক্ট সংগ্রহ</li>
          <li>ক্লায়েন্টের তালিকা তৈরি</li>
          <li>সার্বিক তথ্য সংরক্ষণ</li>
          <li>বিজনেস ও মার্কেটিং সহায়ক</li>
        </ul>
      </div>
    `
  },
  'api-key': {
    title: 'API Key Buy & Sell',
    html: `
      <div class="work-modal-header">
        <p class="eyebrow">10</p>
        <h3>API Key Buy &amp; Sell</h3>
      </div>
      <div class="content-panel">
        <p>এটি একটি লাইভ মার্কেটপ্লেস-ভিত্তিক কাজ যেখানে API key, access key, বা related digital asset কেনা-বেচা হয়।</p>
        <p>সুরক্ষিত লেনদেন, ট্রাস্টেড ডিল, এবং ম্যাচিং প্রক্রিয়া ঠিক রেখে কাজটি পরিচালনা করা হয়। নতুন ডিল খুঁজে পাওয়া, যাচাই করা, এবং নিরাপদ ডেলিভারি নিশ্চিত করাই এখানে মূল বিষয়।</p>
        <ul>
          <li>API access key খোঁজা</li>
          <li>ভ্যালিডেশন ও যাচাইকরণ</li>
          <li>মার্কেট মূল্য বিচার</li>
          <li>সুরক্ষিত ট্রেড ও ডেলিভারি</li>
        </ul>
      </div>
    `
  }
};

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

if (newAccountButton) {
  newAccountButton.addEventListener('click', () => {
    localStorage.removeItem('mmo-user');
    showAuth();
    authForm.reset();
    if (!isSignup) switchAuth.click();
  });
}

function closeMemberModal() {
  memberModal.hidden = true;
}

function closeDetailModal() {
  workModal.hidden = true;
}

function openWalletMenu() {
  const walletWrap = document.querySelector('#walletEarningWrap');
  const panel = document.querySelector('#walletMenuPanel');
  const menuButton = document.querySelector('.wallet-menu');
  const adPanel = document.querySelector('.ad-panel');

  if (walletWrap) walletWrap.hidden = false;
  if (panel) panel.hidden = false;
  if (menuButton) menuButton.setAttribute('aria-expanded', 'true');

  document.querySelectorAll('.wallet-menu-item').forEach((item) => {
    item.classList.toggle('active', item.textContent.trim() === 'Withdraw');
  });

  const walletPanel = document.querySelector('.wallet-panel');
  if (walletPanel) walletPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  if (adPanel) adPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function attachExchangeInteractions() {
  const methodCards = workModalBody.querySelectorAll('.method-card');
  methodCards.forEach((button) => {
    button.addEventListener('click', () => {
      methodCards.forEach((item) => item.classList.toggle('active', item === button));
    });
  });

  const copyButton = workModalBody.querySelector('.copy-button');
  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      const address = '0xf85fa968c474f661ebc37a8a60fc21a85a832f19';
      try {
        await navigator.clipboard.writeText(address);
        copyButton.textContent = 'Copied';
        setTimeout(() => { copyButton.textContent = 'Copy'; }, 1200);
      } catch {
        copyButton.textContent = 'Copy failed';
        setTimeout(() => { copyButton.textContent = 'Copy'; }, 1200);
      }
    });
  }

  const swapButton = workModalBody.querySelector('.swap-button');
  if (swapButton) {
    swapButton.addEventListener('click', () => {
      const fromSelect = workModalBody.querySelector('.send-currency');
      const toSelect = workModalBody.querySelector('.receive-currency');
      const fromValue = fromSelect.value;
      fromSelect.value = toSelect.value;
      toSelect.value = fromValue;
    });
  }

  const nextButton = workModalBody.querySelector('.exchange-next');
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      const receiveSelect = workModalBody.querySelector('.receive-currency');
      const sendSelect = workModalBody.querySelector('.send-currency');
      const selectedReceive = receiveSelect.value;
      const selectedSend = sendSelect.value;
      const receiveTargetMap = {
        Bkash: '01862332796',
        Nagad: '01862332796',
        Binance: 'binace9374168226',
        Bank: 'Bank account: 01521436521',
        USDT: '0xf85fa968c474f661ebc37a8a60fc21a85a832f19',
        ETH: '0xf85fa968c474f661ebc37a8a60fc21a85a832f19',
        BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        BNB: 'bnb1xj4d8u8p4m3p0z3j3p0s6m0x2q5w6t4k5v7h7n',
        TRX: 'TQzv2B9M6G7dR5U1jQ4rL8y4Tn7dA3v8b7',
        SOL: '7QFJj3mC4Yw4RkVd7Pp1J1YdJm2x1Xk2L6',
        XRP: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
        USDC: '0xf85fa968c474f661ebc37a8a60fc21a85a832f19'
      };
      const sendAddressMap = {
        USDT: '0xf85fa968c474f661ebc37a8a60fc21a85a832f19',
        ETH: '0xf85fa968c474f661ebc37a8a60fc21a85a832f19',
        BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        BNB: 'bnb1xj4d8u8p4m3p0z3j3p0s6m0x2q5w6t4k5v7h7n',
        TRX: 'TQzv2B9M6G7dR5U1jQ4rL8y4Tn7dA3v8b7',
        SOL: '7QFJj3mC4Yw4RkVd7Pp1J1YdJm2x1Xk2L6',
        XRP: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
        USDC: '0xf85fa968c474f661ebc37a8a60fc21a85a832f19'
      };
      const selectedTarget = workModalBody.querySelector('.selected-target');
      const selectedAddress = workModalBody.querySelector('.selected-address');
      const targetPanel = workModalBody.querySelector('.exchange-target-panel');
      const txInput = workModalBody.querySelector('.txn-input');

      selectedTarget.textContent = selectedReceive;
      selectedAddress.textContent = receiveTargetMap[selectedReceive] || sendAddressMap[selectedSend] || '0xf85fa968c474f661ebc37a8a60fc21a85a832f19';
      txInput.value = '';
      targetPanel.hidden = false;
      targetPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  const completeButton = workModalBody.querySelector('.exchange-complete');
  if (completeButton) {
    completeButton.addEventListener('click', () => {
      const message = workModalBody.querySelector('.complete-message');
      const txInput = workModalBody.querySelector('.txn-input');
      if (message) {
        message.hidden = false;
        message.textContent = txInput.value.trim() ? 'Complete' : 'Complete';
      }
    });
  }
}

document.querySelectorAll('.work-card-button').forEach((card) => {
  card.addEventListener('click', () => {
    const type = card.dataset.workType;

    if (type === 'wallet') {
      showWalletPage();
      return;
    }

    const info = workDetails[type];
    if (!info) return;
    workModalBody.innerHTML = info.html;
    workModal.hidden = false;

    if (type === 'exchange') {
      attachExchangeInteractions();
    }
  });
});

addMemberButton.addEventListener('click', () => {
  memberModal.hidden = false;
  document.querySelector('#memberName').focus();
});
closeModal.addEventListener('click', closeMemberModal);
closeWorkModal.addEventListener('click', closeDetailModal);
memberModal.addEventListener('click', (event) => { if (event.target === memberModal) closeMemberModal(); });
workModal.addEventListener('click', (event) => { if (event.target === workModal) closeDetailModal(); });
memberForm.addEventListener('submit', (event) => {
  event.preventDefault();
  closeMemberModal();
  memberForm.reset();
  addMemberButton.innerHTML = '<span>✓</span> Member added';
  setTimeout(() => { addMemberButton.innerHTML = '<span>+</span> Add member'; }, 2200);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMemberModal();
    closeDetailModal();
  }
});

if (walletBackButton) {
  walletBackButton.addEventListener('click', showMainDashboard);
}

if (superZeroButton) {
  superZeroButton.addEventListener('click', () => {
    const links = [
      'https://omg10.com/4/9919097',
      'https://omg10.com/4/9910698',
      'https://omg10.com/4/9919093',
      'https://omg10.com/4/9887192',
      'https://omg10.com/4/9904168',
      'https://omg10.com/4/9919095',
      'https://omg10.com/4/9879421',
      'https://omg10.com/4/9919104',
      'https://omg10.com/4/9910700',
      'https://omg10.com/4/9910707',
      'https://omg10.com/4/9919108',
      'https://omg10.com/4/9919088',
      'https://omg10.com/4/9910706',
      'https://omg10.com/4/9919091',
      'https://omg10.com/4/9910708'
    ];
    const randomLink = links[Math.floor(Math.random() * links.length)];

    if (superZeroOutput) {
      superZeroOutput.hidden = false;
      superZeroOutput.innerHTML = 'Loading random link...';
      setTimeout(() => {
        superZeroOutput.innerHTML = `<a href="${randomLink}" target="_blank" rel="noopener">${randomLink}</a>`;
      }, 10000);
    }
  });
}

document.addEventListener('click', (event) => {
  const walletMenuButton = event.target.closest('.wallet-menu');
  if (walletMenuButton) {
    const panel = document.querySelector('#walletMenuPanel');
    if (!panel) return;
    const isOpen = !panel.hidden;
    panel.hidden = isOpen;
    walletMenuButton.setAttribute('aria-expanded', String(!isOpen));
    return;
  }

  const walletMenuItem = event.target.closest('.wallet-menu-item');
  if (walletMenuItem) {
    document.querySelectorAll('.wallet-menu-item').forEach((item) => item.classList.toggle('active', item === walletMenuItem));
    const panel = document.querySelector('#walletMenuPanel');
    if (panel) panel.hidden = true;
    const button = document.querySelector('.wallet-menu');
    if (button) button.setAttribute('aria-expanded', 'false');
    return;
  }

  const adButton = event.target.closest('.ad-item');
  if (!adButton) return;

  const current = Number(localStorage.getItem('mmo-wallet-points') || 0);
  const updated = current + 1;
  localStorage.setItem('mmo-wallet-points', String(updated));
  updateWalletDisplay();

  adButton.disabled = true;
  adButton.classList.add('ad-claimed');
  adButton.innerHTML = '<span class="ad-tag">Claimed</span><strong>Ad watched</strong><small>+1 point added</small>';
});

renderWalletAdPage();
updateActiveUsers();
updateWalletDisplay();
renderLeaderboard();
scheduleLeaderboardUpdate();

const savedUser = getStoredUser();
if (savedUser && savedUser.email) {
  showDashboard(savedUser);
} else {
  const demoUser = { name: 'Sayem', email: 'sayem@example.com' };
  localStorage.setItem('mmo-user', JSON.stringify(demoUser));
  showDashboard(demoUser);
}
