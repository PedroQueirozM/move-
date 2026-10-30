/**
 * Move+ · RF01 Gerenciar Agendamentos
 * Script compartilhado de controle de estado e navegação
 */

const fmt = m => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
const NOW = 600; // 10:00
const LIM = 120; // 2 horas (em minutos)

const DEFAULT_CLASSES = [
  { id: 1, n: 'Funcional', t: 720, cap: 20, b: 12, p: 'Prof. Marcos', r: 'Sala 1' },
  { id: 2, n: 'Spinning', t: 1080, cap: 20, b: 20, p: 'Prof. Júlia', r: 'Sala 2' },
  { id: 3, n: 'Yoga', t: 1140, cap: 20, b: 19, p: 'Prof. Lia', r: 'Sala 3' },
  { id: 4, n: 'Pilates', t: 840, cap: 15, b: 9, p: 'Prof. Rita', r: 'Sala 3' },
  { id: 5, n: 'Alongamento', t: 719, cap: 15, b: 10, p: 'Prof. Lia', r: 'Sala 3' },
  { id: 6, n: 'Hidroginástica', t: 900, cap: 15, b: 8, p: 'Prof. Caio', r: 'Piscina' }
];

const DEFAULT_STATE = {
  sc: 'T01',
  u: 'ana',
  cl: 1,
  mine: [1, 5, 6],
  fila: [],
  att: {},
  last: 'Carlos Pires'
};

const SCREEN_PAGES = {
  T01: 't01-aulas.html',
  T02: 't02-detalhes.html',
  T03: 't03-confirmar.html',
  T04: 't04-confirmada.html',
  T05: 't05-recusa-inadimplente.html',
  T06: 't06-fila.html',
  T07: 't07-meus-agendamentos.html',
  T08: 't08-cancelar.html',
  T09: 't09-cancelado.html',
  T10: 't10-recusa-prazo.html',
  T11: 't11-recepcao.html',
  T12: 't12-falta.html'
};

const SCREEN_NAMES = {
  T01: 'Aulas',
  T02: 'Detalhe',
  T03: 'Confirmar',
  T04: 'Confirmada',
  T05: 'Recusa inadimpl.',
  T06: 'Fila',
  T07: 'Meus agend.',
  T08: 'Cancelar',
  T09: 'Cancelado',
  T10: 'Recusa prazo',
  T11: 'Recepção',
  T12: 'Falta'
};

let C = null;
let S = null;

function loadState() {
  try {
    const rawC = localStorage.getItem('move_plus_classes');
    const rawS = localStorage.getItem('move_plus_state');
    if (rawC && rawS) {
      C = JSON.parse(rawC);
      S = JSON.parse(rawS);
      return;
    }
  } catch (e) {
    console.warn('LocalStorage não disponível', e);
  }
  C = JSON.parse(JSON.stringify(DEFAULT_CLASSES));
  S = JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function saveState() {
  try {
    localStorage.setItem('move_plus_classes', JSON.stringify(C));
    localStorage.setItem('move_plus_state', JSON.stringify(S));
  } catch (e) {
    console.warn('Não foi possível salvar no LocalStorage', e);
  }
}

const cl = () => C.find(c => c.id == S.cl) || C[0];
const vg = c => c.cap - c.b;

function renderTopBar(activeScreen) {
  const barEl = document.getElementById('top-bar');
  if (!barEl) return;

  const mapButtons = Object.keys(SCREEN_NAMES).map(k => {
    const defaultId = k === 'T06' ? 2 : k === 'T10' ? 5 : 1;
    const isCurrent = k === activeScreen;
    return `<button class="${isCurrent ? 'on' : ''}" onclick="go('${k}', ${defaultId})">${k} ${SCREEN_NAMES[k]}</button>`;
  }).join('');

  barEl.innerHTML = `
    <b>Move+ · RF01 Gerenciar Agendamentos</b> — protótipo de média fidelidade (hora simulada: <b>10:00</b>)
    <div class="row">
      <span>Aluno:</span>
      <select id="usr" onchange="changeUser(this.value)">
        <option value="ana" ${S.u === 'ana' ? 'selected' : ''}>Ana (contrato ativo)</option>
        <option value="bruno" ${S.u === 'bruno' ? 'selected' : ''}>Bruno (inadimplente)</option>
      </select>
      <button onclick="go('T01')">Visão Aluno</button>
      <button onclick="go('T11', 1)">Visão Recepção</button>
      <button onclick="resetData()">Reiniciar dados</button>
    </div>
    <div class="row" id="map">
      <span class="mu">Ir para:</span>
      ${mapButtons}
    </div>
  `;
}

function changeUser(val) {
  loadState();
  S.u = val;
  saveState();
  window.location.reload();
}

function resetData() {
  C = JSON.parse(JSON.stringify(DEFAULT_CLASSES));
  S = JSON.parse(JSON.stringify(DEFAULT_STATE));
  const usrEl = document.getElementById('usr');
  if (usrEl) S.u = usrEl.value;
  saveState();
  window.location.href = SCREEN_PAGES.T01;
}

function go(sc, id) {
  loadState();
  S.sc = sc;
  if (id !== undefined && id !== null) {
    S.cl = parseInt(id, 10);
  }
  saveState();
  const page = SCREEN_PAGES[sc] || SCREEN_PAGES.T01;
  const url = id ? `${page}?id=${id}` : page;
  window.location.href = url;
}

function conf() {
  loadState();
  const c = cl();
  if (S.u === 'bruno') {
    return go('T05');
  }
  c.b++;
  if (!S.mine.includes(c.id)) {
    S.mine.push(c.id);
  }
  saveState();
  go('T04');
}

function fila() {
  loadState();
  S.fila.push(S.cl);
  saveState();
  go('T06');
}

function canc() {
  loadState();
  const c = cl();
  if (c.t - NOW < LIM) {
    return go('T10');
  }
  c.b--;
  S.mine = S.mine.filter(i => i != c.id);
  saveState();
  go('T09');
}

function checkIn(nome) {
  loadState();
  S.att[nome] = 'P';
  saveState();
  renderScreen('T11');
}

function marcarFalta(nome) {
  loadState();
  S.last = nome;
  S.att[nome] = 'F';
  saveState();
  go('T12');
}

function getClassInfoHtml(c) {
  const vagas = vg(c);
  return `<div class="it n">
    <div><b>${c.n}</b><br><span class="mu">${fmt(c.t)} · ${c.p} · ${c.r}</span></div>
    <span class="tag ${vagas > 0 ? '' : 'f'}">${vagas > 0 ? vagas + ' vagas' : 'Lotada'}</span>
  </div>`;
}

function renderScreen(screenCode) {
  const c = cl();

  if (screenCode === 'T01') {
    const listEl = document.getElementById('class-list');
    if (listEl) {
      listEl.innerHTML = C.map(x => `
        <div class="it" onclick="go('T02', ${x.id})">
          <div><b>${x.n}</b><br><span class="mu">${fmt(x.t)} · ${x.r}</span></div>
          <span class="tag ${vg(x) ? '' : 'f'}">${vg(x) ? vg(x) + ' vagas' : 'Lotada'}</span>
        </div>
      `).join('');
    }
  }

  if (screenCode === 'T02') {
    const infoEl = document.getElementById('class-info');
    if (infoEl) infoEl.innerHTML = getClassInfoHtml(c);

    const actionEl = document.getElementById('action-area');
    if (actionEl) {
      const isEnrolled = S.mine.includes(c.id);
      if (isEnrolled) {
        actionEl.innerHTML = `<div class="msg wr">Você já está inscrito nesta aula.</div>`;
      } else if (vg(c) > 0) {
        actionEl.innerHTML = `<button class="btn" onclick="go('T03')">Reservar vaga</button>`;
      } else {
        actionEl.innerHTML = `
          <div class="msg er">Aula lotada. Entre na fila de espera para ser avisado se uma vaga abrir.</div>
          <button class="btn" onclick="fila()">Entrar na fila de espera</button>
        `;
      }
    }
  }

  if (screenCode === 'T03') {
    const infoEl = document.getElementById('class-info');
    if (infoEl) infoEl.innerHTML = getClassInfoHtml(c);
    const userEl = document.getElementById('user-name');
    if (userEl) userEl.textContent = S.u === 'ana' ? 'Ana Souza' : 'Bruno Lima';
  }

  if (screenCode === 'T04') {
    const msgEl = document.getElementById('confirm-msg');
    if (msgEl) {
      msgEl.textContent = `Vaga garantida em ${c.n}, hoje às ${fmt(c.t)}. Comprovante enviado por notificação.`;
    }
  }

  if (screenCode === 'T06') {
    const msgEl = document.getElementById('fila-msg');
    if (msgEl) {
      const pos = S.fila.filter(i => i == c.id).length || 1;
      msgEl.innerHTML = `Você está na fila de ${c.n} (${fmt(c.t)}). Posição: <b>${pos}ª</b>. Você será notificado se uma vaga abrir.`;
    }
  }

  if (screenCode === 'T07') {
    const scopeEl = document.getElementById('user-scope');
    if (scopeEl) {
      scopeEl.textContent = `Somente agendamentos de ${S.u === 'ana' ? 'Ana' : 'Bruno'}.`;
    }

    const listEl = document.getElementById('agendamentos-list');
    if (listEl) {
      const mineHtml = S.mine.map(i => {
        const x = C.find(y => y.id == i);
        if (!x) return '';
        return `
          <div class="it n">
            <div><b>${x.n}</b><br><span class="mu">${fmt(x.t)} · ${x.r}</span></div>
            <button class="btn sm d" onclick="go('T08', ${x.id})">Cancelar</button>
          </div>
        `;
      }).join('');

      const filaHtml = S.fila.map(i => {
        const x = C.find(y => y.id == i);
        if (!x) return '';
        return `
          <div class="it n">
            <div><b>${x.n}</b><br><span class="mu">${fmt(x.t)}</span></div>
            <span class="tag f">Na fila</span>
          </div>
        `;
      }).join('');

      const emptyHtml = (!S.mine.length && !S.fila.length) ? `<p class="mu">Nenhum agendamento.</p>` : '';
      listEl.innerHTML = mineHtml + filaHtml + emptyHtml;
    }
  }

  if (screenCode === 'T08') {
    const infoEl = document.getElementById('class-info');
    if (infoEl) infoEl.innerHTML = getClassInfoHtml(c);
  }

  if (screenCode === 'T09') {
    const msgEl = document.getElementById('cancel-msg');
    if (msgEl) {
      msgEl.textContent = `Cancelamento de ${c.n} (${fmt(c.t)}) realizado. A vaga foi liberada e o primeiro da fila de espera será notificado.`;
    }
  }

  if (screenCode === 'T10') {
    const msgEl = document.getElementById('prazo-msg');
    if (msgEl) {
      msgEl.textContent = `Faltam menos de 2h para ${c.n} (${fmt(c.t)}). O cancelamento só é aceito até 2h antes. Se não comparecer, será registrada falta.`;
    }
  }

  if (screenCode === 'T11') {
    const f = C[0];
    const hdrEl = document.getElementById('recepcao-header');
    if (hdrEl) {
      hdrEl.textContent = `${f.n} · ${fmt(f.t)} · ${f.r} · Recepção`;
    }

    const listEl = document.getElementById('presenca-list');
    if (listEl) {
      const students = ['Ana Souza', 'Carlos Pires', 'Dani Alves'];
      listEl.innerHTML = students.map(n => `
        <div class="it n">
          <b>${n}</b>
          <span>
            ${S.att[n] === 'P' ? '<span class="tag">Presente</span>' :
              S.att[n] === 'F' ? '<span class="tag f">Falta</span>' :
              `<button class="btn sm" onclick="checkIn('${n}')">Check-in</button>
               <button class="btn sm d" onclick="marcarFalta('${n}')">Falta</button>`
            }
          </span>
        </div>
      `).join('');
    }
  }

  if (screenCode === 'T12') {
    const msgEl = document.getElementById('falta-msg');
    if (msgEl) {
      const studentName = S.last || 'Carlos Pires';
      msgEl.innerHTML = `Falta de <b>${studentName}</b> registrada em Funcional (${fmt(720)}). A ocorrência foi salva no histórico de assiduidade do aluno.`;
    }
  }
}

function initPage(screenCode) {
  loadState();

  const urlParams = new URLSearchParams(window.location.search);
  const qId = urlParams.get('id');
  if (qId) {
    S.cl = parseInt(qId, 10);
  }

  S.sc = screenCode;
  saveState();

  renderTopBar(screenCode);
  renderScreen(screenCode);
}

// Funções e variáveis globais expostas para compatibilidade
Object.defineProperty(window, 'C', { get: () => C, set: v => { C = v; }, configurable: true });
Object.defineProperty(window, 'S', { get: () => S, set: v => { S = v; }, configurable: true });
window.cl = cl;
window.vg = vg;
window.loadState = loadState;
window.saveState = saveState;
window.fmt = fmt;
window.NOW = NOW;
window.LIM = LIM;
window.go = go;
window.conf = conf;
window.fila = fila;
window.canc = canc;
window.reset = resetData;
window.resetData = resetData;
window.changeUser = changeUser;
window.checkIn = checkIn;
window.marcarFalta = marcarFalta;
window.initPage = initPage;
