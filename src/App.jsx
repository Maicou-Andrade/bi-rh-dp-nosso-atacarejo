import { useState, useRef } from "react";

// ========== SQL SCRIPTS (resumidos - scripts completos nos arquivos .sql) ==========
const SQL_SCRIPTS = {
1: `SELECT DISTINCT C.COD_COLIGADA, C.NOME_COLIGADA, C.COD_FILIAL, C.NOME_FILIAL,
  C.CHAPA, C.NOME_FUNCIONARIO, C.NOME_SETOR, C.NOME_CARGO, C.DESC_SITUACAO,
  C.DESC_SEXO, C.IDADE, FAIXA_ETARIA, C.SALARIO, C.DATA_ADMISSAO,
  C.DESC_TIPO_ADMISSAO, C.DATA_DEMISSAO, C.DESC_TIPO_DEMISSAO,
  C.ANO_ADMISSAO, C.MES_ADMISSAO, C.ANO_DEMISSAO, C.MES_DEMISSAO, C.DATA_NASCIMENTO
FROM (
  SELECT DISTINCT COLIGADA.CODCOLIGADA AS COD_COLIGADA, COLIGADA.NOMEFANTASIA AS NOME_COLIGADA,
    PSECAO.CODFILIAL AS COD_FILIAL, GFILIAL.NOME AS NOME_FILIAL, PFUNC.CHAPA,
    PFUNC.NOME AS NOME_FUNCIONARIO, PSECAO.DESCRICAO AS NOME_SETOR,
    PFUNCAO.NOME AS NOME_CARGO, PCODSITUACAO.DESCRICAO AS DESC_SITUACAO,
    PCODSEXO.DESCRICAO AS DESC_SEXO, PFUNC.SALARIO, CAST(PFUNC.DATAADMISSAO AS DATE) AS DATA_ADMISSAO,
    PTPADMISSAO.DESCRICAO AS DESC_TIPO_ADMISSAO, CAST(PFUNC.DATADEMISSAO AS DATE) AS DATA_DEMISSAO,
    PTPDEMISSAO.DESCRICAO AS DESC_TIPO_DEMISSAO,
    DATEPART(YYYY,PFUNC.DATAADMISSAO) AS ANO_ADMISSAO, DATEPART(MM,PFUNC.DATAADMISSAO) AS MES_ADMISSAO,
    DATEPART(YYYY,PFUNC.DATADEMISSAO) AS ANO_DEMISSAO, DATEPART(MM,PFUNC.DATADEMISSAO) AS MES_DEMISSAO,
    CAST(PPESSOA.DTNASCIMENTO AS DATE) AS DATA_NASCIMENTO,
    DATEDIFF(YY, PPESSOA.DTNASCIMENTO, GETDATE()) - (...) AS IDADE
  FROM PFUNC (NOLOCK)
  INNER JOIN GCOLIGADA AS COLIGADA ON COLIGADA.CODCOLIGADA = PFUNC.CODCOLIGADA
  INNER JOIN PCODSITUACAO ON PFUNC.CODSITUACAO = PCODSITUACAO.CODCLIENTE
  INNER JOIN PFUNCAO ON PFUNCAO.CODIGO = PFUNC.CODFUNCAO AND PFUNCAO.CODCOLIGADA = PFUNC.CODCOLIGADA
  INNER JOIN PSECAO ON PSECAO.CODCOLIGADA = PFUNC.CODCOLIGADA AND PSECAO.CODIGO = PFUNC.CODSECAO
  INNER JOIN PPESSOA ON PPESSOA.CODIGO = PFUNC.CODPESSOA
  INNER JOIN PCODSEXO ON PPESSOA.SEXO = PCODSEXO.CODCLIENTE
  INNER JOIN GFILIAL ON GFILIAL.CODCOLIGADA = PFUNC.CODCOLIGADA AND GFILIAL.CODFILIAL = PSECAO.CODFILIAL
  LEFT JOIN PTPADMISSAO ON PFUNC.TIPOADMISSAO = PTPADMISSAO.CODCLIENTE
  LEFT JOIN PTPDEMISSAO ON PFUNC.TIPODEMISSAO = PTPDEMISSAO.CODCLIENTE
) C
WHERE UPPER(C.NOME_SETOR) NOT LIKE '%AUTONOMO%' AND UPPER(C.NOME_CARGO) NOT LIKE '%DIRETOR ADMINISTRATIVO%'
ORDER BY C.COD_COLIGADA, C.COD_FILIAL, C.CHAPA`,

2: `SELECT DISTINCT C.COD_COLIGADA, C.NOME_COLIGADA, C.COD_FILIAL, C.NOME_FILIAL,
  C.CHAPA, C.NOME_FUNCIONARIO, C.NOME_SETOR, C.NOME_CARGO, C.DESC_SITUACAO,
  C.DESC_SEXO, C.IDADE, FAIXA_ETARIA, C.DATA_ADMISSAO,
  C.INICIO_PER_AQUISITIVO, C.FIM_PER_AQUISITIVO, C.LIMITE_FERIAS,
  C.STATUS_PER_AQUISITVO, C.DATA_PAGAMENTO, C.DATA_INICIO_FERIAS, C.DATA_FIM_FERIAS,
  C.DIAS_GOZO, C.DIAS_ABONO, C.SALDO_FERIAS, C.SALARIO_BASE,
  C.TOTAL_PROVENTOS, C.TOTAL_DESCONTOS, C.LIQUIDO_FERIAS, C.IRRF,
  C.STATUS, C.TEMPO_EMPRESA, C.ANOCOMP, C.MESCOMP
FROM (
  SELECT DISTINCT ... FROM PFUFERIAS
  INNER JOIN PFUNC, PPESSOA, GCOLIGADA, PCODSITUACAO, PCODSEXO, GFILIAL, PFUNCAO, PSECAO
  INNER JOIN PFUFERIASRECIBO, PFUFERIASPER (via PFHSTSIT)
  LEFT JOIN PFFINANC, PEVENTO, SALDOFERIAS (window function)
  OUTER APPLY SAL_MENOR (PFHSTSAL), SAL_MAIOR (PFHSTSAL), FILIAL_VALIDA
) C
WHERE ISNULL(C.PROVDESCBASE, 'P') IN ('P', 'D') AND C.COD_FILIAL = C.CODFILIAL
  AND ISNULL(C.COD_EVENTO, '') IN ('', '0039', '0056', '0098', '0030', '0222', '1122',
    '0076', '0041', '0240', '0243', '0077', '0042', '0101', '1087', '0086',
    '0704', '0705', '0709', '0710', '0714', '1124', '1090')
ORDER BY C.ANOCOMP DESC, C.MESCOMP DESC`,

3: `-- Dados em implantação. Consulta ainda não disponível.`,

4: `SELECT DISTINCT C.* FROM (
  SELECT 'DEBITO' AS SITUACAO, PCONTABILIZACAO.CODLOTE AS COD_LOTE,
    PCONTABILIZACAO.DESCRICAO AS DESC_LOTE, GCOLIGADA.CODCOLIGADA AS COD_COLIGADA,
    GCOLIGADA.NOMEFANTASIA AS NOME_COLIGADA, PSECAO.CODFILIAL AS COD_FILIAL,
    GFILIAL.NOME AS NOME_FILIAL, PSECAO.DESCRICAO AS NOME_SETOR,
    PFUNCAO.NOME AS NOME_CARGO, PCCUSTO.CODCCUSTO AS COD_CUSTO,
    PCCUSTO.NOME AS CENTRO_CUSTO, CCONTA.CODCONTA AS COD_CONTA,
    CCONTA.DESCRICAO AS DESC_CONTA, PPARTIDA.COMPLEMENTO,
    PITEMPARTIDA.VALOR * (-1) AS VALOR, PFUNC.CHAPA, PFUNC.NOME AS NOME_FUNCIONARIO,
    CASE WHEN Substring(CCONTA.CODCONTA,1,1)=1 THEN '1 - ATIVO'
         WHEN Substring(CCONTA.CODCONTA,1,1)=2 THEN '2 - PASSIVO CIRCULANTE'
         WHEN Substring(CCONTA.CODCONTA,1,1)=4 THEN '4 - CONTAS DE RESULTADO' END AS NIVEL
  FROM PCONTABILIZACAO INNER JOIN PPARTIDA, CCONTA, GFILIAL, GCOLIGADA, PCCUSTO,
    PITEMPARTIDA, PFUNC, PFUNCAO, PSECAO
  UNION ALL
  SELECT 'CREDITO' AS SITUACAO, ... (mesma estrutura)
) C ORDER BY C.COD_COLIGADA, C.NOME_FILIAL, C.CHAPA`,

5: `SELECT DISTINCT C.COD_COLIGADA_ATUAL, C.NOME_COLIGADA_ATUAL, C.COD_FILIAL_ATUAL,
  C.NOME_FILIAL_ATUAL, C.CHAPA_ATUAL, C.NOME_FUNCIONARIO, C.NOME_SETOR,
  C.NOME_CARGO, C.DESC_SITUACAO, C.DESC_SEXO, C.IDADE, FAIXA_ETARIA,
  C.TEMPO_EMPRESA, C.DESC_BANCO_CREDOR, C.DESCRICAOEVENTO, C.DATAEMPRESTIMO,
  C.VALOR_EMPRESTIMO, C.NROPARCELAS, C.NROPARCPAGAS, C.VALOR_PARCELA,
  C.VALOR_DESCONTADO_FOLHA, C.SALDODEVEDOR, C.INICIODESCONTO, C.FINALDESCONTO,
  C.DESCRICAOTIPOEMPRESTIMO, C.ANOCOMP, C.MESCOMP
FROM (
  SELECT DISTINCT ... FROM PFUNC
  INNER JOIN PSECAO, GFILIAL, GCOLIGADA, PFUNCAO, PCODSITUACAO, PPESSOA, PCODSEXO, PTPFUNC, PCODRECEB
  LEFT JOIN PFFINANC, PEVENTO, PFEMPRT, PCODEMPRT
  OUTER APPLY FILIAL_VALIDA, COLIGADA_FILIAL_EMPRESTIMO
  -- DESC_BANCO_CREDOR via CASE com ~90 bancos (FEBRABAN)
) C
WHERE C.COD_FILIAL_ATUAL = C.COD_FILIALVALIDA
  AND C.CODEVENTO IN ('0480','9481','9482','9483','9484','9485','9486','9487','9488')
ORDER BY C.ANOCOMP DESC, C.MESCOMP DESC`,

6: `SELECT DISTINCT C.COD_COLIGADA, C.NOME_COLIGADA, C.COD_FILIAL, C.NOME_FILIAL,
  C.CHAPA, C.NOME_FUNCIONARIO, C.NOME_SETOR, C.NOME_CARGO, C.DESC_SEXO,
  C.DESC_SITUACAO, C.DESC_TIPO, C.IDADE, FAIXA_ETARIA, C.DATA_ADMISSAO, C.DATA_DEMISSAO,
  C.TEMPO_TRABALHO_DIAS, C.TEMPO_TRABALHO_MESES, C.TEMPO_TRABALHO_ANOS,
  C.PAGARCT, C.DESC_RECEBIMENTO, C.SALARIO, C.TIPO_DEMISSAO,
  CATEGORIA_DEMISSAO (VOLUNTARIA/INVOLUNTARIA), C.ANOCOMP, C.MESCOMP, C.PERIODO,
  SUM(PROVENTOS) OVER(PARTITION BY ...) AS PROVENTOS,
  SUM(DESCONTOS) OVER(PARTITION BY ...) AS DESCONTOS, LIQUIDO, LIQUIDO_FILIAL
FROM (
  SELECT DISTINCT ... FROM PFFINANC
  INNER JOIN PFUNC, PSECAO, GFILIAL, GCOLIGADA, PEVENTO, PFUNCAO, PCODSITUACAO, PPESSOA, PCODSEXO
  LEFT JOIN PTPFUNC, PCODRECEB, PFEVENTOSPROG
  WHERE PEVENTO.CODIGO != '0290'
) C
WHERE ISNULL(C.COD_SITUACAO,'') = 'D'
  AND (C.PERIODO LIKE '8%' OR (C.PERIODO LIKE '2%' AND C.COD_EVENTO_PROGRAMADO IN (...)))
ORDER BY C.ANOCOMP, C.MESCOMP, C.COD_COLIGADA, C.COD_FILIAL, C.CHAPA`,

7: `SELECT A.* FROM (
  SELECT DISTINCT C.COD_COLIGADA, C.NOME_COLIGADA, C.COD_FILIAL, C.NOME_FILIAL,
    C.CHAPA, C.NOME_FUNCIONARIO, C.CPF, C.NOME_SETOR, C.NOME_CARGO,
    C.DESC_SITUACAO, C.DESC_SEXO, C.IDADE, FAIXA_ETARIA, C.DATA_ADMISSAO,
    C.DATA_DEMISSAO, C.TEMPO_TRABALHO_DIAS, C.TEMPO_TRABALHO_MESES, C.TEMPO_TRABALHO_ANOS,
    CASE WHEN <1 THEN '<1 ano' WHEN <3 THEN '1-3 anos' WHEN <5 THEN '3-5 anos'
         WHEN <10 THEN '5-10 anos' WHEN >=10 THEN '10+' END AS TEMPO_EMPRESA,
    ROW_NUMBER() OVER (PARTITION BY C.CPF ORDER BY CASE WHEN C.COD_SITUACAO != 'D' THEN 1 ELSE 2 END) AS RN
  FROM (
    SELECT DISTINCT ... FROM PFUNC INNER JOIN GCOLIGADA, PCODSITUACAO, PFUNCAO, PSECAO, PPESSOA, PCODSEXO, GFILIAL
  ) C
) A WHERE UPPER(A.NOME_SETOR) != 'AUTONOMO' AND A.RN = 1
ORDER BY A.COD_COLIGADA, A.COD_FILIAL, A.CHAPA`,

8: `SELECT C.COD_COLIGADA, C.NOME_COLIGADA, C.COD_FILIAL, C.NOME_FILIAL,
  C.CHAPA, C.NOME_FUNCIONARIO, C.NOME_SETOR, C.NOME_CARGO, C.DESC_SITUACAO,
  C.DESC_SEXO, C.IDADE, FAIXA_ETARIA, C.CID, C.DESC_CID, C.TIPO_ATESTADO_DESCRICAO,
  C.DTINICIO, C.DTFINAL, C.Dias, C.CATEGORIA, C.NOMEMEDICO,
  C.JUSTIFICATIVA, C.STATUS_DESCRICAO, C.VALIDADO_DESCRICAO
FROM (
  SELECT ... DATEDIFF(DAY, V.DTINICIO, ISNULL(V.DTFINAL, GETDATE())) + 1 AS Dias,
    CASE WHEN DATEDIFF(DAY, V.DTINICIO, V.DTFINAL) > 15 THEN 'AFASTAMENTO'
         WHEN DATEDIFF(DAY, V.DTINICIO, V.DTFINAL) = 0 AND ... THEN 'DECLARACAO'
         ELSE 'ATESTADO' END AS CATEGORIA,
    CASE V.STATUS WHEN 0 THEN 'PENDENTE VALIDACAO' WHEN 1 THEN 'APROVADO' WHEN 2 THEN 'REPROVADO' END
  FROM VPREATESTADO V
  INNER JOIN VCID, PFUNC, GCOLIGADA, PCODSITUACAO, PFUNCAO, PSECAO, PPESSOA, PCODSEXO, GFILIAL
) C WHERE C.COD_SITUACAO != 'D' AND UPPER(C.CATEGORIA) = 'AFASTAMENTO'
ORDER BY C.COD_COLIGADA, C.COD_FILIAL, C.CHAPA`,

9: `SELECT C.COD_COLIGADA, C.NOME_COLIGADA, C.COD_FILIAL, C.NOME_FILIAL,
  C.CHAPA, C.NOME_FUNCIONARIO, C.NOME_SETOR, C.NOME_CARGO, C.DESC_SITUACAO,
  C.DESC_SEXO, C.IDADE, FAIXA_ETARIA, C.CID, C.DESC_CID, C.TIPO_ATESTADO_DESCRICAO,
  C.DTINICIO, C.DTFINAL, C.Dias, C.CATEGORIA, C.NOMEMEDICO,
  C.JUSTIFICATIVA, C.STATUS_DESCRICAO, C.VALIDADO_DESCRICAO
FROM (
  SELECT ... (mesma estrutura do Dashboard 8)
  FROM VPREATESTADO V
  INNER JOIN VCID, PFUNC, GCOLIGADA, PCODSITUACAO, PFUNCAO, PSECAO, PPESSOA, PCODSEXO, GFILIAL
) C WHERE C.COD_SITUACAO != 'D' AND UPPER(C.CATEGORIA) = 'ATESTADO'
ORDER BY C.COD_COLIGADA, C.COD_FILIAL, C.CHAPA`
};

// ========== FILIAIS E DADOS FICTÍCIOS ==========
const FILIAIS = ["Loja Centro","Loja Shopping","Loja Av. Brasil","Loja Mossoró","Loja Caicó","CD Logístico"];
const SETORES = ["Operações","Frente de Caixa","Açougue","Padaria","Hortifruti","Estoque","Administrativo","RH","Financeiro","TI","Fiscal","Compras","Logística","Manutenção","Prevenção de Perdas"];
const CARGOS = ["Operador de Caixa","Repositor","Açougueiro","Padeiro","Aux. Hortifruti","Estoquista","Aux. Administrativo","Analista RH","Conferente","Fiscal de Loja","Encarregado","Supervisor","Gerente","Aux. Financeiro","Motorista"];
const NOMES = ["Maria Silva","João Santos","Ana Oliveira","Pedro Souza","Francisca Lima","José Costa","Antônia Pereira","Carlos Araújo","Raimunda Alves","Francisco Nascimento","Sandra Rocha","Luiz Ferreira","Mariana Gomes","Roberto Barbosa","Patrícia Ribeiro","Fernando Carvalho","Juliana Martins","Ricardo Monteiro","Cláudia Mendes","André Cavalcante"];
const BANCOS = ["Banco do Brasil S.A.","Caixa Econômica Federal","Banco Bradesco S.A.","Itaú Unibanco S.A.","Banco Santander S.A.","Banco BMG S.A.","Banco PAN S.A.","Banco Agibank S.A.","Banco C6 Consignado S.A.","Nu Financeira S.A."];
const CIDS = ["M54.5 - Dor lombar baixa","J06.9 - Inf. aguda vias aéreas sup.","K29.7 - Gastrite não especificada","R51 - Cefaleia","J11 - Influenza","M79.1 - Mialgia","S61.0 - Ferimento do dedo","R10.4 - Dor abdominal","K08.8 - Problemas dentários","F41.0 - Transtorno de ansiedade"];

const fmt = v => "R$ " + v.toFixed(2).replace(".",",").replace(/\B(?=(\d{3})+(?!\d))/g,".");
const fmtP = v => v.toFixed(1).replace(".",",") + "%";
const fmtN = v => v.toLocaleString("pt-BR");

// ========== COMPONENTES REUTILIZÁVEIS ==========
const KPICard = ({icon, label, value, sub, color = "var(--primary)"}) => (
  <div style={{background:"var(--card)",borderRadius:8,boxShadow:"0 1px 3px rgba(0,0,0,0.08)",borderLeft:`4px solid ${color}`,padding:"16px 20px",display:"flex",alignItems:"center",gap:14,minWidth:180,flex:1}}>
    <span style={{fontSize:28}}>{icon}</span>
    <div>
      <div style={{fontSize:13,color:"var(--text-muted)",marginBottom:2}}>{label}</div>
      <div style={{fontSize:26,fontWeight:700,color:"var(--text)"}}>{value}</div>
      {sub && <div style={{fontSize:12,color:"var(--text-muted)",marginTop:2}}>{sub}</div>}
    </div>
  </div>
);

const HBar = ({data, color = "var(--primary)", maxVal}) => {
  const mx = maxVal || Math.max(...data.map(d=>d.value));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {data.map((d,i) => (
        <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:120,fontSize:12,color:"var(--text-muted)",textAlign:"right",flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.label}</div>
          <div style={{flex:1,background:"var(--bg)",borderRadius:4,height:20,overflow:"hidden"}}>
            <div style={{width:`${(d.value/mx)*100}%`,background:d.color||color,height:"100%",borderRadius:4,transition:"width 0.5s",minWidth:d.value>0?2:0}}/>
          </div>
          <div style={{width:60,fontSize:12,fontWeight:600,color:"var(--text)",textAlign:"right"}}>{typeof d.display === "string" ? d.display : fmtN(d.value)}</div>
        </div>
      ))}
    </div>
  );
};

const VBar = ({data, color = "var(--primary)", height = 160}) => {
  const mx = Math.max(...data.map(d=>d.value));
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:4,height,paddingTop:20}}>
      {data.map((d,i) => (
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div style={{fontSize:10,fontWeight:600,color:"var(--text)"}}>{fmtN(d.value)}</div>
          <div style={{width:"100%",maxWidth:40,background:d.color||color,borderRadius:"4px 4px 0 0",height:`${(d.value/mx)*100}%`,minHeight:d.value>0?2:0,transition:"height 0.5s"}}/>
          <div style={{fontSize:10,color:"var(--text-muted)",textAlign:"center",lineHeight:1.1,maxWidth:50,overflow:"hidden"}}>{d.label}</div>
        </div>
      ))}
    </div>
  );
};

const StackedVBar = ({data, height = 160}) => {
  const mx = Math.max(...data.map(d=>(d.v1||0)+(d.v2||0)));
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:4,height,paddingTop:20}}>
      {data.map((d,i) => {
        const total = (d.v1||0)+(d.v2||0);
        const h = (total/mx)*100;
        const h1 = total>0?((d.v1||0)/total)*h:0;
        const h2 = total>0?((d.v2||0)/total)*h:0;
        return (
          <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <div style={{fontSize:9,fontWeight:600,color:"var(--text)"}}>{fmtN(total)}</div>
            <div style={{width:"100%",maxWidth:36,display:"flex",flexDirection:"column",borderRadius:"4px 4px 0 0",overflow:"hidden"}}>
              <div style={{background:"var(--success)",height:`${h1}%`,minHeight:h1>0?1:0}}/>
              <div style={{background:"var(--danger)",height:`${h2}%`,minHeight:h2>0?1:0}}/>
            </div>
            <div style={{fontSize:9,color:"var(--text-muted)",textAlign:"center",maxWidth:50,overflow:"hidden"}}>{d.label}</div>
          </div>
        );
      })}
    </div>
  );
};

const Donut = ({data, size = 140}) => {
  let acc = 0;
  const total = data.reduce((s,d)=>s+d.value,0);
  const segments = data.map(d => {
    const start = acc;
    acc += (d.value/total)*360;
    return `${d.color} ${start}deg ${acc}deg`;
  });
  return (
    <div style={{display:"flex",alignItems:"center",gap:16}}>
      <div style={{width:size,height:size,borderRadius:"50%",background:`conic-gradient(${segments.join(",")})`,position:"relative",flexShrink:0}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:size*0.55,height:size*0.55,borderRadius:"50%",background:"var(--card)"}}/>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        {data.map((d,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:12}}>
            <div style={{width:10,height:10,borderRadius:2,background:d.color,flexShrink:0}}/>
            <span style={{color:"var(--text-muted)"}}>{d.label}</span>
            <span style={{fontWeight:600,color:"var(--text)"}}>{fmtN(d.value)} ({fmtP(d.value/total*100)})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChartCard = ({title, children, style:s}) => (
  <div style={{background:"var(--card)",borderRadius:8,boxShadow:"0 1px 3px rgba(0,0,0,0.08)",padding:16,...s}}>
    <div style={{fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:12,borderBottom:"1px solid var(--border)",paddingBottom:8}}>{title}</div>
    {children}
  </div>
);

const DataTable = ({columns, rows}) => (
  <div style={{overflowX:"auto",maxHeight:320}}>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,fontFamily:"Segoe UI,sans-serif"}}>
      <thead>
        <tr>{columns.map((c,i)=><th key={i} style={{background:"var(--primary)",color:"#fff",padding:"8px 10px",textAlign:"left",position:"sticky",top:0,whiteSpace:"nowrap",fontSize:12,fontWeight:600}}>{c}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r,i)=>(
          <tr key={i} style={{background:i%2===0?"var(--card)":"var(--bg)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"6px 10px",borderBottom:"1px solid var(--border)",whiteSpace:"nowrap",color:"var(--text)"}}>{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ScriptModal = ({show, onClose, sql, dashNum}) => {
  if (!show) return null;
  const ref = useRef(null);
  const copy = () => {
    if(ref.current){navigator.clipboard.writeText(ref.current.textContent);alert("SQL copiado!")}
  };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#1e293b",borderRadius:12,width:"90%",maxWidth:900,maxHeight:"85vh",display:"flex",flexDirection:"column",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:"1px solid #334155"}}>
          <div style={{color:"#f1f5f9",fontWeight:700,fontSize:16}}>📜 Script SQL — Dashboard {dashNum}</div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={copy} style={{background:"var(--primary)",color:"#fff",border:"none",borderRadius:6,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:600}}>📋 Copiar</button>
            <button onClick={onClose} style={{background:"#475569",color:"#fff",border:"none",borderRadius:6,padding:"6px 14px",cursor:"pointer",fontSize:13}}>✕ Fechar</button>
          </div>
        </div>
        <div style={{padding:"16px 20px",overflowY:"auto",flex:1}}>
          <div style={{background:"#f59e0b22",border:"1px solid #f59e0b55",borderRadius:6,padding:"8px 12px",marginBottom:12,fontSize:12,color:"#fbbf24"}}>
            ⚠️ Este é o script resumido. O script <strong>completo e original</strong> está disponível nos arquivos .sql entregues junto com este protótipo.
          </div>
          <pre ref={ref} style={{color:"#e2e8f0",fontSize:13,lineHeight:1.6,whiteSpace:"pre-wrap",wordBreak:"break-word",margin:0,fontFamily:"Consolas, 'Courier New', monospace"}}>{sql}</pre>
        </div>
      </div>
    </div>
  );
};

// ========== DASHBOARD 1: COLABORADORES ==========
const Dash1 = () => {
  const ativos=1847, headcountFilial="Loja Centro", headcountVal=412, salMedio=2145.67, admMes=38, deslMes=22, turnover=(22/1847)*100;
  const porFilial = [{label:"Loja Centro",value:412},{label:"Loja Shopping",value:356},{label:"Loja Av. Brasil",value:328},{label:"Loja Mossoró",value:298},{label:"Loja Caicó",value:265},{label:"CD Logístico",value:188}];
  const porSexo = [{label:"Masculino",value:1105,color:"var(--primary)"},{label:"Feminino",value:742,color:"var(--accent)"}];
  const porFaixa = [{label:"<18",value:45},{label:"18-24",value:412},{label:"25-34",value:623},{label:"35-44",value:438},{label:"45-54",value:234},{label:"55+",value:95}];
  const topSetores = [{label:"Frente de Caixa",value:385},{label:"Operações",value:342},{label:"Açougue",value:178},{label:"Padaria",value:152},{label:"Estoque",value:143},{label:"Hortifruti",value:128},{label:"Prevenção Perdas",value:98},{label:"Logística",value:95},{label:"Administrativo",value:87},{label:"Manutenção",value:72}];
  const evolucao = [{label:"Jan",v1:32,v2:18},{label:"Fev",v1:28,v2:21},{label:"Mar",v1:45,v2:15},{label:"Abr",v1:38,v2:22},{label:"Mai",v1:41,v2:19},{label:"Jun",v1:35,v2:24},{label:"Jul",v1:29,v2:17},{label:"Ago",v1:37,v2:20},{label:"Set",v1:42,v2:23},{label:"Out",v1:33,v2:16},{label:"Nov",v1:36,v2:25},{label:"Dez",v1:30,v2:14}];
  const porSituacao = [{label:"Ativo",value:1847,color:"var(--success)"},{label:"Demitido",value:312,color:"var(--danger)"},{label:"Afastado",value:43,color:"var(--warning)"}];
  const rows = NOMES.slice(0,12).map((n,i)=>[
    String(1000+i),n,FILIAIS[i%6],SETORES[i%15],CARGOS[i%15],i<10?"Ativo":i===10?"Afastado":"Demitido",i%2===0?"Masculino":"Feminino",String(22+i*3),fmt(1400+Math.random()*2000),`0${(i%12)+1}/0${(i%28)+1}/202${i%4}`,i>=10?`0${(i%12)+1}/15/2026`:"-"
  ]);
  return (<>
    <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
      <KPICard icon="👥" label="Total Colaboradores Ativos" value={fmtN(ativos)} color="var(--primary)"/>
      <KPICard icon="📊" label="Headcount Líder" value={fmtN(headcountVal)} sub={`${headcountFilial} lidera`} color="var(--primary-light)"/>
      <KPICard icon="💰" label="Salário Médio" value={fmt(salMedio)} color="var(--accent)"/>
      <KPICard icon="📈" label="Admissões no Mês" value={fmtN(admMes)} color="var(--success)"/>
      <KPICard icon="📉" label="Desligamentos no Mês" value={fmtN(deslMes)} color="var(--danger)"/>
      <KPICard icon="⚖️" label="Turnover" value={fmtP(turnover)} sub={turnover>5?"Acima do ideal":"Dentro da meta"} color={turnover>5?"var(--danger)":turnover<3?"var(--success)":"var(--warning)"}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
      <ChartCard title="Colaboradores por Filial"><HBar data={porFilial}/></ChartCard>
      <ChartCard title="Distribuição por Sexo"><Donut data={porSexo} size={120}/></ChartCard>
      <ChartCard title="Distribuição por Faixa Etária"><VBar data={porFaixa.map((d,i)=>({...d,color:i===2?"var(--accent)":"var(--primary)"}))} height={130}/></ChartCard>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
      <ChartCard title="Top 10 Setores"><HBar data={topSetores}/></ChartCard>
      <ChartCard title="Admissões vs Desligamentos (mês a mês)"><StackedVBar data={evolucao} height={130}/><div style={{display:"flex",gap:12,justifyContent:"center",marginTop:8}}><span style={{fontSize:11,color:"var(--success)"}}>■ Admissões</span><span style={{fontSize:11,color:"var(--danger)"}}>■ Desligamentos</span></div></ChartCard>
      <ChartCard title="Distribuição por Situação"><Donut data={porSituacao} size={120}/></ChartCard>
    </div>
    <ChartCard title="Tabela Analítica — Colaboradores">
      <DataTable columns={["Chapa","Nome","Filial","Setor","Cargo","Situação","Sexo","Idade","Salário","Dt. Admissão","Dt. Demissão"]} rows={rows}/>
    </ChartCard>
  </>);
};

// ========== DASHBOARD 2: CONTROLE DE FÉRIAS ==========
const Dash2 = () => {
  const programadas=124, vencidos=18, custoMes=287450.32, mediaDias=22.4, abonos=31, irrfTotal=42380.15;
  const custoFilial = [{label:"Loja Centro",value:68200},{label:"Loja Shopping",value:54300},{label:"Loja Av. Brasil",value:48700},{label:"Loja Mossoró",value:43800},{label:"Loja Caicó",value:39200},{label:"CD Logístico",value:33250}];
  const porStatus = [{label:"Marcadas",value:124,color:"var(--primary)"},{label:"Pagas",value:89,color:"var(--success)"},{label:"Finalizadas",value:456,color:"var(--text-muted)"},{label:"Ag. Aprov. DP",value:15,color:"var(--warning)"},{label:"Ag. Aprov. Gestor",value:8,color:"var(--accent)"}];
  const topSetoresCusto = [{label:"Frente de Caixa",value:52400},{label:"Operações",value:48200},{label:"Açougue",value:31500},{label:"Padaria",value:28900},{label:"Estoque",value:25600},{label:"Hortifruti",value:22300},{label:"Administrativo",value:19800},{label:"Logística",value:18400},{label:"Manutenção",value:15200},{label:"TI",value:12800}];
  const provDesc = FILIAIS.map(f=>({label:f.replace("Loja ",""),v1:28000+Math.random()*40000|0,v2:8000+Math.random()*15000|0}));
  const rows = NOMES.slice(0,10).map((n,i)=>[
    String(1000+i),n,FILIAIS[i%6],SETORES[i%10],`01/0${i+1}/2024`,`01/0${i+1}/2025`,`01/0${i+1}/2026`,String(30-i*2),String(20+i),String(i<3?0:10-i),fmt(2800+Math.random()*3000),["M - Marcadas","P - Pagas","F - Finalizadas","D - Ag. Aprov. DP"][i%4]
  ]);
  return (<>
    <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
      <KPICard icon="🏖️" label="Férias Programadas" value={fmtN(programadas)} color="var(--primary)"/>
      <KPICard icon="⏳" label="Períodos Vencidos" value={fmtN(vencidos)} sub="Atenção: obrigação legal" color="var(--danger)"/>
      <KPICard icon="💵" label="Custo Total Férias (mês)" value={fmt(custoMes)} color="var(--accent)"/>
      <KPICard icon="📊" label="Média Dias de Gozo" value={mediaDias.toFixed(1).replace(".",",")} color="var(--primary-light)"/>
      <KPICard icon="🔄" label="Abonos Pecuniários" value={fmtN(abonos)} color="var(--warning)"/>
      <KPICard icon="💰" label="IRRF Total" value={fmt(irrfTotal)} color="var(--text-muted)"/>
    </div>
    <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
      <div style={{background:"var(--card)",borderRadius:8,padding:"10px 16px",borderLeft:"4px solid var(--success)",flex:1,minWidth:150}}>
        <div style={{fontSize:12,color:"var(--text-muted)"}}>Saldo &gt; 20 dias</div><div style={{fontSize:20,fontWeight:700,color:"var(--success)"}}>847</div>
      </div>
      <div style={{background:"var(--card)",borderRadius:8,padding:"10px 16px",borderLeft:"4px solid var(--warning)",flex:1,minWidth:150}}>
        <div style={{fontSize:12,color:"var(--text-muted)"}}>Saldo 10-20 dias</div><div style={{fontSize:20,fontWeight:700,color:"var(--warning)"}}>312</div>
      </div>
      <div style={{background:"var(--card)",borderRadius:8,padding:"10px 16px",borderLeft:"4px solid var(--danger)",flex:1,minWidth:150}}>
        <div style={{fontSize:12,color:"var(--text-muted)"}}>Saldo &lt; 10 / Vencido</div><div style={{fontSize:20,fontWeight:700,color:"var(--danger)"}}>18</div>
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
      <ChartCard title="Custo de Férias por Filial"><HBar data={custoFilial} color="var(--accent)"/></ChartCard>
      <ChartCard title="Distribuição por Status"><Donut data={porStatus} size={110}/></ChartCard>
      <ChartCard title="Top 10 Setores (Custo)"><HBar data={topSetoresCusto} color="var(--primary-light)"/></ChartCard>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      <ChartCard title="Proventos vs Descontos por Filial"><StackedVBar data={provDesc} height={130}/><div style={{display:"flex",gap:12,justifyContent:"center",marginTop:8}}><span style={{fontSize:11,color:"var(--success)"}}>■ Proventos</span><span style={{fontSize:11,color:"var(--danger)"}}>■ Descontos</span></div></ChartCard>
      <ChartCard title="Semáforo — Períodos Aquisitivos" style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
        <div style={{display:"flex",gap:24,justifyContent:"center",alignItems:"center",padding:20}}>
          {[{c:"#22C55E",l:"OK (>20d)",v:847},{c:"#F59E0B",l:"Atenção (10-20d)",v:312},{c:"#EF4444",l:"Crítico (<10d)",v:18}].map((s,i)=>(
            <div key={i} style={{textAlign:"center"}}><div style={{width:48,height:48,borderRadius:"50%",background:s.c,margin:"0 auto 8px",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:16}}>{s.v}</div><div style={{fontSize:11,color:"var(--text-muted)"}}>{s.l}</div></div>
          ))}
        </div>
      </ChartCard>
    </div>
    <ChartCard title="Tabela Analítica — Férias">
      <DataTable columns={["Chapa","Nome","Filial","Setor","Per. Aquisitivo","Limite","Saldo","Dias Gozo","Abono","Líquido","Status"]} rows={rows}/>
    </ChartCard>
  </>);
};

// ========== DASHBOARD 3: CONTROLE DE HORAS (PLACEHOLDER) ==========
const Dash3 = () => {
  const placeholderKPIs = [{icon:"⏰",label:"Horas Trabalhadas"},{icon:"🕐",label:"Banco de Horas"},{icon:"📊",label:"Horas Extras"},{icon:"🔴",label:"Atrasos"},{icon:"✅",label:"Assiduidade (%)"}];
  const grayData = FILIAIS.map(f=>({label:f.replace("Loja ",""),value:0}));
  return (<>
    <div style={{background:"var(--accent)",borderRadius:8,padding:"12px 20px",marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
      <span style={{fontSize:24}}>🚧</span>
      <div><div style={{fontWeight:700,color:"#fff",fontSize:15}}>Dados em Implantação</div><div style={{color:"#fff",opacity:0.85,fontSize:13}}>As consultas de controle de horas estão sendo desenvolvidas. Os indicadores abaixo são placeholders.</div></div>
    </div>
    <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
      {placeholderKPIs.map((k,i)=><KPICard key={i} icon={k.icon} label={k.label} value="—" color="var(--border)"/>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
      <ChartCard title="Horas por Filial"><HBar data={grayData.map(d=>({...d,value:1}))} color="var(--border)"/></ChartCard>
      <ChartCard title="Distribuição por Tipo"><Donut data={[{label:"Sem dados",value:1,color:"var(--border)"}]} size={110}/></ChartCard>
      <ChartCard title="Evolução Mensal"><VBar data={Array(12).fill(0).map((_,i)=>({label:["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][i],value:1}))} color="var(--border)" height={130}/></ChartCard>
    </div>
    <ChartCard title="Tabela Analítica — Controle de Horas">
      <div style={{textAlign:"center",padding:40,color:"var(--text-muted)",fontSize:14}}>📋 Dados indisponíveis — consulta em implantação</div>
    </ChartCard>
  </>);
};

// ========== DASHBOARD 4: FOLHA DE PAGAMENTO ==========
const Dash4 = () => {
  const totalDebito=4823567.89, totalCredito=4823567.89, custoMedio=2612.34, filialMaiorCusto="Loja Centro", totalLotes=8;
  const custoFilial = [{label:"Loja Centro",value:1124500},{label:"Loja Shopping",value:968300},{label:"Loja Av. Brasil",value:842700},{label:"Loja Mossoró",value:756800},{label:"Loja Caicó",value:652400},{label:"CD Logístico",value:478867}];
  const debCredFilial = FILIAIS.map(f=>({label:f.replace("Loja ",""),v1:400000+Math.random()*800000|0,v2:400000+Math.random()*800000|0}));
  const porNivel = [{label:"1 - Ativo",value:1245000,color:"var(--primary)"},{label:"2 - Passivo Circulante",value:2156000,color:"var(--accent)"},{label:"4 - Contas Resultado",value:1422567,color:"var(--primary-light)"}];
  const topCCusto = [{label:"CC Operações Lj Centro",value:342000},{label:"CC FDC Lj Shopping",value:298000},{label:"CC Operações Lj Shopping",value:267000},{label:"CC Açougue Lj Centro",value:234000},{label:"CC FDC Lj Av. Brasil",value:218000},{label:"CC Padaria Lj Centro",value:195000},{label:"CC Estoque CD Log.",value:178000},{label:"CC Operações Lj Mossoró",value:164000},{label:"CC Adm Geral",value:152000},{label:"CC FDC Lj Mossoró",value:141000}];
  const topContas = [{label:"Salários a Pagar",value:2850000},{label:"INSS a Recolher",value:578000},{label:"FGTS a Recolher",value:386000},{label:"IRRF a Recolher",value:245000},{label:"Vale Transporte",value:198000},{label:"Vale Alimentação",value:175000},{label:"Provisão 13º",value:142000},{label:"Provisão Férias",value:128000},{label:"Pensão Alimentícia",value:87000},{label:"Sindicato",value:34567}];
  const rows = NOMES.slice(0,10).map((n,i)=>[
    `L${100+i%8}`,FILIAIS[i%6],String(1000+i),n,SETORES[i%10],`CC ${SETORES[i%10]}`,`${i+1}.01.001`,`Conta ${i+1}`,fmt(2000+Math.random()*3000),fmt(1800+Math.random()*2500)
  ]);
  return (<>
    <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
      <KPICard icon="💰" label="Total Folha (Débito)" value={fmt(totalDebito)} color="var(--danger)"/>
      <KPICard icon="💳" label="Total Folha (Crédito)" value={fmt(totalCredito)} color="var(--success)"/>
      <KPICard icon="📊" label="Custo Médio / Colaborador" value={fmt(custoMedio)} color="var(--primary)"/>
      <KPICard icon="🏢" label="Filial Maior Custo" value={filialMaiorCusto} sub={fmt(1124500)} color="var(--accent)"/>
      <KPICard icon="📋" label="Total de Lotes" value={fmtN(totalLotes)} color="var(--primary-light)"/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
      <ChartCard title="Custo da Folha por Filial"><HBar data={custoFilial} color="var(--primary)"/></ChartCard>
      <ChartCard title="Débito vs Crédito por Filial"><StackedVBar data={debCredFilial} height={130}/><div style={{display:"flex",gap:12,justifyContent:"center",marginTop:8}}><span style={{fontSize:11,color:"var(--success)"}}>■ Débito</span><span style={{fontSize:11,color:"var(--danger)"}}>■ Crédito</span></div></ChartCard>
      <ChartCard title="Distribuição por Nível Contábil"><Donut data={porNivel} size={110}/></ChartCard>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      <ChartCard title="Top 10 Centros de Custo"><HBar data={topCCusto} color="var(--accent)"/></ChartCard>
      <ChartCard title="Top 10 Contas Contábeis"><HBar data={topContas} color="var(--primary-dark)"/></ChartCard>
    </div>
    <ChartCard title="Tabela Analítica — Folha de Pagamento">
      <DataTable columns={["Lote","Filial","Chapa","Nome","Setor","Centro Custo","Conta","Descrição","Débito","Crédito"]} rows={rows}/>
    </ChartCard>
  </>);
};

// ========== DASHBOARD 5: EMPRÉSTIMOS ==========
const Dash5 = () => {
  const totalAtivos=342, volumeTotal=4856230.00, saldoDevedor=2134500.00, descontoMensal=187650.00, colabComEmp=298, pctQuadro=(298/1847)*100;
  const porBanco = [{label:"Banco do Brasil",value:1245000},{label:"Caixa Econômica",value:987000},{label:"Bradesco",value:756000},{label:"Itaú Unibanco",value:645000},{label:"Santander",value:432000},{label:"BMG",value:312000},{label:"PAN",value:198000},{label:"Agibank",value:145000},{label:"C6 Consignado",value:89230},{label:"Nu Financeira",value:47000}];
  const porTipo = [{label:"Consignado Privado",value:198,color:"var(--primary)"},{label:"Consignado Público",value:87,color:"var(--accent)"},{label:"Empréstimo Pessoal",value:42,color:"var(--primary-light)"},{label:"Outros",value:15,color:"var(--text-muted)"}];
  const evolDesc = [{label:"Jan",value:165000},{label:"Fev",value:172000},{label:"Mar",value:178000},{label:"Abr",value:187650},{label:"Mai",value:183000},{label:"Jun",value:175000},{label:"Jul",value:169000},{label:"Ago",value:174000},{label:"Set",value:180000},{label:"Out",value:185000},{label:"Nov",value:182000},{label:"Dez",value:178000}];
  const topFilSaldo = [{label:"Loja Centro",value:523000},{label:"Loja Shopping",value:445000},{label:"Loja Av. Brasil",value:387000},{label:"Loja Mossoró",value:342000},{label:"Loja Caicó",value:265000},{label:"CD Logístico",value:172500}];
  const porTempo = [{label:"<1 ano",value:42,color:"var(--accent)"},{label:"1-3 anos",value:87,color:"var(--accent-light)"},{label:"3-5 anos",value:76,color:"var(--primary-light)"},{label:"5-10 anos",value:58,color:"var(--primary)"},{label:"10+",value:35,color:"var(--primary-dark)"}];
  const rows = NOMES.slice(0,10).map((n,i)=>[
    String(1000+i),n,FILIAIS[i%6],SETORES[i%10],BANCOS[i%10],"Consignado",fmt(8000+Math.random()*20000),fmt(400+Math.random()*800),`${6+i}/${12+i*2}`,fmt(2000+Math.random()*10000),`01/0${(i%12)+1}/2024`,`01/0${(i%12)+1}/2026`
  ]);
  return (<>
    <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
      <KPICard icon="🏦" label="Empréstimos Ativos" value={fmtN(totalAtivos)} color="var(--primary)"/>
      <KPICard icon="💰" label="Volume Total Emprestado" value={fmt(volumeTotal)} color="var(--accent)"/>
      <KPICard icon="📉" label="Saldo Devedor Total" value={fmt(saldoDevedor)} color="var(--danger)"/>
      <KPICard icon="💳" label="Desconto Mensal na Folha" value={fmt(descontoMensal)} color="var(--warning)"/>
      <KPICard icon="👥" label="Colaboradores c/ Empréstimo" value={fmtN(colabComEmp)} color="var(--primary-light)"/>
      <KPICard icon="📊" label="% do Quadro" value={fmtP(pctQuadro)} color="var(--text-muted)"/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
      <ChartCard title="Volume por Banco Credor"><HBar data={porBanco} color="var(--primary)"/></ChartCard>
      <ChartCard title="Distribuição por Tipo"><Donut data={porTipo} size={110}/></ChartCard>
      <ChartCard title="Desconto Mensal — Evolução"><VBar data={evolDesc} color="var(--accent)" height={130}/></ChartCard>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      <ChartCard title="Top Filiais por Saldo Devedor"><HBar data={topFilSaldo} color="var(--danger)"/></ChartCard>
      <ChartCard title="Por Faixa Tempo de Empresa"><Donut data={porTempo} size={110}/></ChartCard>
    </div>
    <ChartCard title="Tabela Analítica — Empréstimos">
      <DataTable columns={["Chapa","Nome","Filial","Setor","Banco","Tipo","Vl. Empréstimo","Parcela","Pagas/Total","Saldo Devedor","Início","Final"]} rows={rows}/>
    </ChartCard>
  </>);
};

// ========== DASHBOARD 6: RESCISÕES ==========
const Dash6 = () => {
  const totalMes=22, custoTotal=287340.56, custoMedio=13061.00, pctInvol=63.6, pctVol=36.4, tempoMedioCasa=2.3;
  const evolMensal = [{label:"Jan",value:18},{label:"Fev",value:21},{label:"Mar",value:15},{label:"Abr",value:22},{label:"Mai",value:19},{label:"Jun",value:24},{label:"Jul",value:17},{label:"Ago",value:20},{label:"Set",value:23},{label:"Out",value:16},{label:"Nov",value:25},{label:"Dez",value:14}];
  const volInvol = [{label:"Voluntária",value:8,color:"var(--success)"},{label:"Involuntária",value:14,color:"var(--danger)"}];
  const custoFilial = [{label:"Loja Centro",value:72340},{label:"Loja Shopping",value:58200},{label:"Loja Av. Brasil",value:51800},{label:"Loja Mossoró",value:42000},{label:"Loja Caicó",value:35000},{label:"CD Logístico",value:28000}];
  const topTipos = [{label:"Inic.Empregador sem justa causa",value:10},{label:"Inic.Empregado sem justa causa",value:5},{label:"Comum acordo",value:3},{label:"Término contrato",value:2},{label:"Inic.Empregador com justa causa",value:1},{label:"Outros",value:1}];
  const provDescFilial = FILIAIS.map(f=>({label:f.replace("Loja ",""),v1:20000+Math.random()*50000|0,v2:5000+Math.random()*15000|0}));
  const porFaixaDemitidos = [{label:"<18",value:2},{label:"18-24",value:8},{label:"25-34",value:6},{label:"35-44",value:3},{label:"45-54",value:2},{label:"55+",value:1}];
  const rows = NOMES.slice(0,10).map((n,i)=>[
    String(1000+i),n,FILIAIS[i%6],SETORES[i%10],CARGOS[i%10],["Inic.Empregador sem justa causa","Comum acordo","Inic.Empregado sem justa causa"][i%3],i%3===2?"VOLUNTARIA":"INVOLUNTARIA",`${(i%5)+1}a`,fmt(1400+Math.random()*2000),fmt(3000+Math.random()*8000),fmt(800+Math.random()*2000),fmt(2000+Math.random()*7000),`0${(i%12)+1}/15/2026`
  ]);
  return (<>
    <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
      <KPICard icon="🚪" label="Total Rescisões (mês)" value={fmtN(totalMes)} color="var(--danger)"/>
      <KPICard icon="💰" label="Custo Total Rescisões" value={fmt(custoTotal)} color="var(--accent)"/>
      <KPICard icon="📊" label="Custo Médio / Rescisão" value={fmt(custoMedio)} color="var(--primary)"/>
      <KPICard icon="🔴" label="% Involuntárias" value={fmtP(pctInvol)} sub={pctInvol>60?"Acima de 60%":""} color="var(--danger)"/>
      <KPICard icon="🟢" label="% Voluntárias" value={fmtP(pctVol)} color="var(--success)"/>
      <KPICard icon="⏱️" label="Tempo Médio de Casa" value={`${tempoMedioCasa.toFixed(1).replace(".",",")} anos`} color="var(--primary-light)"/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
      <ChartCard title="Evolução Mensal de Rescisões"><VBar data={evolMensal} color="var(--danger)" height={130}/></ChartCard>
      <ChartCard title="Voluntária vs Involuntária"><Donut data={volInvol} size={120}/></ChartCard>
      <ChartCard title="Custo por Filial"><HBar data={custoFilial} color="var(--accent)"/></ChartCard>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
      <ChartCard title="Top Tipos de Demissão"><HBar data={topTipos} color="var(--primary)"/></ChartCard>
      <ChartCard title="Proventos vs Descontos por Filial"><StackedVBar data={provDescFilial} height={130}/><div style={{display:"flex",gap:12,justifyContent:"center",marginTop:8}}><span style={{fontSize:11,color:"var(--success)"}}>■ Proventos</span><span style={{fontSize:11,color:"var(--danger)"}}>■ Descontos</span></div></ChartCard>
      <ChartCard title="Faixa Etária dos Desligados"><VBar data={porFaixaDemitidos} color="var(--primary-light)" height={130}/></ChartCard>
    </div>
    <ChartCard title="Tabela Analítica — Rescisões">
      <DataTable columns={["Chapa","Nome","Filial","Setor","Cargo","Tipo Demissão","Categoria","Tempo Casa","Salário","Proventos","Descontos","Líquido","Dt. Demissão"]} rows={rows}/>
    </ChartCard>
  </>);
};

// ========== DASHBOARD 7: TEMPO DE EMPRESA ==========
const Dash7 = () => {
  const tempoMedio=4.2, colab10plus=187, colab1menos=312, totalUnicos=1847, faixaPred="1-3 anos";
  const porFaixaTempo = [{label:"<1 ano",value:312,color:"var(--accent)"},{label:"1-3 anos",value:485,color:"var(--accent-light)"},{label:"3-5 anos",value:378,color:"var(--primary-light)"},{label:"5-10 anos",value:485,color:"var(--primary)"},{label:"10+",value:187,color:"var(--primary-dark)"}];
  const tempoFilial = [{label:"CD Logístico",value:6.1},{label:"Loja Centro",value:5.3},{label:"Loja Mossoró",value:4.8},{label:"Loja Shopping",value:3.9},{label:"Loja Av. Brasil",value:3.2},{label:"Loja Caicó",value:2.8}];
  const porSituacao = [{label:"Ativo",value:1847,color:"var(--success)"},{label:"Demitido",value:312,color:"var(--danger)"},{label:"Afastado",value:43,color:"var(--warning)"}];
  const topSetoresTempo = [{label:"TI",value:7.2},{label:"Administrativo",value:6.8},{label:"Financeiro",value:6.5},{label:"Manutenção",value:5.9},{label:"Logística",value:5.4},{label:"Compras",value:5.1},{label:"RH",value:4.8},{label:"Estoque",value:4.2},{label:"Açougue",value:3.8},{label:"Frente de Caixa",value:2.9}];
  const porSexo = [{label:"Masculino",value:1105,color:"var(--primary)"},{label:"Feminino",value:742,color:"var(--accent)"}];
  const porFaixaEtaria = [{label:"<18",value:45},{label:"18-24",value:412},{label:"25-34",value:623},{label:"35-44",value:438},{label:"45-54",value:234},{label:"55+",value:95}];
  const rows = NOMES.slice(0,12).map((n,i)=>[
    String(1000+i),n,"***.***.***-"+String(10+i),FILIAIS[i%6],SETORES[i%10],CARGOS[i%10],i<10?"Ativo":"Demitido",`0${(i%12)+1}/15/20${14+i%10}`,String((i*2+1).toFixed(1)),["<1 ano","1-3 anos","3-5 anos","5-10 anos","10+"][i%5],String(22+i*3),["18-24","25-34","35-44","45-54","55+"][i%5]
  ]);
  return (<>
    <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
      <KPICard icon="📅" label="Tempo Médio de Empresa" value={`${tempoMedio.toFixed(1).replace(".",",")} anos`} color="var(--primary)"/>
      <KPICard icon="🏆" label="Colaboradores 10+ anos" value={fmtN(colab10plus)} sub="Retenção" color="var(--accent)"/>
      <KPICard icon="🆕" label="Colaboradores < 1 ano" value={fmtN(colab1menos)} color="var(--warning)"/>
      <KPICard icon="👥" label="Total Únicos (CPF)" value={fmtN(totalUnicos)} color="var(--primary-light)"/>
      <KPICard icon="📊" label="Faixa Predominante" value={faixaPred} sub="485 colaboradores" color="var(--primary-dark)"/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
      <ChartCard title="Distribuição por Faixa de Tempo"><VBar data={porFaixaTempo} height={130}/></ChartCard>
      <ChartCard title="Tempo Médio por Filial"><HBar data={tempoFilial.map(d=>({...d,display:d.value.toFixed(1).replace(".",",")+"a"}))} color="var(--primary)"/></ChartCard>
      <ChartCard title="Distribuição por Situação"><Donut data={porSituacao} size={110}/></ChartCard>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
      <ChartCard title="Top 10 Setores (Tempo Médio)"><HBar data={topSetoresTempo.map(d=>({...d,display:d.value.toFixed(1).replace(".",",")+"a"}))} color="var(--accent)"/></ChartCard>
      <ChartCard title="Distribuição por Sexo"><Donut data={porSexo} size={110}/></ChartCard>
      <ChartCard title="Distribuição por Faixa Etária"><VBar data={porFaixaEtaria} color="var(--primary-light)" height={130}/></ChartCard>
    </div>
    <ChartCard title="Tabela Analítica — Tempo de Empresa">
      <DataTable columns={["Chapa","Nome","CPF","Filial","Setor","Cargo","Situação","Admissão","Tempo (anos)","Faixa Tempo","Idade","Faixa Etária"]} rows={rows}/>
    </ChartCard>
  </>);
};

// ========== DASHBOARD 8: AFASTAMENTOS ==========
const Dash8 = () => {
  const totalAfastados=43, diasTotal=1845, mediaDias=42.9, pendentes=7, reprovados=2, cidFreq="M54.5 - Dor lombar baixa";
  const topCids = [{label:"M54.5 Dor lombar",value:9},{label:"S62.0 Fratura mão",value:6},{label:"M51.1 Hérnia disco",value:5},{label:"S82.0 Fratura tíbia",value:4},{label:"G56.0 Túnel carpo",value:3},{label:"M75.1 Sínd. manguito",value:3},{label:"S42.0 Fratura clavíc.",value:3},{label:"F32.0 Ep. depressivo",value:2},{label:"O80 Parto normal",value:2},{label:"Z34 Gravidez normal",value:6}];
  const porFilial = [{label:"Loja Centro",value:11},{label:"Loja Shopping",value:9},{label:"Loja Av. Brasil",value:8},{label:"Loja Mossoró",value:7},{label:"Loja Caicó",value:5},{label:"CD Logístico",value:3}];
  const porStatus = [{label:"Aprovado",value:34,color:"var(--success)"},{label:"Pendente Validação",value:7,color:"var(--warning)"},{label:"Reprovado",value:2,color:"var(--danger)"}];
  const porTipo = [{label:"Atestado Médico",value:18,color:"var(--primary)"},{label:"Licença Maternidade",value:8,color:"var(--accent)"},{label:"Laudo Médico",value:7,color:"var(--primary-light)"},{label:"Doença Ocupacional",value:5,color:"var(--warning)"},{label:"Outros",value:5,color:"var(--text-muted)"}];
  const topSetores = [{label:"Operações",value:8},{label:"Estoque",value:6},{label:"Açougue",value:5},{label:"Frente de Caixa",value:5},{label:"Logística",value:4},{label:"Manutenção",value:4},{label:"Padaria",value:3},{label:"Hortifruti",value:3},{label:"Administrativo",value:3},{label:"Prevenção Perdas",value:2}];
  const porFaixa = [{label:"<18",value:0},{label:"18-24",value:5},{label:"25-34",value:12},{label:"35-44",value:14},{label:"45-54",value:8},{label:"55+",value:4}];
  const rows = NOMES.slice(0,10).map((n,i)=>[
    String(1000+i),n,FILIAIS[i%6],SETORES[i%10],CIDS[i%10].split(" - ")[0],CIDS[i%10].split(" - ")[1],"Atestado Médico",`0${(i%12)+1}/01/2026`,`0${(i%12)+1}/${15+i}/2026`,String(16+i*5),["APROVADO","PENDENTE VALIDACAO","APROVADO"][i%3],["VALIDADO","PENDENTE VALIDACAO","VALIDADO"][i%3],`Dr. ${["Silva","Santos","Oliveira","Costa","Lima"][i%5]}`
  ]);
  return (<>
    <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
      <KPICard icon="🏥" label="Total Afastados" value={fmtN(totalAfastados)} color="var(--danger)"/>
      <KPICard icon="📅" label="Dias Totais de Afastamento" value={fmtN(diasTotal)} color="var(--primary)"/>
      <KPICard icon="📊" label="Média de Dias" value={mediaDias.toFixed(1).replace(".",",")} color="var(--primary-light)"/>
      <KPICard icon="⏳" label="Pendentes de Validação" value={fmtN(pendentes)} color="var(--warning)"/>
      <KPICard icon="🔴" label="Reprovados" value={fmtN(reprovados)} color="var(--danger)"/>
      <KPICard icon="📋" label="CID Mais Frequente" value="M54.5" sub="Dor lombar baixa" color="var(--accent)"/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
      <ChartCard title="Top 10 CIDs"><HBar data={topCids} color="var(--danger)"/></ChartCard>
      <ChartCard title="Afastamentos por Filial"><VBar data={porFilial} color="var(--primary)" height={130}/></ChartCard>
      <ChartCard title="Status de Validação"><Donut data={porStatus} size={110}/></ChartCard>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
      <ChartCard title="Por Tipo de Atestado"><Donut data={porTipo} size={110}/></ChartCard>
      <ChartCard title="Top 10 Setores"><HBar data={topSetores} color="var(--primary-light)"/></ChartCard>
      <ChartCard title="Faixa Etária"><VBar data={porFaixa} color="var(--accent)" height={130}/></ChartCard>
    </div>
    <ChartCard title="Tabela Analítica — Afastamentos">
      <DataTable columns={["Chapa","Nome","Filial","Setor","CID","Descrição CID","Tipo","Início","Fim","Dias","Status","Validação","Médico"]} rows={rows}/>
    </ChartCard>
  </>);
};

// ========== DASHBOARD 9: ATESTADOS ==========
const Dash9 = () => {
  const totalAtestados=456, diasPerdidos=1823, mediaDias=4.0, colabDistintos=312, reincidencia=28, pendentes=15;
  const absenteismo = ((1823)/(1847*22)*100);
  const topCids = [{label:"J06.9 Inf. vias aéreas",value:87},{label:"R51 Cefaleia",value:62},{label:"K29.7 Gastrite",value:45},{label:"M54.5 Dor lombar",value:42},{label:"R10.4 Dor abdominal",value:38},{label:"J11 Influenza",value:34},{label:"M79.1 Mialgia",value:28},{label:"F41.0 Ansiedade",value:22},{label:"K08.8 Dentários",value:18},{label:"S61.0 Ferimento dedo",value:14}];
  const porFilial = [{label:"Loja Centro",value:98},{label:"Loja Shopping",value:87},{label:"Loja Av. Brasil",value:78},{label:"Loja Mossoró",value:72},{label:"Loja Caicó",value:65},{label:"CD Logístico",value:56}];
  const porSexo = [{label:"Masculino",value:245,color:"var(--primary)"},{label:"Feminino",value:211,color:"var(--accent)"}];
  const evolMensal = [{label:"Jan",value:42},{label:"Fev",value:38},{label:"Mar",value:52},{label:"Abr",value:45},{label:"Mai",value:36},{label:"Jun",value:48},{label:"Jul",value:32},{label:"Ago",value:41},{label:"Set",value:39},{label:"Out",value:35},{label:"Nov",value:28},{label:"Dez",value:20}];
  const topSetores = [{label:"Frente de Caixa",value:89},{label:"Operações",value:76},{label:"Estoque",value:52},{label:"Açougue",value:45},{label:"Padaria",value:38},{label:"Hortifruti",value:34},{label:"Logística",value:28},{label:"Manutenção",value:25},{label:"Prevenção Perdas",value:22},{label:"Administrativo",value:18}];
  const porStatusVal = [{label:"Aprovado",value:398,color:"var(--success)"},{label:"Pendente Validação",value:15,color:"var(--warning)"},{label:"Reprovado",value:43,color:"var(--danger)"}];
  const porFaixa = [{label:"<18",value:12},{label:"18-24",value:98},{label:"25-34",value:156},{label:"35-44",value:112},{label:"45-54",value:54},{label:"55+",value:24}];
  const rows = NOMES.slice(0,12).map((n,i)=>[
    String(1000+i),n,FILIAIS[i%6],SETORES[i%10],CIDS[i%10].split(" - ")[0],CIDS[i%10].split(" - ")[1],["Atestado Médico","Consulta Médica","Declaração de Ausência"][i%3],`0${(i%12)+1}/0${(i%28)+1}/2026`,`0${(i%12)+1}/0${Math.min((i%28)+3,28)}/2026`,String(1+i%5),["APROVADO","PENDENTE VALIDACAO","APROVADO","APROVADO"][i%4],["VALIDADO","PENDENTE VALIDACAO","VALIDADO","VALIDADO"][i%4]
  ]);
  return (<>
    <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
      <KPICard icon="📋" label="Total de Atestados" value={fmtN(totalAtestados)} color="var(--primary)"/>
      <KPICard icon="📅" label="Dias Totais Perdidos" value={fmtN(diasPerdidos)} color="var(--danger)"/>
      <KPICard icon="📊" label="Média Dias / Atestado" value={mediaDias.toFixed(1).replace(".",",")} color="var(--primary-light)"/>
      <KPICard icon="👥" label="Colaboradores Distintos" value={fmtN(colabDistintos)} color="var(--accent)"/>
      <KPICard icon="🔁" label="Reincidência (3+)" value={fmtN(reincidencia)} sub="Colaboradores com 3+ atestados" color="var(--warning)"/>
      <KPICard icon="⏳" label="Pendentes de Validação" value={fmtN(pendentes)} color="var(--warning)"/>
    </div>
    <div style={{background:"var(--card)",borderRadius:8,padding:"12px 20px",marginBottom:16,borderLeft:"4px solid var(--accent)",boxShadow:"0 1px 3px rgba(0,0,0,0.08)",display:"flex",alignItems:"center",gap:16}}>
      <div><span style={{fontSize:13,color:"var(--text-muted)"}}>Absenteísmo (%) = Dias Perdidos / Dias Úteis</span></div>
      <div style={{fontSize:22,fontWeight:700,color:absenteismo>5?"var(--danger)":"var(--warning)"}}>{fmtP(absenteismo)}</div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
      <ChartCard title="Top 10 CIDs"><HBar data={topCids} color="var(--primary)"/></ChartCard>
      <ChartCard title="Atestados por Filial"><VBar data={porFilial} color="var(--accent)" height={130}/></ChartCard>
      <ChartCard title="Distribuição por Sexo"><Donut data={porSexo} size={110}/></ChartCard>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:16}}>
      <ChartCard title="Evolução Mensal"><VBar data={evolMensal} color="var(--primary-light)" height={120}/></ChartCard>
      <ChartCard title="Top 10 Setores"><HBar data={topSetores} color="var(--danger)"/></ChartCard>
      <ChartCard title="Status de Validação"><Donut data={porStatusVal} size={100}/></ChartCard>
      <ChartCard title="Faixa Etária"><VBar data={porFaixa} color="var(--accent)" height={120}/></ChartCard>
    </div>
    <ChartCard title="Tabela Analítica — Atestados">
      <DataTable columns={["Chapa","Nome","Filial","Setor","CID","Descrição CID","Tipo Atestado","Início","Fim","Dias","Status","Validação"]} rows={rows}/>
    </ChartCard>
  </>);
};

// ========== SIDEBAR + HEADER + MAIN APP ==========
const DASHBOARDS = [
  {id:1,icon:"👥",label:"Colaboradores"},
  {id:2,icon:"🏖️",label:"Controle de Férias"},
  {id:3,icon:"⏰",label:"Controle de Horas"},
  {id:4,icon:"💰",label:"Folha de Pagamento"},
  {id:5,icon:"🏦",label:"Empréstimos"},
  {id:6,icon:"🚪",label:"Rescisões"},
  {id:7,icon:"📅",label:"Tempo de Empresa"},
  {id:8,icon:"🏥",label:"Afastamentos"},
  {id:9,icon:"📋",label:"Atestados"},
];

const DashComponents = {1:Dash1,2:Dash2,3:Dash3,4:Dash4,5:Dash5,6:Dash6,7:Dash7,8:Dash8,9:Dash9};

export default function App() {
  const [active, setActive] = useState(1);
  const [sideOpen, setSideOpen] = useState(true);
  const [showScript, setShowScript] = useState(false);
  const DashComponent = DashComponents[active];

  return (
    <div style={{
      "--primary":"#2B5EA7","--primary-dark":"#1E4A85","--primary-light":"#3A7BD5",
      "--accent":"#F5A623","--accent-light":"#FFD166",
      "--bg":"#F0F4F8","--card":"#FFFFFF","--text":"#1A2B42","--text-muted":"#6B7C93",
      "--success":"#22C55E","--danger":"#EF4444","--warning":"#F59E0B","--border":"#E2E8F0",
      fontFamily:"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display:"flex",height:"100vh",overflow:"hidden",background:"var(--bg)",color:"var(--text)"
    }}>
      {/* SIDEBAR */}
      <div style={{
        width:sideOpen?220:56,background:"var(--primary-dark)",transition:"width 0.2s",
        display:"flex",flexDirection:"column",flexShrink:0,overflow:"hidden"
      }}>
        <div style={{padding:sideOpen?"16px":"8px",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid rgba(255,255,255,0.1)",minHeight:56,cursor:"pointer"}} onClick={()=>setSideOpen(!sideOpen)}>
          <div style={{width:36,height:36,borderRadius:"50%",background:"var(--primary)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{color:"#fff",fontSize:9,fontWeight:700,textAlign:"center",lineHeight:1}}>NOSSO<br/>ATAC.</span>
          </div>
          {sideOpen && <span style={{color:"#fff",fontWeight:700,fontSize:14,whiteSpace:"nowrap"}}>Nosso Atacarejo</span>}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
          {DASHBOARDS.map(d=>(
            <div key={d.id} onClick={()=>setActive(d.id)} style={{
              display:"flex",alignItems:"center",gap:10,padding:sideOpen?"10px 16px":"10px 0",
              cursor:"pointer",background:active===d.id?"rgba(255,255,255,0.15)":"transparent",
              borderLeft:active===d.id?"3px solid var(--accent)":"3px solid transparent",
              transition:"all 0.15s",justifyContent:sideOpen?"flex-start":"center"
            }}>
              <span style={{fontSize:18,flexShrink:0}}>{d.icon}</span>
              {sideOpen && <span style={{color:"#fff",fontSize:13,whiteSpace:"nowrap",opacity:active===d.id?1:0.75}}>{d.label}</span>}
            </div>
          ))}
        </div>
        <div style={{padding:sideOpen?"12px 16px":"12px 0",borderTop:"1px solid rgba(255,255,255,0.1)",textAlign:"center"}}>
          {sideOpen && <div style={{color:"rgba(255,255,255,0.5)",fontSize:10}}>MS Consultoria<br/>BI RH/DP v1.0</div>}
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* HEADER */}
        <div style={{
          height:48,background:"var(--primary-dark)",display:"flex",alignItems:"center",
          padding:"0 20px",gap:16,flexShrink:0
        }}>
          <div style={{flex:1,color:"#fff",fontWeight:700,fontSize:16}}>
            {DASHBOARDS.find(d=>d.id===active)?.icon} {DASHBOARDS.find(d=>d.id===active)?.label}
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {["Coligada ▾","Filial ▾","Período ▾"].map((f,i)=>(
              <div key={i} style={{background:"#fff",borderRadius:6,padding:"4px 12px",fontSize:12,color:"var(--text)",cursor:"pointer",border:"1px solid var(--border)",whiteSpace:"nowrap"}}>{f}</div>
            ))}
            <button onClick={()=>setShowScript(true)} style={{
              background:"var(--accent)",color:"#fff",border:"none",borderRadius:6,
              padding:"5px 14px",cursor:"pointer",fontSize:12,fontWeight:700,
              display:"flex",alignItems:"center",gap:4
            }}>
              📜 Script
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{flex:1,overflow:"auto",padding:16}}>
          <DashComponent/>
          {/* FOOTER */}
          <div style={{textAlign:"center",padding:"16px 0 8px",fontSize:11,color:"var(--text-muted)"}}>
            Nosso Atacarejo — BI RH/DP • Atualizado em {new Date().toLocaleDateString("pt-BR")} • Protótipo Visual (dados fictícios)
          </div>
        </div>
      </div>

      {/* SCRIPT MODAL */}
      <ScriptModal show={showScript} onClose={()=>setShowScript(false)} sql={SQL_SCRIPTS[active]} dashNum={active}/>
    </div>
  );
}
