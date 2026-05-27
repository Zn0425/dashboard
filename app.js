// Xiaohei AI Agent Dashboard
var startTime = Date.now();

setInterval(function() {
  var e = Math.floor((Date.now()-startTime)/1000);
  var m = Math.floor(e/60), s = e%60;
  var u = document.getElementById('up');
  if(u) u.textContent = m + 'm ' + s + 's';
}, 1000);

function openModal(title, items) {
  document.getElementById('mtitle').textContent = title;
  var b = document.getElementById('mbody');
  var h = '';
  for(var i=0; i<items.length; i++) {
    var it = items[i];
    h += '<div class="mi"><div class="mic '+it.cls+'">'+it.icon+'</div><div class="mif"><div class="mn">'+it.name+'</div><div class="md">'+it.desc+'</div></div><div class="ms '+it.sc+'">'+it.st+'</div></div>';
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
    {icon:'🔍',cls:'mib',name:'openviking_search',desc:'Final verification',st:'RUNNING',sc:'mrn'},
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
    {icon:'📁',cls:'mig',name:'trajectories/',desc:'Task execution records (pending)',st:'EMPTY',sc:'mpd'},
    {icon:'📁',cls:'mip',name:'experiences/',desc:'Lessons distilled from tasks',st:'EMPTY',sc:'mpd'},
    {icon:'💫',cls:'mic2',name:'soul.md',desc:'Xiaohei personality & soul',st:'ACTIVE',sc:'mok'}
  ]);
}

function showUptime() {
  var e = Math.floor((Date.now()-startTime)/1000);
  var m=Math.floor(e/60), s=e%60;
  openModal('Uptime', [
    {icon:'🟢',cls:'mig',name:'HTTP Server',desc:'Python3 :8080 running',st:'ONLINE',sc:'mok'},
    {icon:'🟢',cls:'mig',name:'localtunnel',desc:'Public tunnel active',st:'ACTIVE',sc:'mok'},
    {icon:'⏱️',cls:'mib',name:'Uptime',desc:m+'m '+s+'s since start',st:'UP',sc:'mok'},
    {icon:'📅',cls:'mip',name:'Started',desc:'2026-05-27 18:38 CST',st:'OK',sc:'mok'}
  ]);
}

console.log('🐱 Xiaohei Dashboard ready!');