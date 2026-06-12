import Link from "next/link";

export function Header() {
  return (
    <header style={{position:'sticky',top:0,zIndex:40,background:'white',borderBottom:'1px solid #e5e7eb',boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'0 16px',height:'56px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:'10px',textDecoration:'none'}}>
          <div style={{display:'flex',alignItems:'stretch',borderRadius:'4px',overflow:'hidden',border:'1px solid rgba(212,160,23,0.3)',boxShadow:'0 1px 4px rgba(0,0,0,0.15)'}}>
            <div style={{background:'#162d58',width:'22px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'2px',padding:'2px'}}>
              <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',width:'14px',gap:'1px'}}>
                {Array.from({length:12}).map((_,i)=>(
                  <div key={i} style={{width:'2px',height:'2px',borderRadius:'50%',background:'#F5C518'}} />
                ))}
              </div>
              <span style={{fontFamily:'Courier Prime, monospace',fontSize:'6px',fontWeight:700,color:'white',letterSpacing:'0.05em'}}>NL</span>
            </div>
            <div style={{background:'#F5C518',padding:'4px 8px',display:'flex',alignItems:'center'}}>
              <span style={{fontFamily:'Courier Prime, monospace',fontSize:'13px',fontWeight:700,color:'#0f2040',letterSpacing:'0.1em'}}>KTC</span>
            </div>
          </div>
          <span style={{fontSize:'17px',fontWeight:800,color:'#0f2040',letterSpacing:'-0.3px'}}>Kentekencheck</span>
        </Link>
        <nav style={{display:'flex',alignItems:'center',gap:'4px'}}>
          <Link href="/over-ons" style={{fontSize:'14px',color:'#6b7280',padding:'6px 14px',borderRadius:'8px',textDecoration:'none',fontWeight:500}}>Over ons</Link>
        </nav>
      </div>
    </header>
  );
}