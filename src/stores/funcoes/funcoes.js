import {defineStore} from "pinia";

export const useFuncoesStore = defineStore("funcoes", {
    state: () => ({
        funcoes: []
    }),

    actions: {
        /**
         * NORMALIZAR MOEDA
         * @param valor
         * @param casas
         * @returns {string|string}
         */

        normalizarMoeda(valor, casas = 2) {
            if (valor === null || valor === undefined || valor === "") {
                return "0." + "0".repeat(casas);
            }

            // número gigante vindo do XML (ex: 262900000000)
            if (typeof valor === "number") {
                return (valor / Math.pow(10, casas)).toFixed(casas);
            }

            // string tipo "R$ 1.234,56"
            if (typeof valor === "string") {
                const num = Number(
                    valor
                        .replace("R$", "")
                        .replaceAll(".", "")
                        .replace(",", ".")
                        .trim()
                );

                return isNaN(num) ? "0." + "0".repeat(casas) : num.toFixed(casas);
            }

            return "0." + "0".repeat(casas);
        },

        /**
         * PREENCHER FORMS DE ENTRADA DFE
         * @param {object} ide
         * @param {object} total
         * @param {object} emit
         * @param {object} xml
         * @param {object} dest
         * @param {array} itens
         * @param {object} transp
         * @param {object} pag
         * @param {object} infAdic
         * @param {object} forms
         * @param {object} produtos
         * @return {Promise<void>}
         */

        preencherForms(
            ide, total, emit, xml, dest, itens,
            transp, pag, infAdic, forms, produtos
        )
        {
            // 🔹 Pegar a chave de acesso da NFe
            const infNFe = xml.getElementsByTagName("infNFe")[0];
            const chave = infNFe ? infNFe.getAttribute("Id")?.replace("NFe", "") : null;

            // 🔹 Preencher campos
            forms.dtemissao = ide?.dhEmi || null;
            forms.dtentrada = ide?.dhSaiEnt || null;

            forms.nfe_numero = ide?.nNF || null;
            forms.id_serie = ide?.serie || null;
            forms.nfe_modelo = ide?.mod || null;
            forms.nfe_chavedeacesso = chave || null;

            // Totais
            if (total?.ICMSTot) {
                forms.vlr_total_produto = total.ICMSTot.vProd || null;
                forms.vlr_nf = total.ICMSTot.vNF || null;

                forms.base_icms = total.ICMSTot.vBC || null;
                forms.aliquota_icms = total.ICMSTot?.pICMS || null;
                forms.vlr_icms = total.ICMSTot.vICMS || null;

                forms.base_ipi = total.ICMSTot.vBCIPI || null;
                forms.vlr_ipi = total.ICMSTot.vIPI || null;

                forms.vlr_desconto = total.ICMSTot.vDesc || null;
                forms.vlr_frete = total.ICMSTot.vFrete || null;
                forms.outras_despesas = total.ICMSTot.vOutro || null;
                forms.vlr_ii = total.ICMSTot.vII || null;
                forms.outras_despesas_foranf = total.ICMSTot.vOutro || null;
                forms.vlr_pis_produto = total.ICMSTot.vPIS || null;
                forms.vlr_seguro = total.ICMSTot.vSeg || null;
            }

            if (transp) {
                forms.tipo_frete = transp?.modFrete || null;
            }

            if (itens) {
                const itensPayload = (itens || []).map((item, idx) => {
                    const prod = item?.prod ?? {};
                    const imp = item?.imposto ?? {};

                    const icmsGroup = imp?.ICMS ? Object.values(imp.ICMS)[0] : null;
                    const pisGroup = imp?.PIS ? Object.values(imp.PIS)[0] : null;
                    const cofinsGroup = imp?.COFINS ? Object.values(imp.COFINS)[0] : null;

                    const ipiGroup = imp?.IPI?.IPITrib || imp?.IPI?.IPINT || null;

                    const ibscbsNode = imp?.IBSCBS ?? null;
                    const gIBSCBS = ibscbsNode?.gIBSCBS ?? null;

                    const gUF = gIBSCBS?.gIBSUF ?? null;
                    const gMun = gIBSCBS?.gIBSMun ?? null;
                    const gCBS = gIBSCBS?.gCBS ?? null;

                    return {
                        cProd: prod?.cProd || null,
                        cEAN: prod?.cEAN || null,
                        id_seq: Number(item?.nItem ?? (idx + 1)),
                        id_produto: null,
                        id_cor: 0,
                        id_tamanho: 0,

                        descprodutovst: null,
                        descprodutoxml: prod?.xProd ?? null,

                        quantidade: Number(String(prod?.qCom ?? 0).replace(",", ".")),
                        vlr_unitario: Number(prod?.vUnCom).toFixed(2) ?? 0.00,
                        desconto_total_item: this.normalizarMoeda(prod?.vDesc ?? 0.00), // se não tiver no XML, fica 0
                        vlr_total_item: Number(prod?.vProd).toFixed(2) ?? 0.00,

                        vlr_seguro_item: this.normalizarMoeda(prod?.vSeg ?? 0.00),
                        vlr_frete_item: this.normalizarMoeda(prod?.vFrete ?? 0.00),

                        custo_medio: Number(prod?.vUnCom).toFixed(2) ?? 0.00,
                        id_movimentoalmox: forms.id_almoxarifado ?? null,

                        // ===== Fiscal (geral)
                        id_cfop_item: prod?.CFOP ?? null,

                        cst_item: icmsGroup?.CST ?? null,
                        csosn_item: icmsGroup?.CSOSN ?? null,

                        cest_item: prod?.CEST ?? null, // alguns XMLs trazem em prod.CEST; se vier em outro lugar, ajuste aqui

                        // ===== ICMS
                        aliquota_icms_item: this.normalizarMoeda(icmsGroup?.pICMS),
                        base_icms_item: this.normalizarMoeda(icmsGroup?.vBC),
                        vlr_icms_item: this.normalizarMoeda(icmsGroup?.vICMS),

                        aliquota_subst_item: this.normalizarMoeda(icmsGroup?.pICMSST),
                        base_icms_subst_item: this.normalizarMoeda(icmsGroup?.vBCST),
                        vlr_icms_subst_item: this.normalizarMoeda(icmsGroup?.vICMSST),

                        // ===== IPI
                        cst_ipi: ipiGroup?.CST ?? null,
                        aliquota_ipi_item: this.normalizarMoeda(ipiGroup?.pIPI),
                        cenqipi: imp?.IPI?.cEnq ?? null,
                        base_ipi_item: this.normalizarMoeda(ipiGroup?.vBC),
                        vlr_ipi_item: this.normalizarMoeda(ipiGroup?.vIPI),

                        // ===== PIS
                        cst_pis: pisGroup?.CST ?? null,
                        aliquota_pis_item: this.normalizarMoeda(pisGroup?.pPIS),
                        base_pis_item: this.normalizarMoeda(pisGroup?.vBC),

                        // ===== COFINS
                        cst_cofins: cofinsGroup?.CST ?? null,
                        aliquota_cofins_item: this.normalizarMoeda(cofinsGroup?.pCOFINS),
                        base_cofins_item: this.normalizarMoeda(cofinsGroup?.vBC),

                        // ===== Outros / contábil / bases

                        reducao_base_calc: this.normalizarMoeda(icmsGroup?.pRedBC ?? null),
                        vlr_outras_item: this.normalizarMoeda(prod?.vOutro ?? 0.00),
                        vlr_outras_item_foranf: this.normalizarMoeda(prod?.vOutro ?? 0.00),

                        base_cbsibs_item: this.normalizarMoeda(gIBSCBS?.vBC ?? null),
                        vlr_cbs_item: this.normalizarMoeda(gCBS?.vCBS ?? null),
                        vlr_ibsuf_item: this.normalizarMoeda(gUF?.vIBSUF ?? null),
                        vlr_ibsmun_item: this.normalizarMoeda(gMun?.vIBSMun ?? null),

                        aliq_mva: this.normalizarMoeda(icmsGroup?.pMVAST),
                        pmva_item: this.normalizarMoeda(icmsGroup?.pMVAST),

                        mod_bc: icmsGroup?.modBC ?? null,
                        mod_bcst: icmsGroup?.modBCST ?? null,

                        predbc: this.normalizarMoeda(icmsGroup?.pRedBC),
                        predbcst: this.normalizarMoeda(icmsGroup?.pRedBCST),

                        // ===== NCM / incidência
                        id_ncm_item: prod?.NCM ?? null,
                        incidenciafiscal_item: null,

                        // ===== II (Importação) — se não existir no XML, deixa 0
                        aliquota_ii_item: this.normalizarMoeda(icmsGroup?.pII ?? 0.00),
                        base_ii_item: this.normalizarMoeda(icmsGroup?.vBC ?? 0.00),
                        vlr_ii_item: this.normalizarMoeda(icmsGroup?.vII ?? 0.00),
                        vlr_siscomex_item: this.normalizarMoeda(icmsGroup?.vDespAdu ?? 0.00),
                        vlr_afrmm_item: this.normalizarMoeda(icmsGroup?.vAFRMM ?? 0.00),

                        // ===== IBS/CBS (reforma) — nomes CERTOS da sua lista
                        cclasstrib_item: imp?.IBSCBS?.cClassTrib ?? this.normalizarMoeda(0.00),
                        cst_cbsibs_item: imp?.IBSCBS?.CST ?? this.normalizarMoeda(0.00),

                        perc_cbs_item: this.normalizarMoeda(gCBS?.pCBS),
                        perc_ibsuf_item: this.normalizarMoeda(gUF?.pIBSUF),
                        perc_ibsmun_item: this.normalizarMoeda(gMun?.pIBSMun),
                    };
                });
                produtos.value = [...itensPayload];

                forms.reducao_base_calc = this.normalizarMoeda(itensPayload.reduce((a,i)=> a + (Number(i.reducao_base_calc)||0), 0));
                forms.base_cbsibs       = this.normalizarMoeda(itensPayload.reduce((a,i)=> a + (Number(i.base_cbsibs_item)||0), 0));
                forms.vlr_cbs           = this.normalizarMoeda(itensPayload.reduce((a,i)=> a + (Number(i.vlr_cbs_item)||0), 0));
                forms.vlr_ibsuf         = this.normalizarMoeda(itensPayload.reduce((a,i)=> a + (Number(i.vlr_ibsuf_item)||0), 0));
                forms.vlr_ibsmun        = this.normalizarMoeda(itensPayload.reduce((a,i)=> a + (Number(i.vlr_ibsmun_item)||0), 0));
            }

            // Observação
            forms.observacao = infAdic?.infCpl || null;

            // Marcar origem
            forms.importacaoxml = true;
        },
    }
});