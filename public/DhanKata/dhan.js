  // Sample data for six workers (you'll replace this by fetching from your API)
    const data = [
      { id: 'worker1', name: 'Rahim', workedDays: 20, absentDays: 4, datesWorked: ['2025-11-01','2025-11-02','2025-11-03','2025-11-01','2025-11-02','2025-11-03'], totalWage: 10000, payments: [{date:'2025-11-15',amount:4000,girosto:'Mizan'},{date:'2025-11-25',amount:3000,girosto:'Ali'}] },
      { id: 'worker2', name: 'Karim', workedDays: 18, absentDays: 6, datesWorked: ['2025-11-02','2025-11-04'], totalWage: 9000, payments: [{date:'2025-11-20',amount:5000,girosto:'Rahim'}] },
      { id: 'worker3', name: 'Salam', workedDays: 22, absentDays: 2, datesWorked: ['2025-11-01','2025-11-02'], totalWage: 11000, payments: [{date:'2025-11-10',amount:7000,girosto:'Mizan'}] },
      { id: 'worker4', name: 'Jamal', workedDays: 15, absentDays: 9, datesWorked: ['2025-11-03'], totalWage: 7500, payments: [] },
      { id: 'worker5', name: 'Nabila', workedDays: 21, absentDays: 3, datesWorked: ['2025-11-05'], totalWage: 10500, payments: [{date:'2025-11-21',amount:5000,girosto:'Kader'}] },
      { id: 'worker6', name: 'Anis', workedDays: 19, absentDays: 5, datesWorked: ['2025-11-01'], totalWage: 9500, payments: [{date:'2025-11-18',amount:2000,girosto:'Sabbir'},{date:'2025-11-26',amount:1500,girosto:'Jamal'}] }
    ];

    // Utilities
    const $ = sel => document.querySelector(sel);
    const $$ = sel => Array.from(document.querySelectorAll(sel));

    function render() {
      const q = $('#q').value.trim().toLowerCase();
      const month = $('#month').value;

      const filtered = data.filter(w => {
        if (q && !(w.name.toLowerCase().includes(q) || w.id.toLowerCase().includes(q))) return false;
        if (month !== 'all') {
          return w.datesWorked.some(d => d.startsWith(month));
        }
        return true;
      });

      const tbody = $('#tableBody'); tbody.innerHTML='';
      const cards = $('#cards'); cards.innerHTML='';

      if (filtered.length === 0) {
        $('#emptyMsg').style.display = 'block';
      } else { $('#emptyMsg').style.display = 'none'; }

      filtered.forEach(w => {
        const paid = w.payments.reduce((s,p)=>s+p.amount,0);
        const due = w.totalWage - paid;

        // Desktop row
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            <div style="display:flex;align-items:center;gap:10px">
              <div style="width:44px;height:44px;background:#eef2ff;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700">${w.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div>
              <div>
                <div style="font-weight:600">${w.name}</div>
                <div class="small">${w.id}</div>
              </div>
            </div>
          </td>
          <td>${w.workedDays}</td>
          <td>${w.absentDays}</td>
          <td>${w.datesWorked.slice(0,4).join(', ')}${w.datesWorked.length>4? '…':''}</td>
          <td>${w.totalWage}</td>
          <td>${paid}</td>
          <td>${due}</td>
          <td><button class="btn" data-id="${w.id}" onclick="openPayments('${w.id}')">View</button></td>
        `;
        tbody.appendChild(tr);

        // Mobile card
        const card = document.createElement('article');
        card.className = 'card-row';
        card.innerHTML = `
          <div class="card-top">
            <div class="card-left">
              <div class="avatar">${w.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div>
              <div>
                <div style="font-weight:600">${w.name}</div>
                <div class="small">${w.id}</div>
              </div>
            </div>
            <div class="chip">${w.totalWage} ৳</div>
          </div>
          <div class="card-bottom">
            <div class="pill">✔ উপস্থিত: <strong>${w.workedDays}</strong></div>
            <div class="pill">Absent: <strong>${w.absentDays}</strong></div>
            <div class="pill">Paid: <strong>${paid}</strong></div>
            <div class="pill">Due: <strong>${due}</strong></div>
            <div style="flex:1"></div>
            <div><button class="btn" onclick="openPayments('${w.id}')">Payments</button></div>
          </div>
        `;
        cards.appendChild(card);
      });

      // populate month select from dates in data
      populateMonths();
    }

    function populateMonths(){
      const sel = $('#month');
      const months = new Set();
      data.forEach(w=> w.datesWorked.forEach(d=> months.add(d.slice(0,7))));
      const list = Array.from(months).sort();
      // keep existing selection
      const cur = sel.value;
      sel.innerHTML = '<option value="all">All dates</option>' + list.map(m=>`<option value="${m}">${m}</option>`).join('');
      if (list.includes(cur)) sel.value = cur; else sel.value = 'all';
    }

    // Modal logic
    function openPayments(id){
      const worker = data.find(w=>w.id===id);
      if(!worker) return;
      const modalBg = $('#modalBg');
      $('#modalTitle').textContent = `Payments — ${worker.name}`;
      const content = $('#modalContent');
      if(worker.payments.length===0){
        content.innerHTML = '<div class="muted">কোনো পেমেন্ট নেই</div>';
      } else {
        content.innerHTML = '<table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left">Date</th><th style="text-align:right">Amount</th><th style="text-align:left">Girosto</th></tr></thead><tbody>' +
          worker.payments.map(p=>`<tr><td style="padding:8px 4px">${p.date}</td><td style="padding:8px 4px;text-align:right">${p.amount}</td><td style="padding:8px 4px">${p.girosto}</td></tr>`).join('') + '</tbody></table>';
      }
      modalBg.style.display = 'flex';
    }
    $('#closeModal').addEventListener('click', ()=>$('#modalBg').style.display='none');
    $('#modalBg').addEventListener('click', (e)=>{ if(e.target===$('#modalBg')) $('#modalBg').style.display='none' });

    // search & export
    $('#q').addEventListener('input', ()=>render());
    $('#month').addEventListener('change', ()=>render());

    function exportCSV(){
      const headers = ['id','name','workedDays','absentDays','datesWorked','totalWage','paid','due'];
      const rows = data.map(w=>{
        const paid = w.payments.reduce((s,p)=>s+p.amount,0);
        return [w.id,w.name,w.workedDays,w.absentDays,`"${w.datesWorked.join(';')}"`,w.totalWage,paid,w.totalWage-paid];
      });
      const csv = [headers.join(','), ...rows.map(r=>r.join(','))].join('\n');
      const blob = new Blob([csv],{type:'text/csv'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href=url; a.download='attendance.csv'; a.click(); URL.revokeObjectURL(url);
    }
    $('#export').addEventListener('click', exportCSV);

    // initial render
    render();