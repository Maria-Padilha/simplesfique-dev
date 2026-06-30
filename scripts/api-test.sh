#!/bin/bash
# ============================================================
# API TEST — SimplesFique
# Teste rápido de conectividade e principais endpoints
# ============================================================
# Uso:
#   ./scripts/api-test.sh                         # testa conexão
#   TOKEN=xxx ./scripts/api-test.sh               # testa com token
#   TOKEN=xxx PHP=1 ./scripts/api-test.sh         # só PHP API
#   TOKEN=xxx THORSE=1 ./scripts/api-test.sh      # só THorse
# ============================================================

PHP_BASE="${PHP_API:-http://192.168.10.51:8000/api/v1}"
THORSE_BASE="${THORSE_API:-http://192.168.10.100:9005}"
TOKEN="${TOKEN:-}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

echo -e "\n${BOLD}${CYAN}═══════════════════════════════════════${NC}"
echo -e "${BOLD}${CYAN}  API TEST — SimplesFique ERP${NC}"
echo -e "${BOLD}${CYAN}═══════════════════════════════════════${NC}"
echo -e "${DIM}PHP:   $PHP_BASE${NC}"
echo -e "${DIM}THorse: $THORSE_BASE${NC}"
echo -e "${DIM}Token: $( [ -n "$TOKEN" ] && echo '✓' || echo '✗' )${NC}"
echo -e "${DIM}Data:  $(date -u +"%Y-%m-%dT%H:%M:%SZ")${NC}"

test_endpoint() {
    local label="$1"
    local url="$2"
    local auth="$3"
    
    local start=$(python3 -c 'import time; print(int(time.time() * 1000))' 2>/dev/null || echo 0)
    
    if [ -n "$auth" ] && [ -n "$TOKEN" ]; then
        local result=$(curl -s -m 5 -o /tmp/api-test-resp.txt -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$url" 2>/dev/null)
    else
        local result=$(curl -s -m 5 -o /tmp/api-test-resp.txt -w "%{http_code}" "$url" 2>/dev/null)
    fi
    
    local end=$(python3 -c 'import time; print(int(time.time() * 1000))' 2>/dev/null || echo 0)
    local elapsed=$((end - start))
    
    local status_icon
    if [ "$result" = "000" ]; then
        status_icon="${RED}✘${NC}"
        result="SEM RESPOSTA"
    elif [ "$result" -ge 200 ] && [ "$result" -lt 300 ]; then
        status_icon="${GREEN}✓${NC}"
    elif [ "$result" = "404" ]; then
        status_icon="${YELLOW}⚠${NC}"
    else
        status_icon="${RED}✘${NC}"
    fi
    
    local time_color
    if [ "$elapsed" -gt 3000 ]; then time_color="${RED}"
    elif [ "$elapsed" -gt 1000 ]; then time_color="${YELLOW}"
    else time_color="${DIM}"
    fi
    
    printf "  %b %-50s %b%dms%b\n" "$status_icon" "$label" "$time_color" "$elapsed" "$NC"
    
    # Mostra preview da resposta (primeiras linhas)
    if [ "$result" != "SEM RESPOSTA" ] && [ "$result" != "000" ]; then
        local resp_size=$(wc -c < /tmp/api-test-resp.txt 2>/dev/null || echo 0)
        if [ "$resp_size" -gt 5 ]; then
            local preview=$(head -c 200 /tmp/api-test-resp.txt 2>/dev/null | tr -d '\0')
            echo -e "    ${DIM}→ ${preview}${NC}"
        fi
    fi
}

echo -e "\n${BOLD}${CYAN}── PHP API (porta 8000) ──────────────────${NC}"

if [ -z "$THORSE" ]; then
    test_endpoint "GET / (root)" "${PHP_BASE}/../"
    test_endpoint "GET /api/v1/health" "${PHP_BASE}/health"
    
    if [ -n "$TOKEN" ]; then
        echo -e "\n  ${BOLD}Endpoints autenticados:${NC}"
        
        # Pessoas
        test_endpoint "GET /manutencao/pessoas" "${PHP_BASE}/manutencao/pessoas" "auth"
        test_endpoint "GET /manutencao/pessoas?find=a" "${PHP_BASE}/manutencao/pessoas?find=a" "auth"
        
        # Empresa
        test_endpoint "GET /empresa/me" "${PHP_BASE}/empresa/me" "auth"
        
        # Financeiro
        test_endpoint "GET /financeiro/contas-pagar" "${PHP_BASE}/financeiro/contas-pagar" "auth"
        test_endpoint "GET /financeiro/contas-receber" "${PHP_BASE}/financeiro/contas-receber" "auth"
        test_endpoint "GET /financeiro/caixas" "${PHP_BASE}/financeiro/caixas" "auth"
        test_endpoint "GET /financeiro/contas-correntes" "${PHP_BASE}/financeiro/contas-correntes" "auth"
        test_endpoint "GET /financeiro/centros-custo" "${PHP_BASE}/financeiro/centros-custo" "auth"
        test_endpoint "GET /financeiro/dres" "${PHP_BASE}/financeiro/dres" "auth"
        
        # Produtos
        test_endpoint "GET /estoque/produtos" "${PHP_BASE}/estoque/produtos" "auth"
        test_endpoint "GET /estoque/marcas" "${PHP_BASE}/estoque/marcas" "auth"
        test_endpoint "GET /estoque/grupos" "${PHP_BASE}/estoque/grupos" "auth"
        test_endpoint "GET /estoque/subgrupos" "${PHP_BASE}/estoque/subgrupos" "auth"
        test_endpoint "GET /estoque/classes" "${PHP_BASE}/estoque/classes" "auth"
        test_endpoint "GET /estoque/almoxarifados" "${PHP_BASE}/estoque/almoxarifados" "auth"
        test_endpoint "GET /estoque/garantias" "${PHP_BASE}/estoque/garantias" "auth"
        test_endpoint "GET /estoque/cores" "${PHP_BASE}/estoque/cores" "auth"
        
        # Estoque
        test_endpoint "GET /estoque/inventarios" "${PHP_BASE}/estoque/inventarios" "auth"
        test_endpoint "GET /manutencao/formulas" "${PHP_BASE}/manutencao/formulas" "auth"
        
        # Usuários
        test_endpoint "GET /manutencao/usuarios" "${PHP_BASE}/manutencao/usuarios" "auth"
        test_endpoint "GET /manutencao/grupos-usuario" "${PHP_BASE}/manutencao/grupos-usuario" "auth"
        
        # Integrações
        test_endpoint "GET /integracoes/api-externa" "${PHP_BASE}/integracoes/api-externa" "auth"
    else
        echo -e "  ${YELLOW}Sem token — pule os endpoints autenticados${NC}"
        echo -e "  ${DIM}Passe TOKEN=seu_token para testar${NC}"
    fi
fi

# ─── THorse API ──────────────────
echo -e "\n${BOLD}${CYAN}── THorse API (porta 9005) ────────────────${NC}"

if [ -z "$PHP" ]; then
    test_endpoint "GET /empsaas (público)" "${THORSE_BASE}/empsaas"
    
    if [ -n "$TOKEN" ]; then
        echo -e "\n  ${BOLD}Endpoints autenticados:${NC}"
        test_endpoint "GET /contacorrente/{emp}" "${THORSE_BASE}/contacorrente/1" "auth"
        test_endpoint "GET /caixa/{emp}" "${THORSE_BASE}/caixa/1" "auth"
        test_endpoint "GET /produto/{emp}" "${THORSE_BASE}/produto/1" "auth"
        test_endpoint "GET /marca/{emp}" "${THORSE_BASE}/marca/1" "auth"
        test_endpoint "GET /mpo" "${THORSE_BASE}/mpo" "auth"
    fi
fi

echo -e "\n${BOLD}${GREEN}═══════════════════════════════════════${NC}"
echo -e "${BOLD}${GREEN}  Teste concluído!${NC}"
echo -e "${BOLD}${GREEN}═══════════════════════════════════════${NC}\n"
