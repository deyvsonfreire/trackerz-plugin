// trackerz-mask.js

// Carrega o script de máscara de telefone, se necessário
async function maskLoad() {
    if (!window.Trackerz.data?.phoneMask || !window.Trackerz.data.phoneMaskJs) {
      return;
    }
    if (typeof IMask === 'undefined') {
      await loadScript(window.Trackerz.data.phoneMaskJs); // Carrega IMask
    }
    await mask();
  }
  
  // Aplica a máscara de telefone aos campos de entrada
  async function mask() {
    const elements = document.querySelectorAll(".trackerz_mask_phone, #trackerz_mask_phone");
    elements.forEach((el) => {
      if (el.tagName === "INPUT" && window.Trackerz.inputHasPhone(el.name)) {
        el.type = "text";
        el.removeAttribute('pattern');
        IMask(el, { mask: window.Trackerz.data?.phoneMask }); // Aplica a máscara
      } else {
        const inputs = el.querySelectorAll("input");
        inputs.forEach((subel) => {
          if (window.Trackerz.inputHasPhone(subel.name)) {
            subel.type = "text";
            subel.pattern = "";
            IMask(subel, { mask: window.Trackerz.data?.phoneMask }); // Aplica a máscara
          }
        });
      }
    });
  }
  
  // Carrega o script de máscara internacional de telefone, se necessário
  async function maskLoadInter() {
    if (!window.Trackerz.data?.phoneMaskInter) {
      return;
    }
    if (typeof intlTelInput === 'undefined') {
      await loadStyle(window.Trackerz.data.phoneMaskInterCss); // Carrega estilos do intlTelInput
      await addStyle(`
        .iti, .iti--allow-dropdown {
          width: 100% !important;
          z-index: 9999 !important;
        }
      `);
      await loadScript(window.Trackerz.data.phoneMaskInterJs); // Carrega intlTelInput
    }
    await maskInter();
  }
  
  // Aplica a máscara internacional de telefone aos campos de entrada
  async function maskInter() {
    const elements = document.querySelectorAll(".trackerz_mask_phone_inter, #trackerz_mask_phone_inter");
    const intlTel = (el) => {
      el.type = "tel";
      el.removeAttribute('pattern');
      el.classList.add("trackerz_mask_phone_inter_active");
      let inputPhone = window.intlTelInput(el, {
        initialCountry: window.Trackerz.data.geolocation?.trackerzLeadCountryCode || "br",
        placeholderNumberType: 'MOBILE',
        showSelectedDialCode: true
      });
      el.addEventListener('blur', async () => {
        var fullNumber = inputPhone.getNumber();
        window.Trackerz.data.leadPhone = fullNumber;
        window.Trackerz.set({ trackerzLeadPhone: fullNumber }); // Salva o número formatado
        await window.Trackerz.sendLeadDataAPI();
      });
      el.closest('form').addEventListener('submit', () => {
        var fullNumber = inputPhone.getNumber();
        el.value = fullNumber;
      });
    };
    elements.forEach((el) => {
      if (el.tagName === "INPUT" && window.Trackerz.inputHasPhone(el.name)) {
        intlTel(el);
      } else {
        const inputs = el.querySelectorAll("input");
        inputs.forEach((subel) => {
          if (window.Trackerz.inputHasPhone(subel.name)) {
            intlTel(subel);
          }
        });
      }
    });
  }
  
  // Validação de número de telefone com base no país
  function phoneValid(phone, country = '55') {
    phone = phone.replace(/[^0-9]/g, '');
    if (country === '55') {
      if (phone.startsWith('00')) {
        phone = phone.substring(2);
      } else if (phone.startsWith('0')) {
        phone = phone.substring(1);
      }
      if (phone.length === 10) {
        phone = `55${phone.substring(0, 2)}9${phone.substring(2)}`;
      } else if (phone.length === 12 && phone.startsWith('55')) {
        phone = `55${phone.substring(0, 4)}9${phone.substring(4)}`;
      }
    }
    if (!phone.startsWith(country)) {
      phone = `${country}${phone}`;
    }
    return `+${phone}`;
  }
  
  // Exporta as funções para uso em outros arquivos
  export {
    maskLoad,
    mask,
    maskLoadInter,
    maskInter,
    phoneValid
  };