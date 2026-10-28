/**
 * RAMJI SHARMA - AZURE DEVOPS PORTFOLIO INTERACTIVITY
 * Terminal simulator, theme toggling, pipeline animation, filter tabs & toast notifications
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Theme Management (Dark / Light) ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
  const currentTheme = localStorage.getItem('ramji_portfolio_theme') || 'dark';

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeIcon) {
        themeIcon.className = 'fa-solid fa-sun';
      }
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) {
        themeIcon.className = 'fa-solid fa-moon';
      }
    }
    localStorage.setItem('ramji_portfolio_theme', theme);
  }

  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(activeTheme);
      showToast(`Switched to ${activeTheme.charAt(0).toUpperCase() + activeTheme.slice(1)} Mode`);
    });
  }

  // --- 2. Mobile Menu Navigation ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-active');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu when link clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // --- 3. Navbar Scrollspy & Shadow ---
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Navbar blur background on scroll
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Scrollspy highlight
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 4. Dynamic Hero Typewriter Effect ---
  const typewriterTarget = document.getElementById('typewriter-text');
  const roles = [
    'Azure DevOps Engineer',
    'Cloud Infrastructure Architect',
    'Terraform & Landing Zone Specialist',
    'Kubernetes & GitOps Practitioner',
    'DevSecOps & Banking Cloud Consultant'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 70;

  function typeEffect() {
    if (!typewriterTarget) return;

    const currentRole = roles[roleIndex];
    if (isDeleting) {
      typewriterTarget.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 35;
    } else {
      typewriterTarget.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 70;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = 2200; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 400; // Pause before new word
    }

    setTimeout(typeEffect, typeSpeed);
  }

  typeEffect();

  // --- 5. Interactive Pipeline & Terminal Simulator ---
  const terminalBody = document.getElementById('terminal-body');
  const runPipelineBtn = document.getElementById('btn-run-pipeline');
  const driftBtn = document.getElementById('btn-check-drift');
  const secretScanBtn = document.getElementById('btn-scan-secrets');
  const clearTerminalBtn = document.getElementById('btn-clear-terminal');
  const stages = [
    document.getElementById('stage-1'),
    document.getElementById('stage-2'),
    document.getElementById('stage-3'),
    document.getElementById('stage-4'),
    document.getElementById('stage-5')
  ];

  let isPipelineRunning = false;

  function appendTerminalLine(text, type = 'info', prompt = true) {
    if (!terminalBody) return;
    const line = document.createElement('div');
    line.className = 'terminal-line';

    let promptHtml = prompt ? `<span class="term-prompt">devops@ramji-ops:~$</span> ` : '';
    let contentHtml = '';

    switch (type) {
      case 'cmd':
        contentHtml = `<span class="term-cmd">${text}</span>`;
        break;
      case 'success':
        contentHtml = `<span class="term-success">✔ ${text}</span>`;
        break;
      case 'warning':
        contentHtml = `<span class="term-warning">⚠ ${text}</span>`;
        break;
      case 'azure':
        contentHtml = `<span class="term-azure">☁ [Azure/Cloud] ${text}</span>`;
        break;
      case 'terraform':
        contentHtml = `<span class="term-terraform">⚡ [Terraform] ${text}</span>`;
        break;
      default:
        contentHtml = `<span class="term-info">${text}</span>`;
    }

    line.innerHTML = promptHtml + contentHtml;
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function setStageStatus(index, status) {
    if (!stages[index]) return;
    stages[index].classList.remove('active', 'success');
    if (status === 'active') {
      stages[index].classList.add('active');
    } else if (status === 'success') {
      stages[index].classList.add('success');
    }
  }

  function resetStages() {
    stages.forEach((stage, i) => {
      if (stage) stage.classList.remove('active', 'success');
    });
  }

  async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function executeFullPipeline() {
    if (isPipelineRunning) return;
    isPipelineRunning = true;
    if (runPipelineBtn) runPipelineBtn.disabled = true;

    resetStages();
    terminalBody.innerHTML = '';
    appendTerminalLine('az pipelines run --name "Enterprise-Banking-CI-CD" --branch main', 'cmd');
    await sleep(600);

    // Stage 1: Lint & SAST
    setStageStatus(0, 'active');
    appendTerminalLine('Starting Stage 1: SonarQube & Super Linter code quality checks...', 'info', false);
    await sleep(800);
    appendTerminalLine('Analyzing .NET Core APIs, Java microservices & Terraform modules...', 'info', false);
    await sleep(700);
    appendTerminalLine('SonarQube Quality Gate: PASSED (0 Vulnerabilities, 0 Security Hotspots, 94.2% Coverage)', 'success', false);
    setStageStatus(0, 'success');

    // Stage 2: Secret & IaC Security
    setStageStatus(1, 'active');
    appendTerminalLine('Starting Stage 2: DevSecOps TruffleHog & tfsec static scans...', 'info', false);
    await sleep(900);
    appendTerminalLine('Scanning Git commit history for high-entropy tokens and API keys...', 'info', false);
    appendTerminalLine('TruffleHog: Verified 0 leaked credentials in repository.', 'success', false);
    appendTerminalLine('tfsec: Azure Landing Zone configurations comply with CIS Benchmark v1.4.', 'success', false);
    setStageStatus(1, 'success');

    // Stage 3: Terraform Plan & State Locking
    setStageStatus(2, 'active');
    appendTerminalLine('terraform init -backend-config="storage_account_name=ramjiterraformstate" -reconfigure', 'cmd');
    await sleep(900);
    appendTerminalLine('Acquiring state lock on Azure Blob storage container [tfstate-prod]...', 'terraform', false);
    appendTerminalLine('terraform plan -out=prod.tfplan (Evaluating child modules: VNet, AKS, KeyVault, AppGateway)', 'terraform', false);
    await sleep(1000);
    appendTerminalLine('Plan: 4 to add, 2 to change, 0 to destroy. (No configuration drift detected)', 'success', false);
    setStageStatus(2, 'success');

    // Stage 4: Azure Policy & Compliance Gate
    setStageStatus(3, 'active');
    appendTerminalLine('Stage 4: Evaluating Azure Governance & RBAC Least Privilege via PIM...', 'info', false);
    await sleep(800);
    appendTerminalLine('Workload Identity Federation (OIDC) token validated with Azure AD / Entra ID.', 'azure', false);
    appendTerminalLine('Azure Policy Compliance: 100% compliant with RBI Banking Security Guidelines.', 'success', false);
    setStageStatus(3, 'success');

    // Stage 5: Progressive Rollout & GitOps
    setStageStatus(4, 'active');
    appendTerminalLine('argocd app sync enterprise-banking-aks --prune', 'cmd');
    await sleep(1000);
    appendTerminalLine('Synchronizing Kubernetes deployment manifests to AKS cluster (prod-aks-cluster)...', 'azure', false);
    appendTerminalLine('Canary progressive delivery initialized: 10% -> 25% -> 50% -> 100% traffic shift.', 'info', false);
    appendTerminalLine('Health checks: 32 pods Running, 0 Restarts. AGIC routing updated.', 'success', false);
    setStageStatus(4, 'success');

    await sleep(500);
    appendTerminalLine('====================================================================', 'info', false);
    appendTerminalLine('🎉 CI/CD Pipeline execution SUCCESSFUL! Zero downtime deployment complete.', 'success', false);
    appendTerminalLine('====================================================================', 'info', false);

    isPipelineRunning = false;
    if (runPipelineBtn) runPipelineBtn.disabled = false;
    showToast('CI/CD Pipeline Completed Successfully (100% SLA)!');
  }

  async function checkTerraformDrift() {
    if (isPipelineRunning) return;
    isPipelineRunning = true;
    appendTerminalLine('terraform plan -detailed-exitcode -refresh-only', 'cmd');
    await sleep(800);
    appendTerminalLine('Refreshing Azure provider state against Azure Resource Manager (ARM)...', 'terraform', false);
    await sleep(1000);
    appendTerminalLine('Evaluating VMSS, Application Gateway, Cosmos DB, NSGs and VNets...', 'azure', false);
    await sleep(600);
    appendTerminalLine('✔ INFRASTRUCTURE DRIFT CHECK: 0 drift detected. Remote state is 100% in sync with code.', 'success', false);
    isPipelineRunning = false;
    showToast('Terraform Drift Check: In Sync');
  }

  async function scanSecrets() {
    if (isPipelineRunning) return;
    isPipelineRunning = true;
    appendTerminalLine('trufflehog git file://. --only-verified', 'cmd');
    await sleep(700);
    appendTerminalLine('Searching all Git commits, PR branches, and GitHub Actions workflow secrets...', 'info', false);
    await sleep(900);
    appendTerminalLine('✔ TRUFFLEHOG AUDIT: 0 verified secrets detected. Git repository is clean.', 'success', false);
    isPipelineRunning = false;
    showToast('Secret Scan Passed Cleanly');
  }

  if (runPipelineBtn) runPipelineBtn.addEventListener('click', executeFullPipeline);
  if (driftBtn) driftBtn.addEventListener('click', checkTerraformDrift);
  if (secretScanBtn) secretScanBtn.addEventListener('click', scanSecrets);
  if (clearTerminalBtn) {
    clearTerminalBtn.addEventListener('click', () => {
      terminalBody.innerHTML = '';
      resetStages();
      appendTerminalLine('Terminal cleared. Click "Run Full Pipeline" to start simulation.', 'info');
    });
  }

  // --- 6. Project Filter Tabs ---
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || category.includes(filterValue)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 7. Earlier Career Accordion ---
  const earlierToggle = document.getElementById('earlier-career-toggle');
  const earlierContent = document.getElementById('earlier-career-content');

  if (earlierToggle && earlierContent) {
    earlierToggle.addEventListener('click', () => {
      earlierContent.classList.toggle('open');
      const icon = earlierToggle.querySelector('.toggle-icon');
      if (icon) {
        icon.classList.toggle('fa-chevron-down');
        icon.classList.toggle('fa-chevron-up');
      }
    });
  }

  // --- 8. One-Click Copy Utilities ---
  window.copyToClipboard = function(text, label = 'Text') {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label} copied to clipboard!`);
    }).catch(err => {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast(`${label} copied to clipboard!`);
    });
  };

  // --- 9. Toast Notification Handler ---
  function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --- 10. Interactive Contact Form Handler ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name')?.value.trim();
      const email = document.getElementById('form-email')?.value.trim();
      const subjectType = document.getElementById('form-subject')?.value || 'DevOps Opportunity';
      const message = document.getElementById('form-message')?.value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.');
        return;
      }

      const emailSubject = encodeURIComponent(`[Portfolio Inquiry] ${subjectType} - from ${name}`);
      const emailBody = encodeURIComponent(
        `Hi Ramji,\n\n${message}\n\nSender Name: ${name}\nSender Email: ${email}`
      );

      // Open mailto
      window.location.href = `mailto:ramjish0586@gmail.com?subject=${emailSubject}&body=${emailBody}`;

      showToast('Opening your email client to dispatch message...');
      contactForm.reset();
    });
  }

  // --- 11. Resume Print / PDF Export Handler ---
  const printResumeBtn = document.getElementById('btn-print-resume');
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.print();
    });
  }
});
