// Scripts SQL completos — gerados automaticamente dos arquivos originais
export const SQL_SCRIPTS = {
1: `SELECT DISTINCT
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
    C.CHAPA`,
2: `-- ======================================================================
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
    C.CHAPA`,
4: `-- 4_consulta_folha_pagamento
SELECT DISTINCT
    C.*
FROM (
    SELECT
        'DEBITO'                    AS SITUACAO,
        PCONTABILIZACAO.CODLOTE     AS COD_LOTE,
        PCONTABILIZACAO.DESCRICAO   AS DESC_LOTE,
        GCOLIGADA.CODCOLIGADA       AS COD_COLIGADA,
        GCOLIGADA.NOMEFANTASIA      AS NOME_COLIGADA,
        PFUNC.CODFILIAL             AS PCODFILIAL,
        PSECAO.CODFILIAL            AS COD_FILIAL,
        GFILIAL.NOME                AS NOME_FILIAL,
        --
        PFUNC.CODSECAO              AS COD_SETOR,
        PSECAO.DESCRICAO            AS NOME_SETOR,
        PFUNCAO.CODIGO              AS COD_CARGO,
        PFUNCAO.NOME                AS NOME_CARGO,
        --
        PCCUSTO.CODCCUSTO           AS COD_CUSTO,
        PCCUSTO.NOME                AS CENTRO_CUSTO,
        CCONTA.CODCONTA             AS COD_CONTA,
        CCONTA.DESCRICAO            AS DESC_CONTA,
        PPARTIDA.COMPLEMENTO        AS COMPLEMENTO,
        PITEMPARTIDA.VALOR * ( -1 ) AS VALOR,
        PFUNC.CHAPA                 AS CHAPA,
        PFUNC.NOME                  AS NOME_FUNCIONARIO,
--             (
--                 SELECT PTPFUNC.DESCRICAO
--                 FROM   PTPFUNC(NOLOCK)
--                 WHERE  PTPFUNC.CODCLIENTE = PFUNC.CODTIPO
--             )                           AS TIPO_FUNCIONARIO,
        CASE
             WHEN Substring(CCONTA.CODCONTA, 1, 1) = 1 THEN '1 - ATIVO'
             WHEN Substring(CCONTA.CODCONTA, 1, 1) = 2 THEN '2 - PASSIVO CIRCULANTE'
             WHEN Substring(CCONTA.CODCONTA, 1, 1) = 4 THEN '4 - CONTAS DE RESULTADO'
        END                         AS NIVEL
    FROM PCONTABILIZACAO(NOLOCK)
    INNER JOIN PPARTIDA (NOLOCK)
        ON PPARTIDA.CODCOLIGADA = PCONTABILIZACAO.CODCOLIGADA
        AND PPARTIDA.CODLOTE = PCONTABILIZACAO.CODLOTE
    INNER JOIN CCONTA (NOLOCK)
        ON CCONTA.CODCONTA = PPARTIDA.DEBITO
        AND CCONTA.CODCOLIGADA = PPARTIDA.CODCOLIGADA
    INNER JOIN GFILIAL
        ON GFILIAL.CODFILIAL = PPARTIDA.CODFILIAL
        AND GFILIAL.CODCOLIGADA = PPARTIDA.CODCOLIGADA
    INNER JOIN GCOLIGADA (NOLOCK)
        ON GCOLIGADA.CODCOLIGADA = GFILIAL.CODCOLIGADA
    LEFT JOIN PCCUSTO (NOLOCK)
        ON PCCUSTO.CODCOLIGADA = PPARTIDA.CODCOLIGADA
        AND PCCUSTO.CODCCUSTO = PPARTIDA.CODCCUSTO
    LEFT JOIN PITEMPARTIDA (NOLOCK)
        ON PITEMPARTIDA.CODCOLIGADA = PPARTIDA.CODCOLIGADA
        AND PITEMPARTIDA.IDPARTIDA = PPARTIDA.IDPARTIDA
        AND PITEMPARTIDA.CODLOTE = PPARTIDA.CODLOTE
    LEFT JOIN PFUNC
        ON PFUNC.CODCOLIGADA = PITEMPARTIDA.CODCOLIGADA
        AND PFUNC.CHAPA = PITEMPARTIDA.CHAPA
    INNER JOIN PFUNCAO (NOLOCK)
        ON PFUNCAO.CODIGO = PFUNC.CODFUNCAO
        AND PFUNCAO.CODCOLIGADA = PFUNC.CODCOLIGADA
    INNER JOIN PSECAO (NOLOCK)
        ON PSECAO.CODCOLIGADA = PFUNC.CODCOLIGADA
        AND PSECAO.CODIGO = PFUNC.CODSECAO

    UNION ALL

    SELECT
        'CREDITO'                   AS SITUACAO,
        PCONTABILIZACAO.CODLOTE     AS COD_LOTE,
        PCONTABILIZACAO.DESCRICAO   AS DESC_LOTE,
        GCOLIGADA.CODCOLIGADA       AS COD_COLIGADA,
        GCOLIGADA.NOMEFANTASIA      AS NOME_COLIGADA,
        PFUNC.CODFILIAL             AS PCODFILIAL,
        PSECAO.CODFILIAL            AS COD_FILIAL,
        GFILIAL.NOME                AS NOME_FILIAL,
        --
        PFUNC.CODSECAO              AS COD_SETOR,
        PSECAO.DESCRICAO            AS NOME_SETOR,
        PFUNCAO.CODIGO              AS COD_CARGO,
        PFUNCAO.NOME                AS NOME_CARGO,
        --
        PCCUSTO.CODCCUSTO           AS COD_CUSTO,
        PCCUSTO.NOME                AS CENTRO_CUSTO,
        CCONTA.CODCONTA             AS COD_CONTA,
        CCONTA.DESCRICAO            AS DESC_CONTA,
        PPARTIDA.COMPLEMENTO        AS COMPLEMENTO,
        PITEMPARTIDA.VALOR          AS VALOR,
        PFUNC.CHAPA                 AS CHAPA,
        PFUNC.NOME                  AS NOMEFUNC,
--         (
--             SELECT PTPFUNC.DESCRICAO
--             FROM   PTPFUNC(NOLOCK)
--             WHERE  PTPFUNC.CODCLIENTE = PFUNC.CODTIPO
--         )                           AS TIPOFUNCIONARIO,
        CASE
            WHEN Substring(CCONTA.CODCONTA, 1, 1) = 1 THEN '1 - ATIVO'
            WHEN Substring(CCONTA.CODCONTA, 1, 1) = 2 THEN '2 - PASSIVO CIRCULANTE'
            WHEN Substring(CCONTA.CODCONTA, 1, 1) = 4 THEN '4 - CONTAS DE RESULTADO'
        END                         AS NIVEL
    FROM PCONTABILIZACAO(NOLOCK)
    INNER JOIN PPARTIDA (NOLOCK)
        ON PPARTIDA.CODCOLIGADA = PCONTABILIZACAO.CODCOLIGADA
        AND PPARTIDA.CODLOTE = PCONTABILIZACAO.CODLOTE
    INNER JOIN CCONTA (NOLOCK)
        ON CCONTA.CODCONTA = PPARTIDA.CREDITO
        AND CCONTA.CODCOLIGADA = PPARTIDA.CODCOLIGADA
    LEFT JOIN PCCUSTO (NOLOCK)
        ON PCCUSTO.CODCOLIGADA = PPARTIDA.CODCOLIGADA
        AND PCCUSTO.CODCCUSTO = PPARTIDA.CODCCUSTO
    INNER JOIN GFILIAL (NOLOCK)
        ON GFILIAL.CODFILIAL = PPARTIDA.CODFILIAL
        AND GFILIAL.CODCOLIGADA = PPARTIDA.CODCOLIGADA
    INNER JOIN GCOLIGADA (NOLOCK)
        ON GCOLIGADA.CODCOLIGADA = GFILIAL.CODCOLIGADA
    LEFT JOIN PITEMPARTIDA (NOLOCK)
        ON PITEMPARTIDA.CODCOLIGADA = PPARTIDA.CODCOLIGADA
        AND PITEMPARTIDA.IDPARTIDA = PPARTIDA.IDPARTIDA
        AND PITEMPARTIDA.CODLOTE = PPARTIDA.CODLOTE
    LEFT JOIN PFUNC
        ON PFUNC.CODCOLIGADA = PITEMPARTIDA.CODCOLIGADA
        AND PFUNC.CHAPA = PITEMPARTIDA.CHAPA
    INNER JOIN PFUNCAO (NOLOCK)
        ON PFUNCAO.CODIGO = PFUNC.CODFUNCAO
        AND PFUNCAO.CODCOLIGADA = PFUNC.CODCOLIGADA
    INNER JOIN PSECAO (NOLOCK)
        ON PSECAO.CODCOLIGADA = PFUNC.CODCOLIGADA
        AND PSECAO.CODIGO = PFUNC.CODSECAO
) C
WHERE
    UPPER(C.NOME_FUNCIONARIO) LIKE '%MARIA FERNANDA CARVALHO DUARTE%'
ORDER BY
    C.COD_COLIGADA,
    C.NOME_FILIAL,
    C.CHAPA
`,
5: `-- 10_consulta_emprestimos
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
    C.DATAEMPRESTIMO DESC`,
6: `-- 9_consulta_rescisao
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
`,
7: `SELECT
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
    A.CHAPA`,
8: `-- 8_consulta_afastamento
SELECT
    C.COD_COLIGADA,
    C.NOME_COLIGADA,
    C.PCODFILIAL,
    C.COD_FILIAL,
    C.NOME_FILIAL,
    C.CHAPA,
    C.NOME_FUNCIONARIO,
    C.COD_SETOR,
    C.NOME_SETOR,
    C.COD_CARGO,
    C.NOME_CARGO,
    C.COD_SITUACAO,
    C.DESC_SITUACAO,
    C.COD_SEXO,
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
    C.CID,
    C.DESC_CID,
    C.CODTPATESTADO,
    C.TIPO_ATESTADO_DESCRICAO,
    C.DTINICIO,
    C.DTFINAL,
    C.HORAFINAL,
    C.HORAINICIO,
    C.Dias,
    C.CATEGORIA,
    C.CODMEDICO,
    C.NOMEMEDICO,
    C.JUSTIFICATIVA,
    C.JUSTIFICATIVAREJEICAO,
    C.STATUS,
    C.STATUS_DESCRICAO,
    C.VALIDADO,
    C.VALIDADO_DESCRICAO
FROM (
    SELECT
        GCOLIGADA.CODCOLIGADA                                                   AS COD_COLIGADA,
        GCOLIGADA.NOMEFANTASIA                                                  AS NOME_COLIGADA,
        PFUNC.CODFILIAL                                                         AS PCODFILIAL,
        PSECAO.CODFILIAL                           								AS COD_FILIAL,
        GFILIAL.NOME															AS NOME_FILIAL,
        V.CHAPA,
--         PFUNC.CODPESSOA                                                         AS COD_FUNCIONARIO,
        PFUNC.NOME                                                              AS NOME_FUNCIONARIO,
        PFUNC.CODSECAO                                                          AS COD_SETOR,
        PSECAO.DESCRICAO                                                        AS NOME_SETOR,
        PFUNCAO.CODIGO                                                          AS COD_CARGO,
        PFUNCAO.NOME                                                            AS NOME_CARGO,
        PPESSOA.SEXO                                                            AS COD_SEXO,
        PCODSEXO.DESCRICAO                                                      AS DESC_SEXO,
        PFUNC.CODSITUACAO                                                       AS COD_SITUACAO,
        PCODSITUACAO.DESCRICAO                                                  AS DESC_SITUACAO,
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
--         V.AVALRETORNO,
--         V.CHAPARESPABONO,
        V.CID,
        VCID.OBSERVACOES                                                        AS DESC_CID,
--         V.CODCOLIGADA,
--         V.CODENTIDADE,
        V.CODMEDICO,
--         V.CODPESSOA,
        V.CODTPATESTADO,
        CASE
            WHEN V.CODTPATESTADO = '01' THEN 'Atestado Médico'
            WHEN V.CODTPATESTADO = '02' THEN 'Licença Maternidade'
            WHEN V.CODTPATESTADO = '03' THEN 'Licença Mater. Compl. 180 dias'
            WHEN V.CODTPATESTADO = '04' THEN 'Laudo Médico'
            WHEN V.CODTPATESTADO = '05' THEN 'Doença Ocupacional'
            WHEN V.CODTPATESTADO = '06' THEN 'Licença Paternidade'
            WHEN V.CODTPATESTADO = '07' THEN 'Consulta Médica'
            WHEN V.CODTPATESTADO = '08' THEN 'Declaração Exército'
            WHEN V.CODTPATESTADO = '09' THEN 'Declaração de Ausência'
            ELSE 'Tipo Não Identificado'
        END          AS TIPO_ATESTADO_DESCRICAO,
--         V.CODPREATESTADO,
--         V.DATACRIACAO,
--         V.DATAPERICIA,
        V.DTINICIO,
        V.DTFINAL,
        (
            CASE
                WHEN DATEDIFF(DAY, V.DTINICIO, V.DTFINAL) > 15 THEN 'AFASTAMENTO'
                WHEN DATEDIFF(DAY, V.DTINICIO, V.DTFINAL) = 0
                    AND (V.HORAFINAL - V.HORAINICIO) != 1440   THEN 'DECLARACAO'
                ELSE 'ATESTADO'
            END
        )                           AS CATEGORIA,
--         V.DTPREVFINAL,
        V.HORAFINAL,
        V.HORAINICIO,
--         V.IDATESTADOPAI,
--         V.IDIMAGEM,
        V.JUSTIFICATIVA,
        V.JUSTIFICATIVAREJEICAO,
--         V.MOTIVOAFAST,
        V.NOMEMEDICO,
--         V.OCUPACIONAL,
--         V.RECCREATEDBY,
--         V.RECCREATEDON,
--         V.RECMODIFIEDBY,
--         V.RECMODIFIEDON,
--         V.REGCONSELHO,
        V.STATUS,
        CASE
            WHEN V.STATUS = 0 THEN 'PENDENTE VALIDACAO'
            WHEN V.STATUS = 1 THEN 'APROVADO'
            WHEN V.STATUS = 2 THEN 'REPROVADO'
            ELSE 'OUTRO'
        END          AS STATUS_DESCRICAO,
--         V.TIPOARQUIVO,
--         V.UFMEDICO,
        V.VALIDADO,
        CASE
            WHEN V.VALIDADO = 0 THEN 'PENDENTE VALIDACAO'
            WHEN V.VALIDADO = 1 THEN 'VALIDADO'
            ELSE 'OUTRO'
        END          AS VALIDADO_DESCRICAO,
--         PSECAO.DESCRICAO  AS DESCRICAO_SECAO,
--         PFUNC.NOME,
--         PFUNC.CODFILIAL,
--         GFILIAL.NOMEFANTASIA,
--         PFUNCAO.NOME      AS NOME_FUNCAO,
--         PSECAO.DESCRICAO AS DESCRICAO_SECAO_COMPLETA,
        Datediff(DAY, V.DTINICIO, ISNULL(V.DTFINAL, Cast(Getdate() AS DATE)))
        + 1          AS Dias,
        1            AS QNT
    FROM VPREATESTADO V
    INNER JOIN VCID (NOLOCK)
        ON VCID.CID = V.CID
    INNER JOIN PFUNC (NOLOCK)
        ON PFUNC.CHAPA = V.CHAPA
        AND PFUNC.CODCOLIGADA = V.CODCOLIGADA
    INNER JOIN GCOLIGADA (NOLOCK)
        ON GCOLIGADA.CODCOLIGADA = PFUNC.CODCOLIGADA
    INNER JOIN PCODSITUACAO (NOLOCK)
        ON PFUNC.CODSITUACAO = PCODSITUACAO.CODCLIENTE
    INNER JOIN PFUNCAO (NOLOCK)
        ON PFUNCAO.CODIGO = PFUNC.CODFUNCAO
        AND PFUNCAO.CODCOLIGADA = PFUNC.CODCOLIGADA
    INNER JOIN PSECAO (NOLOCK)
        ON PSECAO.CODCOLIGADA = PFUNC.CODCOLIGADA
        AND PSECAO.CODIGO = PFUNC.CODSECAO
    INNER JOIN PPESSOA (NOLOCK)
        ON PPESSOA.CODIGO = PFUNC.CODPESSOA
    INNER JOIN PCODSEXO
        ON PPESSOA.SEXO = PCODSEXO.CODCLIENTE
    INNER JOIN GFILIAL (NOLOCK)
        ON GFILIAL.CODCOLIGADA = PFUNC.CODCOLIGADA
        AND GFILIAL.CODFILIAL = PSECAO.CODFILIAL
) C
WHERE
    C.COD_SITUACAO != 'D'
    AND UPPER(C.CATEGORIA) = 'AFASTAMENTO'
    AND UPPER(C.NOME_FUNCIONARIO) LIKE '%ANA PAULA DIAS%'
ORDER BY
    C.COD_COLIGADA,
    C.COD_FILIAL,
    C.CHAPA`,
9: `-- 7_consulta_atestado
SELECT * FROM VCID;
SELECT
    C.COD_COLIGADA,
    C.NOME_COLIGADA,
    C.PCODFILIAL,
    C.COD_FILIAL,
    C.NOME_FILIAL,
    C.CHAPA,
    C.NOME_FUNCIONARIO,
    C.COD_SETOR,
    C.NOME_SETOR,
    C.COD_CARGO,
    C.NOME_CARGO,
    C.COD_SITUACAO,
    C.DESC_SITUACAO,
    C.COD_SEXO,
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
    C.CID,
    C.DESC_CID,
    C.CODTPATESTADO,
    C.TIPO_ATESTADO_DESCRICAO,
    C.DTINICIO,
    C.DTFINAL,
    C.HORAFINAL,
    C.HORAINICIO,
    C.Dias,
    C.CATEGORIA,
    C.CODMEDICO,
    C.NOMEMEDICO,
    C.JUSTIFICATIVA,
    C.JUSTIFICATIVAREJEICAO,
    C.STATUS,
    C.STATUS_DESCRICAO,
    C.VALIDADO,
    C.VALIDADO_DESCRICAO
FROM (
    SELECT
        GCOLIGADA.CODCOLIGADA                                                   AS COD_COLIGADA,
        GCOLIGADA.NOMEFANTASIA                                                  AS NOME_COLIGADA,
        PFUNC.CODFILIAL                                                         AS PCODFILIAL,
        PSECAO.CODFILIAL                           								AS COD_FILIAL,
        GFILIAL.NOME															AS NOME_FILIAL,
        V.CHAPA,
--         PFUNC.CODPESSOA                                                         AS COD_FUNCIONARIO,
        PFUNC.NOME                                                              AS NOME_FUNCIONARIO,
        PFUNC.CODSECAO                                                          AS COD_SETOR,
        PSECAO.DESCRICAO                                                        AS NOME_SETOR,
        PFUNCAO.CODIGO                                                          AS COD_CARGO,
        PFUNCAO.NOME                                                            AS NOME_CARGO,
        PPESSOA.SEXO                                                            AS COD_SEXO,
        PCODSEXO.DESCRICAO                                                      AS DESC_SEXO,
        PFUNC.CODSITUACAO                                                       AS COD_SITUACAO,
        PCODSITUACAO.DESCRICAO                                                  AS DESC_SITUACAO,
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
--         V.AVALRETORNO,
--         V.CHAPARESPABONO,
        V.CID,
        VCID.OBSERVACOES                                                        AS DESC_CID,
--         V.CODCOLIGADA,
--         V.CODENTIDADE,
        V.CODMEDICO,
--         V.CODPESSOA,
        V.CODTPATESTADO,
        CASE
            WHEN V.CODTPATESTADO = '01' THEN 'Atestado Médico'
            WHEN V.CODTPATESTADO = '02' THEN 'Licença Maternidade'
            WHEN V.CODTPATESTADO = '03' THEN 'Licença Mater. Compl. 180 dias'
            WHEN V.CODTPATESTADO = '04' THEN 'Laudo Médico'
            WHEN V.CODTPATESTADO = '05' THEN 'Doença Ocupacional'
            WHEN V.CODTPATESTADO = '06' THEN 'Licença Paternidade'
            WHEN V.CODTPATESTADO = '07' THEN 'Consulta Médica'
            WHEN V.CODTPATESTADO = '08' THEN 'Declaração Exército'
            WHEN V.CODTPATESTADO = '09' THEN 'Declaração de Ausência'
            ELSE 'Tipo Não Identificado'
        END          AS TIPO_ATESTADO_DESCRICAO,
--         V.CODPREATESTADO,
--         V.DATACRIACAO,
--         V.DATAPERICIA,
        V.DTINICIO,
        V.DTFINAL,
        (
            CASE
                WHEN DATEDIFF(DAY, V.DTINICIO, V.DTFINAL) > 15 THEN 'AFASTAMENTO'
                WHEN DATEDIFF(DAY, V.DTINICIO, V.DTFINAL) = 0
                    AND (V.HORAFINAL - V.HORAINICIO) != 1440   THEN 'DECLARACAO'
                ELSE 'ATESTADO'
            END
        )                           AS CATEGORIA,
--         V.DTPREVFINAL,
        V.HORAFINAL,
        V.HORAINICIO,
--         V.IDATESTADOPAI,
--         V.IDIMAGEM,
        V.JUSTIFICATIVA,
        V.JUSTIFICATIVAREJEICAO,
--         V.MOTIVOAFAST,
        V.NOMEMEDICO,
--         V.OCUPACIONAL,
--         V.RECCREATEDBY,
--         V.RECCREATEDON,
--         V.RECMODIFIEDBY,
--         V.RECMODIFIEDON,
--         V.REGCONSELHO,
        V.STATUS,
        CASE
            WHEN V.STATUS = 0 THEN 'PENDENTE VALIDACAO'
            WHEN V.STATUS = 1 THEN 'APROVADO'
            WHEN V.STATUS = 2 THEN 'REPROVADO'
            ELSE 'OUTRO'
        END          AS STATUS_DESCRICAO,
--         V.TIPOARQUIVO,
--         V.UFMEDICO,
        V.VALIDADO,
        CASE
            WHEN V.VALIDADO = 0 THEN 'PENDENTE VALIDACAO'
            WHEN V.VALIDADO = 1 THEN 'VALIDADO'
            ELSE 'OUTRO'
        END          AS VALIDADO_DESCRICAO,
--         PSECAO.DESCRICAO  AS DESCRICAO_SECAO,
--         PFUNC.NOME,
--         PFUNC.CODFILIAL,
--         GFILIAL.NOMEFANTASIA,
--         PFUNCAO.NOME      AS NOME_FUNCAO,
--         PSECAO.DESCRICAO AS DESCRICAO_SECAO_COMPLETA,
        Datediff(DAY, V.DTINICIO, ISNULL(V.DTFINAL, Cast(Getdate() AS DATE)))
        + 1          AS Dias,
        1            AS QNT
    FROM VPREATESTADO V (NOLOCK)
    INNER JOIN VCID (NOLOCK)
        ON VCID.CID = V.CID
    INNER JOIN PFUNC (NOLOCK)
        ON PFUNC.CHAPA = V.CHAPA
        AND PFUNC.CODCOLIGADA = V.CODCOLIGADA
    INNER JOIN GCOLIGADA (NOLOCK)
        ON GCOLIGADA.CODCOLIGADA = PFUNC.CODCOLIGADA
    INNER JOIN PCODSITUACAO (NOLOCK)
        ON PFUNC.CODSITUACAO = PCODSITUACAO.CODCLIENTE
    INNER JOIN PFUNCAO (NOLOCK)
        ON PFUNCAO.CODIGO = PFUNC.CODFUNCAO
        AND PFUNCAO.CODCOLIGADA = PFUNC.CODCOLIGADA
    INNER JOIN PSECAO (NOLOCK)
        ON PSECAO.CODCOLIGADA = PFUNC.CODCOLIGADA
        AND PSECAO.CODIGO = PFUNC.CODSECAO
    INNER JOIN PPESSOA (NOLOCK)
        ON PPESSOA.CODIGO = PFUNC.CODPESSOA
    INNER JOIN PCODSEXO
        ON PPESSOA.SEXO = PCODSEXO.CODCLIENTE
    INNER JOIN GFILIAL (NOLOCK)
        ON GFILIAL.CODCOLIGADA = PFUNC.CODCOLIGADA
        AND GFILIAL.CODFILIAL = PSECAO.CODFILIAL
) C
WHERE
    C.COD_SITUACAO != 'D'
    AND UPPER(C.CATEGORIA) = 'ATESTADO'
    AND UPPER(C.NOME_FUNCIONARIO) LIKE '%LUIZ CHARLES VARELA DE SENA%'
ORDER BY
    C.COD_COLIGADA,
    C.COD_FILIAL,
    C.CHAPA
`,
3: `-- Dados em implantação. Consulta ainda não disponível.`
};
