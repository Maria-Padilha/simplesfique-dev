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

            const num = Number(String(valor).replace(",", ".").trim());

            return isNaN(num)
                ? "0." + "0".repeat(casas)
                : num.toFixed(casas);
        },

        // normalizarQuantidade(valor, casas = 4) {
        //     if (valor === null || valor === undefined || valor === "") {
        //         return "0." + "0".repeat(casas);
        //     }
        //
        //     const num = Number(String(valor).replace(",", ".").trim());
        //
        //     return isNaN(num)
        //         ? "0." + "0".repeat(casas)
        //         : num.toFixed(casas);
        // },

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

            forms.numero_nf = ide?.nNF || null;
            forms.nfe_numero = ide?.nNF || null;
            forms.serie_nf = ide?.serie || null;
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
                        id_tamanho: '0',
                        uCom: prod?.uCom ?? null,

                        descprodutovst: null,
                        descprodutoxml: prod?.xProd ?? null,

                        quantidade: Number(String(prod?.qCom ?? 0).replace(",", ".")),

                        vlr_unitario: this.normalizarMoeda(prod?.vUnCom),
                        desconto_total_item: this.normalizarMoeda(prod?.vDesc ?? 0),
                        vlr_total_item: this.normalizarMoeda(prod?.vProd),

                        vlr_seguro_item: this.normalizarMoeda(prod?.vSeg ?? 0),
                        vlr_frete_item: this.normalizarMoeda(prod?.vFrete ?? 0),

                        custo_medio: this.normalizarMoeda(prod?.vUnCom),
                        id_movimentoalmox: forms.id_almoxarifado ?? null,

                        id_cfop_item: prod?.CFOP ?? null,
                        cst_item: icmsGroup?.CST ?? null,
                        csosn_item: icmsGroup?.CSOSN ?? null,
                        cest_item: prod?.CEST ?? null,

                        aliquota_icms_item: this.normalizarMoeda(icmsGroup?.pICMS),
                        base_icms_item: this.normalizarMoeda(icmsGroup?.vBC),
                        vlr_icms_item: this.normalizarMoeda(icmsGroup?.vICMS),

                        aliquota_subst_item: this.normalizarMoeda(icmsGroup?.pICMSST),
                        base_icms_subst_item: this.normalizarMoeda(icmsGroup?.vBCST),
                        vlr_icms_subst_item: this.normalizarMoeda(icmsGroup?.vICMSST),

                        cst_ipi: ipiGroup?.CST ?? null,
                        aliquota_ipi_item: this.normalizarMoeda(ipiGroup?.pIPI),
                        cenqipi: imp?.IPI?.cEnq ?? null,
                        base_ipi_item: this.normalizarMoeda(ipiGroup?.vBC),
                        vlr_ipi_item: this.normalizarMoeda(ipiGroup?.vIPI),

                        cst_pis: pisGroup?.CST ?? null,
                        aliquota_pis_item: this.normalizarMoeda(pisGroup?.pPIS),
                        base_pis_item: this.normalizarMoeda(pisGroup?.vBC),

                        cst_cofins: cofinsGroup?.CST ?? null,
                        aliquota_cofins_item: this.normalizarMoeda(cofinsGroup?.pCOFINS),
                        base_cofins_item: this.normalizarMoeda(cofinsGroup?.vBC),

                        reducao_base_calc: this.normalizarMoeda(icmsGroup?.pRedBC),
                        vlr_outras_item: this.normalizarMoeda(prod?.vOutro ?? 0),
                        vlr_outras_item_foranf: this.normalizarMoeda(prod?.vOutro ?? 0),

                        base_cbsibs_item: this.normalizarMoeda(gIBSCBS?.vBC),
                        vlr_cbs_item: this.normalizarMoeda(gCBS?.vCBS),
                        vlr_ibsuf_item: this.normalizarMoeda(gUF?.vIBSUF),
                        vlr_ibsmun_item: this.normalizarMoeda(gMun?.vIBSMun),

                        aliq_mva: this.normalizarMoeda(icmsGroup?.pMVAST),
                        pmva_item: this.normalizarMoeda(icmsGroup?.pMVAST),

                        mod_bc: icmsGroup?.modBC ?? null,
                        mod_bcst: icmsGroup?.modBCST ?? null,

                        predbc: this.normalizarMoeda(icmsGroup?.pRedBC),
                        predbcst: this.normalizarMoeda(icmsGroup?.pRedBCST),

                        id_ncm_item: prod?.NCM ?? null,
                        incidenciafiscal_item: null,

                        aliquota_ii_item: this.normalizarMoeda(icmsGroup?.pII ?? 0),
                        base_ii_item: this.normalizarMoeda(icmsGroup?.vBC ?? 0),
                        vlr_ii_item: this.normalizarMoeda(icmsGroup?.vII ?? 0),
                        vlr_siscomex_item: this.normalizarMoeda(icmsGroup?.vDespAdu ?? 0),
                        vlr_afrmm_item: this.normalizarMoeda(icmsGroup?.vAFRMM ?? 0),

                        cclasstrib_item: imp?.IBSCBS?.cClassTrib ?? "0.00",
                        cst_cbsibs_item: imp?.IBSCBS?.CST ?? "0.00",

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

        /**
         * PREENCHER FORMS DE DEVOLUÇÃO DFE
         * @param ide
         * @param total
         * @param emit
         * @param xml
         * @param dest
         * @param itens
         * @param transp
         * @param pag
         * @param infAdic
         * @param forms
         * @param produtos
         */

        preencherFormsDevolucao(
            ide, total, emit, xml, dest, itens,
            transp, pag, infAdic, forms, produtos
        ) {
            // 🔹 Chave de acesso
            const infNFe = xml.getElementsByTagName("infNFe")[0];
            const chave = infNFe ? infNFe.getAttribute("Id")?.replace("NFe", "") : null;

            // =========================
            // CABEÇALHO / NFe (IMAGEM 1 e 3)
            // =========================
            forms.dtemissao = ide?.dhEmi || null;
            forms.dtsaida   = ide?.dhSaiEnt || null; // devolução pode ser "saída" do retorno
            // se você usa "dtentrada" em outro lugar, pode setar também:
            // forms.dtentrada = ide?.dhSaiEnt || null;

            forms.nfe_numero       = ide?.nNF || null;
            forms.serie_nf         = ide?.serie || forms.serie_nf || null; // se seu cabeçalho usa serie_nf
            forms.nfe_numero_serie = ide?.serie || null;                   // se você tem esse campo também
            forms.nfe_modelo       = ide?.mod || null;
            forms.nfe_chavedeacesso = chave || null;

            // (se você usa esses campos do print)
            forms.nfe_tp_emissao_danfe = ide?.tpEmis || null;
            forms.nfe_nrlote           = null;
            forms.nfe_nrrecibo         = null;
            forms.nfe_status           = null;

            // fornecedor/origem: normalmente devolução referencia a nota de entrada
            // aqui você decide se vai setar algo automático
            // forms.id_fornecedor = ... (você já faz isso antes, pelo emit)

            // =========================
            // TOTAIS (IMAGEM 4)
            // =========================
            if (total?.ICMSTot) {
                const t = total.ICMSTot;

                forms.vlr_total_produto = t.vProd || null;
                forms.vlr_nf            = t.vNF || null;

                forms.base_icms     = t.vBC || null;
                forms.vlr_icms      = t.vICMS || null;

                forms.base_icms_subst = t.vBCST || null;
                forms.vlr_icms_subst  = t.vST || t.vICMSST || null;

                forms.base_ipi = t.vBCIPI || null;
                forms.vlr_ipi  = t.vIPI || null;

                forms.vlr_desconto   = t.vDesc || null;
                forms.vlr_frete      = t.vFrete || null;
                forms.outras_despesas = t.vOutro || null;
                forms.vlr_seguro     = t.vSeg || null;

                forms.vlr_ii         = t.vII || null;
                forms.vlr_pis_produto   = t.vPIS || null;
                forms.vlr_cofins_produto = t.vCOFINS || null;

                // Alguns XMLs podem trazer isentos separados; se não tiver, deixa null
                forms.isento_icms = null;
                forms.isento_ipi  = null;

                // você tinha esse duplicado no print
                forms.outras_despesas_foranf = t.vOutro || null;
            }

            // Frete
            if (transp) {
                forms.tipo_frete = transp?.modFrete || null;
            }

            // Observação
            forms.observacao = infAdic?.infCpl || null;

            // Marcar origem
            forms.importacaoxml = true;

            // =========================
            // ITENS (IMAGEM 2 e 5)
            // =========================
            if (itens) {
                const itensPayload = (itens || []).map((item, idx) => {
                    const prod = item?.prod ?? {};
                    const imp  = item?.imposto ?? {};

                    const icmsGroup   = imp?.ICMS ? Object.values(imp.ICMS)[0] : null;
                    const pisGroup    = imp?.PIS ? Object.values(imp.PIS)[0] : null;
                    const cofinsGroup = imp?.COFINS ? Object.values(imp.COFINS)[0] : null;

                    const ipiGroup = imp?.IPI?.IPITrib || imp?.IPI?.IPINT || null;

                    // IBS/CBS
                    const ibscbsNode = imp?.IBSCBS ?? null;
                    const gIBSCBS = ibscbsNode?.gIBSCBS ?? null;
                    const gUF = gIBSCBS?.gIBSUF ?? null;
                    const gMun = gIBSCBS?.gIBSMun ?? null;
                    const gCBS = gIBSCBS?.gCBS ?? null;

                    // quantidades / valores
                    const quantidade = Number(String(prod?.qCom ?? 0).replace(",", "."));
                    const vUn = Number(String(prod?.vUnCom ?? 0).replace(",", "."));
                    const vProd = Number(String(prod?.vProd ?? 0).replace(",", "."));

                    return {
                        // ===== itens extras (imagem 2)
                        id_seq: Number(item?.nItem ?? (idx + 1)),
                        id_produto: null,
                        id_cor: prod?.id_cor ?? null,         // se não vier do XML, mantém null
                        id_tamanho: prod?.id_tamanho ?? null, // se não vier do XML, mantém null

                        // seu XML usado na tabela
                        descprodutovst: null,
                        descprodutoxml: prod?.xProd ?? null,

                        // dos prints (item)
                        quantidade: quantidade,
                        vlr_unitario: Number.isFinite(vUn) ? Number(vUn.toFixed(2)) : 0,
                        vlr_total_item: Number.isFinite(vProd) ? Number(vProd.toFixed(2)) : 0,

                        // desconto/seguro/frete/outros por item (imagem 2)
                        desconto_total_item: this.normalizarMoeda(prod?.vDesc ?? 0),
                        vlr_seguro_item: this.normalizarMoeda(prod?.vSeg ?? 0),
                        vlr_frete_item: this.normalizarMoeda(prod?.vFrete ?? 0),
                        vlr_outras_item: this.normalizarMoeda(prod?.vOutro ?? 0),
                        vlr_outras_item_foranf: this.normalizarMoeda(prod?.vOutro ?? 0),

                        // custo (você usava vUnCom como custo)
                        custo_medio: Number.isFinite(vUn) ? Number(vUn.toFixed(2)) : 0,
                        id_movimentoalmox: forms.id_almoxarifado ?? null,

                        // ===== Fiscal do item (imagem 5)
                        id_cfop_item: prod?.CFOP ?? null,

                        cst_item: icmsGroup?.CST ?? null,
                        csosn_item: icmsGroup?.CSOSN ?? null,

                        cest_item: prod?.CEST ?? null,
                        id_ncm_item: prod?.NCM ?? null,

                        // ===== ICMS (imagem 5)
                        aliquota_icms_item: this.normalizarMoeda(icmsGroup?.pICMS),
                        base_icms_item: this.normalizarMoeda(icmsGroup?.vBC),
                        vlr_icms_item: this.normalizarMoeda(icmsGroup?.vICMS),

                        aliquota_subst_item: this.normalizarMoeda(icmsGroup?.pICMSST),
                        base_icms_subst_item: this.normalizarMoeda(icmsGroup?.vBCST),
                        vlr_icms_subst_item: this.normalizarMoeda(icmsGroup?.vICMSST),

                        // ===== IPI (imagem 5)
                        cst_ipi: ipiGroup?.CST ?? null,
                        cenqipi: imp?.IPI?.cEnq ?? null,
                        aliquota_ipi_item: this.normalizarMoeda(ipiGroup?.pIPI),
                        base_ipi_item: this.normalizarMoeda(ipiGroup?.vBC),
                        vlr_ipi_item: this.normalizarMoeda(ipiGroup?.vIPI),

                        // ===== PIS
                        cst_pis: pisGroup?.CST ?? null,
                        aliquota_pis_item: this.normalizarMoeda(pisGroup?.pPIS),
                        base_pis_item: this.normalizarMoeda(pisGroup?.vBC),
                        vlr_pis_item: this.normalizarMoeda(pisGroup?.vPIS),

                        // ===== COFINS
                        cst_cofins: cofinsGroup?.CST ?? null,
                        aliquota_cofins_item: this.normalizarMoeda(cofinsGroup?.pCOFINS),
                        base_cofins_item: this.normalizarMoeda(cofinsGroup?.vBC),
                        vlr_cofins_item: this.normalizarMoeda(cofinsGroup?.vCOFINS),

                        // ===== Reduções / MVA / modal BC
                        reducao_base_calc: this.normalizarMoeda(icmsGroup?.pRedBC ?? null),
                        aliq_mva: this.normalizarMoeda(icmsGroup?.pMVAST),
                        pmva_item: this.normalizarMoeda(icmsGroup?.pMVAST),

                        mod_bc: icmsGroup?.modBC ?? null,
                        mod_bcst: icmsGroup?.modBCST ?? null,

                        predbc: this.normalizarMoeda(icmsGroup?.pRedBC),
                        predbcst: this.normalizarMoeda(icmsGroup?.pRedBCST),

                        // ===== Incidência
                        incidenciafiscal_item: null,
                        nfe_identificacaoitem: null,

                        // ===== II / Siscomex / AFRMM (no XML geralmente fica em II, aqui deixo safe)
                        aliquota_ii_item: this.normalizarMoeda(imp?.II?.pII ?? 0),
                        base_ii_item: this.normalizarMoeda(imp?.II?.vBC ?? 0),
                        vlr_ii_item: this.normalizarMoeda(imp?.II?.vII ?? 0),
                        vlr_siscomex_item: this.normalizarMoeda(imp?.II?.vDespAdu ?? 0),
                        vlr_afrmm_item: this.normalizarMoeda(imp?.II?.vAFRMM ?? 0),

                        // ===== IBS/CBS (nomes da sua lista)
                        cclasstrib_item: ibscbsNode?.cClassTrib ?? null,
                        cst_cbsibs_item: ibscbsNode?.CST ?? null,

                        base_cbsibs_item: this.normalizarMoeda(gIBSCBS?.vBC ?? null),

                        perc_cbs_item: this.normalizarMoeda(gCBS?.pCBS),
                        vlr_cbs_item: this.normalizarMoeda(gCBS?.vCBS),

                        perc_ibsuf_item: this.normalizarMoeda(gUF?.pIBSUF),
                        vlr_ibsuf_item: this.normalizarMoeda(gUF?.vIBSUF),

                        perc_ibsmun_item: this.normalizarMoeda(gMun?.pIBSMun),
                        vlr_ibsmun_item: this.normalizarMoeda(gMun?.vIBSMun),
                    };
                });

                produtos.value = [...itensPayload];

                // =========================
                // SOMATÓRIOS PARA O FORMS (como você já faz)
                // =========================
                forms.reducao_base_calc = this.normalizarMoeda(
                    itensPayload.reduce((a, i) => a + (Number(i.reducao_base_calc) || 0), 0)
                );

                forms.base_cbsibs = this.normalizarMoeda(
                    itensPayload.reduce((a, i) => a + (Number(i.base_cbsibs_item) || 0), 0)
                );

                forms.vlr_cbs = this.normalizarMoeda(
                    itensPayload.reduce((a, i) => a + (Number(i.vlr_cbs_item) || 0), 0)
                );

                forms.vlr_ibsuf = this.normalizarMoeda(
                    itensPayload.reduce((a, i) => a + (Number(i.vlr_ibsuf_item) || 0), 0)
                );

                forms.vlr_ibsmun = this.normalizarMoeda(
                    itensPayload.reduce((a, i) => a + (Number(i.vlr_ibsmun_item) || 0), 0)
                );
            }

            // ✅ Se você quiser: marcar flags default da devolução
            // forms.gerou_financeiro = "N"
            // forms.gerou_estoque = "N"
        }
    }
});