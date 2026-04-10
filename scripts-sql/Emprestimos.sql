-- 10_consulta_emprestimos
SELECT DISTINCT
--     SUM(C.VALOR_DESCONTADO_FOLHA) OVER (),
    C.COD_COLIGADA_ATUAL,
    C.NOME_COLIGADA_ATUAL,
    C.COD_FILIAL_ATUAL,
    C.NOME_FILIAL_ATUAL,
    C.CHAPA_ATUAL,
    C.COD_COLIGADA_EMPRESTIMO,
    C.NOME_COLIGADA_EMPRESTIMO,
    C.COD_FILIAL_EMPRESTIMO,
    C.NOME_FILIAL_EMPRESTIMO,
    C.CHAPA_EMPRESTIMO,
    C.NOME_FUNCIONARIO,
    C.NOME_SETOR,
--     C.COD_CARGO,
    C.NOME_CARGO,
--     C.COD_SITUACAO,
    C.DESC_SITUACAO,
--     C.COD_SEXO,
    C.DESC_SEXO,
    C.IDADE,
    CASE
        WHEN C.IDADE < 18 THEN '<18'
        WHEN C.IDADE < 25 THEN '18-24'
        WHEN C.IDADE < 35 THEN '25-34'
        WHEN C.IDADE < 45 THEN '35-44'
        WHEN C.IDADE < 55 THEN '45-54'
        WHEN C.IDADE > 55 THEN '55+'
        ELSE NULL
        END                         AS FAIXA_ETARIA,
    -- ======================================================================
    C.DATAADMISSAO,
    C.TEMPO_TRABALHO_DIAS,
    C.TEMPO_TRABALHO_MESES,
    C.TEMPO_TRABALHO_ANOS,
    (
        CASE
            WHEN C.TEMPO_TRABALHO_ANOS < 1 THEN '<1 ano'
            WHEN C.TEMPO_TRABALHO_ANOS < 3 THEN '1-3 anos'
            WHEN C.TEMPO_TRABALHO_ANOS < 5 THEN '3-5 anos'
            WHEN C.TEMPO_TRABALHO_ANOS < 10 THEN '5-10 anos'
            WHEN C.TEMPO_TRABALHO_ANOS > 10 THEN '10+'
            ELSE NULL
            END
        )                                                                       AS TEMPO_EMPRESA,
--     C.TIPOFUNCAO,
    C.DESCRICAOTIPOFUNCAO,
--     C.CODRECEBIMENTO,
    C.DESCRICAORECEBIMENTO,
    C.DATADEMISSAO,
    C.COD_BANCO_CREDOR,
--     Informação obtida no site do FEBRABAN, não foi encontrado correspondência com alguns códigos
    (
        CASE C.COD_BANCO_CREDOR
            WHEN '001'  THEN 'Banco do Brasil S.A.'
            WHEN '003'  THEN 'Banco da Amazônia S.A.'
            WHEN '004'  THEN 'Banco do Nordeste do Brasil S.A.'
            WHEN '007'  THEN 'Banco Nacional de Desenvolvimento Econômico e Social - BNDES'
            WHEN '012'  THEN 'Banco Inbursa S.A.'
            WHEN '014'  THEN 'State Street Brasil S.A. - Banco Comercial'
            WHEN '021'  THEN 'BANESTES S.A. Banco do Estado do Espírito Santo'
            WHEN '024'  THEN 'Banco BANDEPE S.A.'
            WHEN '029'  THEN 'Banco Itaú Consignado S.A.'
            WHEN '033'  THEN 'Banco Santander  (Brasil)  S.A.'
            WHEN '036'  THEN 'Banco Bradesco BBI S.A.'
            WHEN '037'  THEN 'Banco do Estado do Pará S.A.'
            WHEN '040'  THEN 'Banco Cargill S.A.'
            WHEN '041'  THEN 'Banco do Estado do Rio Grande do Sul S.A.'
            WHEN '047'  THEN 'Banco do Estado de Sergipe S.A.'
            WHEN '063'  THEN 'Banco Bradescard S.A.'
            WHEN '065'  THEN 'Banco Andbank (Brasil) S.A.'
            WHEN '066'  THEN 'Banco Morgan Stanley S.A.'
            WHEN '070'  THEN 'BRB - Banco de Brasília S.A.'
            WHEN '074'  THEN 'Banco J. Safra S.A.'
            WHEN '077'  THEN 'Banco Inter S.A.'
            WHEN '079'  THEN 'Banco Original do Agronegócio S.A.'
            WHEN '082'  THEN 'Banco Topázio S.A.'
            WHEN '094'  THEN 'Banco Finaxis S.A.'
            WHEN '095'  THEN 'Banco Travelex S.A.'
            WHEN '096'  THEN 'Banco B3 S.A.'
            WHEN '104'  THEN 'Caixa Econômica Federal'
            WHEN '107'  THEN 'Banco BOCOM BBM S.A.'
            WHEN '119'  THEN 'Banco Western Union do Brasil S.A.'
            WHEN '120'  THEN 'Banco Rodobens S.A.'
            WHEN '121'  THEN 'Banco Agibank S.A.'
            WHEN '125'  THEN 'Banco Genial S.A.'
            WHEN '128'  THEN 'Braza Bank S.A. Banco de Câmbio'
            WHEN '129'  THEN 'UBS Brasil Banco de Investimento S.A.'
            WHEN '144'  THEN 'Ebury Banco de Câmbio S.A.'
            WHEN '208'  THEN 'Banco BTG Pactual S.A.'
            WHEN '212'  THEN 'Banco Original S.A.'
            WHEN '217'  THEN 'Banco John Deere S.A.'
            WHEN '218'  THEN 'Banco BS2 S.A.'
            WHEN '222'  THEN 'Banco Credit Agricole Brasil S.A.'
            WHEN '224'  THEN 'Banco Fibra S.A.'
            WHEN '233'  THEN 'Banco BMG Soluções Financeiras S.A.'
            WHEN '237'  THEN 'Banco Bradesco S.A.'
            WHEN '246'  THEN 'Banco ABC Brasil S.A.'
            WHEN '249'  THEN 'Banco Investcred Unibanco S.A.'
            WHEN '254'  THEN 'Paraná Banco S.A.'
            WHEN '269'  THEN 'Banco HSBC S.A.'
            WHEN '276'  THEN 'Banco Senff S.A.'
            WHEN '318'  THEN 'Banco BMG S.A.'
            WHEN '320'  THEN 'Bank Of China (Brasil) Banco Múltiplo S.A.'
            WHEN '329'  THEN 'QI SOCIEDADE DE CREDITO DIRETO S.A.'
            WHEN '335'  THEN 'Banco Digio S.A.'
            WHEN '336'  THEN 'Banco C6 S.A.'
            WHEN '341'  THEN 'Itaú Unibanco S.A.'
            WHEN '342'  THEN 'Creditas Sociedade de Crédito Direto S.A.'
            WHEN '348'  THEN 'Banco XP S.A.'
            WHEN '366'  THEN 'Banco Société Générale Brasil S.A.'
            WHEN '368'  THEN 'Banco CSF S.A.'
            WHEN '370'  THEN 'Banco Mizuho do Brasil S.A.'
            WHEN '373'  THEN 'UP.P Sociedade de Empréstimo Entre Pessoas S.A.'
            WHEN '376'  THEN 'Banco J. P. Morgan S.A.'
            WHEN '386'  THEN 'Nu Financeira S.A.'
            WHEN '389'  THEN 'Banco Mercantil do Brasil S.A.'
            WHEN '394'  THEN 'Banco Bradesco Financiamentos S.A.'
            WHEN '399'  THEN 'Kirton Bank S.A. - Banco Múltiplo'
            WHEN '418'  THEN 'Zipidin Soluções Digitais Sociedade de Crédito Direto S.A.'
            WHEN '422'  THEN 'Banco Safra S.A.'
            WHEN '426'  THEN 'NEON FINANCEIRA - SCFI S.A.'
            WHEN '456'  THEN 'Banco MUFG Brasil S.A.'
            WHEN '464'  THEN 'Banco Sumitomo Mitsui Brasileiro S.A.'
            WHEN '473'  THEN 'Banco Caixa Geral - Brasil S.A.'
            WHEN '477'  THEN 'Citibank N.A.'
            WHEN '479'  THEN 'Banco ItauBank S.A'
            WHEN '487'  THEN 'Deutsche Bank S.A. - Banco Alemão'
            WHEN '488'  THEN 'JPMorgan Chase Bank, National Association'
            WHEN '496'  THEN 'BBVA Brasil Banco de Investimento S.A.'
            WHEN '505'  THEN 'Banco UBS (Brasil) S.A.'
            WHEN '531'  THEN 'BMP SOCIEDADE DE CRÉDITO DIRETO S.A'
            WHEN '555'  THEN 'PAN FINANCEIRA S.A.'
            WHEN '600'  THEN 'Banco Luso Brasileiro S.A.'
            WHEN '604'  THEN 'Banco Industrial do Brasil S.A.'
            WHEN '610'  THEN 'Banco VR S.A.'
            WHEN '611'  THEN 'Banco Paulista S.A.'
            WHEN '612'  THEN 'Banco Guanabara S.A.'
            WHEN '623'  THEN 'Banco PAN S.A.'
            WHEN '626'  THEN 'Banco C6 Consignado S.A.'
            WHEN '633'  THEN 'Banco Rendimento S.A.'
            WHEN '634'  THEN 'Banco Triângulo S.A.'
            WHEN '643'  THEN 'Banco Pine S.A.'
            WHEN '644'  THEN '321 SOCIEDADE DE CRÉDITO DIRETO S.A.'
            WHEN '654'  THEN 'Banco Digimais S.A.'
            WHEN '655'  THEN 'Banco Votorantim S.A.'
            WHEN '668'  THEN 'VIA CAPITAL - SOCIEDADE DE CRÉDITO DIRETO S.A.'
            WHEN '707'  THEN 'Banco Daycoval S.A.'
            WHEN '712'  THEN 'Ouribank S.A. Banco Múltiplo'
            WHEN '741'  THEN 'Banco Ribeirão Preto S.A.'
            WHEN '743'  THEN 'Banco Semear S.A.'
            WHEN '745'  THEN 'Banco Citibank S.A.'
            WHEN '747'  THEN 'Banco Rabobank International Brasil S.A.'
            WHEN '748'  THEN 'Banco Cooperativo Sicredi S.A.'
            WHEN '751'  THEN 'Scotiabank Brasil S.A. Banco Múltiplo'
            WHEN '752'  THEN 'Banco BNP Paribas Brasil S.A.'
            WHEN '755'  THEN 'Bank of America Merrill Lynch Banco Múltiplo S.A.'
            WHEN '756'  THEN 'Banco Cooperativo Sicoob S.A.'
            WHEN '903'  THEN 'BANCO INTER S.A.'
            WHEN '908'  THEN 'PARATI CFI S.A.'
            WHEN '935'  THEN 'FACTA FINANCEIRA S.A.'
            ELSE '--'
        END
    )                                                                       AS DESC_BANCO_CREDOR,
    C.CODEVENTO,
    C.COD_EVENTO,
    C.DESCRICAOEVENTO,
--     C.CODEMPRESTIMO,
    C.DATAEMPRESTIMO,
    C.VALOR_EMPRESTIMO,
    C.NROPARCELAS,
    C.DATA_PAGAMENTO,
    C.ANOCOMP,
    C.MESCOMP,
    C.NROPERIODO,
    C.VALOR_PARCELA,
    C.VALOR_ORIGINAL_FOLHA,
    C.VALOR_DESCONTADO_FOLHA,
    C.NROPARCPAGAS,
    C.PERIODICIDADE,
    C.SALDODEVEDOR,
    C.INICIODESCONTO,
    C.FINALDESCONTO,
--     C.TIPOEMPRESTIMO
    C.DESCRICAOTIPOEMPRESTIMO
--     COUNT(DISTINCT C.CHAPA)

--     C.NOME_FUNCIONARIO
FROM (
    SELECT DISTINCT
        PFUNC.CODCOLIGADA                                                       AS COD_COLIGADA_ATUAL,
        GCOLIGADA.NOMEFANTASIA                                                  AS NOME_COLIGADA_ATUAL,
--         PFUNC.CODFILIAL                                                         AS PCODFILIAL,
        PSECAO.CODFILIAL                           								AS COD_FILIAL_ATUAL,
        FILIAL_VALIDA.CODFILIAL                                                 AS COD_FILIALVALIDA,
        GFILIAL.NOME															AS NOME_FILIAL_ATUAL,
        COLIGADA_FILIAL_EMPRESTIMO.CODCOLIGADA                                           AS COD_COLIGADA_EMPRESTIMO,
        COLIGADA_FILIAL_EMPRESTIMO.NOME_COLIGADA                                         AS NOME_COLIGADA_EMPRESTIMO,
        COLIGADA_FILIAL_EMPRESTIMO.CODFILIAL                                             AS COD_FILIAL_EMPRESTIMO,
        COLIGADA_FILIAL_EMPRESTIMO.NOME_FILIAL                                           AS NOME_FILIAL_EMPRESTIMO,
        PFUNC.CHAPA                                                             AS CHAPA_ATUAL,
        COLIGADA_FILIAL_EMPRESTIMO.CHAPA                                                 AS CHAPA_EMPRESTIMO,
        PPESSOA.CPF,
        PFUNC.CODPESSOA                                                         AS COD_FUNCIONARIO,
        PFUNC.NOME                                                              AS NOME_FUNCIONARIO,
        PFUNC.CODSECAO                                                          AS COD_SETOR,
        PSECAO.DESCRICAO                                                        AS NOME_SETOR,
        PFUNCAO.CODIGO                                                          AS COD_CARGO,
        PFUNCAO.NOME                                                            AS NOME_CARGO,
        PFUNC.CODSITUACAO                                                       AS COD_SITUACAO,
        PCODSITUACAO.DESCRICAO                                                  AS DESC_SITUACAO,
        PPESSOA.SEXO                                                            AS COD_SEXO,
        PCODSEXO.DESCRICAO                                                      AS DESC_SEXO,
        (
            DATEDIFF(YY, PPESSOA.DTNASCIMENTO, GETDATE())
            - (
                CASE
                    WHEN
                        (DATEPART(M, PPESSOA.DTNASCIMENTO) > DATEPART(M, GETDATE()))
                        OR (DATEPART(M, PPESSOA.DTNASCIMENTO) = DATEPART(M, GETDATE())
                        AND DATEPART(D, PPESSOA.DTNASCIMENTO) > DATEPART(D, GETDATE()))
                    THEN 1
                    ELSE 0
                END
            )
        )                                                                       AS IDADE,
        (
            CASE
                WHEN UPPER(PFUNC.CODSITUACAO) != 'D'
                THEN (
                    DATEDIFF(DAY, PFUNC.DATAADMISSAO, GETDATE())
                )
            END
        )                                                                       AS TEMPO_TRABALHO_DIAS,
        (
            CASE
                WHEN UPPER(PFUNC.CODSITUACAO) != 'D'
                THEN (
                    DATEDIFF(MONTH, PFUNC.DATAADMISSAO, GETDATE())
                    - CASE
                        WHEN DATEADD(
                            MONTH, DATEDIFF(MONTH, PFUNC.DATAADMISSAO, GETDATE()), PFUNC.DATAADMISSAO
                            ) > GETDATE()
                        THEN 1
                        ELSE 0
                    END
                )
            END
        )                                                                       AS TEMPO_TRABALHO_MESES,
        (
            CASE
                WHEN UPPER(PFUNC.CODSITUACAO) != 'D'
                THEN (
                    DATEDIFF(YEAR, PFUNC.DATAADMISSAO, GETDATE())
                    - CASE
                        WHEN DATEADD(
                            YEAR, DATEDIFF(YEAR, PFUNC.DATAADMISSAO, GETDATE()), PFUNC.DATAADMISSAO
                            ) > GETDATE()
                        THEN 1
                        ELSE 0
                    END
                )
            END
        )                                                                       AS TEMPO_TRABALHO_ANOS,
         -- ======================================================================
        CAST(PFUNC.DATAADMISSAO AS DATE)                                        AS DATAADMISSAO,
        PFUNC.CODTIPO                                                           AS TIPOFUNCAO,
        PTPFUNC.DESCRICAO                                                       AS DESCRICAOTIPOFUNCAO,
        PFUNC.CODRECEBIMENTO,
        PCODRECEB.DESCRICAO                                                     AS DESCRICAORECEBIMENTO,
        CAST(PFUNC.DATADEMISSAO AS DATE)                                        AS DATADEMISSAO,
        PFFINANC.CODEVENTO,
        PEVENTO.CODIGO AS COD_EVENTO,
        PEVENTO.DESCRICAO       AS DESCRICAOEVENTO,
        CAST(PFEMPRT.DTEMPRESTIMO AS DATE)                                      AS DATAEMPRESTIMO,
        PFEMPRT.VALORORIGINAL                                                   as VALOR_EMPRESTIMO,
        PFEMPRT.NROPARCELAS,
        PFEMPRT.NROPARCPAGAS,
        PFEMPRT.PERIODICIDADE,
        PFFINANC.DTPAGTO                                                        AS DATA_PAGAMENTO,
        PFFINANC.ANOCOMP,
        PFFINANC.MESCOMP,
--         PFEMPRT.ANOCOMPATUAL,
--         PFEMPRT.MESCOMPATUAL,
        PFFINANC.NROPERIODO,
        PFEMPRT.PARCEMPRCREDTRAB                                                AS VALOR_PARCELA,
        PFFINANC.VALORORIGINAL                                                  AS VALOR_ORIGINAL_FOLHA,
        PFFINANC.VALOR                                                          AS VALOR_DESCONTADO_FOLHA,
        PFEMPRT.SALDODEVEDOR,
        PFEMPRT.MATINSTCONS                                                     AS COD_BANCO_CREDOR,
        CAST(PFEMPRT.INICIODESCONTO AS DATE)                                    AS INICIODESCONTO,
        CAST(PFEMPRT.FINALDESCONTO AS DATE)                                     AS FINALDESCONTO,
--         PFEMPRT.TIPOEMPRESTIMO
        PCODEMPRT.DESCRICAO                                                     AS DESCRICAOTIPOEMPRESTIMO
    FROM PFUNC (NOLOCK)
    INNER JOIN PSECAO (NOLOCK)
        ON PFUNC.CODCOLIGADA = PSECAO.CODCOLIGADA
        AND PFUNC.CODSECAO = PSECAO.CODIGO
    --     LEFT JOIN PCCUSTO
    --         ON PSECAO.CODCOLIGADA = PCCUSTO.CODCOLIGADA
    --         AND PSECAO.NROCENCUSTOCONT = PCCUSTO.CODCCUSTO
    INNER JOIN GFILIAL (NOLOCK)
        ON GFILIAL.CODCOLIGADA = PSECAO.CODCOLIGADA
        AND GFILIAL.CODFILIAL = PSECAO.CODFILIAL
    INNER JOIN GCOLIGADA (NOLOCK)
        ON GCOLIGADA.CODCOLIGADA = GFILIAL.CODCOLIGADA
    INNER JOIN PFUNCAO (NOLOCK)
        ON PFUNC.CODCOLIGADA = PFUNCAO.CODCOLIGADA
        AND PFUNC.CODFUNCAO = PFUNCAO.CODIGO
    INNER JOIN PCODSITUACAO (NOLOCK)
        ON PCODSITUACAO.CODCLIENTE = PFUNC.CODSITUACAO
    INNER JOIN PPESSOA (NOLOCK)
        ON PFUNC.CODPESSOA = PPESSOA.CODIGO
    INNER JOIN PCODSEXO (NOLOCK)
        ON PPESSOA.SEXO = PCODSEXO.CODCLIENTE
    INNER JOIN PTPFUNC (NOLOCK)
        ON PFUNC.CODTIPO = PTPFUNC.CODCLIENTE
    INNER JOIN PCODRECEB (NOLOCK)
        ON PFUNC.CODRECEBIMENTO = PCODRECEB.CODCLIENTE
    LEFT JOIN GBANCO (NOLOCK)
        ON GBANCO.NUMBANCO = PFUNC.CODBANCOPAGTO
    LEFT JOIN PFFINANC (NOLOCK)
        ON PFFINANC.CODCOLIGADA = PFUNC.CODCOLIGADA
        AND PFFINANC.CHAPA = PFUNC.CHAPA
    INNER JOIN PEVENTO (NOLOCK)
        ON PEVENTO.CODCOLIGADA = PFUNC.CODCOLIGADA
        AND PEVENTO.CODIGO = PFFINANC.CODEVENTO
--     LEFT JOIN GFORMULA (NOLOCK)
--         ON GFORMULA.CODCOLIGADA = PFUNC.CODCOLIGADA
--         AND GFORMULA.CODIGO = PFUNC.CODFORMLANC
--         AND GFORMULA.APLICACAO = 'P'
    LEFT JOIN PFEMPRT (NOLOCK)
        ON PFEMPRT.CODCOLIGADA = PFFINANC.CODCOLIGADA
        AND PFEMPRT.CHAPA = PFFINANC.CHAPA
--         AND PFEMPRT.PARCEMPRCREDTRAB = PFFINANC.VALOR
        AND PFEMPRT.CODEVENTO = PEVENTO.CODIGO
        AND (
            YEAR(PFEMPRT.FINALDESCONTO) > PFFINANC.ANOCOMP
            OR (YEAR(PFEMPRT.FINALDESCONTO) = PFFINANC.ANOCOMP AND MONTH(PFEMPRT.FINALDESCONTO) >= PFFINANC.MESCOMP)
        )
        AND (
            YEAR(PFEMPRT.INICIODESCONTO) < PFFINANC.ANOCOMP
            OR (YEAR(PFEMPRT.INICIODESCONTO) = PFFINANC.ANOCOMP AND MONTH(PFEMPRT.INICIODESCONTO) <= PFFINANC.MESCOMP)
        )
    LEFT JOIN PCODEMPRT (NOLOCK)
        ON PCODEMPRT.CODCOLIGADA = PFEMPRT.CODCOLIGADA
        AND PCODEMPRT.CODCLIENTE = PFEMPRT.TIPOEMPRESTIMO
    OUTER APPLY (
        SELECT TOP 1
            PF.CODCOLIGADA,
            PF.CODFILIAL,
            PF.CODPESSOA,
            PP.CPF,
            PF.CODSITUACAO
        FROM PFUNC PF (NOLOCK)
        INNER JOIN PPESSOA PP(NOLOCK)
            ON PP.CODIGO = PF.CODPESSOA
        WHERE
            PF.CODCOLIGADA = PFUNC.CODCOLIGADA
            AND PP.CPF = PPESSOA.CPF
        ORDER BY
            CASE
                WHEN UPPER(PF.CODSITUACAO) = 'A' THEN 1
                WHEN UPPER(PF.CODSITUACAO) = 'D' THEN 3
                ELSE 2
            END,
            PF.DATADEMISSAO DESC
    ) AS FILIAL_VALIDA
    OUTER APPLY (
        SELECT TOP 1
            GC.NOME AS NOME_COLIGADA,
            GF.NOME AS NOME_FILIAL,
            PF.*
        FROM PFUNC PF (NOLOCK)
        INNER JOIN GFILIAL GF (NOLOCK)
            ON GF.CODCOLIGADA = PF.CODCOLIGADA
            AND GF.CODFILIAL = PF.CODFILIAL
        INNER JOIN GCOLIGADA GC (NOLOCK)
            ON GC.CODCOLIGADA = PF.CODCOLIGADA
        INNER JOIN PPESSOA PP (NOLOCK)
            ON PP.CODIGO = PF.CODPESSOA
        INNER JOIN PFHSTSIT PHS (NOLOCK)
            ON PHS.CODCOLIGADA = PF.CODCOLIGADA
            AND PHS.CHAPA = PF.CHAPA
        WHERE
            PP.CPF = PPESSOA.CPF
            AND PHS.DATAMUDANCA <= PFFINANC.DTPAGTO
        ORDER BY PHS.DATAMUDANCA DESC
    ) AS COLIGADA_FILIAL_EMPRESTIMO
) C
WHERE
    C.COD_FILIAL_ATUAL = C.COD_FILIALVALIDA
    AND C.CODEVENTO IN ('0480', '9481', '9482', '9483', '9484', '9485', '9486', '9487', '9488')
--     AND C.COD_COLIGADA = :coligada AND C.ANOCOMP = :anocomp AND C.MESCOMP = :mescomp
ORDER BY
    C.ANOCOMP DESC,
    C.MESCOMP DESC,
    C.COD_COLIGADA_ATUAL,
    C.COD_FILIAL_ATUAL,
    C.CHAPA_ATUAL,
--     C.CODEMPRESTIMO,
    C.DATAEMPRESTIMO DESC