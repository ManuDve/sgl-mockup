// Mockup WhatsApp Bot - flujo de consulta, reagendamiento y cancelación (solo UI)

const waState = {
  initialized: false,
  userName: 'Cliente',
  cita: {
    id: 'AG-2026-0012',
    materia: 'Derecho Civil',
    fecha: '2026-04-10',
    hora: '10:30',
    estadoPago: 'Pendiente'
  }
};

function waNow() {
  const d = new Date();
  return d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
}

function waChatEl() {
  return document.getElementById('waChat');
}

function waScrollToBottom() {
  const el = waChatEl();
  if (!el) return;
  el.scrollTop = el.scrollHeight;
}

function waAppendMessage({ direction, text, meta }) {
  const el = waChatEl();
  if (!el) return;

  const wrap = document.createElement('div');
  wrap.className = direction === 'out' ? 'flex justify-end' : 'flex justify-start';

  const bubble = document.createElement('div');
  bubble.className = `wa-bubble px-3 py-2 text-sm shadow-sm ${direction === 'out' ? 'wa-out' : 'wa-in'}`;

  const content = document.createElement('div');
  content.className = 'whitespace-pre-wrap leading-snug';
  content.textContent = text;

  const metaEl = document.createElement('div');
  metaEl.className = 'wa-meta mt-1 flex justify-end gap-2';
  metaEl.textContent = meta || waNow();

  bubble.appendChild(content);
  bubble.appendChild(metaEl);
  wrap.appendChild(bubble);
  el.appendChild(wrap);

  waScrollToBottom();
}

function waBot(text) {
  waAppendMessage({ direction: 'in', text });
}

// Mensaje del bot con enlace clickeable
function waBotLink(label, href) {
  const el = waChatEl();
  if (!el) return;

  const wrap = document.createElement('div');
  wrap.className = 'flex justify-start';

  const bubble = document.createElement('div');
  bubble.className = 'wa-bubble px-3 py-2 text-sm shadow-sm wa-in';

  const content = document.createElement('div');
  content.className = 'whitespace-pre-wrap leading-snug';

  const a = document.createElement('a');
  a.href = href;
  a.target = '_self';
  a.rel = 'noopener';
  a.textContent = label;
  a.style.textDecoration = 'underline';
  a.style.textUnderlineOffset = '3px';

  content.appendChild(a);

  const metaEl = document.createElement('div');
  metaEl.className = 'wa-meta mt-1 flex justify-end gap-2';
  metaEl.textContent = waNow();

  bubble.appendChild(content);
  bubble.appendChild(metaEl);
  wrap.appendChild(bubble);
  el.appendChild(wrap);

  waScrollToBottom();
}

function waUser(text) {
  waAppendMessage({ direction: 'out', text });
}

function waReset() {
  const el = waChatEl();
  if (el) el.innerHTML = '';
  waState.initialized = true;
  waBot('Hola. Soy el bot de agendamiento del Sistema de Gestión Legal.');
  waBot('Para comenzar, indica una opción del menú.');
  waStartMenu();
}

function waStartMenu() {
  if (!waChatEl()) return;
  if (!waState.initialized) {
    waReset();
    return;
  }

  waBot(
    'Menú principal:\n' +
      '1) Consultar mi cita\n' +
      '2) Reagendar (vía web)\n' +
      '3) Cancelar (vía web)'
  );
}

function waFlowConsulta() {
  if (!waState.initialized) waReset();

  waUser('1');
  waBot(
    `Encontré tu cita.\n` +
      `ID: ${waState.cita.id}\n` +
      `Materia: ${waState.cita.materia}\n` +
      `Fecha: ${waState.cita.fecha}\n` +
      `Hora: ${waState.cita.hora}`
  );
  waBot('Si necesitas modificar la cita, responde 2 (Reagendar) o 3 (Cancelar).');
}

// Helpers para URLs (compatibles con GitHub Pages)
function waGestionURL(params = {}) {
  // Mantiene el path actual (incluye /<repo>/ en GitHub Pages) y elimina la query
  const base = window.location.href.split('?')[0].split('#')[0];
  const q = new URLSearchParams(params);
  return `${base}?${q.toString()}`;
}

function waIssueOtp(purpose) {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  waState.lastOtp = { otp, purpose, createdAt: Date.now() };
  return otp;
}

function waFlowReagendar() {
  if (!waState.initialized) waReset();

  waUser('2');
  const otp = waIssueOtp('reagendar');
  const url = waGestionURL({ accion: 'reagendar', id: waState.cita.id, otp });

  waBot('Para reagendar debemos verificar tu identidad.');
  waBot(`Código de verificación (válido por 10 minutos): ${otp}`);
  waBot('Abre el siguiente enlace para continuar:');
  waBotLink(url, url);
}

function waFlowCancelar() {
  if (!waState.initialized) waReset();

  waUser('3');
  const otp = waIssueOtp('cancelar');
  const url = waGestionURL({ accion: 'cancelar', id: waState.cita.id, otp });

  waBot('Para cancelar debemos verificar tu identidad.');
  waBot(`Código de verificación (válido por 10 minutos): ${otp}`);
  waBot('Abre el siguiente enlace para continuar:');
  waBotLink(url, url);
}

// Input decorativo: este handler solo inserta un mensaje genérico
function waAutoReplyFromInput() {
  if (!waState.initialized) waReset();
  waUser('Hola');
  waBot('Para ayudarte, responde un número del menú.');
  waStartMenu();
}

// Inicialización suave cuando se renderiza la sección
function waInitIfVisible() {
  const el = waChatEl();
  if (!el) return;
  if (!waState.initialized) waReset();
}
