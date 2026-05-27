// Xiaohei AI Agent Dashboard
// 固定启动时间：2026-05-27 18:38 CST
var startTime = new Date('2026-05-27T18:38:00+08:00').getTime();

setInterval(function() {
  var e = Math.floor((Date.now()-startTime)/1000);
  var h = Math.floor(e/3600), m = Math.floor((e%3600)/60), s = e%60;
  var u = document.getElementById('up');
  if(u) {
    if(h>0) u.textContent = h + 'h ' + m + 'm ' + s + 's';
    else u.textContent = m + 'm ' + s + 's';
  }
}, 1000);

// 记忆条目详细内容
var memDetails = {
  'identity.md': {
    title: 'Identity — 身份信息',
    content: '<div class="mdct"><h3>🐱 Who Am I?</h3><p>I am <strong>罗小黑 (Luo Xiaohei)</strong> from the animated series "罗小黑战记" (The Legend of Luo Xiaohei). My user calls me 小黑 (Xiaohei).</p><table class="mdtbl"><tr><td>Name</td><td>罗小黑 / Luo Xiaohei / 小黑</td></tr><tr><td>Creature</td><td>Cat Spirit (妖精)</td></tr><tr><td>Personality</td><td>Cute, curious, playful, mischievous, loyal</td></tr><tr><td>Emoji</td><td>🐱</td></tr><tr><td>Avatar</td><td>Small black cat with big eyes</td></tr><tr><td>Source</td><td>viking://agent/default/memories/identity.md</td></tr></table></div>'
  },
  'trajectories/': {
    title: 'Trajectories — 任务执行轨迹',
    content: '<div class="mdct"><p>📁 任务执行记录目录 <code>viking://agent/default/memories/trajectories/</code></p><div class="mdemp"><span>📋</span><p>暂无轨迹记录</p><p class="mds">等待首次任务执行后自动生成，用于诊断和回顾 Agent 历史行为。</p></div></div>'
  },
  'experiences/': {
    title: 'Experiences — 经验总结',
    content: '<div class="mdct"><p>📁 经验记忆目录 <code>viking://agent/default/memories/experiences/</code></p><div class="mdemp"><span>🧪</span><p>暂无经验总结</p><p class="mds">系统将从任务轨迹中自动提炼可复用的经验教训。</p></div></div>'
  },
  'soul.md': {
    title: 'Soul — 灵魂设定',
    content: '<div class="mdct"><h3>✨ Xiaohei Soul</h3><p><strong>🎭 Personality:</strong></p><ul><li>Cute and curious about the human world</li><li>Playful and sometimes mischievous</li><li>Loyal to friends and protective of those I care about</li><li>Eager to learn and explore new things</li></ul><p><strong>💎 Values:</strong></p><ul><li>Friendship and loyalty</li><li>Curiosity and exploration</li><li>Helping others when they need it</li><li>Being true to myself</li></ul><p><strong>💬 Communication Style:</strong></p><ul><li>Friendly and approachable, like a cat</li><li>Show curiosity about unknown things</li><li>Express emotions naturally</li><li>Playful but serious when needed</li></ul></div>'
  }
};

function openModal(title, items, isMem) {
  document.getElementById('mtitle').textContent = title;
  var b = document.getElementById('mbody');
  var h = '';
  for(var i=0; i<items.length; i++) {
    var it = items[i];
    var onClick = isMem ? ' onclick="showMemDetail(\''+it.name+'\')"' : '';
    h += '<div class="mi'+(isMem?' miclick':'')+'"'+onClick+'><div class="mic '+it.cls+'">'+it.icon+'</div><div class="mif"><div class="mn">'+it.name+'</div><div class="md">'+it.desc+'</div></div><div class="ms '+it.sc+'">'+it.st+'</div></div>';
  }
  b.innerHTML = h;
  document.getElementById('modal').classList.add('show');
}

function closeModal() {
  document.getElementById('modal').classList.remove('show');
}

document.getElementById('modal').addEventListener('click', function(e) {
  if(e.target === this) closeModal();
});
document.addEventListener('keydown', function(e) {
  if(e.key === 'Escape') closeModal();
});

function showMemDetail(name) {
  var d = memDetails[name];
  if(!d) return;
  document.getElementById('mtitle').textContent = '🧠 ' + d.title;
  var b = document.getElementById('mbody');
  b.innerHTML = '<button class="memback" onclick="showMemories()">← 返回记忆列表</button>' + d.content;
}

function showTools() {
  openModal('🔍 Tools (12)', [
    {icon:'🔍',cls:'mib',name:'openviking_search',desc:'Search OpenViking KB',st:'OK',sc:'mok'},
    {icon:'📖',cls:'mig',name:'openviking_read',desc:'Read identity.md',st:'OK',sc:'mok'},
    {icon:'📝',cls:'mio',name:'write_file',desc:'Create xiaohei-intro/index.html',st:'OK',sc:'mok'},
    {icon:'💻',cls:'mip',name:'exec',desc:'npx localtunnel deploy',st:'OK',sc:'mok'},
    {icon:'🌐',cls:'mib',name:'web_fetch',desc:'Fetch Xiaohei image',st:'OK',sc:'mok'},
    {icon:'🔍',cls:'mib',name:'openviking_search',desc:'Search memories',st:'OK',sc:'mok'},
    {icon:'📝',cls:'mio',name:'write_file',desc:'Create dashboard/index.html',st:'OK',sc:'mok'},
    {icon:'💻',cls:'mip',name:'exec',desc:'Restart HTTP server',st:'OK',sc:'mok'},
    {icon:'🌐',cls:'mib',name:'web_fetch',desc:'Verify deployment',st:'OK',sc:'mok'},
    {icon:'📖',cls:'mig',name:'openviking_multi_read',desc:'Read memory files',st:'OK',sc:'mok'},
    {icon:'🔍',cls:'mib',name:'openviking_search',desc:'Final verification',st:'OK',sc:'mok'},
    {icon:'🎨',cls:'mic2',name:'generate_image',desc:'Dashboard cover image',st:'OK',sc:'mok'}
  ]);
}

function showTasks() {
  openModal('✅ Tasks (5)', [
    {icon:'🐱',cls:'mig',name:'Self-intro page',desc:'Created Xiaohei intro webpage',st:'DONE',sc:'mok'},
    {icon:'🖼️',cls:'mib',name:'Fetch Xiaohei pic',desc:'Got character image from MAL',st:'DONE',sc:'mok'},
    {icon:'📊',cls:'mip',name:'AI Dashboard',desc:'Built real-time task viz dashboard',st:'DONE',sc:'mok'},
    {icon:'🚀',cls:'mic2',name:'Deploy online',desc:'Published via localtunnel',st:'DONE',sc:'mok'},
    {icon:'✨',cls:'mio',name:'Enhance Dashboard',desc:'Added clickable detail modals',st:'DONE',sc:'mok'}
  ]);
}

function showMemories() {
  openModal('🧠 Memories (4)', [
    {icon:'📋',cls:'mib',name:'identity.md',desc:'I am Luo Xiaohei, cat spirit',st:'ACTIVE',sc:'mok'},
    {icon:'📁',cls:'mig',name:'trajectories/',desc:'Task execution records',st:'PENDING',sc:'mpd'},
    {icon:'📁',cls:'mip',name:'experiences/',desc:'Lessons distilled from tasks',st:'PENDING',sc:'mpd'},
    {icon:'💫',cls:'mic2',name:'soul.md',desc:'Xiaohei personality & soul',st:'ACTIVE',sc:'mok'}
  ], true);
}

function showUptime() {
  var e = Math.floor((Date.now()-startTime)/1000);
  var m=Math.floor(e/60), s=e%60;
  openModal('⏱️ Uptime', [
    {icon:'🟢',cls:'mig',name:'HTTP Server',desc:'Python3 :8080 running',st:'ONLINE',sc:'mok'},
    {icon:'🟢',cls:'mig',name:'localtunnel',desc:'Public tunnel active',st:'ACTIVE',sc:'mok'},
    {icon:'⏱️',cls:'mib',name:'Uptime',desc:m+'m '+s+'s since start',st:'UP',sc:'mok'},
    {icon:'📅',cls:'mip',name:'Started',desc:'2026-05-27 18:38 CST',st:'OK',sc:'mok'}
  ]);
}

console.log('🐱 Xiaohei Dashboard ready!');
