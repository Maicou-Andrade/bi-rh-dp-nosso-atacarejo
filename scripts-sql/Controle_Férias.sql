-- ======================================================================
-- TESTE01:
--      PROBLEMA: Colaboradores tranferidos estão com dados duplicados
--      em todas as filiais que eles aparecem
--
--      SOLUÇÃO: Verifica em qual filial o colaborador estava durante
--      as férias.
--
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
        END                                                                     AS FAIXA_ETARIA,
    -- ======================================================================
    C.DATA_ADMISSAO,
    C.DATA_DEMISSAO,
    C.INICIO_PER_AQUISITIVO,
    C.FIM_PER_AQUISITIVO,
    C.LIMITE_FERIAS,
    C.STATUS_PER_AQUISITVO,
    C.DATA_PAGAMENTO,
    C.DATA_INICIO_FERIAS,
    C.DATA_FIM_FERIAS,
    C.DIAS_GOZO,
    C.DIAS_ABONO,
    C.SALDO_FERIAS,
    C.SALARIO_BASE_PFUNC,
    C.SALARIO_BASE,
    C.ANOCOMP,
    C.MESCOMP,
--     C.COD_EVENTO_PFF,
--     C.COD_EVENTO,
--     C.DESC_EVENTO,
--     C.PROVDESCBASE,
--     C.PROVENTO,
--     C.DESCONTO,
    SUM(
            CASE C.PROVDESCBASE
                WHEN 'P' THEN C.VALOR
                ELSE 0
                END
    ) OVER (
                PARTITION BY
                C.COD_COLIGADA,
                C.COD_FILIAL,
                C.CHAPA,
                C.ANOCOMP,
                C.MESCOMP
                )                                                                       AS TOTAL_PROVENTOS,
    SUM(
            CASE C.PROVDESCBASE
                WHEN 'D' THEN C.VALOR
                ELSE 0
                END
    ) OVER (
                PARTITION BY
                C.COD_COLIGADA,
                C.COD_FILIAL,
                C.CHAPA,
                C.ANOCOMP,
                C.MESCOMP
                )                                                                       AS TOTAL_DESCONTOS,
--     C.TOTAL_PROVENTOS,
--     C.TOTAL_DESCONTOS,
    C.LIQUIDO_FERIAS,
    C.IRRF,
--     C.COD_EVENTO_PROGRAMADO,
--     C.NOME_EVENTO_PROGRAMADO,
--     C.VALOR_EVENTO_PROGRAMADO,
    C.STATUS,
    C.TEMPO_TRABALHO_DIAS,
    C.TEMPO_TRABALHO_MESES,
    C.TEMPO_TRABALHO_ANOS,
    (
        CAST(C.TEMPO_TRABALHO_ANOS AS VARCHAR) +  'a '
            + CAST((C.TEMPO_TRABALHO_MESES%12) AS VARCHAR) + 'm'
        )                                                                       AS TEMPO_EMPRESA
FROM (
    SELECT DISTINCT
        GCOLIGADA.CODCOLIGADA                                                   AS COD_COLIGADA,
        GCOLIGADA.NOMEFANTASIA                                                  AS NOME_COLIGADA,
        --     PFUNC.CODFILIAL                                                         AS PCODFILIAL,
        PSECAO.CODFILIAL                           								AS COD_FILIAL,
        FILIAL_VALIDA.CODFILIAL,
        GFILIAL.NOME															AS NOME_FILIAL,
        PFUNC.CHAPA                                                             AS CHAPA,
        --     PFUNC.CODPESSOA                                                         AS COD_FUNCIONARIO,
        PFUNC.NOME                                                              AS NOME_FUNCIONARIO,
        PFUNC.CODSITUACAO                                                       AS COD_SITUACAO,
        PCODSITUACAO.DESCRICAO                                                  AS DESC_SITUACAO,
        PFUNC.CODSECAO                                                          AS COD_SETOR,
        PSECAO.DESCRICAO                                                        AS NOME_SETOR,
        PFUNCAO.CODIGO                                                          AS COD_CARGO,
        PFUNCAO.NOME                                                            AS NOME_CARGO,
        PPESSOA.SEXO                                                            AS COD_SEXO,
        PCODSEXO.DESCRICAO                                                      AS DESC_SEXO,
        CAST(PFUNC.DATAADMISSAO AS DATE)                                        AS DATA_ADMISSAO,
        CAST(PFUNC.DATADEMISSAO AS DATE)                                        AS DATA_DEMISSAO,
        PPESSOA.CPF                                                             AS CPF,
        CAST(PFUFERIAS.INICIOPERAQUIS AS DATE)                                  AS INICIO_PER_AQUISITIVO,
        CAST(PFUFERIAS.FIMPERAQUIS AS DATE)                                     AS FIM_PER_AQUISITIVO,
        (CAST((
            DATEADD(YEAR, 1, PFUFERIAS.FIMPERAQUIS)
            ) AS DATE))                                                             AS LIMITE_FERIAS,
        CASE
            WHEN PFUFERIAS.PERIODOABERTO = 1 THEN 'Periodo Aberto'
            WHEN PFUFERIAS.PERIODOABERTO = 0 THEN 'Periodo Fechado'
            END                                                                     AS STATUS_PER_AQUISITVO,
        CAST(PFUFERIASRECIBO.DATAPAGTO AS DATE)                                    AS DATA_PAGAMENTO,
        CAST(PFUFERIASPER.DATAINICIO AS DATE)                                   AS DATA_INICIO_FERIAS,
        CAST(PFUFERIASPER.DATAFIM AS DATE)                                      AS DATA_FIM_FERIAS,
        PFUFERIASPER.NRODIASFERIAS                                              AS DIAS_GOZO,
        PFUFERIASPER.NRODIASABONO                                               AS DIAS_ABONO,
        SALDOFERIAS.SALDO_FERIAS,
        PFUNC.SALARIO                                                           AS SALARIO_BASE_PFUNC,
        ISNULL(SAL_MENOR.SALARIO_BASE, SAL_MAIOR.SALARIO_BASE)                  AS SALARIO_BASE,
        PFUFERIASRECIBO.LIQUIDO                                                 AS LIQUIDO_FERIAS,
        PFUFERIASRECIBO.IRRF                                                    AS IRRF,
        PFFINANC.CODEVENTO      AS COD_EVENTO_PFF,
        PEVENTO.CODIGO      AS COD_EVENTO,
        PEVENTO.DESCRICAO   AS DESC_EVENTO,
        PEVENTO.PROVDESCBASE,
        PFFINANC.VALOR,
        (
            CASE PEVENTO.PROVDESCBASE
                WHEN 'P' THEN PFFINANC.VALOR
                ELSE NULL
                END
        )   AS PROVENTO,
        (
            CASE PEVENTO.PROVDESCBASE
                WHEN 'D' THEN PFFINANC.VALOR
                ELSE NULL
                END
        )   AS DESCONTO,
        PFFINANC.ANOCOMP,
        PFFINANC.MESCOMP,
             --         Sum(
             --             CASE
             --                 WHEN PEVENTO.CODIGOCALCULO = 30 THEN PFUFERIASVERBAS.VALOR
             --             END
             --         )                                                                       AS IRRF,
        CASE PFUFERIASPER.SITUACAOFERIAS
            WHEN 'D' THEN 'D - AGUARDANDO APROVAÇÃO DP'
            WHEN 'G' THEN 'G - AGUARDANDO APROVAÇÃO GESTOR'
            WHEN 'M' THEN 'M - MARCADAS'
            WHEN 'P' THEN 'P - PAGAS'
            WHEN 'F' THEN 'F - FINALIZADAS'
            WHEN 'X' THEN 'Z - FINALIZADA PROX MES'
        END                                                                     AS STATUS,
        --
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
        --
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
            )                                                                       AS IDADE
        --
    FROM PFUFERIAS (NOLOCK)
    -- ========== DADOS FUNCIONÁRIO ==========
    INNER JOIN PFUNC (NOLOCK)
        ON PFUNC.CODCOLIGADA = PFUFERIAS.CODCOLIGADA
        AND PFUNC.CHAPA = PFUFERIAS.CHAPA
    INNER JOIN PPESSOA (NOLOCK)
         ON PPESSOA.CODIGO = PFUNC.CODPESSOA
    INNER JOIN GCOLIGADA (NOLOCK)
        ON GCOLIGADA.CODCOLIGADA = PFUNC.CODCOLIGADA
    INNER JOIN PCODSITUACAO (NOLOCK)
        ON PFUNC.CODSITUACAO = PCODSITUACAO.CODCLIENTE
    INNER JOIN PCODSEXO
        ON PPESSOA.SEXO = PCODSEXO.CODCLIENTE
    INNER JOIN GFILIAL (NOLOCK)
        ON GFILIAL.CODCOLIGADA = PFUNC.CODCOLIGADA
        AND GFILIAL.CODFILIAL = PFUNC.CODFILIAL
    INNER JOIN PFUNCAO (NOLOCK)
        ON PFUNCAO.CODCOLIGADA = PFUNC.CODCOLIGADA
        AND PFUNCAO.CODIGO = PFUNC.CODFUNCAO
    INNER JOIN PSECAO (NOLOCK)
        ON PSECAO.CODCOLIGADA = PFUNC.CODCOLIGADA
        AND PSECAO.CODIGO = PFUNC.CODSECAO
     -- ========== DADOS FERIAS ==========
    INNER JOIN PFUFERIASRECIBO (NOLOCK)
        ON PFUFERIASRECIBO.CODCOLIGADA = PFUFERIAS.CODCOLIGADA
        AND PFUFERIASRECIBO.CHAPA = PFUFERIAS.CHAPA
        AND PFUFERIASRECIBO.FIMPERAQUIS = PFUFERIAS.FIMPERAQUIS
    LEFT JOIN PFFINANC (NOLOCK)
        ON PFFINANC.CODCOLIGADA = PFUFERIAS.CODCOLIGADA
        AND PFFINANC.CHAPA = PFUFERIAS.CHAPA
        AND PFFINANC.DTPAGTO BETWEEN
            DATEADD(DAY, -10, PFUFERIASRECIBO.DATAPAGTO)
            AND DATEADD(DAY, 2, PFUFERIASRECIBO.DATAPAGTO)
    LEFT JOIN (
         -- Elimina duplicações em caso de transferência
        SELECT DISTINCT
            PF.CODFILIAL,
            PHS.DATAMUDANCA, PHS.NOVASITUACAO,
            PFP.*
        FROM PFHSTSIT PHS (NOLOCK)
        INNER JOIN PFUNC PF (NOLOCK)
             ON PHS.CODCOLIGADA = PF.CODCOLIGADA
             AND PHS.CHAPA = PF.CHAPA
        INNER JOIN PFUFERIASPER PFP (NOLOCK)
             ON PFP.CODCOLIGADA = PF.CODCOLIGADA
             AND PFP.CHAPA = PF.CHAPA
             AND PFP.DATAINICIO = PHS.DATAMUDANCA
         WHERE NOVASITUACAO = 'F'
    ) PFUFERIASPER
        ON PFUFERIASPER.CODCOLIGADA = PFUFERIAS.CODCOLIGADA
        AND PFUFERIASPER.CHAPA = PFUFERIAS.CHAPA
        AND PFUFERIASPER.FIMPERAQUIS = PFUFERIAS.FIMPERAQUIS
        AND PFUFERIASPER.DATAPAGTO = PFUFERIASRECIBO.DATAPAGTO
--         AND PFFINANC.DTPAGTO BETWEEN
--             DATEADD(DAY, -10, PFUFERIASPER.DATAPAGTO)
--             AND DATEADD(DAY, 2, PFUFERIASPER.DATAPAGTO)
    LEFT JOIN (
        SELECT
            PFU.CODCOLIGADA, PFU.CHAPA, PFU.DATAINICIO, PFU.FIMPERAQUIS, PFU.NRODIASFERIAS, PFU.NRODIASABONO,
            (
                30 - SUM(
                    PFU.NRODIASFERIAS
                    + PFU.NRODIASABONO
                ) OVER (
                    PARTITION BY
                        PFU.CODCOLIGADA,
                        PFU.CHAPA,
                        PFU.FIMPERAQUIS
                    ORDER BY
                        PFU.DATAINICIO
                        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
                )
            )       AS SALDO_FERIAS
        FROM PFUFERIASPER PFU
    ) AS SALDOFERIAS
        ON SALDOFERIAS.CODCOLIGADA = PFUFERIASPER.CODCOLIGADA
        AND SALDOFERIAS.CHAPA = PFUFERIASPER.CHAPA
        AND SALDOFERIAS.FIMPERAQUIS = PFUFERIAS.FIMPERAQUIS
--         AND PFFINANC.DTPAGTO BETWEEN
--             DATEADD(DAY, -10, PFUFERIASRECIBO.DATAPAGTO)
--             AND DATEADD(DAY, 2, PFUFERIASRECIBO.DATAPAGTO)
        AND SALDOFERIAS.DATAINICIO = PFUFERIASPER.DATAINICIO
-- --     -- ========== DADOS DE EVENTO ==========
    LEFT JOIN PEVENTO (NOLOCK)
        ON PEVENTO.CODCOLIGADA = PFUFERIAS.CODCOLIGADA
        AND PEVENTO.CODIGO = PFFINANC.CODEVENTO
    OUTER APPLY (
        SELECT TOP 1
            PFHSTSAL.SALARIO AS SALARIO_BASE
        FROM PFHSTSAL (NOLOCK)
        WHERE
            PFHSTSAL.CODCOLIGADA = PFUFERIASRECIBO.CODCOLIGADA
            AND PFHSTSAL.CHAPA = PFUFERIASRECIBO.CHAPA
            /*AND CONVERT(varchar, CAST(PFHSTSAL.DTMUDANCA AS DATE), 103) <=  CONVERT(varchar, CAST(PFUFERIASRECIBO.DATAPAGTO AS DATE), 103) */
            AND PFHSTSAL.DTMUDANCA <= PFUFERIASRECIBO.DATAPAGTO
        ORDER BY PFHSTSAL.DTMUDANCA DESC
    ) AS SAL_MENOR
    OUTER APPLY (
        SELECT TOP 1
            PFHSTSAL.SALARIO AS SALARIO_BASE
        FROM PFHSTSAL (NOLOCK)
        WHERE
            PFHSTSAL.CODCOLIGADA = PFUFERIAS.CODCOLIGADA
            AND PFHSTSAL.CHAPA = PFUFERIAS.CHAPA
            /*AND CONVERT(varchar, CAST(PFHSTSAL.DTMUDANCA AS DATE), 103) >=  CONVERT(varchar, CAST(PFUFERIASPER.DATAPAGTO AS DATE), 103) */
            AND PFHSTSAL.DTMUDANCA >= PFUFERIASPER.DATAPAGTO
        ORDER BY PFHSTSAL.DTMUDANCA ASC
    ) AS SAL_MAIOR
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
) C
WHERE
    ISNULL(C.PROVDESCBASE, 'P') IN ('P', 'D')
-- --     AND C.NOME_FUNCIONARIO LIKE '%SANDRA MARIA%'
    AND C.COD_FILIAL = C.CODFILIAL
    AND ISNULL(C.COD_EVENTO, '') IN (
        '',
        --- RECIBO -------------
        -- PROVENTOS:
--         '0040', '0038',
        '0039', '0056',
        -- DESCONTOS:
        '0098', '0030', '0222', '1122',

        --- FICHA -------------
        -- PROVENTOS:
        '0076', '0041', '0240', '0243', '0077', '0042',
        '0101', '1087', '0086', '0704', '0705', '0709',
        '0710', '0714',
        -- DESCONTOS:
        '1124',

        -------
        -- PROVENTOS:
        '1090'
        -- DESCONTOS:

    )
ORDER BY
    C.ANOCOMP DESC,
    C.MESCOMP DESC,
    C.FIM_PER_AQUISITIVO DESC,
    C.DATA_INICIO_FERIAS DESC,
    C.COD_COLIGADA,
    C.COD_FILIAL,
    C.CHAPA