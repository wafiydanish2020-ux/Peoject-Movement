const app = document.getElementById('app');
let mods = [];

// === PENGATURAN LINK SOSIAL MEDIA & DM DISCORD ===
const DISCORD_USER_ID = "1383097126040502303"; // ID Discord pribadimu
const MENU_DISCORD_LINK = "https://discord.gg/Qj6cvqsfy"; // Link server untuk menu navigasi atas
const MENU_YOUTUBE_LINK = "https://youtube.com/@AzrulPlayz";

// === DAFTAR LINK DISCORD STAFF CADANGAN (BISA DITAMBAHIN SENDIRI) ===
const STAFF_LINKS = [
  "https://discord.com/users/ID_STAFF_1_KAMU",
  "https://discord.com/users/ID_STAFF_2_KAMU",
  "https://discord.com/users/ID_STAFF_3_KAMU"
];

// Fungsi bantu untuk mengambil satu staff secara acak pas tombol diklik
function getStaffRandomLink() {
  const randomIndex = Math.floor(Math.random() * STAFF_LINKS.length);
  return STAFF_LINKS[randomIndex];
}

// Ambil data mods dari mods.json
fetch('data/project_names.json')
  .then(r => r.json())
  .then(d => {
    mods = d;
    renderBrowse();
  });

// Mengatur class CSS badge status secara otomatis
function getStatusBadgeClass(status) {
  if (!status) return 'status-release';
  const s = status.toLowerCase();
  if (s === 'early access') return 'status-early';
  if (s === 'alpha') return 'status-alpha';
  if (s === 'beta') return 'status-beta';
  return 'status-release';
}

// 1. Tampilan Beranda / Daftar Mod Utama
function renderBrowse() {
  document.getElementById('crumbBrowseContainer').style.display = 'inline';
  document.getElementById('dynamicCrumb').innerHTML = '';

  app.innerHTML = `
    <h1>Minecraft Bedrock Add-Ons</h1>
    <div class="small" style="margin-bottom: 16px;">${mods.length} projects available</div>
  ` + mods.map(m => {
    const isFree = m.price.toUpperCase() === 'FREE';
    return `
    <div class="mod-card" onclick="renderDetail('${m.id}')">
      <img class="thumb" src="${m.image}">
      <div style="flex: 1;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
          <b>${m.title}</b>
          <span class="status-badge-mini ${getStatusBadgeClass(m.status)}">${m.status || 'Release'}</span>
        </div>
        <div class="small" style="margin: 4px 0 8px 0;">${m.short_description}</div>
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
          <div>
            <span class="badge">${m.category}</span>
            <span class="badge">${m.minecraft_version}</span>
          </div>
          <span class="small-price ${isFree ? 'green' : 'gold'}">${m.price}</span>
        </div>
        <div class="small" style="margin-top: 6px; color: var(--text-dim);">${m.updated}</div>
      </div>
    </div>
    `;
  }).join('');
}

// 2. Tampilan Detail Utama
function renderDetail(id) {
  const m = mods.find(x => x.id === id);
  document.getElementById('crumbBrowseContainer').style.display = 'none';
  document.getElementById('dynamicCrumb').innerHTML = ` › <span class="small" style="color: var(--text-muted); font-weight: 500;">${m.title}</span>`;
  showDesc(m);
}

// Komponen Template Atas Header Detail (Dinamis Sesuai Tombol Install / Buy)
function getDetailHeaderHTML(m) {
  const statusClass = getStatusBadgeClass(m.status);
  const statusLabel = m.status || 'Release';
  const isFree = m.price.toUpperCase() === 'FREE';

  // AMAN & ADIL: Tombol utama tetep DM lu (Owner). Di bawahnya ada tombol random staff kalau lu slow respon.
  const actionButtonHTML = isFree 
    ? `<a class="cf-main-download-btn free-btn" href="${m.download_url}" target="_blank" rel="noopener" download>Install</a>`
    : `
      <a class="cf-main-download-btn buy-btn" href="https://discord.com/users/${DISCORD_USER_ID}" target="_blank" rel="noopener">Buy (Chat DM Gw)</a>
      <button class="help-btn" onclick="window.open(getStaffRandomLink(), '_blank')" style="margin-top: 10px; margin-bottom: 0px; font-size: 14px;">⏳ Owner Slow Respon? Hubungi Staff</button>
    `;

  return `
  <div class="cf-mobile-header">
    <img class="cf-mod-icon" src="${m.image}">
    <div class="cf-header-info">
      <h1 class="cf-title">${m.title}</h1>
      <span class="cf-status-badge ${statusClass}">${statusLabel}</span>
      <div class="cf-author-row">By <span class="cf-author-name">${m.author || 'Unknown'}</span></div>
    </div>
  </div>

  <div class="cf-summary-box">
    <p class="cf-short-desc">${m.short_description}</p>
    <div class="cf-stats-row">
      <div>
        <div class="cf-stats-label">Price</div>
        <div class="cf-stats-value ${isFree ? 'green' : 'gold'}">${m.price}</div>
      </div>
      <div>
        <div class="cf-stats-label">Last Update</div>
        <div class="cf-stats-value">${m.updated}</div>
      </div>
    </div>
  </div>

  <div class="cf-action-bar">
    ${actionButtonHTML}
  </div>
  `;
}

// Tab Deskripsi
function showDesc(m) {
  app.innerHTML = getDetailHeaderHTML(m) + `
  <div class="tab-switch">
    <div class="tab active" onclick="showDesc(currentMod)">Description</div>
    <div class="tab" onclick="showFiles(currentMod)">Files</div>
  </div>
  <div class="cf-tab-body">
    <p class="cf-full-description">${m.description}</p>
  </div>
  `;
  window.currentMod = m;
}

// Tab Files Informasi
function showFiles(m) {
  app.innerHTML = getDetailHeaderHTML(m) + `
  <div class="tab-switch">
    <div class="tab" onclick="showDesc(currentMod)">Description</div>
    <div class="tab active">Files</div>
  </div>
  <div class="cf-tab-body">
    <div class="info-box">
      <div class="row"><span>File Name</span><span style="font-family: monospace; font-size: 12px; color: var(--text-muted);">${m.file_name}</span></div>
      <div class="row"><span>Category</span><span>${m.category}</span></div>
      <div class="row"><span>Version</span><span>${m.version}</span></div>
      <div class="row"><span>Minecraft Version</span><span>${m.minecraft_version}</span></div>
    </div>
    <button class="help-btn" onclick="window.open('${MENU_DISCORD_LINK}', '_blank')">Get Help on Discord</button>
  </div>
  `;
  window.currentMod = m;
}

// Fungsi kembali ke Beranda utama
function goBackToBrowse() {
  renderBrowse();
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  const firstBtn = document.querySelector('.nav-btn');
  if (firstBtn) firstBtn.classList.add('active');
}

/* --- LOGIKA KLIK TOMBOL NAVIGASI HEADER --- */
document.getElementById('homeBtn').addEventListener('click', goBackToBrowse);
document.getElementById('crumbHome').addEventListener('click', goBackToBrowse);
document.getElementById('crumbBrowse').addEventListener('click', goBackToBrowse);

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const teksMenu = this.innerText.trim().toLowerCase();

    if (teksMenu === 'browse') {
      goBackToBrowse();
    } else if (teksMenu === 'discord') {
      window.open(MENU_DISCORD_LINK, '_blank');
    } else if (teksMenu === 'youtube') {
      window.open(MENU_YOUTUBE_LINK, '_blank');
    }
  });
});
