import axios from 'axios';

const apiPhp = axios.create({
    baseURL: process.env.VUE_APP_PHP_API_URL || 'http://192.168.10.51:8000/api/v1'
});

// Injeta Bearer token em todas as requisições
apiPhp.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Normaliza respostas de sucesso — extrai array de respostas paginadas do Laravel
// Laravel retorna: { current_page: 1, data: [...], total: N, ... }
// O interceptor substitui response.data pelo array real, eliminando a necessidade
// de stores fazerem response.data?.data ?? response.data para esse caso.
apiPhp.interceptors.response.use(
    response => {
        if (
            response.data &&
            typeof response.data === 'object' &&
            !Array.isArray(response.data) &&
            Array.isArray(response.data.data) &&
            typeof response.data.current_page === 'number'
        ) {
            response.data = response.data.data;
        }
        return response;
    },
    error => {
        // 401 — sessão expirada, redireciona para login
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        // 422 — normaliza os 2 formatos de erro de validação:
        // Formato 1: { message: "...", errors: { campo: ["msg"] } }
        // Formato 2: { erro: "..." }
        if (error.response?.status === 422) {
            const data = error.response.data;
            if (data?.errors && Object.keys(data.errors).length > 0) {
                const firstField = Object.keys(data.errors)[0];
                error.validationMessage = data.errors[firstField]?.[0] || data.message || 'Erro de validação.';
            } else if (data?.erro) {
                error.validationMessage = data.erro;
            } else {
                error.validationMessage = data?.message || 'Erro de validação.';
            }
        }

        return Promise.reject(error);
    }
);

export default apiPhp;
