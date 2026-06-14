import type { Terugroepactie } from "@/types/vehicle";

interface Props { actions: Terugroepactie[]; }

export function RecallActions({ actions }: Props) {
  if (actions.length === 0) return null;

  return (
    <div style={{borderRadius:'14px',overflow:'hidden',border:'2px solid #fca5a5'}}>
      <div style={{background:'#fef2f2',borderBottom:'2px solid #fca5a5',padding:'10px 16px',display:'flex',alignItems:'center',gap:'8px'}}>
        <span style={{fontSize:'18px'}}>⚠️</span>
        <span style={{fontSize:'12px',fontWeight:700,color:'#991b1b',textTransform:'uppercase',letterSpacing:'0.08em'}}>
          Openstaande terugroepacties ({actions.length})
        </span>
      </div>
      <div style={{background:'white'}}>
        {actions.map((a, i) => (
          <div key={i} style={{padding:'16px',borderBottom: i < actions.length - 1 ? '1px solid #fee2e2' : 'none',display:'flex',gap:'12px',alignItems:'flex-start'}}>
            <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#ef4444',flexShrink:0,marginTop:'6px'}} />
            <div>
              <p style={{fontSize:'13px',fontWeight:700,color:'#991b1b',margin:'0 0 4px'}}>
                Referentie: {a.referentie}
              </p>
              <p style={{fontSize:'13px',color:'#374151',margin:0}}>{a.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}