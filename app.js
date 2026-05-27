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

function openModal(title, items, detailHandler) {
  document.getElementById('mtitle').textContent = title;
  var b = document.getElementById('mbody');
  var h = '';
  for(var i=0; i<items.length; i++) {
    var it = items[i];
    var onClick = detailHandler ? ' onclick="'+detailHandler+'(\''+it.name+'\')"' : '';
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

function showMemDetail(name) {
  var d = memDetails[name];
  if(!d) return;
  document.getElementById('mtitle').textContent = '🧠 ' + d.title;
  var b = document.getElementById('mbody');
  b.innerHTML = '<button class="memback" onclick="showMemories()">← 返回记忆列表</button>' + d.content;
}

// 任务详细内容
var taskDetails = {
  'Self-intro page': {
    title: '🐱 小黑自我介绍页面',
    content: '<div class="mdct"><h3>📄 项目概述</h3><p>为小黑创建了一个精美的个人介绍网页 <code>xiaohei-intro/index.html</code>，展示罗小黑的角色信息。</p><h3>🎨 包含内容</h3><ul><li>小黑头像与角色名称</li><li>身份说明：来自《罗小黑战记》的猫妖精</li><li>性格特点：可爱、好奇、贪玩、忠诚</li><li>能力标签：变身、搜索、编程、聊天</li><li>渐变背景 + 毛玻璃卡片设计</li></ul><h3>🛠️ 使用工具</h3><p><code>write_file</code> — 创建 HTML/CSS 文件</p><h3>📊 状态</h3><p class="mds">✅ 已完成 — 可通过 localtunnel 公网访问</p></div>'
  },
  'Fetch Xiaohei pic': {
    title: '🖼️ 获取小黑图片',
    content: '<div class="mdct"><h3>📄 项目概述</h3><p>从 MyAnimeList 等网站抓取罗小黑的角色图片，用于自我介绍页面。</p><h3>🔍 数据来源</h3><ul><li>MyAnimeList — 罗小黑战记条目</li><li>动漫角色资料页</li></ul><h3>🛠️ 使用工具</h3><p><code>web_fetch</code> — 抓取网页内容并提取图片 URL</p><h3>📊 状态</h3><p class="mds">✅ 已完成 — 图片已嵌入 intro 页面</p></div>'
  },
  'AI Dashboard': {
    title: '📊 AI Agent 实时仪表盘',
    content: '<div class="mdct"><h3>📄 项目概述</h3><p>构建了一个完整的 AI Agent 实时任务执行可视化仪表盘。</p><h3>🎯 核心功能</h3><ul><li><strong>统计卡片</strong>：工具调用次数、完成任务数、记忆条目、运行时间</li><li><strong>工具执行日志</strong>：12 条工具调用记录，实时状态展示</li><li><strong>对话演示</strong>：用户与 Agent 的真实对话示例</li><li><strong>架构图</strong>：VikingBot → OpenViking → 工具链流程</li><li><strong>能力矩阵</strong>：知识检索、文件读写、命令执行、网页搜索</li></ul><h3>🛠️ 使用工具</h3><p><code>write_file</code> × 3 — 创建 HTML/CSS/JS 三个文件</p><h3>📊 状态</h3><p class="mds">✅ 已完成 — 响应式设计，支持移动端</p></div>'
  },
  'Deploy online': {
    title: '🚀 部署到公网',
    content: '<div class="mdct"><h3>📄 项目概述</h3><p>将小黑的项目部署到公网，使外部用户可以访问。</p><h3>🔗 部署方案</h3><ul><li><strong>localtunnel</strong>：快速隧道代理，将本地 8080 端口暴露到公网</li><li><strong>GitHub Pages</strong>：永久托管方案，绑定自定义域名</li></ul><h3>🌐 访问地址</h3><p>localtunnel 临时地址（已过期）→ 永久地址：<a href="https://zn0425.github.io/dashboard" target="_blank">zn0425.github.io/dashboard</a></p><h3>🛠️ 使用工具</h3><p><code>exec</code> — npx localtunnel、git push</p><h3>📊 状态</h3><p class="mds">✅ 已完成 — GitHub Pages 永久生效</p></div>'
  },
  'Enhance Dashboard': {
    title: '✨ Dashboard 功能增强',
    content: '<div class="mdct"><h3>📄 项目概述</h3><p>持续优化 Dashboard 的用户体验和交互功能。</p><h3>🔧 增强内容</h3><ul><li><strong>可点击详情弹窗</strong>：工具日志、任务列表、记忆条目均可点击查看详情</li><li><strong>运行时间修复</strong>：从动态计时改为固定启动时间，刷新不归零</li><li><strong>记忆条目详情</strong>：点击任意记忆可展开完整内容，支持返回列表</li><li><strong>任务详情查看</strong>：每个完成任务都有详细的项目介绍页面</li><li><strong>模态动画</strong>：弹窗入场缩放 + 淡入动画</li><li><strong>ESC 关闭</strong>：支持键盘 ESC 键关闭弹窗</li><li><strong>背景遮罩点击关闭</strong>：点击弹窗外部区域即可关闭</li></ul><h3>🛠️ 使用工具</h3><p><code>edit_file</code> — 增量修改 app.js</p><h3>📊 状态</h3><p class="mds">✅ 已完成 — 持续迭代中</p></div>'
  }
};

function showTaskDetail(name) {
  var d = taskDetails[name];
  if(!d) return;
  document.getElementById('mtitle').textContent = '✅ ' + d.title;
  var b = document.getElementById('mbody');
  b.innerHTML = '<button class="memback" onclick="showTasks()">← 返回任务列表</button>' + d.content;
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
  ], 'showTaskDetail');
}

function showMemories() {
  openModal('🧠 Memories (4)', [
    {icon:'📋',cls:'mib',name:'identity.md',desc:'I am Luo Xiaohei, cat spirit',st:'ACTIVE',sc:'mok'},
    {icon:'📁',cls:'mig',name:'trajectories/',desc:'Task execution records',st:'PENDING',sc:'mpd'},
    {icon:'📁',cls:'mip',name:'experiences/',desc:'Lessons distilled from tasks',st:'PENDING',sc:'mpd'},
    {icon:'💫',cls:'mic2',name:'soul.md',desc:'Xiaohei personality & soul',st:'ACTIVE',sc:'mok'}
  ], 'showMemDetail');
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
