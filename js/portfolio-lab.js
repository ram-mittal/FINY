/* ============================================================
   PORTFOLIO LAB MODULE — arthX
   Compound growth simulations.
============================================================ */

(function () {
  'use strict';

  const labForm = document.getElementById('labForm');
  const labFutureValue = document.getElementById('labFutureValue');
  const labChart = document.getElementById('labChart');

  if (labForm) {
    labForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const initial = parseFloat(labForm.querySelector('[name="lab-initial"]').value) || 0;
      const monthly = parseFloat(labForm.querySelector('[name="lab-monthly"]').value) || 0;
      const years = parseInt(labForm.querySelector('[name="lab-years"]').value, 10);
      const rate = parseFloat(labForm.querySelector('[name="lab-rate"]').value) || 0;

      if (isNaN(years) || years <= 0) return;

      // Compound interest math
      const months = years * 12;
      const monthlyRate = rate / 100 / 12;
      
      let futureValue = initial;
      let totalInvested = initial;

      for (let i = 0; i < months; i++) {
        futureValue = (futureValue + monthly) * (1 + monthlyRate);
        totalInvested += monthly;
      }

      if (labFutureValue && window.formatINR) {
        labFutureValue.textContent = window.formatINR(futureValue);
      }

      if (labChart && window.formatINR) {
        const wealthGained = futureValue - totalInvested;
        // Calculate relative heights (max 150px)
        const maxVal = Math.max(futureValue, totalInvested, wealthGained, 1);
        const hInvested = Math.max((totalInvested / maxVal) * 150, 5);
        const hReturns = Math.max((wealthGained / maxVal) * 150, 5);
        const hTotal = 150;

        labChart.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:flex-end; height:150px; border-bottom:1px solid rgba(255,255,255,0.2); padding-bottom:10px; gap:10px;">
            <div style="text-align:center; flex:1; min-width:0;">
              <div style="height:${hInvested}px; width:100%; max-width:40px; background:rgba(255,255,255,0.4); margin:0 auto; border-radius:4px 4px 0 0;"></div>
              <span class="mono" style="font-size:10px; display:block; margin-top:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">INVESTED</span>
              <strong style="font-size:12px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${window.formatINR(totalInvested)}">${window.formatINR(totalInvested)}</strong>
            </div>
            <div style="text-align:center; flex:1; min-width:0;">
              <div style="height:${hReturns}px; width:100%; max-width:40px; background:var(--accent-muted); margin:0 auto; border-radius:4px 4px 0 0;"></div>
              <span class="mono" style="font-size:10px; display:block; margin-top:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">RETURNS</span>
              <strong style="font-size:12px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${window.formatINR(wealthGained)}">${window.formatINR(wealthGained)}</strong>
            </div>
            <div style="text-align:center; flex:1; min-width:0;">
              <div style="height:${hTotal}px; width:100%; max-width:40px; background:var(--accent-sky); margin:0 auto; border-radius:4px 4px 0 0;"></div>
              <span class="mono" style="font-size:10px; display:block; margin-top:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">TOTAL</span>
              <strong style="font-size:12px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${window.formatINR(futureValue)}">${window.formatINR(futureValue)}</strong>
            </div>
          </div>
        `;
      }
    });
  }
})();
