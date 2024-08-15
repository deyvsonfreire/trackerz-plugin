// trackerz-utils.js

// Verifica se um elemento está visível na página
function checkIsVisible(element) {
    if (element.style?.display === 'none') {
      return false;
    }
    let parent = element.parentNode;
    while (parent) {
      if (parent.style?.display === 'none') {
        return false;
      }
      parent = parent.parentNode;
    }
    return true;
  }
  
  // Gera um UUID (Universally Unique Identifier)
  function uuid() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    } else {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  }
  
  // Carrega um estilo externo
  function loadStyle(url) {
    return new Promise((resolve, reject) => {
      let tag = document.createElement('link');
      tag.href = url;
      tag.rel = 'stylesheet';
      tag.type = 'text/css';
      tag.onload = resolve;
      tag.onerror = reject;
      document.head.appendChild(tag);
    });
  }
  
  // Adiciona um estilo inline
  function addStyle(content) {
    return new Promise((resolve, reject) => {
      const tag = document.createElement('style');
      tag.textContent = content;
      tag.onload = resolve;
      tag.onerror = reject;
      document.head.appendChild(tag);
    });
  }
  
  // Formata um número de telefone para o formato internacional E.164
  function formatPhoneNumber(phone, countryCode = '55') {
    phone = phone.replace(/[^0-9]/g, '');
  
    if (countryCode === '55') {
      // Remove os zeros à esquerda para números do Brasil
      if (phone.startsWith('00')) {
        phone = phone.substring(2);
      } else if (phone.startsWith('0')) {
        phone = phone.substring(1);
      }
  
      // Adiciona o nono dígito para números de celular
      if (phone.length === 10) {
        phone = `55${phone.substring(0, 2)}9${phone.substring(2)}`;
      } else if (phone.length === 12 && phone.startsWith('55')) {
        phone = `55${phone.substring(0, 4)}9${phone.substring(4)}`;
      }
    }
  
    // Adiciona o código do país se não estiver presente
    if (!phone.startsWith(countryCode)) {
      phone = `${countryCode}${phone}`;
    }
  
    return `+${phone}`;
  }
  
  // Remove acentos de um objeto
  function removeAccents(object) {
    const newObject = {};
    for (const key in object) {
      const value = object[key];
      const newKey = key?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (typeof value === 'object') {
        newObject[newKey] = removeAccents(value);
      } else {
        newObject[newKey] = value?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      }
    }
    return newObject;
  }
  
  // Obtém o timestamp UTC atual
  function getUtcTimestamp() {
    var date = new Date();
    var utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
    return Math.floor(utc / 1000);
  }
  
  // Exporta as funções para uso em outros arquivos
  export {
    checkIsVisible,
    uuid,
    loadStyle,
    addStyle,
    formatPhoneNumber,
    removeAccents,
    getUtcTimestamp
  };