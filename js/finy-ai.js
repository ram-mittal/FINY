/* ============================================================
   arthX AI MODULE
   Simulated AI Chat Interface & Context Awareness
============================================================ */

(function () {
  'use strict';

  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatHistory = document.getElementById('chatHistory');
  let currentUser = null;
  
  // To make the AI feel real, we'll fetch the user's net worth as context
  let userNetWorthContext = null;

  document.addEventListener('arthx:auth', async (e) => {
    currentUser = e.detail.user;
    if (currentUser) {
      // Fetch context silently in background
      const { data } = await window.supabaseClient
        .from('net_worth')
        .select('net_worth')
        .eq('user_id', currentUser.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (data) userNetWorthContext = data.net_worth;
    }
  });

  if (chatForm) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
      }
    });

    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const query = chatInput.value.trim();
      if (!query) return;

      if (!currentUser) {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (session && session.user) {
          currentUser = session.user;
        } else {
          if (window.showToast) window.showToast('Please log in first.', 'error');
          return;
        }
      }

      // 1. Append User Bubble
      appendMessage(query, 'user');
      chatInput.value = '';
      
      // 2. Loading State
      const btn = chatForm.querySelector('button[type="submit"]');
      if (window.setLoading) window.setLoading(btn, true);
      chatInput.disabled = true;

      // 3. Simulate Network Delay for LLM inference (1.5 seconds)
      setTimeout(() => {
        // 4. Generate contextual response
        let aiResponse = "I'm currently running in Demo Mode. To connect me to a real LLM like OpenAI or Gemini, you'll need to deploy a Supabase Edge Function.";
        let citations = [];

        const lowerQ = query.toLowerCase();
        
        if (lowerQ.includes('net worth') || lowerQ.includes('how much do i have') || lowerQ.includes('my money')) {
          if (userNetWorthContext !== null) {
            aiResponse = `Based on your dashboard data, your current calculated Net Worth is **${window.formatINR ? window.formatINR(userNetWorthContext) : userNetWorthContext}**. Would you like me to suggest some rebalancing strategies in the Portfolio Lab?`;
            citations.push({ source: 'arthX Internal DB', path: 'net_worth table' });
          } else {
            aiResponse = "You haven't filled out your Assets and Liabilities yet. Please go to the Net Worth tab so I can analyze your financial position!";
          }
        } 
        else if (lowerQ.includes('dsr') || lowerQ.includes('dscr') || lowerQ.includes('loan') || lowerQ.includes('business')) {
          aiResponse = "A healthy Debt Service Coverage Ratio (DSCR) for a rural enterprise is typically 1.25x or higher. This means your Net Operating Income is 125% of your debt obligations. You can model this exactly in our Enterprise Advisor tab.";
          citations.push({ source: 'arthX Academy', path: 'Rural Enterprise Finance Module' });
          citations.push({ source: 'Investopedia', path: 'https://www.investopedia.com/terms/d/dscr.asp' });
        }
        else if (lowerQ.includes('hello') || lowerQ.includes('hi')) {
          aiResponse = "Hello! I am arthX. I'm connected to your financial data and our secure knowledge base. How can I assist you today?";
        }
        else {
          aiResponse = `That's a great question about "${query}". I can help you analyze risk and project compound growth. Just let me know what specific assets you're looking at.`;
        }

        // 5. Append AI Bubble with Evidence Layer
        appendMessage(aiResponse, 'ai', citations);
        
        if (window.setLoading) window.setLoading(btn, false);
        chatInput.disabled = false;
        chatInput.focus();
      }, 1500);
    });
  }

  function appendMessage(text, sender, citations = []) {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.gap = '16px';
    wrapper.style.maxWidth = '85%';
    
    if (sender === 'user') {
      wrapper.style.alignSelf = 'flex-end';
      wrapper.style.flexDirection = 'row-reverse';
    }

    let avatar = '';
    if (sender === 'ai') {
      avatar = `<div style="width:36px; height:36px; border-radius:12px; background:linear-gradient(135deg, var(--accent-sky), #b3e0f2); display:flex; align-items:center; justify-content:center; flex-shrink:0; font-family:var(--font-serif); color:var(--bg-main); font-weight:600; font-size:18px; box-shadow:0 4px 15px var(--accent-sky-glow);">A</div>`;
    } else {
      avatar = `<div style="width:36px; height:36px; border-radius:12px; background:rgba(255,255,255,0.05); border:1px solid var(--glass-border); display:flex; align-items:center; justify-content:center; flex-shrink:0; font-family:var(--font-sans); color:var(--text-main); font-weight:500; font-size:16px;">U</div>`;
    }

    // Format basic bold markdown for demo
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--accent-sky); font-weight:500;">$1</strong>');

    let citationsHTML = '';
    if (citations.length > 0) {
      citationsHTML = `<div style="margin-top:12px; padding-top:12px; border-top:1px solid rgba(255,255,255,0.08); font-size:11px; opacity:0.8;">
        <span class="mono" style="display:block; margin-bottom:6px; color:var(--accent-sky);">EVIDENCE / SOURCES</span>
        ${citations.map(c => `<div style="margin-bottom:4px; display:flex; align-items:center; gap:6px;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> ${c.source} <span style="opacity:0.5;">(${c.path})</span></div>`).join('')}
      </div>`;
    }

    const bubbleColor = sender === 'ai' ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, rgba(135, 206, 235, 0.1), rgba(135, 206, 235, 0.05))';
    const borderStyle = sender === 'ai' ? '1px solid var(--glass-border)' : '1px solid rgba(135,206,235,0.15)';
    const borderRadius = sender === 'ai' ? '4px 16px 16px 16px' : '16px 4px 16px 16px';

    const bubble = `
      <div style="background:${bubbleColor}; border:${borderStyle}; padding:18px 24px; border-radius:${borderRadius}; font-size:14px; line-height:1.6; color:var(--text-main); box-shadow:0 10px 30px rgba(0,0,0,0.1);">
        ${formattedText}
        ${citationsHTML}
      </div>
    `;

    wrapper.innerHTML = avatar + bubble;
    chatHistory.appendChild(wrapper);
    
    // Auto scroll to bottom
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

})();
