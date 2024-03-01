
const Trackerz = class {

	constructor() {
		this.WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		this.MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		this.data = {};

		const mensagemConsole = `
%cTrackerz`;

		const estilos = [
			'font-size: 20px; font-weight: bold; color: #022260;',
			'font-size: 16px; color: #022260;',
			'font-size: 14px; color: #022260;',
		];

		console.log(mensagemConsole, ...estilos);
	}

					

	async start(data) {
			this.data = data;

			// Função para recuperar a data e hora da última visita do localStorage
			function get_last_visit_timestamp() {
				return localStorage.getItem("trackerz_last_visit");
			} 

			// Função para recuperar a data e hora da última sessão do localStorage
			function get_last_session_timestamp() {
				return localStorage.getItem("trackerz_last_session");
			} 

			// Constante com a duração da sessão do GA4 (em milissegundos)
			const GA4_SESSION_DURATION = 1800000; // 30 minutos

			function get_session_id() {
				let session_id = sessionStorage.getItem("trackerz_session_id");

				if (!session_id) {
					const now = Date.now();
					const random_number = Math.floor(Math.random() * 1000000);
					session_id = `${now}-${random_number}`; 
					sessionStorage.setItem("trackerz_session_id", session_id);
				}

				return session_id;
			}

			// Verificação da sessão
			const last_session_timestamp = get_last_session_timestamp();
			if (last_session_timestamp && Date.now() - last_session_timestamp < GA4_SESSION_DURATION) {
				// **Em vez de retornar, faça algo aqui se a sessão não for nova:**
				console.log('Sessão não é nova, mas vamos continuar o processamento.');
			} else {
				// Atualização da data e hora da última sessão
				localStorage.setItem("trackerz_last_session", Date.now());
			}

			// Verificação da visita
			const last_visit_timestamp = get_last_visit_timestamp();
			if (last_visit_timestamp && Date.now() - last_visit_timestamp < GA4_SESSION_DURATION) {
				// **Em vez de retornar, faça algo aqui se a sessão não for nova:**
				console.log('Sessão não é nova, mas vamos continuar o processamento.');
			} else {
				// Atualização da data e hora da última visita
				localStorage.setItem("trackerz_last_visit", Date.now());
			}

			// Armazenamento da session_id
			const session_id = get_session_id();
			this.data.session_id = session_id // Inclua a session_id nos dados

			// Variáveis do Sistema
			localStorage.setItem('tkz_domain', this.data.domain);
			this.data.page_url = window.location.href;

			if (!this.check_domain()) {
				return;
			}

        

		// Variáveis do Evento
		const tkz_day_of_week = new Date().getDay();
		const tkz_month = new Date().getMonth();
		const tkz_hour_start = new Date().getHours();
		this.data.event_day_in_month = new Date().getDate();
		this.data.event_day = this.WEEK_DAYS[tkz_day_of_week];
		this.data.event_month = this.MONTHS[tkz_month];
		this.data.event_time_interval = `${tkz_hour_start}-${tkz_hour_start + 1}`;

		// Variáveis da Página
		this.data.page_title = document.title;
		this.data.traffic_source = document.referrer;
		this.data.utm_source = this.search_params_url_cookie('utm_source');
		this.data.utm_medium = this.search_params_url_cookie('utm_medium');
		this.data.utm_campaign = this.search_params_url_cookie('utm_campaign');
		this.data.utm_id = this.search_params_url_cookie('utm_id');
		this.data.utm_term = this.search_params_url_cookie('utm_term');
		this.data.utm_content = this.search_params_url_cookie('utm_content');
		this.data.src = this.search_params_url_cookie('src');
		this.data.sck = this.search_params_url_cookie('sck');


		// Variáveis do Lead
		this.data.lead_id = this.get('tkz_lead_id');

		this.data.lead_name = this.search_params_url_cookie('full_name', 'lead_name') || this.get('tkz_lead_name');
		this.data.lead_fname = this.search_params_url_cookie('fname', 'first-name', 'first_name', 'first name') || this.get('tkz_lead_fname');
		this.data.lead_lname = this.search_params_url_cookie('lname', 'last-name', 'last_name', 'last name') || this.get('tkz_lead_lname');
		this.data.lead_email = this.search_params_url_cookie('email') || this.get('tkz_lead_email');
		this.data.lead_phone = this.search_params_url_cookie('phone', 'tel', 'whatsapp', 'ph') || this.get('tkz_lead_phone');

		// Geo Location
		this.data.geolocation = await this.get_geolocation();
		this.data.user_agent = navigator.userAgent;


    await this.send_session_data();


		this.set({
			tkz_lead_id: this.data.lead_id,
			tkz_lead_name: this.data.lead_name,
			tkz_lead_fname: this.data.lead_fname,
			tkz_lead_lname: this.data.lead_lname,
			tkz_lead_email: this.data.lead_email,
			tkz_lead_phone: this.data.lead_phone,
		});



		// Monitor Submit Forms
		this.monitor_forms();


		// Elementor Popup
		window.addEventListener('elementor/popup/show', async () => {
			this.monitor_forms();
			await this.mask_load();
		});



    // Envia os dados para o Google Tag Manager
	const gtmData = {
		// **Sessão**
		session_id: this.data.session_id,
		domain: this.data.domain,
		page_url: this.data.page_url,
		event_day_in_month: this.data.event_day_in_month,
		event_day: this.data.event_day,
		event_month: this.data.event_month,
		event_time_interval: this.data.event_time_interval,
	
		// **Lead**
		lead_id: this.data.lead_id,
		lead_name: this.data.lead_name,
		lead_fname: this.data.lead_fname,
		lead_lname: this.data.lead_lname,
		lead_email: this.data.lead_email,
		lead_phone: this.data.lead_phone,
	
		// **Geolocalização**
		ip: this.data.geolocation?.tkz_lead_ip,
		device: this.data.user_agent,
		adress_city: this.data.geolocation?.tkz_lead_city,
		adress_state: this.data.geolocation?.tkz_lead_region,
		adress_zipcode: this.data.geolocation?.tkz_lead_zipcode,
		adress_country_name: this.data.geolocation?.tkz_lead_country,
		adress_country: this.data.geolocation?.tkz_lead_country_code,
	
		// **Página**
		page_title: this.data.page_title,
		traffic_source: this.data.traffic_source,
		utm_source: this.data.utm_source,
		utm_medium: this.data.utm_medium,
		utm_campaign: this.data.utm_campaign,
		utm_id: this.data.utm_id,
		utm_term: this.data.utm_term,
		utm_content: this.data.utm_content,
		src: this.data.src,
		sck: this.data.sck,
	};
	

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(gtmData); 

	}

	/*
	 * Getters and Setters
	 */
	get(key) {
		// Verifica se o cookie existe
		const cookies = document.cookie.split(';');
		for (const cookie of cookies) {
			const [cookieKey, cookieValue] = cookie.trim().split('=');
			if (cookieKey === key) {
				return cookieValue;
			}
		}

		// Se não encontrar no cookie, tenta buscar no localStorage
		const localStorageValue = localStorage.getItem(key);
		return localStorageValue;
	}

	set(cookies) {
		const domain = this.get('tkz_domain');
		const expirationTime = 15552000 * 1000;
		const expires = new Date(Date.now() + expirationTime).toUTCString();

		// Set Cookies
		for (let key in cookies) {
			const value = cookies[key];
			if (value && value !== 'undefined') {
				document.cookie = `${key}=${value}; expires=${expires}; path=/; domain=.${domain}`;
				// document.cookie = `${key}=${value}; SameSite=None; Secure; expires=${expires}; path=/; domain=.${domain}`;
				localStorage.setItem(key, value);
			}
		}
	}

	getTimestampUtc() {
		var date = new Date();
		var utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
		return Math.floor(utc / 1000);
	}

	search_params_url_cookie(...params) {
		// Verifique os Cookies
		for (const param of params) {
			const cookieName = param;
			const cookieValue = this.get(cookieName);
			if (cookieValue) {
				return cookieValue;
			}
		}

		// Verifique a URL
		const urlSearchParams = new URLSearchParams(window.location.search);
		for (const param of params) {
			if (urlSearchParams.has(param)) {
				return urlSearchParams.get(param);
			}
		}

		// Se não encontrado em nenhum lugar, retorne em branco
		return '';
	}

	get_path(element) {
		let path = [];

		while (element) {
			path.push(element);
			element = element.parentElement;
		}

		return path;
	}

	/*
	 * Geo Location
	 */
	async get_ip() {
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

	async get_geolocation() {
		const key_ip = 'tkz_geo_location';
		const geolocation = localStorage.getItem(key_ip);
	
		if (!geolocation) {
			try {
				let response = await fetch('https://ipwho.is/');
				
				if (!response.ok) {
					response = await fetch('https://ipwhois.pro/?key=9byOkU4mxozzQv6s');
				}
	
				if (response.ok) {
					const ipInfo = await response.json();
	
					const values = {
						tkz_lead_ip: ipInfo.ip,
						tkz_lead_city: ipInfo.city ? ipInfo.city.toLowerCase() : '',
						tkz_lead_region: ipInfo.region ? ipInfo.region.replace('State of ', '').toLowerCase() : '',
						tkz_lead_country: ipInfo.country_name ? ipInfo.country_name.toLowerCase() : ipInfo.country.toLowerCase(),
						tkz_lead_country_code: ipInfo.country_code.toLowerCase(),
						tkz_lead_currency: ipInfo.currency_code || ipInfo.currency?.code,
						tkz_lead_zipcode: ipInfo.postal_code || ipInfo.postal,
					}
	
					this.set(values);
					localStorage.setItem(key_ip, JSON.stringify(values));
	
					return values;
				} else {
					throw new Error('Erro ao obter dados de geolocalização');
				}
			} catch (error) {
				console.error('Erro ao obter dados de geolocalização:', error);
				return null; // Ou outro tratamento de erro adequado
			}
		}
	
		return JSON.parse(geolocation);
	}
	
		
	/*
	 * Forms
	 */
	monitor_forms() {
		// Seleciona todos os campos do formulário
		document.querySelectorAll('input').forEach(field => {
			this.input_monitor(field.name || field.id)

			// Email
			if (this.data?.lead_email && field.name.includes('mail')) {
				field.value = this.data?.lead_email;
			}

			// Name
			if (
				field.name.includes('name')
				&& (this.data?.lead_name || this.data?.lead_fname || this.data?.lead_lname)
			) {
				if (field.name.includes('first')) { // First
					field.value = this.data?.lead_fname || this.data?.lead_name;
				} else if (field.name.includes('last')) { // Last
					field.value = this.data?.lead_lname;
				} else if (!field.name.includes('last')) { // Full
					field.value = this.data?.lead_name || this.data?.lead_fname;
				}
			}

			// Phone
			if (this.data?.lead_phone) {
				if (
					(
						field.name.includes('tel') ||
						field.name.includes('phone') ||
						field.name.includes('ph') ||
						field.name.includes('cel') ||
						field.name.includes('mobile') ||
						field.name.includes('whats')
					)
					&& !field.name.includes('ddi')
					&& !field.name.includes('ddd')
				) {
					field.value = this.data?.lead_phone;
				}
			}
		});
	}

	async input_monitor(name) {
		const formFields = document.querySelectorAll(`[name*="${name}"]`);
		formFields.forEach((field) => {
			field.addEventListener('input', async (event) => {
				await this.input_save(event.target.name, event.target.value);
			});
			field.addEventListener('blur', async (event) => {
				await this.input_save(event.target.name, event.target.value, field);
				await this.send_lead_data();
			});
		});
	}

	async input_save(name, value, field = undefined) {
		// Email
		if (name.includes('mail')) {
			this.set({ tkz_lead_email: value });
			this.data.lead_email = value;
		}

		// Phone
		if (
			(
				name.includes('tel') ||
				name.includes('phone') ||
				name.includes('ph') ||
				name.includes('cel') ||
				name.includes('mobile') ||
				name.includes('whats')
			)
			&& !name.includes('ddi')
			&& !name.includes('ddd')
		) {
			if (this.data?.phone_valid) {
				value = this.phone_valid(value, this.data?.phone_country);

				if (field && this.data?.phone_update) {
					field.value = value;
				}
			}

			this.set({ tkz_lead_phone: value })
			this.data.lead_phone = value;
		}

		// Name
		if (name.includes('name')) {
			let full_name = this.data.lead_name,
				fname = this.data.lead_fname,
				lname = this.data.lead_lname;

			if (name.includes('first')) {
				fname = value.substring(0, value.indexOf(' '));
				lname = value.substring(value.indexOf(' ') + 1);
				full_name = [fname, lname].join(' ')
			} else if (name.includes('last')) {
				lname = value;
				full_name = [fname, lname].join(' ')
			} else if (!name.includes('last')) {
				full_name = value;
				fname = value.substring(0, value.indexOf(' '));
				lname = value.substring(value.indexOf(' ') + 1) || this.data.lead_lname;
			}

			this.set({
				tkz_lead_name: full_name,
				tkz_lead_fname: fname,
				tkz_lead_lname: lname,
			});

			this.data.lead_name = full_name;
			this.data.lead_fname = fname;
			this.data.lead_lname = lname;
		}
	}

	phone_valid(phone, country = '55') {
		// Limpa todos os caracteres que não são números
		phone = phone.replace(/[^0-9]/g, '');

		if (country === '55') {
			// Remove todos os 0 do começo do telefone, se houver
			if (phone.startsWith('00')) {
				phone = phone.substring(2);
			} else if (phone.startsWith('0')) {
				phone = phone.substring(1);
			}

			// Valida se o telefone tem 10 dígitos
			if (phone.length === 10) {
				// Adiciona o nono dígito no telefone, após o DDD, 2 números iniciais do telefone
				phone = `55${phone.substring(0, 2)}9${phone.substring(2)}`;
			}

			// Valida se o telefone tem 12 dígitos e começa com 55
			else if (phone.length === 12 && phone.startsWith('55')) {
				// Insere o nono dígito do telefone, após o DDI e DDD, os 4 números iniciais
				phone = `55${phone.substring(0, 4)}9${phone.substring(4)}`;
			}
		}

		// Verifica se o país já está incluído no início do telefone
		if (!phone.startsWith(country)) {
			phone = `${country}${phone}`;
		}

		return `+${phone}`;
	}

	async load_script(url) {
		return new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = url;
			script.onload = resolve;
			script.onerror = reject;
			document.head.appendChild(script);
		});
	}

	async hash_value(value) {
		if (!value || !value.length) {
			return null;
		}

		// Verifica se o navegador suporta a API de Criptografia Web
		if (crypto && crypto.subtle) {
			// Converte a string para ArrayBuffer
			const encoder = new TextEncoder();
			const data = encoder.encode(value);

			// Calcula o hash usando o algoritmo SHA-256
			const hashBuffer = await crypto.subtle.digest('SHA-256', data);

			// Converte o ArrayBuffer para uma string hexadecimal
			const hashArray = Array.from(new Uint8Array(hashBuffer));
			const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

			return hashHex;
		} else {
			if (!sha256) {
				await this.load_script('https://cdn.jsdelivr.net/npm/js-sha256/src/sha256.min.js');
			}


			return sha256(value);
		}
	}

	check_domain() {
		if (!this.data.page_url.includes(this.data.domain)) {
			console.log("Página fora do domínio de origem", this.data.domain);
			return false;
		}

		return true;
	}

	check_is_visible(element) {
		// Verifica se o elemento está oculto por causa do estilo
		if (element.style?.display === 'none') {
			return false;
		}

		// Verifica se o elemento está oculto por causa de um pai
		let parent = element.parentNode;
		while (parent) {
			if (parent.style?.display === 'none') {
				return false;
			}
			parent = parent.parentNode;
		}

		// O elemento está visível
		return true;
	}

	/*
	 * Facebook
	 */
	async facebook_send_event(data) {
		if (!this.data.fb_pixel) {
			return;
		}

		const fb_data = {
			event_id: data?.event_id,
			event_time: this.getTimestampUtc(),
			event_name: this.data.event_name,
			content_ids: (data?.content_id) ? data?.content_id?.split(',') : null,
			product_id: this.data.product_id,
			product_name: this.data.product_name,
			content_name: this.data.content_name || this.data.product_name,
			value: this.data.product_value,
			currency: this.data.currency,
			page_title: this.data.page_title,
			page_id: this.data.page_id,
		};

		console.log("Dados do evento Facebook:", fb_data); // Adicionando console.log aqui

		this.facebook_api(fb_data);
		await this.facebook_web(fb_data);
	}

	facebook_load_pixel() {
		if (typeof fbq === 'undefined') {
			! function(f, b, e, v, n, t, s) {
				if (f.fbq) return;
				n = f.fbq = function() {
					n.callMethod ?
						n.callMethod.apply(n, arguments) : n.queue.push(arguments)
				};
				if (!f._fbq) f._fbq = n;
				n.push = n;
				n.loaded = !0;
				n.version = '2.0';
				n.queue = [];
				t = b.createElement(e);
				t.async = !0;
				t.src = v;
				s = b.getElementsByTagName(e)[0];
				s.parentNode.insertBefore(t, s)
			}(window, document, 'script', this.data.fb_js);
		}

		fbq('init', this.data.fb_pixel);
		if (this.data?.fb_test_code) {
			fbq("data-fb-debug", this.data?.fb_test_code);
		}
	}

	async facebook_web(data) {
		this.facebook_load_pixel();

		fbq('track', data?.event_name || "PageView", {
			// Lead
			external_id: this.data?.lead_id,
			nm: await this.hash_value(this.data?.lead_name),
			fn: await this.hash_value(this.data?.lead_fname || this.data?.lead_name),
			ln: await this.hash_value(this.data?.lead_lname),
			em: await this.hash_value(this.data?.lead_email),
			ph: await this.hash_value(this.data?.lead_phone),

			// Cookie
			// fbc: this.data?.fb_fbc,
			// fbp: this.data?.fb_fbp,
			fbc: this.search_params_url_cookie('_fbc', 'fbclid') || null,
			fbp: this.search_params_url_cookie('_fbp', 'fbp') || null,

			// Product
			currency: data?.currency || this.data.geolocation?.tkz_lead_currency,
			content_type: 'product',
			content_ids: data?.content_ids,
			product_id: data?.product_id,
			content_name: data?.content_name,
			value: data?.value,

			// Geolocation
			client_user_agent: this.data.user_agent,
			client_ip_address: this.data.geolocation?.tkz_lead_ip,
			ct: await this.hash_value(this.data.geolocation?.tkz_lead_city),
			st: await this.hash_value(this.data.geolocation?.tkz_lead_region),
			zp: await this.hash_value(this.data.geolocation?.tkz_lead_zipcode),
			country: await this.hash_value(this.data.geolocation?.tkz_lead_country_code),

			// Event
			event_time: data?.event_time,
			event_day: this.data.event_day,
			event_day_in_month: this.data.event_day_in_month,
			event_month: this.data.event_month,
			event_time_interval: this.data.event_time_interval,
			event_url: this.data.page_url,
			event_source_url: this.data.page_url,
			traffic_source: this.data.traffic_source,

			// Page
			page_id: data?.page_id || this.data?.page_id,
			page_title: data?.page_title || this.data?.page_title,

			// App
			plugin: this.data?.plugin_name,
			plugin_info: this.data?.plugin_info,
		}, {
			eventID: data?.event_id || this.data?.event_id,
		});
	}

	facebook_api(data) {
		// Variáveis de Pixels
		this.data.fb_fbc = this.search_params_url_cookie('_fbc', 'fbclid')
		this.data.fb_fbp = this.search_params_url_cookie('_fbp', 'fbp')

		fetch(this.data.api_event, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			// body: data
			body: JSON.stringify({
				...this.data,
				...data
			})
		})
		// .then(data => {
		// 	console.log('Success:', data)
		// })
		// .catch(error => {
		// 	console.error('Error:', error);
		// });
	}

	/**
	 * Methods
	 */
	async send_event(data) {
		// event_id
		// event_name
		// content_id
		// product_id
		// product_name
		// product_value
		// currency
		// page_title
		// page_id

		await this.facebook_send_event(data);
	}



	async send_session_data() {
		console.log('Enviando dados da sessão...');
		const securityToken = this.data.api_token;
		
		try {
			// Verificação se o session_id é o mesmo do último enviado
			const previousSessionId = localStorage.getItem("previous_session_id");
			if (previousSessionId && previousSessionId === this.data.session_id) {
				console.log('O session_id é o mesmo do último enviado. Não é necessário enviar os dados novamente.');
				return;
			}
	
			const response = await fetch(this.data.api_session, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					//'Authorization': `Bearer ${securityToken}`
				},
				body: JSON.stringify({
					session_id: this.data.session_id,
					domain: this.data.domain,
					page_url: this.data.page_url,
					event_day_in_month: this.data.event_day_in_month,
					event_day: this.data.event_day,
					event_month: this.data.event_month,
					event_time_interval: this.data.event_time_interval,
					geolocation: this.data.geolocation,
					lead_id: this.data.lead_id,
					lead_name: this.data.lead_name,
					lead_fname: this.data.lead_fname,
					lead_lname: this.data.lead_lname,
					lead_email: this.data.lead_email,
					lead_phone: this.data.lead_phone,
					ip: this.data.geolocation?.tkz_lead_ip,
					device: this.data.user_agent,
					adress_city: this.data.geolocation?.tkz_lead_city,
					adress_state: this.data.geolocation?.tkz_lead_region,
					adress_zipcode: this.data.geolocation?.tkz_lead_zipcode,
					adress_country_name: this.data.geolocation?.tkz_lead_country,
					adress_country: this.data.geolocation?.tkz_lead_country_code,
				})
			});
			console.log('Resposta recebida:', response);
	
			if (!response.ok) {
				console.error('Erro ao enviar dados da sessão.');
				throw new Error('Erro ao enviar dados da sessão.');
			}
	
			const responseData = await response.json();
	
			console.log('Dados recebidos do servidor:', responseData);
	
			// Envie os dados para o servidor para salvar no banco de dados
			await this.saveSessionDataToServer(responseData.data);
			
			// Armazenamento do session_id atual como o último enviado
			localStorage.setItem("previous_session_id", this.data.session_id);
	
			return responseData.data;
		} catch (error) {
			console.error('Erro ao enviar dados da sessão:', error);
			return {};
		}
	}
	
	
	async saveSessionDataToServer(leadData) {
		try {
			const baseURL = window.location.origin;
			const apiURL = `${baseURL}/wp-json/trackerz/v1/save-session-data`;

			console.log('API URL:', apiURL); // Adicionando um log para verificar a URL da API

	
			const response = await fetch(apiURL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					session_id: this.data.session_id,
					domain: this.data.domain,
					page_url: this.data.page_url,
					event_day_in_month: this.data.event_day_in_month,
					event_day: this.data.event_day,
					event_month: this.data.event_month,
					event_time_interval: this.data.event_time_interval,
					geolocation: this.data.geolocation,
					lead_id: this.data.lead_id,
					lead_name: this.data.lead_name,
					lead_fname: this.data.lead_fname,
					lead_lname: this.data.lead_lname,
					lead_email: this.data.lead_email,
					lead_phone: this.data.lead_phone,
					ip: this.data.geolocation?.tkz_lead_ip,
					device: this.data.user_agent,
					adress_city: this.data.geolocation?.tkz_lead_city,
					adress_state: this.data.geolocation?.tkz_lead_region,
					adress_zipcode: this.data.geolocation?.tkz_lead_zipcode,
					adress_country_name: this.data.geolocation?.tkz_lead_country,
					adress_country: this.data.geolocation?.tkz_lead_country_code,
				})
			});

			console.log('Response:', response); // Adicionando um log para verificar a resposta da requisição
	
			if (!response.ok) {
				throw new Error('Erro ao salvar dados da sessão no servidor.');
			}
		} catch (error) {
			console.error('Erro ao salvar dados da sessão no servidor:', error);
		}
	}
	
	
	
	async send_lead_data() {
		return await fetch(this.data.api_lead, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			// body: data
			body: JSON.stringify({
				// Info
				lead_id: this.data.lead_id,
				lead_name: this.data.lead_name,
				lead_fname: this.data.lead_fname,
				lead_lname: this.data.lead_lname,
				lead_email: this.data.lead_email,
				lead_phone: this.data.lead_phone,

				// Geolocation
				ip: this.data.geolocation?.tkz_lead_ip,
				device: this.data.user_agent,
				adress_city: this.data.geolocation?.tkz_lead_city,
				adress_state: this.data.geolocation?.tkz_lead_region,
				adress_zipcode: this.data.geolocation?.tkz_lead_zipcode,
				adress_country_name: this.data.geolocation?.tkz_lead_country,
				adress_country: this.data.geolocation?.tkz_lead_country_code,
			})
		})
			.then(async (data) => {
				data = await data.json();
				let lead_data = data?.data

				this.data.lead_id = lead_data.id;
				this.data.lead_name = lead_data?.name || this.data.lead_name;
				this.data.lead_fname = lead_data?.fname || this.data.lead_fname;
				this.data.lead_lname = lead_data?.lname || this.data.lead_lname;
				this.data.lead_email = lead_data?.email || this.data.lead_email;
				this.data.lead_phone = lead_data?.phone || this.data.lead_phone;

				this.data.geolocation.tkz_lead_ip = lead_data?.ip || this.data.geolocation?.tkz_lead_ip;
				this.data.geolocation.tkz_lead_city = lead_data?.adress_city || this.data.geolocation?.tkz_lead_city;
				this.data.geolocation.tkz_lead_region = lead_data?.adress_state || this.data.geolocation?.tkz_lead_region;
				this.data.geolocation.tkz_lead_zipcode = lead_data?.adress_zipcode || this.data.geolocation?.tkz_lead_zipcode;
				this.data.geolocation.tkz_lead_country = lead_data?.adress_country_name || this.data.geolocation?.tkz_lead_country;
				this.data.geolocation.tkz_lead_country_code = lead_data?.adress_country || this.data.geolocation?.tkz_lead_country_code;

				return lead_data;
			})
			.catch(() => {
				return {};
			});
	}
}
