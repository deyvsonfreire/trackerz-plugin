// trackerz.js

// Importa as funções dos outros arquivos
import { checkIsVisible, uuid, loadStyle, addStyle, formatPhoneNumber, removeAccents, getUtcTimestamp } from './trackerz-utils.js';
import { maskLoad, mask, maskLoadInter, maskInter, phoneValid } from './trackerz-mask.js';
import { listenForEvents, sendEvent } from './trackerz-events.js';
import { facebookLoadPixel, facebookSendEvent, facebookWeb, facebookAPI } from './trackerz-facebook.js';

// Classe Trackerz
class Trackerz {
  constructor() {
    // Armazena os nomes dos dias da semana
    this.weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // Armazena os nomes dos meses
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    // Objeto para armazenar os dados do Trackerz
    this.data = {};
    // Atribui a função uuid() para gerar user_id
    this.generateUserId = uuid;
  }

  // Formata um número de telefone para o formato internacional E.164
  formatPhoneNumber(phone, countryCode = '55') {
    return formatPhoneNumber(phone, countryCode); // Utiliza a função importada
  }

  // Extrai o DDD e o número de telefone de um número formatado
  extractPhoneDetails(phone) {
    const formattedPhone = this.formatPhoneNumber(phone);
    const ddd = formattedPhone.substring(3, 5);
    const phoneNumber = formattedPhone.substring(5);
    return { ddd, phoneNumber };
  }

  // Inicializa o Trackerz com os dados fornecidos
  async start(data) {
    try {
      this.data = data;

      if (!this.checkDomain()) {
        return;
      }

      this.updatePageData(); // Atualiza os dados da página no localStorage
      this.data.userId = this.generateUserId(); // Gera o user_id
      this.data.sessionId = this.manageSession();
      this.updateEventData();
      this.updateLeadData();
      this.data.geolocation = await this.getGeolocation();
      this.data.userAgent = navigator.userAgent;

      localStorage.setItem("previousSessionId", this.data.sessionId);

      this.setLeadData();
      this.monitorForms();
      this.updateSckParameter();

      window.addEventListener('elementor/popup/show', async () => {
        this.monitorForms();
      });

      // Chama a função para ouvir eventos
      listenForEvents(); 

      // Chama as funções de máscara de telefone, se necessário
      if (this.data.phoneMask) {
        await maskLoad();
      }
      if (this.data.phoneMaskInter) {
        await maskLoadInter();
      }
    } catch (error) {
      console.error('Error in Trackerz start method:', error);
    }
  }

  // Gerencia a sessão do usuário
  manageSession() {
    let sessionId = localStorage.getItem("trackerzSessionId");
    const todayDate = new Date().toISOString().split('T')[0];

    if (sessionId === null) {
        sessionId = this.generateUserId(); // Gera novo sessionId
        localStorage.setItem("trackerzSessionId", sessionId);
        localStorage.setItem("trackerzLastAccessDate", todayDate);
        localStorage.setItem("trackerzUtmSource", this.searchParamsUrlCookie('utm_source'));
        console.log("Novo session_id gerado (primeira visita):", sessionId);
    } else {
        console.log("Session_id existente:", sessionId);
    }

    return sessionId;
  }

  // Obtém o timestamp da última visita do usuário
  getLastVisitTimestamp() {
    return localStorage.getItem("trackerzLastVisit");
  }

  // Obtém o timestamp da última sessão do usuário
  getLastSessionTimestamp() {
    return localStorage.getItem("trackerzLastSession");
  }

  // Atualiza os dados do evento
  updateEventData() {
    const dayOfWeek = new Date().getDay();
    const month = new Date().getMonth();
    const hourStart = new Date().getHours();
    this.data.eventDayInMonth = new Date().getDate();
    this.data.eventDay = this.weekDays[dayOfWeek];
    this.data.eventMonth = this.months[month];
    this.data.eventTimeInterval = `${hourStart}-${hourStart + 1}`;
  }

  // Atualiza os dados da página
  updatePageData() {
    this.data.pageTitle = document.title;
    this.data.trafficSource = document.referrer;
    this.data.utmSource = this.searchParamsUrlCookie('utm_source');
    this.data.utmMedium = this.searchParamsUrlCookie('utm_medium');
    this.data.utmCampaign = this.searchParamsUrlCookie('utm_campaign');
    this.data.utmId = this.searchParamsUrlCookie('utm_id');
    this.data.utmTerm = this.searchParamsUrlCookie('utm_term');
    this.data.utmContent = this.searchParamsUrlCookie('utm_content');
    this.data.src = this.searchParamsUrlCookie('src');
    this.data.sck = this.searchParamsUrlCookie('sck');
  }

  // Atualiza os dados do lead
  updateLeadData() {
    this.data.leadId = this.get('trackerzLeadId');
    this.data.leadName = this.searchParamsUrlCookie('full_name', 'lead_name') || this.get('trackerzLeadName');
    this.data.leadFname = this.searchParamsUrlCookie('fname', 'first-name', 'first_name', 'first name') || this.get('trackerzLeadFname');
    this.data.leadLname = this.searchParamsUrlCookie('lname', 'last-name', 'last_name', 'last name') || this.get('trackerzLeadLname');
    this.data.leadEmail = this.searchParamsUrlCookie('email') || this.get('trackerzLeadEmail');
    this.data.leadPhone = this.searchParamsUrlCookie('phone', 'tel', 'whatsapp', 'ph') || this.get('trackerzLeadPhone');
  }

  // Define os dados do lead nos cookies e localStorage
  setLeadData() {
    this.set({
      trackerzLeadId: this.data.leadId,
      trackerzLeadName: this.data.leadName,
      trackerzLeadFname: this.data.leadFname,
      trackerzLeadLname: this.data.leadLname,
      trackerzLeadEmail: this.data.leadEmail,
      trackerzLeadPhone: this.data.leadPhone,
    });
  }

  // Envia os dados para o Google Tag Manager
  sendDataToGTM(eventData) {
    // Adaptação para o GTM
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventData);
  }

  // Obtém um valor do localStorage ou cookie
  get(key) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieKey, cookieValue] = cookie.trim().split('=');
      if (cookieKey === key) {
        return cookieValue;
      }
    }

    return localStorage.getItem(key);
  }

  // Define um valor no cookie e localStorage
  set(cookies) {
    const domain = this.get('trackerzDomain');
    const expirationTime = 15552000 * 1000;
    const expires = new Date(Date.now() + expirationTime).toUTCString();

    for (let key in cookies) {
      const value = cookies[key];
      if (value && value !== 'undefined') {
        document.cookie = `${key}=${value}; expires=${expires}; path=/; domain=.${domain}`;
        localStorage.setItem(key, value);
      }
    }
  }

  // Obtém o timestamp UTC atual
  getUtcTimestamp() {
    return getUtcTimestamp(); // Utiliza a função importada
  }

  // Busca parâmetros na URL, cookies e localStorage
  searchParamsUrlCookie(...params) {
    // 1. URL atual
    const urlSearchParams = new URLSearchParams(window.location.search);
    for (const param of params) {
      if (urlSearchParams.has(param)) {
        const value = urlSearchParams.get(param);
        this.syncStorageAndCookie(param, value, param.startsWith('utm_'));
        return value;
      }
    }

    // 2. URL de referência
    const referrerSearchParams = new URLSearchParams(document.referrer.split('?')[1] || '');
    for (const param of params) {
      if (referrerSearchParams.has(param)) {
        const value = referrerSearchParams.get(param);
        this.syncStorageAndCookie(param, value, param.startsWith('utm_'));
        return value;
      }
    }

    // 3. Cookies
    for (const param of params) {
      const cookieValue = this.getCookie(param);
      if (cookieValue) {
        this.syncStorageAndCookie(param, cookieValue, param.startsWith('utm_'));
        return cookieValue;
      }
    }

    // 4. localStorage
    for (const param of params) {
      const localStorageValue = localStorage.getItem(`trackerz${param.charAt(0).toUpperCase() + param.slice(1)}`);
      if (localStorageValue) {
        return localStorageValue;
      }
    }

    // 5. Valor padrão para utm_source (se não encontrado em nenhum lugar)
    if (params.includes('utm_source')) {
      return 'direto';
    }

    return '';
  }

  // Sincroniza um valor entre o localStorage e o cookie
  syncStorageAndCookie(param, value, isSessionData) {
    const storedValueLocalStorage = localStorage.getItem(`trackerz${param.charAt(0).toUpperCase() + param.slice(1)}`);
    const storedValueCookie = this.getCookie(param);

    if (value !== storedValueLocalStorage || value !== storedValueCookie) {
      localStorage.setItem(`trackerz${param.charAt(0).toUpperCase() + param.slice(1)}`, value);

      if (isSessionData) {
        document.cookie = `${param}=${value}; path=/`;
      } else {
        document.cookie = `${param}=${value}; path=/; max-age=31536000`;
      }
      if (param === 'utm_source') {
        this.updateSckParameter();
      }
    }
  }

  // Obtém o valor de um cookie pelo nome
  getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
    return null;
  }

  // Obtém o caminho DOM de um elemento
  getElementPath(element) {
    let path = [];

    while (element) {
      path.push(element);
      element = element.parentElement;
    }

    return path;
  }

  // Obtém o endereço IP do usuário
  async getIpAddress() {
    const ip = this.data.trackerzLeadIp;

    if (ip) {
      return ip;
    }

    try {
      const response = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
      const data = await response.text();
      const lines = data.split('\n');

      for (const line of lines) {
        const parts = line.split('=');
        if (parts[0] === 'ip') {
          return parts[1];
        }
      }

      return null;
    } catch (error) {
      console.error('Erro ao obter o IP:', error);
      return null;
    }
  }

  // Obtém a geolocalização do usuário
  async getGeolocation() {
    const ipKey = 'trackerzGeolocation';
    const geolocation = localStorage.getItem(ipKey);

    if (geolocation) {
      return JSON.parse(geolocation);
    }

    let response, values;

    try {
      response = await fetch('https://pro.ip-api.com/json/?key=TOLoWxdNIA0zIZm');
      if (response.ok) {
        response = await response.json();
        values = {
          trackerzLeadIp: response.query,
          trackerzLeadCity: response.city?.toLowerCase(),
          trackerzLeadRegion: response.regionName?.toLowerCase(),
          trackerzLeadRegionCode: response.region?.toLowerCase(),
          trackerzLeadCountry: response.country?.toLowerCase(),
          trackerzLeadCountryCode: response.countryCode?.toLowerCase(),
          trackerzLeadCurrency: response.currency,
          trackerzLeadZipcode: response.zip,
        };
      } else {
        throw new Error('Primeira tentativa falhou');
      }
    } catch (error) {
      console.error('Erro na primeira tentativa de geolocalização:', error);
      try {
        response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          response = await response.json();
          values = {
            trackerzLeadIp: response.ip,
            trackerzLeadCity: response.city?.toLowerCase(),
            trackerzLeadRegion: response.region?.toLowerCase(),
            trackerzLeadRegionCode: response.region_code?.toLowerCase(),
            trackerzLeadCountry: response.country_name?.toLowerCase(),
            trackerzLeadCountryCode: response.country_code?.toLowerCase(),
            trackerzLeadCurrency: response.currency,
            trackerzLeadZipcode: response.postal,
          };
        } else {
          throw new Error('Segunda tentativa falhou');
        }
      } catch (error) {
        console.error('Erro na segunda tentativa de geolocalização:', error);
        try {
          response = await fetch('https://json.geoiplookup.io/');
          if (response.ok) {
            response = await response.json();
            values = {
              trackerzLeadIp: response.ip,
              trackerzLeadCity: response.city?.toLowerCase(),
              trackerzLeadRegion: response.region?.toLowerCase(),
              trackerzLeadCountry: response.country_name?.toLowerCase(),
              trackerzLeadCountryCode: response.country_code?.toLowerCase(),
              trackerzLeadCurrency: response.currency_code,
              trackerzLeadZipcode: response.postal_code,
            };
          }
        } catch (error) {
          console.error('Erro na terceira tentativa de geolocalização:', error);
          return null;
        }
      }
    }

    this.set(this.removeAccents(values));
    localStorage.setItem(ipKey, JSON.stringify(values));

    return values;
  }

  // Remove acentos de um objeto
  removeAccents(object) {
    const newObject = {};

    for (const key in object) {
      const value = object[key];
      const newKey = key?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      if (typeof value === 'object') {
        newObject[newKey] = this.removeAccents(value);
      } else {
        newObject[newKey] = value?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      }
    }

    return newObject;
  }

  // Manipula mudanças nos campos do formulário
  handleInputChange(event) {
    const field = event.target;
    const name = field.name;
    const value = field.value;

    this.saveInput(name, value, field);
  }

  // Monitora os formulários da página
  monitorForms() {
    document.querySelectorAll('form').forEach(form => {
      form.querySelectorAll('input, textarea, select').forEach(field => {
        const name = field.name;

        // Adiciona os ouvintes para 'input' e 'blur' ANTES de preencher os campos
        field.addEventListener('input', this.handleInputChange.bind(this));
        field.addEventListener('blur', this.handleInputChange.bind(this));

        // Preenche os campos com os valores do localStorage
        if (this.hasInputMail(name)) {
          field.value = this.data.leadEmail || '';
        } else if (this.hasInputPhone(name)) {
          field.value = this.data.leadPhone || '';
        } else if (this.hasInputName(name)) {
          if (name.includes('first')) {
            field.value = this.data.leadFname || '';
          } else if (name.includes('last')) {
            field.value = this.data.leadLname || '';
          } else {
            field.value = this.data.leadName || '';
          }
        }
      });

      // Preenche os campos UTM do formulário
      this.fillUtmFields(form);

      // Código para lidar com o evento 'submit' do formulário
      form.addEventListener('submit', (event) => {
        const formData = new FormData(form);
        const leadData = {};

        formData.forEach((value, key) => {
          if (key.includes('email')) {
            this.set({ trackerzLeadEmail: value });
            this.data.leadEmail = value;
          } else if (key.includes('phone') || key.includes('tel')) {
            const { ddd, phoneNumber } = this.extractPhoneDetails(value);
            this.set({
              trackerzLeadPhone: `+55${ddd}${phoneNumber}`,
              trackerzLeadPhoneDdd: ddd,
              trackerzLeadPhoneNumber: phoneNumber
            });
            this.data.leadPhone = `+55${ddd}${phoneNumber}`;
          } else if (key.includes('name')) {
            let fullName = this.data.leadName,
              fname = this.data.leadFname,
              lname = this.data.leadLname;

            if (key.includes('first')) {
              fname = value;
              if (!lname) {
                lname = this.data.leadLname || '';
              }
              fullName = `${fname} ${lname}`;
            } else if (key.includes('last')) {
              lname = value;
              if (!fname) {
                fname = this.data.leadFname || '';
              }
              fullName = `${fname} ${lname}`;
            } else {
              fullName = value;
              fname = value.split(' ')[0];
              lname = value.split(' ')[1] || this.data.leadLname || '';
            }

            this.set({
              trackerzLeadName: fullName,
              trackerzLeadFname: fname,
              trackerzLeadLname: lname,
            });

            this.data.leadName = fullName;
            this.data.leadFname = fname;
            this.data.leadLname = lname;
          }

          leadData[key] = value;
        });

        this.sendLeadDataAPI(leadData);
        this.sendDataToGTM(leadData);

        if (!form.hasAttribute('data-no-redirect')) {
          form.submit();
        } else {
          event.preventDefault();
        }
      });
    });
  }

  // Salva os dados de um campo de entrada
  saveInput(name, value, field = undefined) {
    if (this.hasInputMail(name)) {
      // Validação de email adicionada
      if (this.isValidEmail(value)) {
        this.set({ trackerzLeadEmail: value });
        this.data.leadEmail = value;
      } else {
        // Lógica para lidar com email inválido
        console.warn("Email inválido:", value);
      }
    } else if (this.hasInputPhone(name)) {
      if (this.data?.phoneValid) {
        value = this.formatPhoneNumber(value, this.data?.phoneCountry);
        if (field && this.data?.phoneUpdate) {
          field.value = value;
        }
      }
      this.set({ trackerzLeadPhone: value });
      this.data.leadPhone = value;
    } else if (this.hasInputName(name)) {
      let fullName = this.data.leadName,
        fname = this.data.leadFname,
        lname = this.data.leadLname;

      if (name.includes('first')) {
        fname = value;
        fullName = `${fname} ${lname || ''}`;
      } else if (name.includes('last')) {
        lname = value;
        fullName = `${fname || ''} ${lname}`;
      } else {
        fullName = value;
        fname = value.split(' ')[0];
        lname = value.split(' ')[1] || '';
      }

      this.set({
        trackerzLeadName: fullName,
        trackerzLeadFname: fname,
        trackerzLeadLname: lname,
      });

      this.data.leadName = fullName;
      this.data.leadFname = fname;
      this.data.leadLname = lname;
    }

    this.sendLeadDataAPI(this.data);
    this.sendDataToGTM(this.data);
  }

  // Verifica se o nome do input indica um campo de telefone
  hasInputPhone(name) {
    const names = [
      'tel',
      'phone',
      'ph',
      'cel',
      'mobile',
      'fone',
      'whats',
    ];
    const variables = names.concat(
      this.data?.inputCustomPhone?.split(',') || []
    );

    return variables.some(variable => variable && name.toLowerCase().includes(variable));
  }

  // Verifica se o nome do input indica um campo de email
  hasInputMail(name) {
    const names = [
      'mail',
      'email',
    ];
    const variables = names.concat(
      this.data?.inputCustomEmail?.split(',') || []
    );

    return variables.some(variable => variable && name.toLowerCase().includes(variable));
  }

  // Verifica se o nome do input indica um campo de nome
  hasInputName(name) {
    const names = [
      'nome',
      'name'
    ];
    const variables = names.concat(
      this.data?.inputCustomName?.split(',') || []
    );

    return variables.some(variable => variable && name.toLowerCase().includes(variable));
  }

  // Validação de email usando expressão regular
  isValidEmail(email) {
    // Expressão regular para validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Carrega um script externo
  async loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Verifica se o script está sendo executado no domínio correto
  checkDomain() {
    if (!this.data.pageUrl.includes(this.data.domain)) {
      console.log("Página fora do domínio de origem", this.data.domain);
      return false;
    }

    return true;
  }

  // Valida se uma string é uma URL válida
  isUrlValid(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Preenche os campos UTM de um formulário
  fillUtmFields(form) {
    const utms = ['utm_campaign', 'utm_medium', 'utm_source', 'utm_content', 'utm_term'];
    utms.forEach(utm => {
      let field = form.querySelector(`[id^="form-field-${utm}"]`);
      if (field) {
        // Ponto de atenção 5: Prioridade do utm_source em fillUtmFields
        let value = this.searchParamsUrlCookie(utm) || '';
        if (utm === 'utm_source' && value === '') {
          value = document.referrer ? new URL(document.referrer).hostname : "direto";
        }
        field.value = value;
      }
    });

    let slugField = form.querySelector('[id^="form-field-pagina_captura"]');
    if (slugField) {
      slugField.value = window.location.pathname.split('/')[1];
    }
  }

  // Atualiza o parâmetro SCK nos links da página
  updateSckParameter() {
    const utms = ['utm_campaign', 'utm_medium', 'utm_source', 'utm_content', 'utm_term'];
    let scks = []; // Declara scks fora do loop forEach
    var urlPatterns = ["hotmart.com"]

    document.querySelectorAll('a').forEach(el => {
      try {
        if (urlPatterns(el.href)) {
          const elURL = new URL(el.href);

          if (!elURL.hash) {
            const elSearchParams = new URLSearchParams(elURL.search);
            let hasUTMs = false;
            let sckParts = []; // Array para armazenar as partes do sck

            utms.forEach(utm => {
              const utmValue = this.searchParamsUrlCookie(utm);
              if (utmValue !== '') {
                // Adiciona a UTM ao link se não estiver presente
                if (!elSearchParams.has(utm)) {
                  elSearchParams.append(utm, utmValue);
                  hasUTMs = true;
                }
                // Adiciona a UTM ao array sckParts
                sckParts.push(`${utm}=${utmValue}`);
              }
            });

            // Adiciona o parâmetro sck ao link
            if (sckParts.length > 0 && !elSearchParams.has('sck')) {
              elSearchParams.append('sck', sckParts.join('|'));
              hasUTMs = true;
            }

            if (hasUTMs) {
              el.href = elURL.origin + elURL.pathname + "?" + elSearchParams.toString();
            }
          }
        }
      } catch (error) {
        console.error('Error in link modification:', error);
      }
    });
  }

  // Funções de API (usando as funções importadas)
  sendLeadDataAPI(leadData) {
    // Utilize a função sendLeadDataAPI de trackerz-api.js
    sendLeadDataAPI(leadData);
  }

  sendEventDataAPI(eventData) {
    // Utilize a função sendEventDataAPI de trackerz-api.js
    sendEventDataAPI(eventData);
  }

  sendEventToGTM(eventData) {
    // Utilize a função sendEventToGTM de trackerz-api.js
    sendEventToGTM(eventData);
  }

  sendEventToMautic(eventData) {
    // Utilize a função sendEventToMautic de trackerz-api.js
    sendEventToMautic(eventData);
  }
}


// Inicializa o Trackerz com as configurações do WordPress
function initTrackerz() {
  // Obtém as configurações do WordPress
  const settings = {
    domain: trackerz_get_option('trackerz_domain'),
    fbPixel: trackerz_get_option('trackerz_fb_pixel'),
    gtmEnabled: trackerz_get_option('trackerz_gtm_enabled') === '1', // Converta para booleano
    mauticEnabled: trackerz_get_option('trackerz_mautic_enabled') === '1', // Converta para booleano
    apiEnabled: trackerz_get_option('trackerz_api_enabled') === '1', // Converta para booleano
    phoneMask: trackerz_get_option('trackerz_phone_mask'),
    phoneMaskInter: trackerz_get_option('trackerz_phone_mask_inter'),
    phoneMaskInterCss: trackerz_get_option('trackerz_phone_mask_inter_css'),
    phoneMaskInterJs: trackerz_get_option('trackerz_phone_mask_inter_js'),
    apiEndpoint: trackerz_get_option('trackerz_api_endpoint'),
    mauticEndpoint: trackerz_get_option('trackerz_mautic_endpoint'),
    facebookAPIEndpoint: trackerz_get_option('trackerz_facebook_api_endpoint'),
  };

  // Cria uma instância do Trackerz
  const trackerz = new Trackerz();

  // Define as configurações do Trackerz
  trackerz.data = settings;

  // Inicia o Trackerz
  trackerz.start();
}

// Chama a função de inicialização ao carregar a página
window.addEventListener('load', initTrackerz);