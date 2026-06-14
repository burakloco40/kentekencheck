import type { APKKeuring } from "@/types/vehicle";

interface Props { history: APKKeuring[]; apkExpiryDateNL: string | null; }

export function APKHistory({ history, apkExpiryDateNL }: Props) {
  if (history.length === 0) return null;

  return (
    <div style={{borderRadius:'14px',overflow:'hidden',border:'1px solid #e5e7eb'}}>
      <div style={{background:'#f9fafb',borderBottom:'1px solid #e5e7eb',padding:'10px 16px',display:'flex',alignItems:'center',gap:'8px'}}>
        <span>🔍</span>
        <span style={{fontSize:'12px',fontWeight:700,color:'#374151',textTransform:'uppercase',letterSpacing:'0.08em'}}>APK Keuringshistorie</span>
      </div>

      {apkExpiryDateNL && (
        <div style={{padding:'14px 16px',background:'#f0fdf4',borderBottom:'1px solid #e5e7eb',display:'flex',alignItems:'center',gap:'8px'}}>
          <span style={{fontSize:'16px'}}>✓</span>
          <span style={{fontSize:'14px',fontWeight:600,color:'#166534'}}>APK geldig tot: {apkExpiryDateNL}</span>
        </div>
      )}

      <div style={{background:'white'}}>
        {history.map((k, i) => (
          <div key={i} style={{borderBottom: i < history.length - 1 ? '1px solid #f3f4f6' : 'none',padding:'16px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
              <div style={{width:'10px',height:'10px',borderRadius:'50%',background: k.gebreken.length === 0 ? '#16a34a' : '#d97706',flexShrink:0}} />
              <span style={{fontSize:'14px',fontWeight:700,color:'#111827'}}>
                {k.datumNL} om {k.tijd}
              </span>
              <span style={{fontSize:'12px',color:'#6b7280',background:'#f3f4f6',padding:'2px 8px',borderRadius:'999px'}}>
                {k.soort}
              </span>
            </div>

            {k.gebreken.length === 0 ? (
              <div style={{marginLeft:'18px'}}>
                <p style={{fontSize:'13px',color:'#16a34a',fontWeight:500,margin:0}}>Geen gebreken geconstateerd</p>
              </div>
            ) : (
              <div style={{marginLeft:'18px'}}>
                {k.gebreken.map((g, j) => (
                  <div key={j} style={{display:'flex',gap:'8px',marginBottom:'4px'}}>
                    <span style={{fontSize:'12px',fontWeight:600,color:'#d97706',flexShrink:0}}>Gebrek {j+1}</span>
                    <span style={{fontSize:'13px',color:'#374151'}}>{g}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}