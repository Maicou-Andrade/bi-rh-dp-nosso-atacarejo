SELECT
    A.*
FROM (
    SELECT DISTINCT
        C.COD_COLIGADA,
        C.NOME_COLIGADA,
--         C.PCODFILIAL,
        C.COD_FILIAL,
        C.NOME_FILIAL,
        C.CHAPA,
        C.NOME_FUNCIONARIO,
        C.CPF,
--         C.COD_SETOR,
        C.NOME_SETOR,
--         C.COD_CARGO,
        C.NOME_CARGO,
--         C.COD_SITUACAO,
        C.DESC_SITUACAO,
--         C.COD_SEXO,
        C.DESC_SEXO,
        C.IDADE,
        CASE
            WHEN C.IDADE < 18 THEN '<18'
            WHEN C.IDADE < 25 THEN '18-24'
            WHEN C.IDADE < 35 THEN '25-34'
            WHEN C.IDADE < 45 THEN '35-44'
            WHEN C.IDADE < 55 THEN '45-54'
            WHEN C.IDADE >= 55 THEN '55+'
            ELSE NULL
        END                                                                     AS FAIXA_ETARIA,
        -- ======================================================================
        C.DATA_ADMISSAO,
        C.DATA_DEMISSAO,
        C.ANO_ADMISSAO,
        C.MES_ADMISSAO,
        C.ANO_DEMISSAO,
        C.MES_DEMISSAO,
        C.TEMPO_TRABALHO_DIAS,
        C.TEMPO_TRABALHO_MESES,
        C.TEMPO_TRABALHO_ANOS,
        (
            CASE
                WHEN C.TEMPO_TRABALHO_ANOS < 1 THEN '<1 ano'
                WHEN C.TEMPO_TRABALHO_ANOS < 3 THEN '1-3 anos'
                WHEN C.TEMPO_TRABALHO_ANOS < 5 THEN '3-5 anos'
                WHEN C.TEMPO_TRABALHO_ANOS < 10 THEN '5-10 anos'
                WHEN C.TEMPO_TRABALHO_ANOS >= 10 THEN '10+'
                ELSE NULL
            END
        )                                                                       AS TEMPO_EMPRESA,
        C.DATA_NASCIMENTO,
        C.ANO_NASCIMENTO,
        C.MES_NASCIMENTO,
        ROW_NUMBER() OVER (
            PARTITION BY
                C.CPF
            ORDER BY
                CASE WHEN C.COD_SITUACAO != 'D' THEN 1 ELSE 2 END
        ) AS RN
    FROM (
        SELECT DISTINCT
            COLIGADA.CODCOLIGADA                                                    AS COD_COLIGADA,
            COLIGADA.NOMEFANTASIA                                                   AS NOME_COLIGADA,
--             PFUNC.CODFILIAL                                                         AS PCODFILIAL,
            PSECAO.CODFILIAL                           								AS COD_FILIAL,
            GFILIAL.NOME															AS NOME_FILIAL,
            PFUNC.CHAPA                                                             AS CHAPA,
    --         PFUNC.CODPESSOA                                                         AS COD_FUNCIONARIO,
            PFUNC.NOME                                                              AS NOME_FUNCIONARIO,
            PPESSOA.CPF,
            PFUNC.CODSECAO                                                          AS COD_SETOR,
            PSECAO.DESCRICAO                                                        AS NOME_SETOR,
            PFUNCAO.CODIGO                                                          AS COD_CARGO,
            PFUNCAO.NOME                                                            AS NOME_CARGO,
            PFUNC.CODSITUACAO                                                       AS COD_SITUACAO,
            PCODSITUACAO.DESCRICAO                                                  AS DESC_SITUACAO,
            PPESSOA.SEXO                                                            AS COD_SEXO,
            PCODSEXO.DESCRICAO                                                      AS DESC_SEXO,
            -- ======================================================================
            CAST(PFUNC.DATAADMISSAO AS DATE)                         		        AS DATA_ADMISSAO,
            CAST(PFUNC.DATADEMISSAO AS DATE)                         		        AS DATA_DEMISSAO,
            DATEPART(YYYY,PFUNC.DATAADMISSAO)   	                                AS ANO_ADMISSAO,
            DATEPART(MM,PFUNC.DATAADMISSAO)	                                        AS MES_ADMISSAO,
            DATEPART(YYYY,PFUNC.DATADEMISSAO)				                        AS ANO_DEMISSAO,
            DATEPART(MM,PFUNC.DATADEMISSAO)			                                AS MES_DEMISSAO,
            --
            (
                DATEDIFF(DAY, PFUNC.DATAADMISSAO, GETDATE())
            )                                                                       AS TEMPO_TRABALHO_DIAS,
            (
                DATEDIFF(MONTH, PFUNC.DATAADMISSAO, GETDATE())
                - CASE
                    WHEN DATEADD(
                        MONTH, DATEDIFF(MONTH, PFUNC.DATAADMISSAO, GETDATE()), PFUNC.DATAADMISSAO
                        ) > GETDATE()
                    THEN 1
                    ELSE 0
                END
            )                                                                       AS TEMPO_TRABALHO_MESES,
            (
                DATEDIFF(YEAR, PFUNC.DATAADMISSAO, GETDATE())
                - CASE
                    WHEN DATEADD(
                        YEAR, DATEDIFF(YEAR, PFUNC.DATAADMISSAO, GETDATE()), PFUNC.DATAADMISSAO
                        ) > GETDATE()
                    THEN 1
                    ELSE 0
                END
            )                                                                       AS TEMPO_TRABALHO_ANOS,
            --
            CAST(PPESSOA.DTNASCIMENTO AS DATE)                                      AS DATA_NASCIMENTO,
            DATEPART(YYYY,PPESSOA.DTNASCIMENTO)				                        AS ANO_NASCIMENTO,
            DATEPART(MM,PPESSOA.DTNASCIMENTO)										AS MES_NASCIMENTO,
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
        FROM PFUNC (NOLOCK)
        INNER JOIN GCOLIGADA AS COLIGADA (NOLOCK)
            ON COLIGADA.CODCOLIGADA = PFUNC.CODCOLIGADA
        INNER JOIN PCODSITUACAO (NOLOCK)
            ON PFUNC.CODSITUACAO = PCODSITUACAO.CODCLIENTE
        INNER JOIN PFUNCAO (NOLOCK)
            ON PFUNCAO.CODIGO = PFUNC.CODFUNCAO
            AND PFUNCAO.CODCOLIGADA = PFUNC.CODCOLIGADA
        INNER JOIN PSECAO (NOLOCK)
            ON PSECAO.CODCOLIGADA = PFUNC.CODCOLIGADA
            AND PSECAO.CODIGO = PFUNC.CODSECAO
        LEFT JOIN PCCUSTO (NOLOCK)
            ON PCCUSTO.CODCOLIGADA = PSECAO.CODCOLIGADA
            AND PCCUSTO.CODCCUSTO = PSECAO.NROCENCUSTOCONT
        LEFT JOIN PFRATEIOFIXO (NOLOCK)
            ON PFRATEIOFIXO.CODCOLIGADA = PFUNC.CODCOLIGADA
            AND PFRATEIOFIXO.CHAPA = PFUNC.CHAPA
        LEFT JOIN GCCUSTO (NOLOCK)
            ON GCCUSTO.CODCOLIGADA = PFRATEIOFIXO.CODCOLIGADA
            AND GCCUSTO.CODCCUSTO = PFRATEIOFIXO.CODCCUSTO
        INNER JOIN PPESSOA (NOLOCK)
            ON PPESSOA.CODIGO = PFUNC.CODPESSOA
        INNER JOIN PCODSEXO
            ON PPESSOA.SEXO = PCODSEXO.CODCLIENTE
        LEFT JOIN PFCOMPL (NOLOCK)
            ON PFCOMPL.CODCOLIGADA = PFUNC.CODCOLIGADA
            AND PFCOMPL.CHAPA = PFUNC.CHAPA
        LEFT JOIN PTPFUNC AS TIPO (NOLOCK)
            ON PFUNC.CODTIPO = TIPO.CODINTERNO
        LEFT JOIN PMOTDEMISSAO (NOLOCK)
            ON PMOTDEMISSAO.CODCLIENTE = PFUNC.MOTIVODEMISSAO
            AND PMOTDEMISSAO.CODCOLIGADA = PFUNC.CODCOLIGADA
        LEFT JOIN PCODINSTRUCAO (NOLOCK)
            ON PCODINSTRUCAO.CODCLIENTE = PPESSOA.GRAUINSTRUCAO
        LEFT JOIN PCORRACA (NOLOCK)
            ON PCORRACA.CODCLIENTE = PPESSOA.CORRACA
        LEFT JOIN PFDEPEND (NOLOCK)
            ON PFDEPEND.CODCOLIGADA = PFUNC.CODCOLIGADA
            AND PFDEPEND.CHAPA = PFUNC.CHAPA
        LEFT JOIN PCODPARENT	(NOLOCK)
            ON PCODPARENT.CODCLIENTE = PFDEPEND.GRAUPARENTESCO
        INNER JOIN GFILIAL (NOLOCK)
            ON GFILIAL.CODCOLIGADA = PFUNC.CODCOLIGADA
            AND GFILIAL.CODFILIAL = PSECAO.CODFILIAL
    ) C
) A
WHERE
    UPPER(A.NOME_SETOR) != 'AUTONOMO'
    AND A.RN = 1
--     AND ISNULL(A.COD_SITUACAO, '') != 'D'
--     AND UPPER(A.NOME_FUNCIONARIO) LIKE '%MARIA FERNANDA CARVALHO DUARTE%'
ORDER BY
    A.COD_COLIGADA,
    A.COD_FILIAL,
    A.CHAPA