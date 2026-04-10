-- 9_consulta_rescisao
SELECT DISTINCT
    C.COD_COLIGADA,
    C.NOME_COLIGADA,
--     C.PCODFILIAL,
    C.COD_FILIAL,
    C.NOME_FILIAL,
    C.CHAPA,
    C.NOME_FUNCIONARIO,
--     C.COD_SETOR,
    C.NOME_SETOR,
--     C.COD_CARGO,
    C.NOME_CARGO,
--     C.COD_SEXO,
    C.DESC_SEXO,
--     C.COD_SITUACAO,
    C.DESC_SITUACAO,
--     C.COD_TIPO,
    C.DESC_TIPO,
    C.IDADE,
    CASE
        WHEN C.IDADE < 18 THEN '<18'
        WHEN C.IDADE < 25 THEN '18-24'
        WHEN C.IDADE < 35 THEN '25-34'
        WHEN C.IDADE < 45 THEN '35-44'
        WHEN C.IDADE < 55 THEN '45-54'
        WHEN C.IDADE > 55 THEN '55+'
        ELSE NULL
    END                                                                     AS FAIXA_ETARIA,
    -- ======================================================================
    C.DATA_ADMISSAO,
    C.DATA_DEMISSAO,
    --
    C.TEMPO_TRABALHO_DIAS,
    C.TEMPO_TRABALHO_MESES,
    C.TEMPO_TRABALHO_ANOS,
    C.PAGARCT,
--     C.COD_RECEBIMENTO,
    C.DESC_RECEBIMENTO,
    C.SALARIO,
    C.TIPO_DEMISSAO,
    (
        CASE
            WHEN UPPER(C.TIPO_DEMISSAO) IN (
                'COMUM ACORDO',
                'TERMINO DE CONTRATO DE TRABALHO',
                'INIC.EMPREGADO SEM JUSTA CAUSA'
            ) THEN 'VOLUNTARIA'
            WHEN UPPER(C.TIPO_DEMISSAO) NOT IN (
                'COMUM ACORDO',
                'TERMINO DE CONTRATO DE TRABALHO',
                'INIC.EMPREGADO SEM JUSTA CAUSA'
            ) THEN 'INVOLUNTARIA'
            ELSE NULL
        END
    )                                                                       AS CATEGORIA_DEMISSAO,
    C.ANOCOMP,
    C.MESCOMP,
    C.PERIODO,
--     SUM(C.PROVENTOS) OVER ( PARTITION BY C.COD_COLIGADA, C.COD_FILIAL, C.ANOCOMP, C.MESCOMP, YEAR(DATA_DEMISSAO), MONTH(C.DATA_DEMISSAO)),
--     C.COD_EVENTO_PROGRAMADO,
--     C.DESC_EVENTO_PROGRAMADO,
--     C.VALOR_EVENTO_PROGRAMADO,
--     C.TIPO_EVENTO_PROGRAMADO,
--     C.SEMPREVALIDO,
--     C.REFERENCIA,
--     C.PROVDESCBASE,
--     C.VALOR_PROVENTOS,
--     C.VALOR_DESCONTOS,
    -- Valor de proventos, descontos e líquido mensal, por colaborador
    SUM(
        ISNULL(C.VALOR_PROVENTOS, 0)
    ) OVER (
        PARTITION BY
            C.COD_COLIGADA,
            C.CHAPA,
            C.ANOCOMP,
            C.MESCOMP
    )                                                                       AS PROVENTOS,
    SUM(
        ISNULL(C.VALOR_DESCONTOS, 0)
    ) OVER (
        PARTITION BY
            C.COD_COLIGADA,
            C.CHAPA,
            C.ANOCOMP,
            C.MESCOMP
    )                                                                       AS DESCONTOS,
    (
        SUM(
            ISNULL(C.VALOR_PROVENTOS, 0)
        ) OVER (
            PARTITION BY
                C.COD_COLIGADA,
                C.CHAPA,
                C.ANOCOMP,
                C.MESCOMP
        )
        - SUM(
            ISNULL(C.VALOR_DESCONTOS, 0)
        ) OVER (
            PARTITION BY
                C.COD_COLIGADA,
                C.CHAPA,
                C.ANOCOMP,
                C.MESCOMP
        )
    )                                                                       AS LIQUIDO,
    -- Valor de proventos, descontos e líquido mensal, por filial
    (
        SUM(ISNULL(C.VALOR_PROVENTOS, 0))
            OVER (PARTITION BY C.COD_COLIGADA, C.COD_FILIAL, C.ANOCOMP, C.MESCOMP)
    )                                                                       AS PROVENTOS_FILIAL_MENSAL,
    (
        SUM(ISNULL(C.VALOR_DESCONTOS, 0))
            OVER (PARTITION BY C.COD_COLIGADA, C.COD_FILIAL, C.ANOCOMP, C.MESCOMP)
    )                                                                       AS DESCONTOS_FILIAL_MENSAL,
    (
        SUM(ISNULL(C.VALOR_PROVENTOS, 0))
            OVER (PARTITION BY C.COD_COLIGADA, C.COD_FILIAL, C.ANOCOMP, C.MESCOMP)
        - SUM(ISNULL(C.VALOR_DESCONTOS, 0))
            OVER (PARTITION BY C.COD_COLIGADA, C.COD_FILIAL, C.ANOCOMP, C.MESCOMP)
    )                                                                       AS LIQUIDO_FILIAL
FROM (
    SELECT DISTINCT
        PFUNC.CODCOLIGADA                                                       AS COD_COLIGADA,
        GCOLIGADA.NOMEFANTASIA                                                  AS NOME_COLIGADA,
        PSECAO.CODFILIAL                           								AS COD_FILIAL,
        GFILIAL.NOME															AS NOME_FILIAL,
        PFUNC.CHAPA,
        PFUNC.NOME                                                              AS NOME_FUNCIONARIO,
        PSECAO.DESCRICAO                                                        AS NOME_SETOR,
        PFUNCAO.NOME                                                            AS NOME_CARGO,
        PCODSEXO.DESCRICAO                                                      AS DESC_SEXO,
        PFUNC.CODSITUACAO                                                       AS COD_SITUACAO,
        PCODSITUACAO.DESCRICAO                                                  AS DESC_SITUACAO,
        PTPFUNC.DESCRICAO                                                       AS DESC_TIPO,
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
        -- ======================================================================
        CAST(PFUNC.DATAADMISSAO AS DATE)                                        AS DATA_ADMISSAO,
        CAST(PFUNC.DATADEMISSAO AS DATE)                                        AS DATA_DEMISSAO,
        --
        (
            CASE
                WHEN UPPER(PFUNC.CODSITUACAO) = 'D'
                THEN (
                    DATEDIFF(DAY, PFUNC.DATAADMISSAO, PFUNC.DATADEMISSAO)
                )
            END
        )                                                                       AS TEMPO_TRABALHO_DIAS,
        (
            CASE
                WHEN UPPER(PFUNC.CODSITUACAO) = 'D'
                THEN (
                    DATEDIFF(MONTH, PFUNC.DATAADMISSAO, PFUNC.DATADEMISSAO)
                    - CASE
                        WHEN DATEADD(
                            MONTH, DATEDIFF(MONTH, PFUNC.DATAADMISSAO, PFUNC.DATADEMISSAO), PFUNC.DATAADMISSAO
                            ) > GETDATE()
                        THEN 1
                        ELSE 0
                    END
                )
            END
        ) AS TEMPO_TRABALHO_MESES,
        (
            CASE
                WHEN UPPER(PFUNC.CODSITUACAO) = 'D'
                THEN (
                    DATEDIFF(YEAR, PFUNC.DATAADMISSAO, PFUNC.DATADEMISSAO)
                    - CASE
                        WHEN DATEADD(
                            YEAR, DATEDIFF(YEAR, PFUNC.DATAADMISSAO, PFUNC.DATADEMISSAO), PFUNC.DATAADMISSAO
                            ) > GETDATE()
                        THEN 1
                        ELSE 0
                    END
                )
            END
        ) AS TEMPO_TRABALHO_ANOS,
        --
        CAST(PFUNC.DTPAGTORESCISAO AS DATE)                            AS PAGARCT,
        PCODRECEB.DESCRICAO                                                     AS DESC_RECEBIMENTO,
        /* ----------------------------------------------- */
        PFUNC.SALARIO,
        CASE
            WHEN PFUNC.TIPODEMISSAO = '1' THEN 'Inic.Empregador com justa causa'
            WHEN PFUNC.TIPODEMISSAO = '2' THEN 'Inic.Empregador sem justa causa'
            WHEN PFUNC.TIPODEMISSAO = '3' THEN 'Inic.Empregado com justa causa'
            WHEN PFUNC.TIPODEMISSAO = '4' THEN 'Inic.Empregado sem justa causa'
            WHEN PFUNC.TIPODEMISSAO = '5' THEN 'Transferência sem ônus p/ Cedente'
            WHEN PFUNC.TIPODEMISSAO = '6' THEN 'Transferência com ônus p/ Cedente'
            WHEN PFUNC.TIPODEMISSAO = '7' THEN 'Reforma ou Transf. para Reserva'
            WHEN PFUNC.TIPODEMISSAO = '8' THEN 'Falecimento'
            WHEN PFUNC.TIPODEMISSAO = '9' THEN 'Outros casos'
            WHEN PFUNC.TIPODEMISSAO = 'A' THEN 'Aposentadoria invalidez (ac. trab.)'
            WHEN PFUNC.TIPODEMISSAO = 'B' THEN 'Rescisão determinada pela justica'
            WHEN PFUNC.TIPODEMISSAO = 'C' THEN 'Culpa Recíproca'
            WHEN PFUNC.TIPODEMISSAO = 'D' THEN 'Aposentadoria invalidez (doenca)'
            WHEN PFUNC.TIPODEMISSAO = 'E' THEN 'Aposentadoria especial'
            WHEN PFUNC.TIPODEMISSAO = 'F' THEN 'Falecimento p/ acidente de trabalho'
            WHEN PFUNC.TIPODEMISSAO = 'G' THEN 'Força Maior'
            WHEN PFUNC.TIPODEMISSAO = 'H' THEN 'Exoneração de Cargo Comissionado'
            WHEN PFUNC.TIPODEMISSAO = 'I' THEN 'Apos. p/ Idade com resc. contrato'
            WHEN PFUNC.TIPODEMISSAO = 'J' THEN 'Apos. p/ Idade sem resc. contrato'
            WHEN PFUNC.TIPODEMISSAO = 'M' THEN 'Mudanca de Regime Trabalhista'
            WHEN PFUNC.TIPODEMISSAO = 'N' THEN 'Rescisão Indireta'
            WHEN PFUNC.TIPODEMISSAO = 'O' THEN 'Aposentadoria invalidez (outros)'
            WHEN PFUNC.TIPODEMISSAO = 'P' THEN 'Falecimento p/ doenca profissional'
            WHEN PFUNC.TIPODEMISSAO = 'R' THEN 'Apos. Tempo Serv. c/ Resc. Contrato'
            WHEN PFUNC.TIPODEMISSAO = 'S' THEN 'Apos.tempo servico sem resc.contrato'
            WHEN PFUNC.TIPODEMISSAO = 'T' THEN 'Término de contrato de trabalho'
            WHEN PFUNC.TIPODEMISSAO = 'U' THEN 'Aposentadoria Compulsória'
            WHEN PFUNC.TIPODEMISSAO = 'V' THEN 'Comum acordo'
            WHEN PFUNC.TIPODEMISSAO = 'W' THEN 'Término da Cessão/Requisição'
            WHEN PFUNC.TIPODEMISSAO = 'X' THEN 'Extinção do contrato de trabalho intermitente'
            ELSE 'Tipo de demissão não especificado'
        END                                                                     AS TIPO_DEMISSAO,
        /* ----------------------------------------------- */
        (
            CASE PEVENTO.PROVDESCBASE
                WHEN 'P'    THEN PFFINANC.VALOR
                ELSE NULL
            END
        )   AS VALOR_PROVENTOS,
        (
            CASE PEVENTO.PROVDESCBASE
                WHEN 'D'    THEN PFFINANC.VALOR
                ELSE NULL
            END
        )   AS VALOR_DESCONTOS,
        (
            SELECT CONCAT(PDESCPERIODO.CODINTERNO, ' - ', PDESCPERIODO.DESCRICAO)
            FROM PDESCPERIODO (NOLOCK)
            WHERE PDESCPERIODO.CODINTERNO = PFFINANC.NROPERIODO
        )                                                                       AS PERIODO,
        PEVENTO.PROVDESCBASE,
        PFFINANC.REF                                                            AS REFERENCIA,
        PFFINANC.DTPAGTO,
        PFFINANC.ANOCOMP,
        PFFINANC.MESCOMP,
        PEVENTO.CODIGO                                                          AS COD_EVENTO_PROGRAMADO,
        PEVENTO.DESCRICAO                                                       AS DESC_EVENTO_PROGRAMADO,
        PFFINANC.VALOR                                                          AS VALOR_EVENTO_PROGRAMADO,
        PFEVENTOSPROG.SEMPREVALIDO,
        (
            CASE
                WHEN PEVENTO.CODIGO IN ('0026', '0031', '0780', '0781')
                    THEN 'FGTS rescisório'
                WHEN PEVENTO.CODIGO IN ('0028')
                    THEN 'Multa rescisória'
                WHEN PEVENTO.CODIGO IN ('0498')
                    THEN 'Quebra_Caixa'
                WHEN PEVENTO.CODIGO IN ('0099')
                    THEN 'Gratificação'
                WHEN PEVENTO.CODIGO IN ('0023')
                    THEN 'Periculosidade'
                WHEN PEVENTO.CODIGO IN ('0407')
                    THEN 'Insalubridade'
                WHEN PEVENTO.CODIGO IN ('0150', '0290')
                    THEN 'Líquido de Rescisão'
                ELSE NULL
            END
        )                                                                       AS TIPO_EVENTO_PROGRAMADO
    FROM PFFINANC(NOLOCK)
    INNER JOIN PFUNC(NOLOCK)
        ON PFUNC.CHAPA = PFFINANC.CHAPA
        AND PFUNC.CODCOLIGADA = PFFINANC.CODCOLIGADA
    LEFT JOIN PSECAO(NOLOCK)
        ON PSECAO.CODCOLIGADA = PFUNC.CODCOLIGADA
        AND PSECAO.CODIGO = PFUNC.CODSECAO
    INNER JOIN GFILIAL (NOLOCK)
        ON GFILIAL.CODCOLIGADA = PSECAO.CODCOLIGADA
        AND GFILIAL.CODFILIAL = PSECAO.CODFILIAL
    INNER JOIN GCOLIGADA (NOLOCK)
        ON GCOLIGADA.CODCOLIGADA = GFILIAL.CODCOLIGADA
    INNER JOIN PEVENTO(NOLOCK)
        ON PEVENTO.CODIGO = PFFINANC.CODEVENTO
        AND PEVENTO.CODCOLIGADA = PFFINANC.CODCOLIGADA
    INNER JOIN PFUNCAO(NOLOCK)
        ON PFUNCAO.CODIGO = PFUNC.CODFUNCAO
        AND PFUNCAO.CODCOLIGADA = PFUNC.CODCOLIGADA
    INNER JOIN PCODSITUACAO (NOLOCK)
        ON PCODSITUACAO.CODCLIENTE = PFUNC.CODSITUACAO
    INNER JOIN PPESSOA (NOLOCK)
        ON PFUNC.CODPESSOA = PPESSOA.CODIGO
    INNER JOIN PCODSEXO (NOLOCK)
        ON PPESSOA.SEXO = PCODSEXO.CODCLIENTE
    LEFT JOIN PTPFUNC (NOLOCK)
        ON PFUNC.CODTIPO = PTPFUNC.CODCLIENTE
    LEFT JOIN PCODRECEB (NOLOCK)
        ON PFUNC.CODRECEBIMENTO = PCODRECEB.CODCLIENTE
    LEFT JOIN GBANCO (NOLOCK)
        ON GBANCO.NUMBANCO = PFUNC.CODBANCOPAGTO
    LEFT JOIN PSINDIC (NOLOCK)
        ON PSINDIC.CODCOLIGADA = PFUNC.CODCOLIGADA
        AND PSINDIC.CODIGO = PFUNC.CODSINDICATO
    LEFT JOIN GDEPTO (NOLOCK)
        ON GDEPTO.CODCOLIGADA = PSECAO.CODCOLIGADA
        AND GDEPTO.CODFILIAL = PSECAO.CODFILIAL
        AND GDEPTO.CODDEPARTAMENTO = PSECAO.CODDEPTO
    LEFT JOIN PFEVENTOSPROG (NOLOCK)
        ON PFEVENTOSPROG.CODCOLIGADA = PEVENTO.CODCOLIGADA
        AND PFEVENTOSPROG.CODEVENTO = PEVENTO.CODIGO
        AND PFEVENTOSPROG.CHAPA = PFUNC.CHAPA
    /*
    LEFT JOIN PFRATEIOFIXO
        ON PFRATEIOFIXO.CODCOLIGADA = PFUNC.CODCOLIGADA
        AND PFRATEIOFIXO.CHAPA = PFUNC.CHAPA
    LEFT JOIN PCCUSTO
        ON PFRATEIOFIXO.CODCOLIGADA = PCCUSTO.CODCOLIGADA
        AND PFRATEIOFIXO.CODCCUSTO = PCCUSTO.CODCCUSTO
    */
    /* ----------------------------------------------- */
    WHERE
        PEVENTO.CODIGO != '0290'
        AND (
            PEVENTO.CODIGO != '0099'
            OR (PEVENTO.CODIGO = '0099' AND PFEVENTOSPROG.SEMPREVALIDO = 1)
        )
) C
WHERE
    ISNULL(C.COD_SITUACAO, '') = 'D'
--     AND C.PROVDESCBASE IN ('P', 'D')
    -- '8 - Rescisão':
    AND (
        C.PERIODO LIKE '8%'
        OR (C.PERIODO LIKE '2%' AND C.COD_EVENTO_PROGRAMADO IN (
            -- PROVENTO:
            '0005', '0020', '0023', '0024', '0025', '0039', '0041', '0045', '0048', '0056',
            '0059', '0062', '0071', '0076', '0079', '0083', '0086', '0099', '0105', '0106',
            '0111', '0145', '0146', '0150', '0171', '0173', '0215', '0244', '0270', '0283',
            '0301', '0305', '0407', '0495', '0498', '0526', '0545', '0650', '0652', '0653',
            '0654', '0655', '0666', '0670', '0671', '0692', '0694', '0696', '0697', '0704',
            '0710', '0714', '0731', '0735', '0741', '0745', '0803', '0805', '0809', '0817',
            '0825', '1056', '1087', '1090', '1105', '1124', '1138', '1139', '1698', '9526',
            -- DESCONTO:,
            '0003', '0004', '0008', '0011', '0013', '0021', '0035', '0043', '0051', '0125',
            '0152', '0182', '0201', '0210', '0256', '0480', '0514', '0547', '0570', '0571',
            '0607', '0609', '1017', '1044', '1048', '1114', '1137', '9481', '9482', '9483',
            '9484', '9485', '9730',
            -- BASE:
            '0026', '0027', '0028', '0031', '0033', '0044', '0073', '0078', '0199', '0203',
            '0205', '0207', '0208', '0238', '0250', '0327', '0332', '0369', '0370', '0371',
            '0482', '0483', '0780', '0781', '0873', '0877', '0907', '0909', '1111', '1127',
            '2115'
        ) AND C.DTPAGTO >= C.DATA_DEMISSAO)
    )
    -- Valor do Líquido. Não aparece explícito em todos. Portanto será ignorado e calculado manualmento:
--     AND C.TIPO_EVENTO_PROGRAMADO IS NOT NULL
-- ==================================================
-- dados para a validação
--     AND C.COD_COLIGADA = 1 AND C.COD_FILIAL = 1 AND C.ANOCOMP = '2026' AND C.MESCOMP = '01'
--     AND UPPER(C.CHAPA) = :Chapa
--     AND C.ANOCOMP >= 2025
--     AND C.MESCOMP >= 1
--     AND C.ANOCOMP = :Ano
--     AND C.MESCOMP = :Mes
ORDER BY
    C.ANOCOMP,
    C.MESCOMP,
    C.COD_COLIGADA,
    C.COD_FILIAL,
    C.CHAPA
--     C.PROVDESCBASE DESC

