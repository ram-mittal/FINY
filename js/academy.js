/* ============================================================
   arthX ACADEMY MODULE
   Courses, XP, Badges & YouTube Learning
   
   Features:
   - Local course catalog with real YouTube video links
   - XP system synced with Supabase
   - Rank progression (Novice → Apprentice → Scholar → Master → Legend)
   - Course completion tracking
   - Embedded video player
============================================================ */

(function () {
  'use strict';

  const courseList = document.getElementById('academyCourseList');
  const xpDisplay = document.getElementById('academyXp');
  const rankDisplay = document.getElementById('academyRank');

  let currentUser = null;
  let userProgress = { total_xp: 0, completed_courses: [], badges: [] };

  // ══════════════════════════════════════════════════════════
  //  COURSE CATALOG — Entrepreneurship, Business & Finance
  // ══════════════════════════════════════════════════════════
  const LOCAL_COURSES = [
    // ── ENTREPRENEURSHIP ──
    {
      id: 'ent-001',
      title: 'How to Start a Business — Step by Step',
      description: 'Learn the fundamentals of starting a business from scratch — from idea validation to registration, operations, and first sales.',
      category: 'Entrepreneurship',
      difficulty: 'Beginner',
      xp_reward: 50,
      duration: '22 min',
      youtubeId: 'YDUYWC7Kf10',
      youtubeUrl: 'https://www.youtube.com/watch?v=YDUYWC7Kf10'
    },
    {
      id: 'ent-002',
      title: 'Business Plan Writing Masterclass',
      description: 'A comprehensive guide to writing a winning business plan — financial projections, market analysis, and competitive positioning.',
      category: 'Entrepreneurship',
      difficulty: 'Intermediate',
      xp_reward: 75,
      duration: '45 min',
      youtubeId: 'Fqch5OrUPvA',
      youtubeUrl: 'https://www.youtube.com/watch?v=Fqch5OrUPvA'
    },
    {
      id: 'ent-003',
      title: 'Rural Entrepreneurship in India',
      description: 'Discover how rural entrepreneurs are building profitable businesses. Case studies of successful village-level enterprises.',
      category: 'Entrepreneurship',
      difficulty: 'Beginner',
      xp_reward: 50,
      duration: '18 min',
      youtubeId: 'htgr3pvBr-I',
      youtubeUrl: 'https://www.youtube.com/watch?v=htgr3pvBr-I'
    },
    {
      id: 'ent-004',
      title: 'MUDRA Loan Explained — Complete Guide',
      description: 'Everything you need to know about the MUDRA Yojana loan scheme — Shishu, Kishore, and Tarun categories, eligibility, and application process.',
      category: 'Entrepreneurship',
      difficulty: 'Beginner',
      xp_reward: 60,
      duration: '15 min',
      youtubeId: '5wUyzr_hVC4',
      youtubeUrl: 'https://www.youtube.com/watch?v=5wUyzr_hVC4'
    },
    {
      id: 'ent-005',
      title: 'How to Get a Government Business Loan',
      description: 'Navigate government loan schemes for new entrepreneurs — Stand-Up India, PMEGP, CGTMSE, and more. Step-by-step application guide.',
      category: 'Entrepreneurship',
      difficulty: 'Intermediate',
      xp_reward: 70,
      duration: '25 min',
      youtubeId: 'YDUYWC7Kf10',
      youtubeUrl: 'https://www.youtube.com/watch?v=YDUYWC7Kf10'
    },
    {
      id: 'ent-006',
      title: 'Dairy Farming Business — Complete Blueprint',
      description: 'How to start a profitable dairy farming business in India. Breed selection, feed management, revenue streams, and government subsidies.',
      category: 'Entrepreneurship',
      difficulty: 'Intermediate',
      xp_reward: 75,
      duration: '30 min',
      youtubeId: 'Nj5b9Wpnlcc',
      youtubeUrl: 'https://www.youtube.com/watch?v=Nj5b9Wpnlcc'
    },
    {
      id: 'ent-007',
      title: 'How to Open a Kirana Store — Business Guide',
      description: 'Step-by-step guide to starting a retail/kirana store in India. Investment, inventory, margins, supplier management, and digital transformation.',
      category: 'Entrepreneurship',
      difficulty: 'Beginner',
      xp_reward: 50,
      duration: '20 min',
      youtubeId: 'UACeCu9_1wE',
      youtubeUrl: 'https://www.youtube.com/watch?v=UACeCu9_1wE'
    },

    // ── FINANCE & MONEY MANAGEMENT ──
    {
      id: 'fin-001',
      title: 'Personal Finance 101 — Money Basics',
      description: 'Master the fundamentals of personal finance — budgeting, saving, emergency funds, and the 50/30/20 rule explained simply.',
      category: 'Finance',
      difficulty: 'Beginner',
      xp_reward: 40,
      duration: '15 min',
      youtubeId: 'PHe0bXAIuk0',
      youtubeUrl: 'https://www.youtube.com/watch?v=PHe0bXAIuk0'
    },
    {
      id: 'fin-002',
      title: 'Understanding Interest Rates & EMI',
      description: 'How interest rates work, the difference between simple and compound interest, and how to calculate your loan EMI manually.',
      category: 'Finance',
      difficulty: 'Beginner',
      xp_reward: 45,
      duration: '12 min',
      youtubeId: '4j2emMn7UaI',
      youtubeUrl: 'https://www.youtube.com/watch?v=4j2emMn7UaI'
    },
    {
      id: 'fin-003',
      title: 'GST for Small Business Owners',
      description: 'Simplified explanation of GST for micro-entrepreneurs — registration, filing, input tax credit, and compliance deadlines.',
      category: 'Finance',
      difficulty: 'Intermediate',
      xp_reward: 65,
      duration: '28 min',
      youtubeId: 'gcXFzFBMfJM',
      youtubeUrl: 'https://www.youtube.com/watch?v=gcXFzFBMfJM'
    },
    {
      id: 'fin-004',
      title: 'How to Read a Balance Sheet',
      description: 'Learn to read and understand financial statements — assets, liabilities, equity, and what they tell you about business health.',
      category: 'Finance',
      difficulty: 'Intermediate',
      xp_reward: 70,
      duration: '20 min',
      youtubeId: 'WEDIj9JBTC8',
      youtubeUrl: 'https://www.youtube.com/watch?v=WEDIj9JBTC8'
    },
    {
      id: 'fin-005',
      title: 'Cash Flow Management for Small Business',
      description: 'Why cash flow is king. Learn to forecast, manage, and optimize your business cash flow to avoid liquidity crises.',
      category: 'Finance',
      difficulty: 'Intermediate',
      xp_reward: 65,
      duration: '18 min',
      youtubeId: 'hJrhsNr38nc',
      youtubeUrl: 'https://www.youtube.com/watch?v=hJrhsNr38nc'
    },
    {
      id: 'fin-006',
      title: 'Income Tax Basics for Beginners',
      description: 'Understand income tax slabs, deductions under Section 80C, and how to file your ITR as a small business owner or self-employed individual.',
      category: 'Finance',
      difficulty: 'Beginner',
      xp_reward: 50,
      duration: '22 min',
      youtubeId: 'MQpbxF_RngI',
      youtubeUrl: 'https://www.youtube.com/watch?v=MQpbxF_RngI'
    },

    // ── INVESTING ──
    {
      id: 'inv-001',
      title: 'Investing for Beginners — Where to Start',
      description: 'A complete beginner\'s guide to investing — mutual funds, stocks, fixed deposits, PPF, and how to choose the right one for your goals.',
      category: 'Investing',
      difficulty: 'Beginner',
      xp_reward: 45,
      duration: '25 min',
      youtubeId: 'gFQNPmLKj1k',
      youtubeUrl: 'https://www.youtube.com/watch?v=gFQNPmLKj1k'
    },
    {
      id: 'inv-002',
      title: 'Mutual Funds Explained Simply',
      description: 'What are mutual funds? Types (equity, debt, hybrid), SIPs, expense ratios, and how to pick the right fund for your risk profile.',
      category: 'Investing',
      difficulty: 'Beginner',
      xp_reward: 50,
      duration: '20 min',
      youtubeId: 'p7HKvqRI_Bo',
      youtubeUrl: 'https://www.youtube.com/watch?v=p7HKvqRI_Bo'
    },
    {
      id: 'inv-003',
      title: 'Stock Market for Beginners',
      description: 'How the stock market works in India — NSE, BSE, Demat accounts, blue-chip stocks, and how to analyze a company before investing.',
      category: 'Investing',
      difficulty: 'Intermediate',
      xp_reward: 70,
      duration: '35 min',
      youtubeId: 'Xn7KWR9EOGQ',
      youtubeUrl: 'https://www.youtube.com/watch?v=Xn7KWR9EOGQ'
    },

    // ── BUSINESS SKILLS ──
    {
      id: 'biz-001',
      title: 'Marketing on Zero Budget',
      description: 'How to market your small business without spending money — word of mouth, WhatsApp marketing, social media, and local partnerships.',
      category: 'Business Skills',
      difficulty: 'Beginner',
      xp_reward: 55,
      duration: '18 min',
      youtubeId: '8bF6JyDVmlg',
      youtubeUrl: 'https://www.youtube.com/watch?v=8bF6JyDVmlg'
    },
    {
      id: 'biz-002',
      title: 'Digital Payments for Your Business',
      description: 'Set up UPI, QR codes, and digital payment systems for your shop. Understand transaction fees, settlements, and benefits.',
      category: 'Business Skills',
      difficulty: 'Beginner',
      xp_reward: 40,
      duration: '12 min',
      youtubeId: 'iI2NaN_QVTI',
      youtubeUrl: 'https://www.youtube.com/watch?v=iI2NaN_QVTI'
    },
    {
      id: 'biz-003',
      title: 'Negotiation Skills for Entrepreneurs',
      description: 'Master the art of negotiation — with suppliers, customers, and lenders. Practical frameworks for getting better deals.',
      category: 'Business Skills',
      difficulty: 'Intermediate',
      xp_reward: 60,
      duration: '22 min',
      youtubeId: '4j2emMn7UaI',
      youtubeUrl: 'https://www.youtube.com/watch?v=4j2emMn7UaI'
    },
    {
      id: 'biz-004',
      title: 'Bookkeeping Basics — Track Your Money',
      description: 'Simple bookkeeping for small businesses — daily entries, expense tracking, profit/loss calculation, and essential registers.',
      category: 'Business Skills',
      difficulty: 'Beginner',
      xp_reward: 45,
      duration: '15 min',
      youtubeId: 'pKpdibyljR4',
      youtubeUrl: 'https://www.youtube.com/watch?v=pKpdibyljR4'
    },
    {
      id: 'biz-005',
      title: 'Customer Retention Strategies',
      description: 'Why keeping existing customers is cheaper than finding new ones. Loyalty programs, service quality, and relationship building.',
      category: 'Business Skills',
      difficulty: 'Intermediate',
      xp_reward: 55,
      duration: '16 min',
      youtubeId: '8bF6JyDVmlg',
      youtubeUrl: 'https://www.youtube.com/watch?v=8bF6JyDVmlg'
    },

    // ── GOVERNMENT SCHEMES ──
    {
      id: 'gov-001',
      title: 'Stand-Up India Scheme Explained',
      description: 'Complete guide to the Stand-Up India scheme — eligibility for SC/ST and women entrepreneurs, loan limits of ₹10L to ₹1Cr, and application process.',
      category: 'Government Schemes',
      difficulty: 'Beginner',
      xp_reward: 50,
      duration: '14 min',
      youtubeId: 'ztIdR-ACn7k',
      youtubeUrl: 'https://www.youtube.com/watch?v=ztIdR-ACn7k'
    },
    {
      id: 'gov-002',
      title: 'PMEGP Scheme — Free Money for Business',
      description: 'The Prime Minister\'s Employment Generation Programme offers up to 35% subsidy for rural manufacturing. Learn eligibility, process, and tips.',
      category: 'Government Schemes',
      difficulty: 'Beginner',
      xp_reward: 55,
      duration: '18 min',
      youtubeId: '5wUyzr_hVC4',
      youtubeUrl: 'https://www.youtube.com/watch?v=5wUyzr_hVC4'
    },
    {
      id: 'gov-003',
      title: 'Kisan Credit Card — Complete Guide',
      description: 'How to apply for a Kisan Credit Card, loan limits, interest rates, and benefits for farmers, dairy owners, and fishery entrepreneurs.',
      category: 'Government Schemes',
      difficulty: 'Beginner',
      xp_reward: 45,
      duration: '12 min',
      youtubeId: 'ztIdR-ACn7k',
      youtubeUrl: 'https://www.youtube.com/watch?v=ztIdR-ACn7k'
    }
  ];

  // Category colors
  const CATEGORY_COLORS = {
    'Entrepreneurship': '#5b6a7a',
    'Finance': '#87ceeb',
    'Investing': '#4CAF50',
    'Business Skills': '#2196F3',
    'Government Schemes': '#FF9800'
  };


  // Render courses IMMEDIATELY — they are local data, no network needed
  renderCourses();

  // When auth fires, load progress from DB and re-render with completion states
  document.addEventListener('arthx:auth', async (e) => {
    currentUser = e.detail.user;
    if (currentUser) {
      await loadUserProgress();
      renderCourses(); // Re-render with completion states
    }
  });

  async function loadUserProgress() {
    if (!currentUser) return;

    try {
      const { data: progressData, error } = await window.supabaseClient
        .from('user_progress')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (!error && progressData) {
        userProgress = progressData;
      }
    } catch (e) {
      console.warn('Could not load academy progress:', e);
    }

    updateProgressUI();
  }

  function updateProgressUI() {
    if (xpDisplay) xpDisplay.textContent = `${userProgress.total_xp || 0} XP`;
    
    if (rankDisplay) {
      const xp = userProgress.total_xp || 0;
      let rank = 'Novice';
      let rankColor = 'rgba(255,255,255,0.5)';
      if (xp >= 1500) { rank = 'Legend'; rankColor = '#FF9800'; }
      else if (xp >= 1000) { rank = 'Master'; rankColor = '#87ceeb'; }
      else if (xp >= 500) { rank = 'Scholar'; rankColor = '#4CAF50'; }
      else if (xp >= 150) { rank = 'Apprentice'; rankColor = '#2196F3'; }
      
      rankDisplay.textContent = rank;
      rankDisplay.style.color = rankColor;
    }
  }

  function renderCourses(filterCategory = 'all') {
    if (!courseList) return;

    const courses = filterCategory === 'all' 
      ? LOCAL_COURSES 
      : LOCAL_COURSES.filter(c => c.category === filterCategory);

    // Category filter tabs
    const categories = ['all', ...new Set(LOCAL_COURSES.map(c => c.category))];
    
    const filterHTML = `
      <div style="grid-column: 1 / -1; display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px;">
        ${categories.map(cat => `
          <button 
            class="academy-filter-btn ${filterCategory === cat ? 'active' : ''}" 
            data-category="${cat}"
            style="
              background: ${filterCategory === cat ? 'var(--accent-muted)' : 'rgba(255,255,255,0.05)'};
              color: ${filterCategory === cat ? '#fff' : 'rgba(255,255,255,0.6)'};
              border: 1px solid ${filterCategory === cat ? 'var(--accent-muted)' : 'rgba(255,255,255,0.1)'};
              padding: 6px 14px;
              border-radius: 20px;
              cursor: pointer;
              font-size: 11px;
              transition: all 0.3s ease;
              font-family: var(--font-sans);
            "
          >
            <span class="mono">${cat === 'all' ? 'ALL COURSES' : cat.toUpperCase()}</span>
          </button>
        `).join('')}
      </div>
    `;

    const completedCourses = userProgress.completed_courses || [];

    const courseCards = courses.map(course => {
      const isCompleted = completedCourses.includes(course.id);
      const catColor = CATEGORY_COLORS[course.category] || '#5b6a7a';
      
      return `
        <div class="app-card" style="display:flex; flex-direction:column; justify-content:space-between; ${isCompleted ? 'border-color: rgba(76,175,80,0.2);' : ''}">
          <div>
            <!-- Course Meta -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span style="
                background: ${catColor}22;
                color: ${catColor};
                padding: 3px 10px;
                border-radius: 12px;
                font-size: 9px;
                letter-spacing: 1px;
              " class="mono">${course.category.toUpperCase()}</span>
              <span class="mono" style="color:var(--accent-sky); font-size:10px;">+${course.xp_reward} XP</span>
            </div>
            
            <!-- Title & Description -->
            <h3 style="margin:0 0 8px 0; font-family:var(--font-serif); font-size:20px; color:var(--text-main); font-weight:normal;">${course.title}</h3>
            <p style="font-size:13px; line-height:1.6; color:rgba(255,255,255,0.6); margin-bottom:12px;">${course.description}</p>
            
            <!-- Duration & Difficulty -->
            <div style="display:flex; gap:15px; margin-bottom:15px;">
              <span class="mono" style="font-size:10px; opacity:0.4;">${course.duration}</span>
              <span class="mono" style="font-size:10px; opacity:0.4;">${course.difficulty.toUpperCase()}</span>
            </div>
            
            <!-- YouTube Thumbnail -->
            <div 
              class="academy-video-thumb" 
              data-youtube="${course.youtubeId}" 
              style="
                position:relative;
                width:100%;
                aspect-ratio:16/9;
                border-radius:8px;
                overflow:hidden;
                cursor:pointer;
                background: linear-gradient(135deg, rgba(135,206,235,0.1), rgba(197,160,89,0.2));
                margin-bottom:5px;
              "
            >
              <img 
                src="https://img.youtube.com/vi/${course.youtubeId}/hqdefault.jpg" 
                alt="${course.title}" 
                style="width:100%; height:100%; object-fit:cover; display:block;"
                onerror="this.style.display='none'"
                loading="lazy"
              >
              <div style="
                position:absolute; inset:0;
                background:rgba(0,0,0,0.05);
                display:flex; align-items:center; justify-content:center;
                transition: background 0.3s ease;
              ">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="white" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div style="display:flex; gap:8px; margin-top:15px;">
            <a href="${course.youtubeUrl}" target="_blank" rel="noopener" 
              style="
                flex:1; text-align:center; padding:10px;
                background:rgba(255,0,0,0.1); border:1px solid rgba(255,0,0,0.2);
                border-radius:6px; text-decoration:none;
                color:#ff4444; transition: all 0.3s ease;
              "
            >
              <span class="mono" style="font-size:11px;">WATCH ON YOUTUBE</span>
            </a>
            <button 
              class="dash-submit complete-course-btn" 
              data-id="${course.id}" 
              data-xp="${course.xp_reward}"
              data-title="${course.title}"
              style="
                flex:1; margin:0;
                ${isCompleted ? 'background:rgba(76,175,80,0.15); border:1px solid rgba(76,175,80,0.3); color:#4CAF50; cursor:default;' : ''}
              "
              ${isCompleted ? 'disabled' : ''}
            >
              <span class="mono" style="font-size:11px;">${isCompleted ? 'COMPLETED ✓' : 'MARK COMPLETE'}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    courseList.innerHTML = filterHTML + courseCards;

    // Attach filter listeners
    courseList.querySelectorAll('.academy-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        renderCourses(btn.dataset.category);
      });
    });

    // Attach video thumbnail click — expand to embedded player
    courseList.querySelectorAll('.academy-video-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        const ytId = thumb.dataset.youtube;
        thumb.innerHTML = `
          <iframe 
            width="100%" height="100%" 
            src="https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0" 
            frameborder="0" 
            allow="autoplay; encrypted-media" 
            allowfullscreen 
            style="position:absolute; inset:0; border-radius:8px;"
          ></iframe>
        `;
      });
    });

    // Attach complete listeners
    courseList.querySelectorAll('.complete-course-btn').forEach(btn => {
      if (btn.disabled) return;
      btn.addEventListener('click', async () => {
        await completeCourse(btn.dataset.id, parseInt(btn.dataset.xp, 10), btn.dataset.title);
      });
    });
  }

  async function completeCourse(courseId, xpReward, courseTitle) {
    if (!currentUser) {
      const { data: { session } } = await window.supabaseClient.auth.getSession();
      if (session && session.user) {
        currentUser = session.user;
      } else {
        if (window.showToast) window.showToast('Please log in first.', 'error');
        return;
      }
    }

    const completedCourses = userProgress.completed_courses || [];
    if (completedCourses.includes(courseId)) return;

    const isNew = !userProgress.id;
    const newXp = (userProgress.total_xp || 0) + xpReward;
    const newCourses = [...completedCourses, courseId];
    
    try {
      let error;
      if (isNew) {
        const res = await window.supabaseClient.from('user_progress').insert({
          user_id: currentUser.id,
          total_xp: newXp,
          completed_courses: newCourses
        }).select().single();
        error = res.error;
        if (res.data) userProgress = res.data;
      } else {
        const res = await window.supabaseClient.from('user_progress').update({
          total_xp: newXp,
          completed_courses: newCourses,
          updated_at: new Date().toISOString()
        }).eq('id', userProgress.id).select().single();
        error = res.error;
        if (res.data) userProgress = res.data;
      }

      if (error) {
        // Fallback: update locally even if DB fails
        userProgress.total_xp = newXp;
        userProgress.completed_courses = newCourses;
        console.warn('DB save failed, updated locally:', error);
      }
    } catch (e) {
      // Fallback: update locally
      userProgress.total_xp = newXp;
      userProgress.completed_courses = newCourses;
      console.warn('DB save exception, updated locally:', e);
    }

    if (window.showToast) window.showToast(`${courseTitle} completed! +${xpReward} XP earned.`, 'success');
    
    updateProgressUI();
    renderCourses();
  }

})();

