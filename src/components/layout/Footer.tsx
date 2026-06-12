import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{borderTop:'1px solid #e5e7eb',background:'#f9fafb',marginTop:'auto'}}>
      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'32px 16px'}}>
        <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:'16px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <div style={{display:'flex',alignItems:'stretch',borderRadius:'4px',overflow:'hidden',border:'1px solid rgba(212,160,23,0.3)'}}>
              <div style={{background:'#162d58',width:'18px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'1px',padding:'2px'}}>
                <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',width:'12px',gap:'1px'}}>
                  {Array.from({length:12}).map((_,i)=>(
                    <div key={i} style={{width:'2px',height:'2px',borderRadius:'50%',background:'#F5C518'}} />
                  ))}
                </div>
                <span style={{fontFamily:'Courier Prime, monospace',fontSize:'5px',fontWeight:700,color:'white'}}>NL</span>
              </div>
              <div style={{background:'#F5C518',padding:'2px 6px',display:'flex',alignItems:'center'}}>
                <span style={{fontFamily:'Courier Prime, monospace',fontSize:'10px',fontWeight:700,color:'#0f2040',letterSpacing:'0.1em'}}>KTC</span>
              </div>
            </div>
            <span style={{fontSize:'14px',fontWeight:700,color:'#374151'}}>Kentekencheck</span>
          </div>
          <p style={{fontSize:'12px',color:'#9ca3af',textAlign:'center',margin:0}}>
            Gegevens afkomstig van{' '}
            <a href="https://opendata.rdw.nl" target="_blank" rel="noopener noreferrer" style={{color:'#6b7280',textDecoration:'underline'}}>RDW Open Data</a>.
            Geen rechten aan te ontlenen.
          </p>
          <div style={{display:'flex',alignItems:'center',gap:'16px',fontSize:'12px',color:'#9ca3af'}}>
            <Link href="/over-ons" style={{color:'#9ca3af',textDecoration:'none'}}>Over ons</Link>
            <span>© {year}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}