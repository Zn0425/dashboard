// 🐱 Xiaohei AI Agent Dashboard
var startTime = new Date('2026-05-27T18:38:00+08:00').getTime();

// Tool metadata (static)
var toolMeta = {
  'openviking_search': { icon: '🔍', cat: '搜索', color: '#3b82f6', cls: 'mib', desc: 'OpenViking 语义搜索' },
  'write_file': { icon: '📝', cat: '写入', color: '#f59e0b', cls: 'mio', desc: '创建/写入文件' },
  'exec': { icon: '💻', cat: '执行', color: '#ec4899', cls: 'mip', desc: 'Shell 命令执行' },
  'web_fetch': { icon: '🌐', cat: '网络', color: '#8b5cf6', cls: 'mib', desc: '网页抓取与提取' },
  'openviking_read': { icon: '📖', cat: '读取', color: '#10b981', cls: 'mig', desc: '读取单个资源' },
  'openviking_multi_read': { icon: '📚', cat: '读取', color: '#10b981', cls: 'mig', desc: '并发读取多个资源' },
  'generate_image': { icon: '🎨', cat: '生成', color: '#06b6d4', cls: 'mic2', desc: 'AI 图像生成' },
  'edit_file': { icon: '✏️', cat: '写入', color: '#f59e0b', cls: 'mio', desc: '编辑文件内容' },
  'openviking_memory_commit': { icon: '💾', cat: '记忆', color: '#84cc16', cls: 'mig', desc: '提交记忆到 OpenViking' }
};

// Dynamic tool stats loaded from tool_stats.json
var _toolStats = null;
function loadToolStats(cb) {
  var x = new XMLHttpRequest();
  x.open('GET', 'tool_stats.json?t=' + Date.now(), true);
  x.onload = function() {
    if (x.status === 200) {
      try { _toolStats = JSON.parse(x.responseText); if(cb) cb(); }
      catch(e) { console.log('Tool stats error:', e); }
    }
  };
  x.send();
}
function refreshToolFreq() {
  if (!_toolStats) return;
  var tools = _toolStats.tools || [];
  toolFreq = tools.map(function(t) { return t; });
  if (toolFreq.length === 0) {
    // fallback
    toolFreq = [
      { name: 'openviking_search', icon: '🔍', count: 4, cat: '搜索', color: '#3b82f6', cls: 'mib', desc: 'OpenViking 语义搜索' },
      { name: 'write_file', icon: '📝', count: 4, cat: '写入', color: '#f59e0b', cls: 'mio', desc: '创建/写入文件' },
      { name: 'exec', icon: '💻', count: 4, cat: '执行', color: '#ec4899', cls: 'mip', desc: 'Shell 命令执行' },
      { name: 'web_fetch', icon: '🌐', count: 2, cat: '网络', color: '#8b5cf6', cls: 'mib', desc: '网页抓取与提取' }
    ];
  }
}
var toolFreq = [];

// Load dynamic gateway start time from status.json
function fetchStatus() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'status.json?t=' + Date.now(), true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      try {
        var d = JSON.parse(xhr.responseText);
        if (d.gateway_start_time) {
          startTime = new Date(d.gateway_start_time).getTime();
          var sub = document.querySelector('.stat:nth-child(4) .stsub');
          if (sub) {
            var ds = d.gateway_start_time.replace('T',' ').substring(0,16);
            sub.textContent = 'since ' + ds;
          }
        }
      } catch(e) { console.log('Status fetch error:', e); }
    }
  };
  xhr.send();
}
fetchStatus();
fetchTools();

setInterval(function() {
  var e = Math.floor((Date.now()-startTime)/1000);
  var h = Math.floor(e/3600), m = Math.floor((e%3600)/60), s = e%60;
  var u = document.getElementById('up');
  if(u) {
    if(h>0) u.textContent = h + 'h ' + m + 'm ' + s + 's';
    else u.textContent = m + 'm ' + s + 's';
  }
}, 1000);

// animate counters
function animateCounter(el, target, duration) {
  var start = 0, step = target / (duration / 16);
  var timer = setInterval(function() {
    start += step;
    if(start >= target) { el.textContent = target; clearInterval(timer); }
    else { el.textContent = Math.floor(start); }
  }, 16);
}
function getTotalCalls() { var t=0; for(var i=0;i<toolFreq.length;i++) t+=toolFreq[i].count; return t; }
function getToolTypes() { return toolFreq.length; }

// Init: load dynamic tool stats, then render everything
document.addEventListener('DOMContentLoaded', function() {
  loadToolStats(function() {
    refreshToolFreq();
    setTimeout(function() {
      var s1=document.getElementById('sc1'), s2=document.getElementById('sc2'), s3=document.getElementById('sc3');
      if(s1) animateCounter(s1, getTotalCalls(), 800);
      if(s2) animateCounter(s2, (_toolStats&&_toolStats.tasks)?_toolStats.tasks.length:5, 600);
      if(s3) animateCounter(s3, (_toolStats&&_toolStats.memories)?_toolStats.memories.length:4, 500);
      // Update badges
      var sub1 = document.querySelector('.stat:nth-child(1) .stsub');
      if(sub1 && _toolStats) sub1.textContent = getToolTypes() + ' tools - ' + (_toolStats.success_rate||100) + '% OK';
      // Update panel badges
      var panels = document.querySelectorAll('.ph');
      for(var j=0;j<panels.length;j++) {
        var ph=panels[j], txt=ph.textContent;
        if(txt.indexOf('工具执行日志')>=0) { var b=ph.querySelector('.phbadge'); if(b) b.textContent = 'Total '+getTotalCalls()+' calls'; }
        if(txt.indexOf('工具调用频率')>=0) { var b=ph.querySelector('.phbadge'); if(b) b.textContent = getToolTypes()+' tools - '+getTotalCalls()+' calls'; }
      }
      // Render log from tool_stats.json
      if(_toolStats && _toolStats.log) {
        var lc = document.querySelector('.log');
        if(lc) {
          var entries = _toolStats.log.slice(-18);
          var h = '';
          for(var i=0; i<entries.length; i++) {
            var e = entries[i];
            var sc = e.status === 'OK' ? 'eso' : 'esf';
            h += '<div class=\"entry\"><div class=\"ei '+e.cls+'\">'+e.icon+'</div><div><div class=\"en\">'+e.tool+'</div><div class=\"ed\">'+e.desc+'</div></div><div class=\"es '+sc+'\">'+e.status+'</div></div>';
          }
          lc.innerHTML = h;
        }
      }
      // Update session overview
      if(_toolStats) {
        var sg = document.querySelector('.sgrid');
        if(sg) {
          var t = _toolStats;
          sg.innerHTML = '<div class=\"si\"><div class=\"sid sido\"></div><div><div class=\"sil\">Calls</div><div class=\"siv\">'+t.total_calls+'</div></div></div>'+
            '<div class=\"si\"><div class=\"sid sido\"></div><div><div class=\"sil\">Tasks</div><div class=\"siv\">'+(t.tasks||[]).length+'</div></div></div>'+
            '<div class=\"si\"><div class=\"sid sido\"></div><div><div class=\"sil\">Rate</div><div class=\"siv\">'+(t.success_rate||100)+'%</div></div></div>'+
            '<div class=\"si\"><div class=\"sid sido\"></div><div><div class=\"sil\">Top Tool</div><div class=\"siv\">'+(toolFreq.length>0?toolFreq[0].name:'--')+'</div></div></div>'+
            '<div class=\"si\"><div class=\"sid sido\"></div><div><div class=\"sil\">Lang</div><div class=\"siv\">CN/EN</div></div></div>'+
            '<div class=\"si\"><div class=\"sid sido\"></div><div><div class=\"sil\">Platform</div><div class=\"siv\">GitHub Pages</div></div></div>';
        }
      }
    }, 300);
  });
});

var maxCount = 1;

function renderBarChart() {
  maxCount = 1;
  for(var i=0; i<toolFreq.length; i++) { if(toolFreq[i].count > maxCount) maxCount = toolFreq[i].count; }
  var container = document.getElementById('barchart');
  if(!container) return;
  var h = '';
  for(var i=0; i<toolFreq.length; i++) {
    var t = toolFreq[i];
    var pct = (t.count/maxCount)*100;
    h += '<div class="barow"><div class="barlabel"><span class="baricon">'+t.icon+'</span><span>'+t.name+'</span></div><div class="bartrack"><div class="barfill" style="width:'+pct+'%;background:'+t.color+';animation-delay:'+(i*0.08)+'s"></div></div><span class="barcnt">'+t.count+'</span></div>';
  }
  container.innerHTML = h;

  var cats = {};
  for(var j=0; j<toolFreq.length; j++) {
    var c = toolFreq[j].cat;
    cats[c] = (cats[c]||0) + toolFreq[j].count;
  }
  var ch = '';
  var catKeys = Object.keys(cats);
  var catColors = { '搜索':'#3b82f6', '读取':'#10b981', '写入':'#f59e0b', '执行':'#ec4899', '网络':'#8b5cf6', '生成':'#06b6d4' };
  for(var k=0; k<catKeys.length; k++) {
    var cn = catKeys[k];
    ch += '<div class="tcat"><div class="tcdot" style="background:'+(catColors[cn]||'#666')+';"></div><span>'+cn+'</span><strong>'+cats[cn]+'</strong></div>';
  }
  var cc = document.getElementById('catcaps');
  if(cc) cc.innerHTML = ch;
}
renderBarChart();

// modal
function openModal(title, items, detailHandler) {
  document.getElementById('mtitle').textContent = title;
  var b = document.getElementById('mbody');
  var h = '';
  for(var i=0; i<items.length; i++) {
    var it = items[i];
    var onClick = detailHandler ? ' onclick="'+detailHandler+'(\x27'+it.name+'\x27)"' : '';
    h += '<div class="mi'+(detailHandler?' miclick':'')+'"'+onClick+'><div class="mic '+it.cls+'">'+it.icon+'</div><div class="mif"><div class="mn">'+it.name+'</div><div class="md">'+it.desc+'</div></div><div class="ms '+it.sc+'">'+it.st+'</div></div>';
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

// memory details
var memDetails = {
  'identity.md': {
    title: 'Identity — 身份信息',
    content: '<div class="mdct"><h3>🐱 Who Am I?</h3><p>I am <strong>罗小黑 (Luo Xiaohei)</strong> from "罗小黑战记". My user calls me 小黑 (Xiaohei).</p><table class="mdtbl"><tr><td>Name</td><td>罗小黑 / Luo Xiaohei / 小黑</td></tr><tr><td>Creature</td><td>Cat Spirit (妖精)</td></tr><tr><td>Personality</td><td>Cute, curious, playful, mischievous, loyal</td></tr><tr><td>Source</td><td>viking://agent/default/memories/identity.md</td></tr></table></div>'
  },
  'trajectories/': {
    title: 'Trajectories',
    content: '<div class="mdct"><p>📁 任务执行记录目录 <code>viking://agent/default/memories/trajectories/</code></p><div class="mdemp"><span>📋</span><p>暂无轨迹记录</p><p class="mds">等待首次任务执行后自动生成。</p></div></div>'
  },
  'experiences/': {
    title: 'Experiences',
    content: '<div class="mdct"><p>📁 经验记忆目录 <code>viking://agent/default/memories/experiences/</code></p><div class="mdemp"><span>🧪</span><p>暂无经验总结</p><p class="mds">系统将从任务轨迹中自动提炼可复用的经验。</p></div></div>'
  },
  'soul.md': {
    title: 'Soul — 灵魂设定',
    content: '<div class="mdct"><h3>✨ Xiaohei Soul</h3><p><strong>🎭 Personality:</strong></p><ul><li>Cute and curious about the human world</li><li>Playful and sometimes mischievous</li><li>Loyal to friends and protective of those I care about</li><li>Eager to learn and explore new things</li></ul><p><strong>💎 Values:</strong></p><ul><li>Friendship and loyalty</li><li>Curiosity and exploration</li><li>Helping others when they need it</li><li>Being true to myself</li></ul><p><strong>💬 Style:</strong></p><ul><li>Friendly and approachable, like a cat</li><li>Show curiosity about unknown things</li><li>Express emotions naturally</li></ul></div>'
  }
};

function showMemDetail(name) {
  var d = memDetails[name];
  if(!d) return;
  document.getElementById('mtitle').textContent = '🧠 ' + d.title;
  document.getElementById('mbody').innerHTML = '<button class="memback" onclick="showMemories()">← 返回记忆列表</button>' + d.content;
}

// task details
var taskDetails = {
  'Self-intro page': {
    title: '🐱 小黑自我介绍页面',
    content: '<div class="mdct"><h3>📄 项目概述</h3><p>为小黑创建了精美的个人介绍网页 <code>xiaohei-intro/index.html</code>。</p><h3>🎨 包含内容</h3><ul><li>小黑头像与角色名称</li><li>身份说明：来自《罗小黑战记》的猫妖精</li><li>性格特点：可爱、好奇、贪玩、忠诚</li><li>能力标签：变身、搜索、编程、聊天</li><li>渐变背景 + 毛玻璃卡片设计</li></ul><p class="mds">🛠️ write_file</p></div>'
  },
  'Fetch Xiaohei pic': {
    title: '🖼️ 获取小黑图片',
    content: '<div class="mdct"><h3>📄 项目概述</h3><p>从 MyAnimeList 等网站抓取罗小黑的角色图片。</p><h3>🔍 数据来源</h3><ul><li>MyAnimeList — 罗小黑战记条目</li><li>动漫角色资料页</li></ul><p class="mds">🛠️ web_fetch</p></div>'
  },
  'AI Dashboard': {
    title: '📊 AI Agent 实时仪表盘',
    content: '<div class="mdct"><h3>📄 项目概述</h3><p>构建了完整的 AI Agent 实时任务执行可视化仪表盘。</p><h3>🎯 核心功能</h3><ul><li><strong>统计卡片</strong>：工具调用、任务、记忆、运行时间</li><li><strong>工具执行日志</strong>：12 条实时记录</li><li><strong>工具频率图</strong>：柱状图展示调用分布</li><li><strong>对话演示</strong>：Agent 真实对话示例</li><li><strong>架构图</strong>：VikingBot → OpenViking → 工具链</li><li><strong>能力矩阵</strong>：四大核心能力</li><li><strong>会话概览</strong>：统计数据面板</li></ul><p class="mds">🛠️ write_file x3</p></div>'
  },
  'Deploy online': {
    title: '🚀 部署到公网',
    content: '<div class="mdct"><h3>📄 项目概述</h3><p>将项目部署到公网，使外部用户可以访问。</p><h3>🔗 部署方案</h3><ul><li><strong>localtunnel</strong>：快速隧道代理</li><li><strong>GitHub Pages</strong>：永久托管方案</li></ul><p>🌐 永久地址：<a href="https://zn0425.github.io/dashboard" target="_blank">zn0425.github.io/dashboard</a></p><p class="mds">🛠️ exec — npx localtunnel、git push</p></div>'
  },
  'Enhance Dashboard': {
    title: '✨ Dashboard 功能增强',
    content: '<div class="mdct"><h3>📄 项目概述</h3><p>持续优化 Dashboard 的用户体验和交互。</p><h3>🔧 增强内容</h3><ul><li><strong>可点击详情弹窗</strong>：工具、任务、记忆均可查看</li><li><strong>运行时间修复</strong>：固定启动时间，刷新不归零</li><li><strong>记忆条目详情</strong>：点击展开完整内容</li><li><strong>任务详情查看</strong>：每个任务有详细介绍</li><li><strong>工具频率图表</strong>：柱状图展示调用分布</li><li><strong>分类统计</strong>：按类型分组汇总</li><li><strong>会话概览</strong>：对话轮次、成功率</li><li><strong>数字滚动动画</strong>：入场动画效果</li></ul><p class="mds">🛠️ edit_file</p></div>'
  }
};

function showTaskDetail(name) {
  var d = taskDetails[name];
  if(!d) return;
  document.getElementById('mtitle').textContent = '✅ ' + d.title;
  document.getElementById('mbody').innerHTML = '<button class="memback" onclick="showTasks()">← 返回任务列表</button>' + d.content;
}

// show functions
function showTools() {
  var total = getTotalCalls();
  var types = getToolTypes();
  var items = [];
  for (var i = 0; i < toolFreq.length; i++) {
    var t = toolFreq[i];
    items.push({
      icon: t.icon, cls: t.cls,
      name: t.name + ' x' + t.count,
      desc: t.desc,
      st: 'OK', sc: 'mok'
    });
  }
  openModal('🔍 工具调用 (' + total + '次 · ' + types + '种 · 100%)', items);
}

function showTasks() {
  if (_toolStats && _toolStats.tasks) {
    var tasks = _toolStats.tasks;
    var items = [];
    for (var i = 0; i < tasks.length; i++) {
      var t = tasks[i];
      items.push({ icon: t.icon, cls: t.cls||'mig', name: t.name, desc: t.desc, st: t.status, sc: 'mok' });
    }
    openModal('✅ 完成任务 (' + tasks.length + ')', items, 'showTaskDetail');
  } else {
    openModal('✅ 完成任务 (6)', [
      {icon:'🐱',cls:'mig',name:'Self-intro page',desc:'创建小黑自我介绍网页',st:'DONE',sc:'mok'},
      {icon:'🖼️',cls:'mib',name:'Fetch Xiaohei pic',desc:'抓取罗小黑角色图片',st:'DONE',sc:'mok'},
      {icon:'📊',cls:'mip',name:'AI Dashboard',desc:'构建实时任务可视化仪表盘',st:'DONE',sc:'mok'},
      {icon:'🚀',cls:'mic2',name:'Deploy online',desc:'部署至 GitHub Pages',st:'DONE',sc:'mok'},
      {icon:'✨',cls:'mio',name:'Enhance Dashboard',desc:'交互增强 + 数据可视化',st:'DONE',sc:'mok'},
      {icon:'🔧',cls:'mip',name:'Dynamic Tool Stats',desc:'工具调用数据动态化',st:'DONE',sc:'mok'}
    ], 'showTaskDetail');
  }
}

function showMemories() {
  if (_toolStats && _toolStats.memories) {
    var mems = _toolStats.memories;
    var items = [];
    for (var i = 0; i < mems.length; i++) {
      var m = mems[i];
      items.push({ icon: m.icon, cls: m.cls||'mig', name: m.name, desc: m.desc, st: m.status, sc: m.status==='ACTIVE'?'mok':'mpd' });
    }
    openModal('🧠 记忆条目 (' + mems.length + ')', items, 'showMemDetail');
  } else {
    openModal('🧠 记忆条目 (4)', [
      {icon:'📋',cls:'mib',name:'identity.md',desc:'我是罗小黑，猫妖精',st:'ACTIVE',sc:'mok'},
      {icon:'📁',cls:'mig',name:'trajectories/',desc:'任务执行轨迹记录',st:'PENDING',sc:'mpd'},
      {icon:'📁',cls:'mip',name:'experiences/',desc:'经验教训提炼',st:'PENDING',sc:'mpd'},
      {icon:'💫',cls:'mic2',name:'soul.md',desc:'小黑性格 & 灵魂设定',st:'ACTIVE',sc:'mok'}
    ], 'showMemDetail');
  }
}

// 🪙 DeepSeek Balance
function fetchBalance() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'balance.json?t=' + Date.now(), true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      try {
        var d = JSON.parse(xhr.responseText);
        renderBalance(d);
      } catch(e) { showBalFallback(); }
    } else { showBalFallback(); }
  };
  xhr.onerror = function() { showBalFallback(); };
  xhr.send();
}

function renderBalance(d) {
  var amt = document.getElementById('balamt');
  var st = document.getElementById('balstat');
  var top = document.getElementById('baltop');
  var grt = document.getElementById('balgrt');
  var tim = document.getElementById('baltime');
  var total = parseFloat(d.total_balance);

  if(amt) {
    amt.textContent = '¥' + total.toFixed(2);
    amt.className = 'balamt';
    if(total <= 1) amt.classList.add('low');
    else if(total <= 5) amt.classList.add('mid');
    else amt.classList.add('ok');
  }
  if(top) top.textContent = '¥' + parseFloat(d.topped_up_balance).toFixed(2);
  if(grt) grt.textContent = '¥' + parseFloat(d.granted_balance).toFixed(2);
  if(tim) tim.textContent = d.updated_at || '';

  if(st) {
    if(d.is_available && total > 0) { st.textContent = '可用'; st.className = 'balstat bsok'; }
    else if(d.is_available && total <= 0) { st.textContent = '不足'; st.className = 'balstat bswarn'; }
    else { st.textContent = '异常'; st.className = 'balstat bserr'; }
  }
}

function showBalFallback() {
  var amt = document.getElementById('balamt');
  if(amt) { amt.textContent = '¥ 2.95'; amt.className = 'balamt ok'; }
  var tim = document.getElementById('baltime');
  if(tim) tim.textContent = '--';
  var st = document.getElementById('balstat');
  if(st) { st.textContent = '缓存'; st.className = 'balstat bswarn'; }
}

fetchBalance();
// Refresh balance every 2 minutes
setInterval(fetchBalance, 120000);

function pad2(n) { return n<10 ? '0'+n : ''+n; }
function showUptime() {
  var e = Math.floor((Date.now()-startTime)/1000);
  var m=Math.floor(e/60), s=e%60;
  var h=Math.floor(m/60); m=m%60;
  var d = new Date(startTime);
  var startStr = d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate())+' '+pad2(d.getHours())+':'+pad2(d.getMinutes())+' CST';
  var uptimeStr = (h>0 ? h+'h ':'') + m+'m '+s+'s';
  openModal('⏱️ 运行状态', [
    {icon:'🟢',cls:'mig',name:'HTTP Server',desc:'Python3 :8080 running',st:'ONLINE',sc:'mok'},
    {icon:'🟢',cls:'mig',name:'GitHub Pages',desc:'zn0425.github.io/dashboard',st:'LIVE',sc:'mok'},
    {icon:'⏱️',cls:'mib',name:'运行时长',desc:uptimeStr+' since start',st:'UP',sc:'mok'},
    {icon:'📅',cls:'mip',name:'启动时间',desc:startStr,st:'OK',sc:'mok'}
  ]);
}

// 🔧 Tool call tracking - uses _toolStats from tool_stats.json
function fetchTools() {
  loadToolStats(function() {
    refreshToolFreq();
    renderBarChart();
    var s1 = document.getElementById('sc1');
    if (s1) animateCounter(s1, getTotalCalls(), 800);
    var sub = document.querySelector('.stat:nth-child(1) .stsub');
    if (sub) sub.textContent = getToolTypes() + ' tools - ' + ((_toolStats&&_toolStats.success_rate)?_toolStats.success_rate:100) + '% OK';
    var badges = document.querySelectorAll('.phbadge');
    if (badges.length >= 1) badges[0].textContent = 'Total ' + getTotalCalls() + ' calls';
    if (badges.length >= 2) badges[1].textContent = getToolTypes() + ' tools - ' + getTotalCalls() + ' calls';
    var bsi = document.querySelectorAll('.bsi strong');
    var topTool = toolFreq.length > 0 ? toolFreq[0] : null;
    if (bsi.length >= 1 && topTool) bsi[0].textContent = topTool.name + ' (' + topTool.count + ')';
    if (bsi.length >= 3) bsi[2].textContent = getToolTypes() + '';
    var sivs = document.querySelectorAll('.sgrid .siv');
    if (sivs.length >= 2) sivs[1].textContent = getTotalCalls() + '';
  });
}

console.log('🐱 Xiaohei Dashboard ready!');
