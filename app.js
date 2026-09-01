const $ = (id) => document.getElementById(id);
const STORAGE_KEY = 'civicguard_cases_v1';

function getCases(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function saveCases(cases){ localStorage.setItem(STORAGE_KEY, JSON.stringify(cases)); renderCases(); }
function escapeHtml(s=''){ return s.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

function analyzeMessage(message, channel='other'){
  const text = (message || '').trim();
  const lower = text.toLowerCase();
  const evidence = [];
  let score = 0;
  const rules = [
    [/\b(urgent|immediately|act now|final warning|suspended|locked)\b/i, 2, 'Uses urgency or threat language'],
    [/\b(password|otp|one[- ]time code|verification code|pin)\b/i, 3, 'Requests or references sensitive authentication information'],
    [/\b(click|tap|open)\b.*\b(link|url)\b/i, 2, 'Pushes the recipient toward a link'],
    [/https?:\/\//i, 1, 'Contains a web link'],
    [/\b(prize|winner|reward|refund|cash|payment|invoice)\b/i, 2, 'Uses financial or reward language'],
    [/\b(bank|payroll|admin|it support|microsoft|google|facebook)\b/i, 1, 'Impersonates or invokes a trusted service or authority'],
    [/\b(send|reply|confirm|verify)\b.*\b(password|otp|code|account|identity)\b/i, 3, 'Attempts to obtain account or identity information'],
  ];
  for (const [re, pts, note] of rules){ if(re.test(text)){ score += pts; evidence.push(note); } }
  if(channel === 'sms' && /https?:\/\//i.test(text)) { score += 1; evidence.push('Link delivered over SMS'); }
  const level = score >= 8 ? 'critical' : score >= 5 ? 'high' : score >= 3 ? 'medium' : 'low';
  const guidance = level === 'low'
    ? 'Treat cautiously and verify the sender through a trusted channel.'
    : level === 'medium'
    ? 'Do not interact with links or attachments until the sender is independently verified.'
    : 'Do not click, reply, disclose credentials, or approve sign-in prompts. Preserve the message and escalate through your organization’s trusted support channel.';
  return {risk: level, score, evidence: evidence.length ? evidence : ['No common high-risk indicators detected by this simple heuristic'], guidance};
}

function createCase({title, context='', risk='medium', source='manual'}){
  const cases = getCases();
  const item = {id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), title: title || 'Untitled incident', context, risk, source, reviewed:false, createdAt:new Date().toISOString()};
  cases.unshift(item); saveCases(cases); return item;
}

function buildPlan(scenario='unknown', risk='medium'){
  const common = [
    'Preserve the original message, headers, screenshots, or relevant logs without modifying them.',
    'Verify the event through a trusted channel that is separate from the suspicious message.',
    'Avoid clicking links, opening attachments, sharing credentials, or approving unexpected sign-in prompts.'
  ];
  const scenarioSteps = {
    phishing:['If credentials may have been entered, reset the affected password from a trusted device and revoke active sessions.','Report the sender/domain/link through your organization’s approved security or IT channel.'],
    account_takeover:['Reset the account password, revoke sessions, and review recent sign-ins and recovery methods.','Enable or re-enroll multi-factor authentication using a trusted method and check for unauthorized forwarding or profile changes.'],
    malware:['Disconnect the affected device from sensitive networks if compromise is suspected.','Do not delete evidence; contact authorized IT/security personnel for containment and malware analysis.'],
    data_exposure:['Identify what data may have been exposed, to whom, and for how long.','Escalate promptly to the responsible privacy/security authority and follow applicable notification procedures.'],
    unknown:['Escalate the case to an authorized security/IT contact for further assessment.']
  };
  const high = ['For high/critical risk, prioritize containment and account protection before routine operations.'];
  return [...common, ...(scenarioSteps[scenario] || scenarioSteps.unknown), ...(['high','critical'].includes(risk)?high:[])];
}

function draftNotice(audience='staff', topic='suspicious login links'){
  const audienceText = {staff:'team members',students:'students',volunteers:'volunteers',public:'community members'}[audience] || 'community members';
  return `Security reminder for ${audienceText}: We are seeing or preparing for reports involving ${topic}. Please avoid opening unexpected links or attachments, never share passwords or one-time codes, and verify unusual requests through an official contact channel. If you receive something suspicious, preserve the message and report it to the appropriate support or security contact. Do not forward suspicious links to others.`;
}

function renderAnalysis(result){
  $('analysisResult').classList.remove('muted');
  $('analysisResult').innerHTML = `<div><span class="risk ${result.risk}">${result.risk} risk</span> <strong>Score ${result.score}</strong></div><ul class="evidence">${result.evidence.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul><p>${escapeHtml(result.guidance)}</p>`;
  $('riskLevel').value = ['low','medium','high','critical'].includes(result.risk) ? result.risk : 'medium';
}

function renderPlan(steps){ $('planResult').classList.remove('muted'); $('planResult').innerHTML = steps.map(x=>`<li>${escapeHtml(x)}</li>`).join(''); }
function renderCases(){
  const cases = getCases(); const el = $('caseList');
  if(!cases.length){ el.innerHTML = '<div class="result muted">No local cases yet.</div>'; return; }
  el.innerHTML = cases.map(c=>`<article class="case-card"><div class="case-top"><div><h3>${escapeHtml(c.title)}</h3><span class="risk ${escapeHtml(c.risk)}">${escapeHtml(c.risk)}</span> <span class="badge ${c.reviewed?'reviewed':''}">${c.reviewed?'Reviewed':'Open'}</span></div><small>${new Date(c.createdAt).toLocaleString()}</small></div><p>${escapeHtml(c.context || 'No additional context.')}</p><button class="ghost" data-review="${c.id}">${c.reviewed?'Mark open':'Mark reviewed'}</button></article>`).join('');
  el.querySelectorAll('[data-review]').forEach(btn=>btn.addEventListener('click',()=>markReviewed(btn.dataset.review)));
}
function markReviewed(id, reviewed=true){ const cases=getCases(); const c=cases.find(x=>x.id===id); if(!c) return null; c.reviewed=reviewed; saveCases(cases); return c; }

$('sampleBtn').addEventListener('click',()=>{ $('messageText').value='URGENT: Your payroll account has been suspended. Verify immediately at https://payroll-check.example and reply with the OTP sent to your phone.'; $('channel').value='sms'; });
$('analyzeBtn').addEventListener('click',()=>renderAnalysis(analyzeMessage($('messageText').value,$('channel').value)));
$('createCaseBtn').addEventListener('click',()=>{ const r=analyzeMessage($('messageText').value,$('channel').value); createCase({title:$('caseTitle').value||'Suspicious message report',context:$('caseContext').value||$('messageText').value,risk:r.risk}); });
$('planBtn').addEventListener('click',()=>renderPlan(buildPlan($('scenario').value,$('riskLevel').value)));
$('noticeBtn').addEventListener('click',()=>{ $('noticeResult').classList.remove('muted'); $('noticeResult').textContent=draftNotice($('audience').value,$('noticeTopic').value); });
$('clearBtn').addEventListener('click',()=>{ localStorage.removeItem(STORAGE_KEY); renderCases(); });

function registerWebMCP(){
  const mc = document.modelContext;
  const dot=$('webmcpDot'), status=$('webmcpStatus'), detail=$('webmcpDetail');
  if(!mc || typeof mc.registerTool !== 'function'){
    dot.classList.add('warn'); status.textContent='WebMCP not exposed in this browser'; detail.textContent='The app still works manually. Enable a compatible WebMCP browser/flag for agent tools.'; return;
  }
  try {
    mc.registerTool({name:'analyze_suspicious_message',description:'Defensively analyze a suspicious SMS, email, or chat message using local heuristics. Returns risk, evidence, and safe guidance. Never clicks links or sends data.',inputSchema:{type:'object',properties:{message:{type:'string',description:'The suspicious message text to analyze.'},channel:{type:'string',enum:['sms','email','chat','other']}},required:['message']},execute:async({message,channel='other'})=>analyzeMessage(message,channel)});
    mc.registerTool({name:'create_incident_case',description:'Create a local defensive-security incident case in the CivicGuard dashboard. Use only when the user asks to record or organize an incident.',inputSchema:{type:'object',properties:{title:{type:'string'},context:{type:'string'},risk:{type:'string',enum:['low','medium','high','critical']}},required:['title']},execute:async({title,context='',risk='medium'})=>createCase({title,context,risk,source:'webmcp'})});
    mc.registerTool({name:'build_response_plan',description:'Generate safe defensive incident-response steps. Does not provide offensive exploitation instructions.',inputSchema:{type:'object',properties:{scenario:{type:'string',enum:['phishing','account_takeover','malware','data_exposure','unknown']},risk:{type:'string',enum:['low','medium','high','critical']}},required:['scenario']},execute:async({scenario,risk='medium'})=>({steps:buildPlan(scenario,risk)})});
    mc.registerTool({name:'draft_awareness_notice',description:'Draft a concise non-alarmist cybersecurity awareness notice for a selected audience.',inputSchema:{type:'object',properties:{audience:{type:'string',enum:['staff','students','volunteers','public']},topic:{type:'string'}},required:['topic']},execute:async({audience='staff',topic})=>({notice:draftNotice(audience,topic)})});
    mc.registerTool({name:'list_incident_cases',description:'List incident cases currently stored locally in this browser.',inputSchema:{type:'object',properties:{}},execute:async()=>({cases:getCases()})});
    mc.registerTool({name:'mark_case_reviewed',description:'Mark a local incident case reviewed after the user asks to update its status.',inputSchema:{type:'object',properties:{case_id:{type:'string'},reviewed:{type:'boolean'}},required:['case_id']},execute:async({case_id,reviewed=true})=>({case:markReviewed(case_id,reviewed)})});
    dot.classList.add('ok'); status.textContent='WebMCP tools registered'; detail.textContent='Six structured defensive tools are available to compatible browser agents.';
  } catch(err){ dot.classList.add('warn'); status.textContent='WebMCP detected, registration error'; detail.textContent=String(err?.message||err); }
}

renderCases();
registerWebMCP();
