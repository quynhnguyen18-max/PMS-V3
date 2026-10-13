(function(){
  'use strict';
  var params=new URLSearchParams(window.location.search);
  if(params.get('hrbpView')!=='1')return;

  var employee=params.get('emp')||params.get('manager');
  var managerRole=params.get('role');
  if(window.PMSStore){
    window.PMSStore.setSession({
      emp:employee||window.PMSStore.session().emp,
      role:params.has('manager')?(managerRole||'lm1'):'nv',
      scenario:null,
      from:null
    });
  }

  function openRequestedTab(){
    var tab=params.get('tab');
    if(typeof window.switchMainTab==='function')window.switchMainTab(tab==='goals'?0:tab==='myr'?1:2);
    if(typeof window.switchCycleTab==='function')window.switchCycleTab(tab==='goals'?0:tab==='myr'?1:2);
  }

  function lockMutations(){
    document.body.classList.add('hrbp-proxy-view');
    function freezeControls(root){
      var controls=[];
      if(root.matches&&root.matches('input,textarea,select,[contenteditable="true"]'))controls.push(root);
      if(root.querySelectorAll)controls=controls.concat(Array.from(root.querySelectorAll('input,textarea,select,[contenteditable="true"]')));
      controls.forEach(function(control){
        if(control.matches('[contenteditable]'))control.setAttribute('contenteditable','false');
        else control.disabled=true;
      });
    }
    freezeControls(document);
    new MutationObserver(function(changes){changes.forEach(function(change){change.addedNodes.forEach(function(node){if(node.nodeType===1)freezeControls(node);});});}).observe(document.body,{childList:true,subtree:true});
    document.addEventListener('submit',function(event){event.preventDefault();event.stopImmediatePropagation();},true);
    document.addEventListener('click',function(event){
      var button=event.target.closest('button');
      if(!button)return;
      var label=(button.textContent+' '+(button.getAttribute('aria-label')||'')).trim();
      if(button.closest('.role-switch')||/(Lưu|Gửi|Thu hồi|Xác nhận|Từ chối|Duyệt|Yêu cầu|Thêm|Sửa|Xóa|Chọn tệp|Tải lên|Phê duyệt)/i.test(label)){
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },true);
    var badge=document.createElement('div');
    badge.className='hrbp-proxy-badge';
    badge.setAttribute('role','status');
    var person=(window.PMS_EMPLOYEES||[]).find(function(item){return item.id===employee;});
    badge.textContent='HRBP - Chỉ xem'+(person?' - '+person.name+' ('+person.login+')':'');
    document.body.appendChild(badge);
  }

  function syncProxyIdentity(){
    var person=(window.PMS_EMPLOYEES||[]).find(function(item){return item.id===employee;});
    if(!person)return;
    var name=document.querySelector('.sb-uname');
    var role=document.querySelector('.sb-urole');
    if(name)name.textContent=person.name;
    if(role)role.textContent=params.has('manager')?'Quản lý, '+person.div+' - '+person.dept:'Nhân viên, '+person.dept;
    if(!params.has('manager')){
      var lines=document.querySelectorAll('.ec-line');
      if(lines[0])lines[0].innerHTML='<span class="ec-lbl">Nhân viên:</span> '+person.name+' <span class="ec-dom">('+person.login+')</span>';
      if(lines[1])lines[1].innerHTML='<span class="ec-lbl">Team:</span> '+person.div+' - '+person.dept;
      if(lines[2]&&person.mgr)lines[2].innerHTML='<span class="ec-lbl">Quản lý trực tiếp:</span> '+person.mgr.name+' <span class="ec-dom">('+person.mgr.login+')</span>';
      document.querySelectorAll('.ci-name').forEach(function(item){if(item.textContent.trim()==='Nguyễn Văn Tú')item.textContent=person.name;});
    }
  }

  var style=document.createElement('style');
  style.textContent='.hrbp-proxy-badge{position:fixed;right:18px;bottom:18px;z-index:9999;padding:7px 11px;border:1px solid var(--brand-ring,#f3a7cf);border-radius:999px;background:var(--brand-muted,#fce7f3);color:var(--brand,#b0006d);font:600 12px/1.3 "Public Sans",sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.12)}';
  document.head.appendChild(style);
  document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){openRequestedTab();syncProxyIdentity();lockMutations();},0);});
})();
