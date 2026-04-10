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
    C.SALARIO,
    C.DATA_ADMISSAO,
--     C.COD_TIPO_ADMISSAO,
    C.DESC_TIPO_ADMISSAO,
    C.DATA_DEMISSAO,
--     C.COD_TIPO_DEMISSAO,
    C.DESC_TIPO_DEMISSAO,
    C.ANO_ADMISSAO,
    C.MES_ADMISSAO,
    C.ANO_DEMISSAO,
    C.MES_DEMISSAO,
    C.DATA_NASCIMENTO,
    C.ANO_NASCIMENTO,
    C.MES_NASCIMENTO
FROM (
    SELECT DISTINCT
        COLIGADA.CODCOLIGADA                                                    AS COD_COLIGADA,
        COLIGADA.NOMEFANTASIA                                                   AS NOME_COLIGADA,
        PFUNC.CODFILIAL                                                         AS PCODFILIAL,
        PSECAO.CODFILIAL                           								AS COD_FILIAL,
        GFILIAL.NOME															AS NOME_FILIAL,
        PFUNC.CHAPA                                                             AS CHAPA,
--         PFUNC.CODPESSOA                                                         AS COD_FUNCIONARIO,
        PFUNC.NOME                                                              AS NOME_FUNCIONARIO,
    --     PFUNC.PISPASEP                                                          AS PISPASEP,
        PFUNC.CODSECAO                                                          AS COD_SETOR,
        PSECAO.DESCRICAO                                                        AS NOME_SETOR,
        PFUNCAO.CODIGO                                                          AS COD_CARGO,
        PFUNCAO.NOME                                                            AS NOME_CARGO,
        PFUNC.CODSITUACAO                                                       AS COD_SITUACAO,
        PCODSITUACAO.DESCRICAO                                                  AS DESC_SITUACAO,
        PPESSOA.SEXO                                                            AS COD_SEXO,
        PCODSEXO.DESCRICAO                                                      AS DESC_SEXO,
    --     PFUNCAO.CBO2002                                                         AS CBO2002,
        PFUNC.SALARIO                                                           AS SALARIO,
--         (
--             SELECT
--                 SUM(PF.SALARIO)
--             FROM PFUNC PF
--             WHERE PF.CODCOLIGADA = PFUNC.CODCOLIGADA
--         ) 							                                            AS SOMA_SALARIOS,
    --     PPESSOA.CPF                                                             AS CPF,
    --     PPESSOA.CARTIDENTIDADE                                                  AS RG,
    --     PPESSOA.ORGEMISSORIDENT                                                 AS EMISSOR_RG,
    --     PSECAO.NROCENCUSTOCONT                                                  AS COD_CUSTO,
    --     PCCUSTO.NOME                                                            AS CENTRO_CUSTO,
    --     PFRATEIOFIXO.CODCCUSTO                                                  AS COD_CUSTO_FUNCIONARIO,
    --     GCCUSTO.NOME                                                            AS CENTRO_CUSTO_FUNCIONARIO,
        CAST(PFUNC.DATAADMISSAO AS DATE)                         		        AS DATA_ADMISSAO,
        PTPADMISSAO.CODINTERNO                                                  AS COD_TIPO_ADMISSAO,
        PTPADMISSAO.DESCRICAO                                                   AS DESC_TIPO_ADMISSAO,
        CAST(PFUNC.DATADEMISSAO AS DATE)                         		        AS DATA_DEMISSAO,
        PTPDEMISSAO.CODINTERNO                                                  AS COD_TIPO_DEMISSAO,
        PTPDEMISSAO.DESCRICAO                                                   AS DESC_TIPO_DEMISSAO,
        DATEPART(YYYY,PFUNC.DATAADMISSAO)   	                                AS ANO_ADMISSAO,
        DATEPART(MM,PFUNC.DATAADMISSAO)	                                        AS MES_ADMISSAO,
        DATEPART(YYYY,PFUNC.DATADEMISSAO)				                        AS ANO_DEMISSAO,
        DATEPART(MM,PFUNC.DATADEMISSAO)			                                AS MES_DEMISSAO,
        CAST(PPESSOA.DTNASCIMENTO AS DATE)                                      AS DATA_NASCIMENTO,
        DATEPART(YYYY,PPESSOA.DTNASCIMENTO)				                        AS ANO_NASCIMENTO,
        DATEPART(MM,PPESSOA.DTNASCIMENTO)										AS MES_NASCIMENTO,
    --     (][
    --         CASE
    --             WHEN EXISTS (
    --                 SELECT CHAPA FROM PFDEPEND DP
    --                 WHERE
    --                     DP.CODCOLIGADA = PFUNC.CODCOLIGADA
    --                     AND DP.CHAPA = PFUNC.CHAPA
    --                     AND DP.GRAUPARENTESCO IN ('1','3')
    --             )
    --             THEN 'Sim'
    --             ELSE 'Não'
    --         END
    --     )													                    AS POSSUI_FILHO,
    --     PPESSOA.ESTADOCIVIL                                                     AS ESTADOCIVIL,
    --     PPESSOA.RUA                                                             AS LOGRADOURO,
    --     PPESSOA.CEP                                                             AS CEP,
    --     PPESSOA.NUMERO                                                          AS NUMERO,
    --     PPESSOA.COMPLEMENTO                                                     AS COMPLEMENTO,
    --     PPESSOA.BAIRRO                                                          AS BAIRRO,
    --     PPESSOA.CIDADE                                                          AS CIDADE,
    --     PPESSOA.ESTADO                                                          AS UF,
    --     ISNULL(PPESSOA.TELEFONE1, '')											AS TELEFONE_I,
    --     ISNULL(PPESSOA.TELEFONE2, '')											AS TELEFONE_II,
    --     ISNULL(PPESSOA.TELEFONE3, '')											AS TELEFONE_III,
    --     TIPO.DESCRICAO                                                          AS TIPO_FUNCIONARIO,
    --     PMOTDEMISSAO.DESCRICAO                                                  AS MOTIVO_DEMISSAO,
    --     PCODINSTRUCAO.DESCRICAO												    AS ESCOLARIDADE,
    --     (
    --         CASE
    --             WHEN PPESSOA.IDIMAGEM IS NULL 	THEN 'Não Possui Imagem'
    --             WHEN PPESSOA.IDIMAGEM IS NOT NULL THEN 'Possui Imagem'
    --         END
    --     ) 															            AS Foto,
    --     (
    --         CASE
    --             WHEN PPESSOA.DEFICIENTEAUDITIVO = 1 THEN 'AUDITIVO'
    --             WHEN PPESSOA.DEFICIENTEFALA     = 1 THEN 'FALA'
    --             WHEN PPESSOA.DEFICIENTEFISICO   = 1 THEN 'FISICO'
    --             WHEN PPESSOA.DEFICIENTEMENTAL   = 1 THEN 'MENTAL'
    --             WHEN PPESSOA.DEFICIENTEVISUAL   = 1 THEN 'VISUAL'
    --             WHEN PPESSOA.BRPDH              = 1 THEN 'REABILITADO'
    --         ELSE 'N/A' END
    --     )                                         		                        AS DEFIFIENCIA,
    --     PCORRACA.DESCRICAO                                                      AS RACA,
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
    --     (
    --         SELECT
    --             CASE
    --                 WHEN COUNT(*) <> 0
    --                 THEN 'Sim'
    --                 ELSE 'Não'
    --             END AS POSSUI
    --         FROM PFDEPEND AS FILHOS
    --         WHERE
    --             FILHOS.CODCOLIGADA = PFUNC.CODCOLIGADA
    --             AND FILHOS.CHAPA = PFUNC.CHAPA
    --             AND FILHOS.GRAUPARENTESCO = '1'
    --     ) AS POSSUI_FILHOS,
    --     PFDEPEND.NOME AS Parente_Nome,
    --     PCODPARENT.DESCRICAO AS Parente_Tipo,
    --     ISNULL(CONVERT(VARCHAR,PFDEPEND.DTNASCIMENTO,103),'Não Informada') AS Parente_Nascimento,
    --     (
    --         CASE WHEN PFDEPEND.CARTAOVACINA = 1 THEN 'Sim' ELSE 'Não' END
    --     ) AS Dependente_CartVacina,
    --     (
    --         CASE WHEN PFDEPEND.FREQESCOLAR = 1 THEN 'Sim' ELSE 'Não' END
    --     ) AS Dependente_FreqEscolar
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
    LEFT JOIN PCODPARENT (NOLOCK)
        ON PCODPARENT.CODCLIENTE = PFDEPEND.GRAUPARENTESCO
    INNER JOIN GFILIAL (NOLOCK)
        ON GFILIAL.CODCOLIGADA = PFUNC.CODCOLIGADA
        AND GFILIAL.CODFILIAL = PSECAO.CODFILIAL
    LEFT JOIN PTPADMISSAO (NOLOCK)
        ON PFUNC.TIPOADMISSAO = PTPADMISSAO.CODCLIENTE
    LEFT JOIN  PTPDEMISSAO (NOLOCK)
        ON PFUNC.TIPODEMISSAO = PTPDEMISSAO.CODCLIENTE
) C
WHERE
    UPPER(C.NOME_SETOR) NOT LIKE '%AUTONOMO%' AND UPPER(C.NOME_CARGO) NOT LIKE '%DIRETOR ADMINISTRATIVO%'
ORDER BY
    C.COD_COLIGADA,
    C.COD_FILIAL,
    C.CHAPA
