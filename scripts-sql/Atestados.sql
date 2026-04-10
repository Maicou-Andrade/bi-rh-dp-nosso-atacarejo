-- 7_consulta_atestado
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

