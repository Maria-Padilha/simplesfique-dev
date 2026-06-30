/**
 * Formata uma data para o padrão brasileiro (dd/mm/aaaa).
 *
 * Strings no formato YYYY-MM-DD são interpretadas como UTC pelo JavaScript,
 * o que causa deslocamento de 1 dia em fusos negativos (ex: UTC-3 do Brasil).
 * Esta função corrige esse comportamento ao forçar o parse como horário local.
 *
 * @param {string|Date|null} data - Data a formatar
 * @param {string} [fallback='-'] - Valor exibido quando a data for nula/inválida
 * @returns {string}
 */
export function formatarData(data, fallback = '-') {
  if (!data) return fallback

  let date

  if (typeof data === 'string') {
    // Se for apenas data (YYYY-MM-DD), forçar parse como horário local
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      date = new Date(data + 'T00:00:00')
    } else {
      date = new Date(data)
    }
  } else {
    date = new Date(data)
  }

  if (isNaN(date.getTime())) return fallback

  return date.toLocaleDateString('pt-BR')
}
