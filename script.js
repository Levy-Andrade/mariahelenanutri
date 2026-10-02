/**
 * ==========================================================================
 * LANDING PAGE - NUTRICIONISTA MARIA HELENA
 * Lógica Vanilla JavaScript (Zero dependências externas)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. ATUALIZAÇÃO AUTOMÁTICA DO ANO NO FOOTER
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 2. ANIMAÇÃO DE DIGITAÇÃO (TYPING EFFECT NO HERO)
  // --------------------------------------------------------------------------
  const typingTarget = document.getElementById('typingText');
  if (typingTarget) {
    const textToType = "Emagrecimento e Performance sem neuras.";
    let charIndex = 0;
    const typingSpeed = 50; // milissegundos por caractere

    function typeCharacter() {
      if (charIndex < textToType.length) {
        typingTarget.textContent += textToType.charAt(charIndex);
        charIndex++;
        setTimeout(typeCharacter, typingSpeed);
      }
    }

    // Inicia a digitação após breve intervalo para suavidade no carregamento
    setTimeout(typeCharacter, 300);
  }

  // --------------------------------------------------------------------------
  // 3. MENU MOBILE (DRAWER & BOTÃO HAMBURGUER)
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu(forceClose = false) {
    if (!mobileToggle || !mobileMenu) return;

    const isOpen = forceClose ? true : mobileMenu.classList.contains('open');

    if (isOpen) {
      mobileMenu.classList.remove('open');
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    } else {
      mobileMenu.classList.add('open');
      mobileToggle.classList.add('active');
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Fechar menu mobile ao clicar em um link
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleMobileMenu(true);
    });
  });

  // Fechar menu mobile ao clicar fora dele
  document.addEventListener('click', (e) => {
    if (
      mobileMenu &&
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !mobileToggle.contains(e.target)
    ) {
      toggleMobileMenu(true);
    }
  });

  // --------------------------------------------------------------------------
  // 4. DESTAQUE DO LINK ATIVO NA NAVEGAÇÃO AO ROLAR (SCROLL SPY)
  // --------------------------------------------------------------------------
  const trackedSections = document.querySelectorAll('section[id], footer[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    trackedSections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopNavLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // --------------------------------------------------------------------------
  // 5. FERRAMENTA INTERATIVA: CALCULADORA DE HIDRATAÇÃO
  // --------------------------------------------------------------------------
  const waterForm = document.getElementById('waterCalculatorForm');
  const userWeightInput = document.getElementById('userWeight');
  const weightError = document.getElementById('weightError');
  const resultContainer = document.getElementById('calculatorResult');
  const resultLiters = document.getElementById('resultLiters');
  const resultBottles = document.getElementById('resultBottles');
  const resultGlasses = document.getElementById('resultGlasses');
  const waterFillLevel = document.getElementById('waterFillLevel');
  const resultAdviceText = document.getElementById('resultAdviceText');
  const calcCtaWhatsapp = document.getElementById('calcCtaWhatsapp');

  function calculateHydration(e) {
    if (e) e.preventDefault();

    const weight = parseFloat(userWeightInput.value);

    // Validação de entrada
    if (isNaN(weight) || weight <= 0) {
      weightError.textContent = 'Por favor, insira um peso válido (ex: 70).';
      userWeightInput.focus();
      return;
    }

    if (weight < 30 || weight > 250) {
      weightError.textContent = 'Por favor, insira um peso entre 30 kg e 250 kg.';
      userWeightInput.focus();
      return;
    }

    weightError.textContent = '';

    // Obter fator de atividade (35, 40 ou 45 ml/kg)
    const selectedActivity = document.querySelector('input[name="activityLevel"]:checked');
    const factor = selectedActivity ? parseInt(selectedActivity.value, 10) : 35;

    // Cálculo em mililitros e litros
    const totalMl = weight * factor;
    const liters = (totalMl / 1000).toFixed(1);
    
    // Equivalências práticas
    const bottles500ml = (totalMl / 500).toFixed(1);
    const glasses250ml = Math.round(totalMl / 250);

    // Atualização dos números na tela
    resultLiters.textContent = liters;
    resultBottles.textContent = bottles500ml;
    resultGlasses.textContent = glasses250ml;

    // Barra visual de progresso (normalizada: 1.5L = 25%, 5L = 100%)
    const percentage = Math.min(Math.max(((totalMl - 1000) / (4500 - 1000)) * 100, 25), 100);
    waterFillLevel.style.width = `${percentage}%`;

    // Mensagem contextual sem emojis
    if (factor === 35) {
      resultAdviceText.innerHTML = `Para sua rotina de atividade <strong>leve</strong>, atingir <strong>${liters}L/dia</strong> é essencial para a filtração renal adequada, eliminação de toxinas e controle de picos de falsa fome no meio da tarde.`;
    } else if (factor === 40) {
      resultAdviceText.innerHTML = `Com treinos <strong>moderados</strong>, seus <strong>${liters}L/dia</strong> são o suporte para evitar fadiga precoce, acelerar a síntese de proteínas musculares e manter seu metabolismo ativo na queima de gordura.`;
    } else {
      resultAdviceText.innerHTML = `Em nível <strong>intenso</strong>, atingir <strong>${liters}L/dia</strong> é fundamental! A perda de apenas 2% de água corporal pode reduzir em até 15% seu rendimento físico. Considere também o uso estratégico de eletrólitos.`;
    }

    // Link personalizado para o WhatsApp
    const encodedMessage = encodeURIComponent(
      `Olá Nutri Maria Helena! Fiz o cálculo da minha hidratação no site (peso ${weight}kg, deu ${liters}L/dia) e gostaria de agendar uma consulta para alinhar toda a minha alimentação!`
    );
    calcCtaWhatsapp.href = `https://wa.me/5511999999999?text=${encodedMessage}`;

    // Exibir o container de resultados
    resultContainer.classList.remove('hidden');

    // Scroll sutil para o resultado no mobile
    if (window.innerWidth < 768) {
      setTimeout(() => {
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }

  if (waterForm) {
    waterForm.addEventListener('submit', calculateHydration);

    // Recalcular ao trocar o rádio
    const activityRadios = document.querySelectorAll('input[name="activityLevel"]');
    activityRadios.forEach((radio) => {
      radio.addEventListener('change', () => {
        if (userWeightInput.value && !resultContainer.classList.contains('hidden')) {
          calculateHydration();
        }
      });
    });

    // Limpar mensagem de erro enquanto digita
    userWeightInput.addEventListener('input', () => {
      if (weightError.textContent) {
        weightError.textContent = '';
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. WIDGET FLUTUANTE DE ATENDIMENTO (SPEED DIAL)
  // --------------------------------------------------------------------------
  const floatingTriggerBtn = document.getElementById('floatingTriggerBtn');
  const speedDialMenu = document.getElementById('speedDialMenu');

  function toggleSpeedDial(forceClose = false) {
    if (!floatingTriggerBtn || !speedDialMenu) return;

    const isOpen = forceClose ? true : floatingTriggerBtn.classList.contains('active');

    if (isOpen) {
      floatingTriggerBtn.classList.remove('active');
      speedDialMenu.classList.remove('open');
      floatingTriggerBtn.setAttribute('aria-expanded', 'false');
      speedDialMenu.setAttribute('aria-hidden', 'true');
    } else {
      floatingTriggerBtn.classList.add('active');
      speedDialMenu.classList.add('open');
      floatingTriggerBtn.setAttribute('aria-expanded', 'true');
      speedDialMenu.setAttribute('aria-hidden', 'false');
    }
  }

  if (floatingTriggerBtn) {
    floatingTriggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSpeedDial();
    });
  }

  // Fechar Speed Dial ao clicar fora dele
  document.addEventListener('click', (e) => {
    const floatingWrapper = document.querySelector('.floating-widget-wrapper');
    if (
      floatingWrapper &&
      !floatingWrapper.contains(e.target) &&
      floatingTriggerBtn &&
      floatingTriggerBtn.classList.contains('active')
    ) {
      toggleSpeedDial(true);
    }
  });

  // --------------------------------------------------------------------------
  // 7. MODAL DE FAQ & ACCORDION DE DÚVIDAS
  // --------------------------------------------------------------------------
  const faqModalOverlay = document.getElementById('faqModalOverlay');
  const openFaqModalBtn = document.getElementById('openFaqModalBtn');
  const openFaqFromFooter = document.getElementById('openFaqFromFooter');
  const closeFaqModalBtn = document.getElementById('closeFaqModalBtn');

  function openFaqModal() {
    if (!faqModalOverlay) return;
    toggleSpeedDial(true);
    faqModalOverlay.classList.add('open');
    faqModalOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    if (closeFaqModalBtn) {
      closeFaqModalBtn.focus();
    }
  }

  function closeFaqModal() {
    if (!faqModalOverlay) return;
    faqModalOverlay.classList.remove('open');
    faqModalOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  if (openFaqModalBtn) {
    openFaqModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openFaqModal();
    });
  }

  if (openFaqFromFooter) {
    openFaqFromFooter.addEventListener('click', (e) => {
      e.preventDefault();
      openFaqModal();
    });
  }

  if (closeFaqModalBtn) {
    closeFaqModalBtn.addEventListener('click', closeFaqModal);
  }

  // Fechar ao clicar no backdrop (overlay)
  if (faqModalOverlay) {
    faqModalOverlay.addEventListener('click', (e) => {
      if (e.target === faqModalOverlay) {
        closeFaqModal();
      }
    });
  }

  // Tecla Escape fecha modais e menus abertos
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (faqModalOverlay && faqModalOverlay.classList.contains('open')) {
        closeFaqModal();
      }
      if (floatingTriggerBtn && floatingTriggerBtn.classList.contains('active')) {
        toggleSpeedDial(true);
      }
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        toggleMobileMenu(true);
      }
    }
  });

  // Accordion (apenas 1 item aberto por vez)
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');

  accordionTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const parentItem = trigger.closest('.accordion-item');
      const isAlreadyActive = parentItem.classList.contains('active');

      document.querySelectorAll('.accordion-item').forEach((item) => {
        item.classList.remove('active');
        const btn = item.querySelector('.accordion-trigger');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isAlreadyActive) {
        parentItem.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 8. SCROLL REVEAL (INTERSECTION OBSERVER)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach((el) => {
      el.classList.add('revealed');
    });
  }

});
