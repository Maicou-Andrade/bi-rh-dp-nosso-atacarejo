import { useState, useRef } from "react";
import { SQL_SCRIPTS } from "./scripts.js";

// ========== FILIAIS REAIS ==========
const FILIAIS = [
  "Pau dos Ferros - RN",
  "São Miguel - RN",
  "Limoeiro do Norte - CE",
  "Quixadá - CE",
  "Assú - RN",
  "Morada Nova - CE"
];
const FL = s => "Nosso Atacarejo - " + s;
const SETORES = ["Operações","Frente de Caixa","Açougue","Padaria","Hortifruti","Estoque","Administrativo","RH","Financeiro","TI","Fiscal","Compras","Logística","Manutenção","Prevenção de Perdas"];
const CARGOS = ["Operador de Caixa","Repositor","Açougueiro","Padeiro","Aux. Hortifruti","Estoquista","Aux. Administrativo","Analista RH","Conferente","Fiscal de Loja","Encarregado","Supervisor","Gerente","Aux. Financeiro","Motorista"];
const NOMES = ["Maria Silva","João Santos","Ana Oliveira","Pedro Souza","Francisca Lima","José Costa","Antônia Pereira","Carlos Araújo","Raimunda Alves","Francisco Nascimento","Sandra Rocha","Luiz Ferreira","Mariana Gomes","Roberto Barbosa","Patrícia Ribeiro","Fernando Carvalho","Juliana Martins","Ricardo Monteiro","Cláudia Mendes","André Cavalcante"];
const BANCOS = ["Banco do Brasil S.A.","Caixa Econômica Federal","Banco Bradesco S.A.","Itaú Unibanco S.A.","Banco Santander S.A.","Banco BMG S.A.","Banco PAN S.A.","Banco Agibank S.A.","Banco C6 Consignado S.A.","Nu Financeira S.A."];
const CIDS = ["M54.5 - Dor lombar baixa","J06.9 - Inf. aguda vias aéreas sup.","K29.7 - Gastrite não especificada","R51 - Cefaleia","J11 - Influenza","M79.1 - Mialgia","S61.0 - Ferimento do dedo","R10.4 - Dor abdominal","K08.8 - Problemas dentários","F41.0 - Transtorno de ansiedade"];
const MESES_12 = ["Mai/25","Jun/25","Jul/25","Ago/25","Set/25","Out/25","Nov/25","Dez/25","Jan/26","Fev/26","Mar/26","Abr/26"];

const fmt = v => "R$ " + v.toFixed(2).replace(".",",").replace(/\B(?=(\d{3})+(?!\d))/g,".");
const fmtP = v => v.toFixed(1).replace(".",",") + "%";
const fmtN = v => v.toLocaleString("pt-BR");

// ========== COMPONENTES ==========
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
          <div style={{width:140,fontSize:12,color:"var(--text-muted)",textAlign:"right",flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={d.label}>{d.label}</div>
          <div style={{flex:1,background:"var(--bg)",borderRadius:4,height:20,overflow:"hidden"}}>
            <div style={{width:`${(d.value/mx)*100}%`,background:d.color||color,height:"100%",borderRadius:4,transition:"width 0.5s",minWidth:d.value>0?2:0}}/>
          </div>
          <div style={{width:70,fontSize:12,fontWeight:600,color:"var(--text)",textAlign:"right"}}>{typeof d.display === "string" ? d.display : fmtN(d.value)}</div>
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
          <div style={{fontSize:10,color:"var(--text-muted)",textAlign:"center",lineHeight:1.1,maxWidth:55,overflow:"hidden"}}>{d.label}</div>
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
            <div style={{fontSize:9,color:"var(--text-muted)",textAlign:"center",maxWidth:55,overflow:"hidden"}}>{d.label}</div>
          </div>
        );
      })}
    </div>
  );
};

// Gráfico de linha mensal (1 ou 2 séries) — para histórico 12 meses
const Line12M = ({series, height = 180, yFmt}) => {
  const W = 640, H = 150, PL = 40, PR = 12, PT = 10, PB = 28;
  const allVals = series.flatMap(s => s.data);
  const mx = Math.max(...allVals) * 1.08;
  const mn = Math.min(Math.min(...allVals), 0);
  const xStep = (W - PL - PR) / (MESES_12.length - 1);
  const yScale = v => H - PB - ((v - mn)/(mx - mn || 1))*(H - PT - PB);
  const fmtY = yFmt || fmtN;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(t => mn + (mx-mn)*t);
  return (
    <div style={{height, display:"flex", flexDirection:"column"}}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:height-(series.length>1?22:6)}} preserveAspectRatio="none">
        {ticks.map((t,i) => (
          <g key={i}>
            <line x1={PL} y1={yScale(t)} x2={W-PR} y2={yScale(t)} stroke="var(--border)" strokeWidth="0.5" strokeDasharray={i===0?"":"2 2"}/>
            <text x={PL-4} y={yScale(t)+3} fontSize="8" fill="var(--text-muted)" textAnchor="end">{fmtY(t)}</text>
          </g>
        ))}
        {series.map((s, si) => {
          const path = s.data.map((v,i) => `${i===0?'M':'L'} ${PL+i*xStep} ${yScale(v)}`).join(' ');
          return (
            <g key={si}>
              <path d={path} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round"/>
              {s.data.map((v,i) => (
                <circle key={i} cx={PL+i*xStep} cy={yScale(v)} r="2.5" fill={s.color} stroke="var(--card)" strokeWidth="1"/>
              ))}
            </g>
          );
        })}
        {MESES_12.map((m,i) => (
          <text key={i} x={PL+i*xStep} y={H-10} fontSize="9" fill="var(--text-muted)" textAnchor="middle">{m}</text>
        ))}
      </svg>
      {series.length > 1 && (
        <div style={{display:"flex",gap:14,justifyContent:"center",marginTop:4}}>
          {series.map((s,i) => (
            <span key={i} style={{fontSize:11,color:"var(--text-muted)",display:"flex",alignItems:"center",gap:4}}>
              <span style={{display:"inline-block",width:10,height:10,borderRadius:2,background:s.color}}/>{s.label}
            </span>
          ))}
        </div>
      )}
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

const ScriptModal = ({show, onClose, sql, dashNum, dashName}) => {
  const ref = useRef(null);
  if (!show) return null;
  const copy = () => {
    if(ref.current){navigator.clipboard.writeText(ref.current.textContent).then(()=>alert("SQL copiado para a área de transferência!"))}
  };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#1e293b",borderRadius:12,width:"92%",maxWidth:1000,maxHeight:"88vh",display:"flex",flexDirection:"column",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:"1px solid #334155"}}>
          <div style={{color:"#f1f5f9",fontWeight:700,fontSize:16}}>📜 Script SQL — {dashName}</div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={copy} style={{background:"var(--primary)",color:"#fff",border:"none",borderRadius:6,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:600}}>📋 Copiar</button>
            <button onClick={onClose} style={{background:"#475569",color:"#fff",border:"none",borderRadius:6,padding:"6px 14px",cursor:"pointer",fontSize:13}}>✕ Fechar</button>
          </div>
        </div>
        <div style={{padding:"16px 20px",overflowY:"auto",flex:1}}>
          <pre ref={ref} style={{color:"#e2e8f0",fontSize:13,lineHeight:1.6,whiteSpace:"pre-wrap",wordBreak:"break-word",margin:0,fontFamily:"Consolas, 'Courier New', monospace"}}>{sql}</pre>
        </div>
      </div>
    </div>
  );
};

// ========== DASHBOARD 1: COLABORADORES (1.600 ativos) ==========
const Dash1 = () => {
  const ativos=1600, headcountFilial="Pau dos Ferros - RN", headcountVal=358, salMedio=1986.45, admMes=34, deslMes=19, turnover=(19/1600)*100;
  const porFilial = [{label:"Pau dos Ferros - RN",value:358},{label:"São Miguel - RN",value:302},{label:"Limoeiro do Norte - CE",value:285},{label:"Quixadá - CE",value:262},{label:"Assú - RN",value:218},{label:"Morada Nova - CE",value:175}];
  const porSexo = [{label:"Masculino",value:952,color:"var(--primary)"},{label:"Feminino",value:648,color:"var(--accent)"}];
  const porFaixa = [{label:"<18",value:38},{label:"18-24",value:356},{label:"25-34",value:542},{label:"35-44",value:378},{label:"45-54",value:198},{label:"55+",value:88}];
  const topSetores = [{label:"Frente de Caixa",value:334},{label:"Operações",value:298},{label:"Açougue",value:154},{label:"Padaria",value:132},{label:"Estoque",value:124},{label:"Hortifruti",value:112},{label:"Prevenção Perdas",value:86},{label:"Logística",value:82},{label:"Administrativo",value:74},{label:"Manutenção",value:62}];
  const evolucao = [{label:"Jan",v1:28,v2:16},{label:"Fev",v1:24,v2:18},{label:"Mar",v1:39,v2:13},{label:"Abr",v1:34,v2:19},{label:"Mai",v1:36,v2:17},{label:"Jun",v1:30,v2:21},{label:"Jul",v1:25,v2:15},{label:"Ago",v1:32,v2:18},{label:"Set",v1:37,v2:20},{label:"Out",v1:29,v2:14},{label:"Nov",v1:31,v2:22},{label:"Dez",v1:26,v2:12}];
  const porSituacao = [{label:"Ativo",value:1600,color:"var(--success)"},{label:"Demitido",value:274,color:"var(--danger)"},{label:"Afastado",value:38,color:"var(--warning)"}];
  const histSalMedio = [1912.30,1924.85,1938.20,1945.60,1952.10,1958.80,1964.40,1971.20,1976.90,1979.50,1982.70,1986.45];
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
    <ChartCard title="Histórico dos Últimos 12 Meses — Salário Médio">
      <Line12M series={[{label:"Salário Médio",color:"var(--accent)",data:histSalMedio}]} yFmt={fmt}/>
    </ChartCard>
  </>);
};

// ========== DASHBOARD 2: CONTROLE DE FÉRIAS ==========
const Dash2 = () => {
  const programadas=108, vencidos=14, custoMes=248320.78, mediaDias=22.8, abonos=26, irrfTotal=36740.50;
  const custoFilial = [{label:"Pau dos Ferros - RN",value:58400},{label:"São Miguel - RN",value:47200},{label:"Limoeiro do Norte - CE",value:42800},{label:"Quixadá - CE",value:38500},{label:"Assú - RN",value:34200},{label:"Morada Nova - CE",value:27220}];
  const porStatus = [{label:"M - Marcadas",value:108,color:"var(--primary)"},{label:"P - Pagas",value:76,color:"var(--success)"},{label:"F - Finalizadas",value:398,color:"var(--text-muted)"},{label:"D - Ag. Aprov. DP",value:12,color:"var(--warning)"},{label:"G - Ag. Aprov. Gestor",value:6,color:"var(--accent)"}];
  const topSetoresCusto = [{label:"Frente de Caixa",value:45600},{label:"Operações",value:41800},{label:"Açougue",value:27400},{label:"Padaria",value:25100},{label:"Estoque",value:22200},{label:"Hortifruti",value:19400},{label:"Administrativo",value:17200},{label:"Logística",value:16000},{label:"Manutenção",value:13200},{label:"TI",value:11100}];
  const provDesc = FILIAIS.map(f=>({label:f.split(" - ")[0],v1:24000+Math.random()*35000|0,v2:7000+Math.random()*12000|0}));
  const histProgramadas = [92,88,96,101,94,105,112,98,104,108,115,108];
  const histCustoFerias = [218400,224800,232100,241500,228900,246200,254800,238400,249600,252300,246700,248320];
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
        <div style={{fontSize:12,color:"var(--text-muted)"}}>Saldo &gt; 20 dias</div><div style={{fontSize:20,fontWeight:700,color:"var(--success)"}}>734</div>
      </div>
      <div style={{background:"var(--card)",borderRadius:8,padding:"10px 16px",borderLeft:"4px solid var(--warning)",flex:1,minWidth:150}}>
        <div style={{fontSize:12,color:"var(--text-muted)"}}>Saldo 10-20 dias</div><div style={{fontSize:20,fontWeight:700,color:"var(--warning)"}}>268</div>
      </div>
      <div style={{background:"var(--card)",borderRadius:8,padding:"10px 16px",borderLeft:"4px solid var(--danger)",flex:1,minWidth:150}}>
        <div style={{fontSize:12,color:"var(--text-muted)"}}>Saldo &lt; 10 / Vencido</div><div style={{fontSize:20,fontWeight:700,color:"var(--danger)"}}>14</div>
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
          {[{c:"#22C55E",l:"OK (>20d)",v:734},{c:"#F59E0B",l:"Atenção (10-20d)",v:268},{c:"#EF4444",l:"Crítico (<10d)",v:14}].map((s,i)=>(
            <div key={i} style={{textAlign:"center"}}><div style={{width:48,height:48,borderRadius:"50%",background:s.c,margin:"0 auto 8px",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:16}}>{s.v}</div><div style={{fontSize:11,color:"var(--text-muted)"}}>{s.l}</div></div>
          ))}
        </div>
      </ChartCard>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      <ChartCard title="Histórico 12 Meses — Férias Programadas">
        <Line12M series={[{label:"Férias Programadas",color:"var(--primary)",data:histProgramadas}]}/>
      </ChartCard>
      <ChartCard title="Histórico 12 Meses — Custo Total Férias">
        <Line12M series={[{label:"Custo Total",color:"var(--accent)",data:histCustoFerias}]} yFmt={fmt}/>
      </ChartCard>
    </div>
  </>);
};

// ========== DASHBOARD 3: CONTROLE DE HORAS (PLACEHOLDER) ==========
const Dash3 = () => {
  const placeholderKPIs = [{icon:"⏰",label:"Horas Trabalhadas"},{icon:"🕐",label:"Banco de Horas"},{icon:"📊",label:"Horas Extras"},{icon:"🔴",label:"Atrasos"},{icon:"✅",label:"Assiduidade (%)"}];
  const grayData = FILIAIS.map(f=>({label:f.split(" - ")[0],value:0}));
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
  </>);
};

// ========== DASHBOARD 4: FOLHA DE PAGAMENTO ==========
const Dash4 = () => {
  const totalDebito=4187230.56, totalCredito=4187230.56, custoMedio=2617.02, filialMaiorCusto="Pau dos Ferros - RN", totalLotes=8;
  const custoFilial = [{label:"Pau dos Ferros - RN",value:978400},{label:"São Miguel - RN",value:824500},{label:"Limoeiro do Norte - CE",value:738200},{label:"Quixadá - CE",value:658700},{label:"Assú - RN",value:562000},{label:"Morada Nova - CE",value:425430}];
  const debCredFilial = FILIAIS.map(f=>({label:f.split(" - ")[0],v1:350000+Math.random()*650000|0,v2:350000+Math.random()*650000|0}));
  const porNivel = [{label:"1 - Ativo",value:1082000,color:"var(--primary)"},{label:"2 - Passivo Circulante",value:1876000,color:"var(--accent)"},{label:"4 - Contas Resultado",value:1229230,color:"var(--primary-light)"}];
  const topCCusto = [{label:"CC Operações Pau dos Ferros",value:298000},{label:"CC FDC São Miguel",value:258000},{label:"CC Operações Limoeiro",value:232000},{label:"CC Açougue Pau dos Ferros",value:204000},{label:"CC FDC Quixadá",value:189000},{label:"CC Padaria Pau dos Ferros",value:168000},{label:"CC Estoque Assú",value:154000},{label:"CC Operações Morada Nova",value:142000},{label:"CC Adm Geral",value:132000},{label:"CC FDC Assú",value:122000}];
  const topContas = [{label:"Salários a Pagar",value:2476000},{label:"INSS a Recolher",value:502000},{label:"FGTS a Recolher",value:334000},{label:"IRRF a Recolher",value:213000},{label:"Vale Transporte",value:172000},{label:"Vale Alimentação",value:152000},{label:"Provisão 13º",value:123000},{label:"Provisão Férias",value:111000},{label:"Pensão Alimentícia",value:75000},{label:"Sindicato",value:29230}];
  const histCustoMedio = [2542.10,2558.40,2567.80,2578.30,2586.90,2592.40,2598.70,2604.80,2609.30,2612.80,2614.50,2617.02];
  const histDebito  = [3942000,3978000,4012000,4045000,4078000,4101000,4122000,4138000,4152000,4168000,4178000,4187230];
  const histCredito = [3938000,3972000,4005000,4038000,4072000,4095000,4116000,4132000,4148000,4162000,4175000,4187230];
  return (<>
    <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
      <KPICard icon="💰" label="Total Folha (Débito)" value={fmt(totalDebito)} color="var(--danger)"/>
      <KPICard icon="💳" label="Total Folha (Crédito)" value={fmt(totalCredito)} color="var(--success)"/>
      <KPICard icon="📊" label="Custo Médio / Colaborador" value={fmt(custoMedio)} color="var(--primary)"/>
      <KPICard icon="🏢" label="Filial Maior Custo" value="Pau dos Ferros" sub={fmt(978400)} color="var(--accent)"/>
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
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      <ChartCard title="Histórico 12 Meses — Custo Médio / Colaborador">
        <Line12M series={[{label:"Custo Médio",color:"var(--primary)",data:histCustoMedio}]} yFmt={fmt}/>
      </ChartCard>
      <ChartCard title="Histórico 12 Meses — Total Folha (Débito e Crédito)">
        <Line12M series={[{label:"Débito",color:"var(--danger)",data:histDebito},{label:"Crédito",color:"var(--success)",data:histCredito}]} yFmt={fmt}/>
      </ChartCard>
    </div>
  </>);
};

// ========== DASHBOARD 5: EMPRÉSTIMOS ==========
const Dash5 = () => {
  const totalAtivos=296, volumeTotal=4212800.00, saldoDevedor=1852300.00, descontoMensal=162840.00, colabComEmp=258;
  const porBanco = [{label:"Banco do Brasil",value:1082000},{label:"Caixa Econômica",value:856000},{label:"Bradesco",value:654000},{label:"Itaú Unibanco",value:562000},{label:"Santander",value:374000},{label:"BMG",value:271000},{label:"PAN",value:172000},{label:"Agibank",value:126000},{label:"C6 Consignado",value:77800},{label:"Nu Financeira",value:38000}];
  const porTipo = [{label:"Consignado Privado",value:172,color:"var(--primary)"},{label:"Consignado Público",value:74,color:"var(--accent)"},{label:"Empréstimo Pessoal",value:36,color:"var(--primary-light)"},{label:"Outros",value:14,color:"var(--text-muted)"}];
  const evolDesc = [{label:"Jan",value:143000},{label:"Fev",value:149000},{label:"Mar",value:154000},{label:"Abr",value:162840},{label:"Mai",value:158000},{label:"Jun",value:152000},{label:"Jul",value:146000},{label:"Ago",value:151000},{label:"Set",value:156000},{label:"Out",value:160000},{label:"Nov",value:157000},{label:"Dez",value:154000}];
  const topFilSaldo = [{label:"Pau dos Ferros - RN",value:454000},{label:"São Miguel - RN",value:386000},{label:"Limoeiro do Norte - CE",value:336000},{label:"Quixadá - CE",value:297000},{label:"Assú - RN",value:230000},{label:"Morada Nova - CE",value:149300}];
  const porTempo = [{label:"<1 ano",value:36,color:"var(--accent)"},{label:"1-3 anos",value:76,color:"var(--accent-light)"},{label:"3-5 anos",value:66,color:"var(--primary-light)"},{label:"5-10 anos",value:50,color:"var(--primary)"},{label:"10+",value:30,color:"var(--primary-dark)"}];
  const histEmpAtivos = [268,272,278,281,285,287,290,293,295,293,294,296];
  return (<>
    <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
      <KPICard icon="🏦" label="Empréstimos Ativos" value={fmtN(totalAtivos)} color="var(--primary)"/>
      <KPICard icon="💰" label="Volume Total Emprestado" value={fmt(volumeTotal)} color="var(--accent)"/>
      <KPICard icon="📉" label="Saldo Devedor Total" value={fmt(saldoDevedor)} color="var(--danger)"/>
      <KPICard icon="💳" label="Desconto Mensal na Folha" value={fmt(descontoMensal)} color="var(--warning)"/>
      <KPICard icon="👥" label="Colaboradores c/ Empréstimo" value={fmtN(colabComEmp)} color="var(--primary-light)"/>
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
    <ChartCard title="Histórico 12 Meses — Empréstimos Ativos">
      <Line12M series={[{label:"Empréstimos Ativos",color:"var(--primary)",data:histEmpAtivos}]}/>
    </ChartCard>
  </>);
};

// ========== DASHBOARD 6: RESCISÕES ==========
const Dash6 = () => {
  const totalMes=19, custoTotal=249180.34, custoMedio=13114.75, pctInvol=63.2, pctVol=36.8, tempoMedioCasa=2.1;
  const evolMensal = [{label:"Jan",value:16},{label:"Fev",value:18},{label:"Mar",value:13},{label:"Abr",value:19},{label:"Mai",value:17},{label:"Jun",value:21},{label:"Jul",value:15},{label:"Ago",value:18},{label:"Set",value:20},{label:"Out",value:14},{label:"Nov",value:22},{label:"Dez",value:12}];
  const volInvol = [{label:"Voluntária",value:7,color:"var(--success)"},{label:"Involuntária",value:12,color:"var(--danger)"}];
  const custoFilial = [{label:"Pau dos Ferros - RN",value:62800},{label:"São Miguel - RN",value:50500},{label:"Limoeiro do Norte - CE",value:45200},{label:"Quixadá - CE",value:36500},{label:"Assú - RN",value:30400},{label:"Morada Nova - CE",value:23780}];
  const topTipos = [{label:"Inic.Empregador sem justa causa",value:8},{label:"Inic.Empregado sem justa causa",value:4},{label:"Comum acordo",value:3},{label:"Término contrato",value:2},{label:"Inic.Empregador com justa causa",value:1},{label:"Outros",value:1}];
  const provDescFilial = FILIAIS.map(f=>({label:f.split(" - ")[0],v1:18000+Math.random()*42000|0,v2:4000+Math.random()*12000|0}));
  const porFaixaDemitidos = [{label:"<18",value:1},{label:"18-24",value:7},{label:"25-34",value:5},{label:"35-44",value:3},{label:"45-54",value:2},{label:"55+",value:1}];
  const histTotalResc = [16,18,13,19,17,21,15,18,20,14,22,19];
  const histCustoMedioResc = [11420.50,11830.20,12150.80,12340.40,12510.90,12680.30,12820.60,12940.20,13010.50,13045.80,13090.30,13114.75];
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
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      <ChartCard title="Histórico 12 Meses — Total de Rescisões">
        <Line12M series={[{label:"Rescisões",color:"var(--danger)",data:histTotalResc}]}/>
      </ChartCard>
      <ChartCard title="Histórico 12 Meses — Custo Médio / Rescisão">
        <Line12M series={[{label:"Custo Médio",color:"var(--primary)",data:histCustoMedioResc}]} yFmt={fmt}/>
      </ChartCard>
    </div>
  </>);
};

// ========== DASHBOARD 7: TEMPO DE EMPRESA ==========
const Dash7 = () => {
  const tempoMedio=3.8, colab10plus=162, colab1menos=286, totalUnicos=1600, faixaPred="1-3 anos";
  const porFaixaTempo = [{label:"<1 ano",value:286,color:"var(--accent)"},{label:"1-3 anos",value:428,color:"var(--accent-light)"},{label:"3-5 anos",value:332,color:"var(--primary-light)"},{label:"5-10 anos",value:392,color:"var(--primary)"},{label:"10+",value:162,color:"var(--primary-dark)"}];
  const tempoFilial = [{label:"Pau dos Ferros - RN",value:5.8},{label:"São Miguel - RN",value:4.6},{label:"Limoeiro do Norte - CE",value:3.9},{label:"Quixadá - CE",value:3.4},{label:"Assú - RN",value:2.9},{label:"Morada Nova - CE",value:2.2}];
  const porSituacao = [{label:"Ativo",value:1600,color:"var(--success)"},{label:"Demitido",value:274,color:"var(--danger)"},{label:"Afastado",value:38,color:"var(--warning)"}];
  const topSetoresTempo = [{label:"TI",value:6.8},{label:"Administrativo",value:6.2},{label:"Financeiro",value:5.9},{label:"Manutenção",value:5.4},{label:"Logística",value:4.8},{label:"Compras",value:4.6},{label:"RH",value:4.3},{label:"Estoque",value:3.7},{label:"Açougue",value:3.4},{label:"Frente de Caixa",value:2.6}];
  const porSexo = [{label:"Masculino",value:952,color:"var(--primary)"},{label:"Feminino",value:648,color:"var(--accent)"}];
  const porFaixaEtaria = [{label:"<18",value:38},{label:"18-24",value:356},{label:"25-34",value:542},{label:"35-44",value:378},{label:"45-54",value:198},{label:"55+",value:88}];
  const histTempoMedio = [3.4,3.5,3.5,3.6,3.6,3.6,3.7,3.7,3.7,3.8,3.8,3.8];
  const rows = NOMES.slice(0,12).map((n,i)=>[
    String(1000+i),n,"•••.•••.•••-••",FILIAIS[i%6],SETORES[i%10],CARGOS[i%10],i<10?"Ativo":"Demitido",`0${(i%12)+1}/15/20${14+i%10}`,String((i*2+1).toFixed(1)),["<1 ano","1-3 anos","3-5 anos","5-10 anos","10+"][i%5],String(22+i*3),["18-24","25-34","35-44","45-54","55+"][i%5]
  ]);
  return (<>
    <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
      <KPICard icon="📅" label="Tempo Médio de Empresa" value={`${tempoMedio.toFixed(1).replace(".",",")} anos`} color="var(--primary)"/>
      <KPICard icon="🏆" label="Colaboradores 10+ anos" value={fmtN(colab10plus)} sub="Retenção" color="var(--accent)"/>
      <KPICard icon="🆕" label="Colaboradores < 1 ano" value={fmtN(colab1menos)} color="var(--warning)"/>
      <KPICard icon="👥" label="Total Únicos (CPF)" value={fmtN(totalUnicos)} color="var(--primary-light)"/>
      <KPICard icon="📊" label="Faixa Predominante" value={faixaPred} sub="428 colaboradores" color="var(--primary-dark)"/>
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
    <ChartCard title="Histórico 12 Meses — Tempo Médio de Empresa" style={{marginBottom:16}}>
      <Line12M series={[{label:"Tempo Médio (anos)",color:"var(--primary)",data:histTempoMedio}]} yFmt={v=>v.toFixed(1).replace(".",",")+"a"}/>
    </ChartCard>
    <ChartCard title="Tabela Analítica — Tempo de Empresa">
      <DataTable columns={["Chapa","Nome","CPF","Filial","Setor","Cargo","Situação","Admissão","Tempo (anos)","Faixa Tempo","Idade","Faixa Etária"]} rows={rows}/>
    </ChartCard>
  </>);
};

// ========== DASHBOARD 8: AFASTAMENTOS ==========
const Dash8 = () => {
  const totalAfastados=38, diasTotal=1612, mediaDias=42.4, pendentes=6, reprovados=2, cidFreq="M54.5";
  const topCids = [{label:"M54.5 Dor lombar",value:8},{label:"S62.0 Fratura mão",value:5},{label:"M51.1 Hérnia disco",value:4},{label:"S82.0 Fratura tíbia",value:4},{label:"G56.0 Túnel carpo",value:3},{label:"M75.1 Sínd. manguito",value:3},{label:"S42.0 Fratura clavíc.",value:2},{label:"F32.0 Ep. depressivo",value:2},{label:"O80 Parto normal",value:2},{label:"Z34 Gravidez normal",value:5}];
  const porFilial = [{label:"Pau dos Ferros",value:10},{label:"São Miguel",value:8},{label:"Limoeiro",value:7},{label:"Quixadá",value:6},{label:"Assú",value:4},{label:"Morada Nova",value:3}];
  const porStatus = [{label:"Aprovado",value:30,color:"var(--success)"},{label:"Pendente Validação",value:6,color:"var(--warning)"},{label:"Reprovado",value:2,color:"var(--danger)"}];
  const porTipo = [{label:"Atestado Médico",value:16,color:"var(--primary)"},{label:"Licença Maternidade",value:7,color:"var(--accent)"},{label:"Laudo Médico",value:6,color:"var(--primary-light)"},{label:"Doença Ocupacional",value:4,color:"var(--warning)"},{label:"Outros",value:5,color:"var(--text-muted)"}];
  const topSetores = [{label:"Operações",value:7},{label:"Estoque",value:5},{label:"Açougue",value:5},{label:"Frente de Caixa",value:4},{label:"Logística",value:4},{label:"Manutenção",value:3},{label:"Padaria",value:3},{label:"Hortifruti",value:3},{label:"Administrativo",value:2},{label:"Prevenção Perdas",value:2}];
  const porFaixa = [{label:"<18",value:0},{label:"18-24",value:4},{label:"25-34",value:11},{label:"35-44",value:12},{label:"45-54",value:7},{label:"55+",value:4}];
  const histTotalAfast = [32,30,35,38,34,41,39,36,42,40,37,38];
  const histMediaDias  = [38.2,39.5,40.8,41.3,40.1,42.6,43.2,41.8,43.5,42.9,42.1,42.4];
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
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      <ChartCard title="Histórico 12 Meses — Total de Afastados">
        <Line12M series={[{label:"Afastados",color:"var(--danger)",data:histTotalAfast}]}/>
      </ChartCard>
      <ChartCard title="Histórico 12 Meses — Média de Dias">
        <Line12M series={[{label:"Média (dias)",color:"var(--primary)",data:histMediaDias}]} yFmt={v=>v.toFixed(1).replace(".",",")}/>
      </ChartCard>
    </div>
  </>);
};

// ========== DASHBOARD 9: ATESTADOS ==========
const Dash9 = () => {
  const totalAtestados=396, diasPerdidos=1584, mediaDias=4.0, colabDistintos=271, reincidencia=24, pendentes=13;
  const topCids = [{label:"J06.9 Inf. vias aéreas",value:76},{label:"R51 Cefaleia",value:54},{label:"K29.7 Gastrite",value:39},{label:"M54.5 Dor lombar",value:36},{label:"R10.4 Dor abdominal",value:33},{label:"J11 Influenza",value:29},{label:"M79.1 Mialgia",value:24},{label:"F41.0 Ansiedade",value:19},{label:"K08.8 Dentários",value:16},{label:"S61.0 Ferimento dedo",value:12}];
  const porFilial = [{label:"Pau dos Ferros",value:85},{label:"São Miguel",value:76},{label:"Limoeiro",value:68},{label:"Quixadá",value:62},{label:"Assú",value:56},{label:"Morada Nova",value:49}];
  const porSexo = [{label:"Masculino",value:213,color:"var(--primary)"},{label:"Feminino",value:183,color:"var(--accent)"}];
  const evolMensal = [{label:"Jan",value:36},{label:"Fev",value:33},{label:"Mar",value:45},{label:"Abr",value:39},{label:"Mai",value:31},{label:"Jun",value:42},{label:"Jul",value:28},{label:"Ago",value:36},{label:"Set",value:34},{label:"Out",value:30},{label:"Nov",value:24},{label:"Dez",value:18}];
  const topSetores = [{label:"Frente de Caixa",value:78},{label:"Operações",value:66},{label:"Estoque",value:45},{label:"Açougue",value:39},{label:"Padaria",value:33},{label:"Hortifruti",value:30},{label:"Logística",value:24},{label:"Manutenção",value:22},{label:"Prevenção Perdas",value:19},{label:"Administrativo",value:16}];
  const porStatusVal = [{label:"Aprovado",value:346,color:"var(--success)"},{label:"Pendente Validação",value:13,color:"var(--warning)"},{label:"Reprovado",value:37,color:"var(--danger)"}];
  const porFaixa = [{label:"<18",value:10},{label:"18-24",value:85},{label:"25-34",value:136},{label:"35-44",value:97},{label:"45-54",value:47},{label:"55+",value:21}];
  const histTotalAtest = [312,328,345,358,341,372,384,365,389,381,372,396];
  const histMediaDiasAtest = [3.6,3.7,3.8,3.8,3.7,3.9,4.0,3.9,4.0,4.0,3.9,4.0];
  return (<>
    <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
      <KPICard icon="📋" label="Total de Atestados" value={fmtN(totalAtestados)} color="var(--primary)"/>
      <KPICard icon="📅" label="Dias Totais Perdidos" value={fmtN(diasPerdidos)} color="var(--danger)"/>
      <KPICard icon="📊" label="Média Dias / Atestado" value={mediaDias.toFixed(1).replace(".",",")} color="var(--primary-light)"/>
      <KPICard icon="👥" label="Colaboradores Distintos" value={fmtN(colabDistintos)} color="var(--accent)"/>
      <KPICard icon="🔁" label="Reincidência (3+)" value={fmtN(reincidencia)} sub="Colaboradores com 3+ atestados" color="var(--warning)"/>
      <KPICard icon="⏳" label="Pendentes de Validação" value={fmtN(pendentes)} color="var(--warning)"/>
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
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      <ChartCard title="Histórico 12 Meses — Total de Atestados">
        <Line12M series={[{label:"Atestados",color:"var(--primary)",data:histTotalAtest}]}/>
      </ChartCard>
      <ChartCard title="Histórico 12 Meses — Média de Dias por Atestado">
        <Line12M series={[{label:"Média (dias)",color:"var(--accent)",data:histMediaDiasAtest}]} yFmt={v=>v.toFixed(1).replace(".",",")}/>
      </ChartCard>
    </div>
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
  const activeDash = DASHBOARDS.find(d=>d.id===active);

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
          {sideOpen && <span style={{color:"#fff",fontWeight:700,fontSize:13,whiteSpace:"nowrap"}}>Nosso Atacarejo</span>}
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
            {activeDash?.icon} {activeDash?.label}
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {["Coligada ▾","Filial ▾","Setor ▾","Período ▾"].map((f,i)=>(
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
          <div style={{textAlign:"center",padding:"16px 0 8px",fontSize:11,color:"var(--text-muted)"}}>
            Nosso Atacarejo — BI RH/DP • Atualizado em {new Date().toLocaleDateString("pt-BR")} • Protótipo Visual (dados fictícios)
          </div>
        </div>
      </div>

      {/* SCRIPT MODAL */}
      <ScriptModal show={showScript} onClose={()=>setShowScript(false)} sql={SQL_SCRIPTS[active]} dashNum={active} dashName={activeDash?.label}/>
    </div>
  );
}
