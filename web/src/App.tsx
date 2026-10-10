import { useEffect, useState, useRef } from 'react'
import { loadProfiles, saveProfiles, getActiveId, setActiveId, getProgress, saveProgress, speak, uid, AVATARS } from './store'
import type { Profile } from './store'

type View='home'|'profiles'|'logika'|'bahasa'|'kreativitas'|'game-count'|'game-shape'|'game-letter'|'game-word'|'game-color'|'parental'

export default function App(){
  const [profiles,setProfiles]=useState<Profile[]>(()=>loadProfiles())
  const [activeId,setActive]=useState<string|null>(()=>getActiveId())
  const [view,setView]=useState<View>('home')
  const [online,setOnline]=useState(navigator.onLine)
  const [showGate,setShowGate]=useState(false)
  const [premium,setPremium]=useState(()=>localStorage.getItem('edu_premium')==='1')
  const active = profiles.find(p=>p.id===activeId) || null

  useEffect(()=>{
    const a=()=>setOnline(true), b=()=>setOnline(false)
    window.addEventListener('online',a); window.addEventListener('offline',b)
    return()=>{window.removeEventListener('online',a); window.removeEventListener('offline',b)}
  },[])
  useEffect(()=>{ saveProfiles(profiles)},[profiles])
  useEffect(()=>{ if(activeId) setActiveId(activeId)},[activeId])

  const addProfile=(name:string,avatar:string)=>{
    if(profiles.length>=3) return
    const p:Profile={id:uid(),name,avatar,stickers:[],progress:{},screenTimeLimit:30,createdAt:Date.now()}
    setProfiles([...profiles,p]); setActive(p.id); setView('home')
  }
  const giveSticker=(emoji:string)=>{
    if(!active) return
    setProfiles(ps=>ps.map(p=>p.id===active.id?{...p,stickers:[...p.stickers,emoji]}:p))
  }
  const saveGameScore=(gameId:string,score:number)=>{
    if(!active) return
    const prog=getProgress(); const cur=prog[active.id]||{}
    cur[gameId]=Math.max(cur[gameId]||0,score)
    prog[active.id]=cur; saveProgress(prog)
    setProfiles(ps=>ps.map(p=>p.id===active.id?{...p,progress:{...p.progress,[gameId]:cur[gameId]}}:p))
  }

  return <div className="app">
    <header className="header">
      <div className="logo" onClick={()=>setView('home')} style={{cursor:'pointer'}}>
        <div className="logo-badge">🎓</div>
        Ceria Belajar
        {active && <span className="badge">{active.avatar} {active.name}</span>}
      </div>
      <div className="header-actions">
        <span className="badge" style={{background: online?'#DCFCE7':'#FEE2E2'}}>{online?'● Online':'○ Offline'}</span>
        <button className="btn btn-ghost" onClick={()=>setView('profiles')}>👧 Ganti Profil</button>
        <button className="btn btn-outline" onClick={()=>setShowGate(true)}>👨‍👩‍👧 Orang Tua</button>
      </div>
    </header>
    {!online && <div className="offline-bar">Mode offline — progres tetap tersimpan di perangkat</div>}

    <main className="container">
      {view==='home' && <HomeView active={active} profiles={profiles} onPlay={(v:View)=>setView(v)} onProfiles={()=>setView('profiles')} premium={premium} />}
      {view==='profiles' && <ProfileSelector profiles={profiles} activeId={activeId} onSelect={setActive} onAdd={addProfile} onBack={()=>setView('home')} />}
      {view==='logika' && <ModuleView title="Dunia Logika" desc="Berhitung & bentuk" color="var(--blue)" onBack={()=>setView('home')} onSpeak={speak} games={[
        {icon:'🔢',name:'Hitung Benda',desc:'Hitung berapa bendanya',action:()=>setView('game-count'),free:true},
        {icon:'🔷',name:'Cocokkan Bentuk',desc:'Cocokkan bentuk yang sama',action:()=>setView('game-shape'),free:true},
      ]} />}
      {view==='bahasa' && <ModuleView title="Dunia Bahasa" desc="Huruf & kata" color="var(--green)" onBack={()=>setView('home')} onSpeak={speak} games={[
        {icon:'🔤',name:'Tebak Huruf',desc:'Dengar & pilih huruf',action:()=>setView('game-letter'),free:true},
        {icon:'🧩',name:'Susun Kata',desc:'Susun huruf jadi kata',action:()=>setView('game-word'),free:premium},
      ]} />}
      {view==='kreativitas' && <ModuleView title="Dunia Kreativitas" desc="Mewarnai & kreasi" color="var(--orange)" onBack={()=>setView('home')} onSpeak={speak} games={[
        {icon:'🎨',name:'Mewarnai',desc:'Warnai gambar lucu',action:()=>setView('game-color'),free:true},
      ]} />}
      {view==='game-count' && <GameCount onBack={()=>setView('logika')} onReward={giveSticker} onScore={(s:number)=>saveGameScore('count',s)} onSpeak={speak} />}
      {view==='game-shape' && <GameShape onBack={()=>setView('logika')} onReward={giveSticker} onScore={(s:number)=>saveGameScore('shape',s)} onSpeak={speak} />}
      {view==='game-letter' && <GameLetter onBack={()=>setView('bahasa')} onReward={giveSticker} onScore={(s:number)=>saveGameScore('letter',s)} onSpeak={speak} />}
      {view==='game-word' && <GameWord onBack={()=>setView('bahasa')} onReward={giveSticker} onScore={(s:number)=>saveGameScore('word',s)} onSpeak={speak} />}
      {view==='game-color' && <GameColor onBack={()=>setView('kreativitas')} onReward={giveSticker} onScore={(s:number)=>saveGameScore('color',s)} onSpeak={speak} />}
      {view==='parental' && <ParentalDashboard profiles={profiles} setProfiles={setProfiles} onBack={()=>setView('home')} onUnlock={()=>{setPremium(true); localStorage.setItem('edu_premium','1')}} premium={premium} />}
    </main>

    {showGate && <MathGate onClose={()=>setShowGate(false)} onSuccess={()=>{setShowGate(false); setView('parental')}} />}

    <footer style={{textAlign:'center',padding:'16px',color:'#9CA3AF',fontSize:'.8rem'}}>Ceria Belajar • 4-8 tahun • Tap besar • Tanpa tautan eksternal</footer>
  </div>
}

function HomeView({active,profiles,onPlay,onProfiles,premium}:{active:Profile|null,profiles:Profile[],onPlay:(v:View)=>void,onProfiles:()=>void,premium:boolean}){
  return <div className="stack" style={{gap:20}}>
    <div className="hero">
      <div>
        <h1 style={{fontSize:'2rem',fontWeight:900,lineHeight:1.1}}>Halo, {active? active.name : 'Teman Kecil'}! 👋</h1>
        <p className="muted" style={{marginTop:8}}>Pilih dunia & mulai bermain sambil belajar. Tap yang besar ya!</p>
        {!active && profiles.length===0 && <div style={{marginTop:14}}><button className="btn btn-primary" onClick={onProfiles}>Buat Profil Dulu →</button></div>}
        {active && <div className="sticker-row">{active.stickers.length? active.stickers.map((s,i)=><span key={i} className="sticker">{s}</span>) : <span className="muted">Selesaikan game untuk dapat stiker ⭐</span>}</div>}
        <div style={{marginTop:14}} className="flex"><button className="btn btn-secondary" onClick={()=>speak('Halo! Pilih dunia untuk bermain')}>🔊 Dengar</button><span className="badge">Freemium: 3 dunia • {premium?'Premium aktif':'Game kedua butuh premium'}</span></div>
      </div>
      <div className="mascot">🦊<small>Maskot Ceria</small></div>
    </div>
    <div className="grid3">
      <ModuleCard icon="🔢" title="Dunia Logika" desc="Hitung & bentuk" color="var(--blue)" progress="2 game" onClick={()=>onPlay('logika')} />
      <ModuleCard icon="🔤" title="Dunia Bahasa" desc="Huruf & kata" color="var(--green)" progress={premium?'2 game':'1 gratis + 1 premium'} onClick={()=>onPlay('bahasa')} />
      <ModuleCard icon="🎨" title="Dunia Kreativitas" desc="Mewarnai seru" color="var(--orange)" progress="1 game" onClick={()=>onPlay('kreativitas')} />
    </div>
    {!active && <div style={{background:'#FEF3C7',padding:12,borderRadius:12,fontWeight:700}}>💡 Buat profil (maks 3 anak) supaya progres & stiker tersimpan</div>}
  </div>
}
function ModuleCard({icon,title,desc,color,progress,onClick}:{icon:string,title:string,desc:string,color:string,progress:string,onClick:()=>void}){
  return <div className="card" onClick={onClick} role="button" tabIndex={0}>
    <div className="module-icon" style={{background:color}}>{icon}</div>
    <div style={{fontWeight:900,fontSize:'1.1rem'}}>{title}</div>
    <div className="muted">{desc} • {progress}</div>
    <div style={{marginTop:10}}><span className="btn btn-primary" style={{padding:'8px 14px',minHeight:36}}>Main ▶</span></div>
  </div>
}
function ModuleView({title,desc,color,games,onBack,onSpeak}:{title:string,desc:string,color:string,games:{icon:string,name:string,desc:string,action:()=>void,free:boolean}[],onBack:()=>void,onSpeak:(t:string)=>void}){
  return <div className="stack">
    <button className="btn btn-ghost" style={{alignSelf:'flex-start'}} onClick={onBack}>← Kembali</button>
    <div style={{background:color,borderRadius:20,padding:20,color:'white'}}><h2 style={{fontWeight:900,fontSize:'1.5rem'}}>{title}</h2><p>{desc}</p><button className="btn btn-outline" style={{marginTop:8}} onClick={()=>onSpeak(title)}>🔊 Dengarkan</button></div>
    <div className="grid3">
      {games.map(g=> <div key={g.name} className={g.free? 'card':'card card-locked'} onClick={g.free? g.action: undefined}>
        {!g.free && <span className="lock-badge">🔒 Premium</span>}
        <div style={{fontSize:36}}>{g.icon}</div><div style={{fontWeight:800}}>{g.name}</div><div className="muted">{g.desc}</div>
        {g.free ? <div style={{marginTop:8}}><span className="btn btn-primary" style={{minHeight:36,padding:'8px 14px'}}>Main</span></div> : <div className="muted" style={{marginTop:8}}>Buka di Dashboard Orang Tua</div>}
      </div>)}
    </div>
  </div>
}
function ProfileSelector({profiles,activeId,onSelect,onAdd,onBack}:{profiles:Profile[],activeId:string|null,onSelect:(id:string)=>void,onAdd:(n:string,a:string)=>void,onBack:()=>void}){
  const [name,setName]=useState(''); const [avatar,setAvatar]=useState(AVATARS[0])
  return <div className="stack">
    <button className="btn btn-ghost" style={{alignSelf:'flex-start'}} onClick={onBack}>← Kembali</button>
    <h2 className="kid-title">Pilih Profil 👧👦</h2><p className="muted">Maksimal 3 anak. Data tersimpan di perangkat (localStorage).</p>
    <div className="profile-grid">
      {profiles.map(p=> <div key={p.id} className={p.id===activeId?'profile-card active':'profile-card'} onClick={()=>onSelect(p.id)}>
        <div className="avatar" style={{background:'#FEF3C7',margin:'0 auto'}}>{p.avatar}</div>
        <div style={{fontWeight:800,marginTop:8}}>{p.name}</div>
        <div className="muted">{p.stickers.length} stiker</div>
        {p.id===activeId && <div className="badge" style={{marginTop:6}}>Aktif</div>}
      </div>)}
      {profiles.length<3 && <div className="card" style={{display:'grid',placeItems:'center',minHeight:120,border:'2px dashed #E5E7EB'}}>Tambah di bawah ↓</div>}
    </div>
    {profiles.length<3 && <div className="game-area" style={{maxWidth:520}}>
      <h3 style={{fontWeight:800}}>Tambah Anak</h3>
      <div className="stack" style={{marginTop:10}}>
        <input placeholder="Nama anak" value={name} onChange={e=>setName(e.target.value)} aria-label="Nama anak" />
        <div><div className="muted">Pilih avatar</div><div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:6}}>{AVATARS.map(a=> <button key={a} onClick={()=>setAvatar(a)} style={{width:48,height:48,borderRadius:12,border: avatar===a?'3px solid var(--primary)':'2px solid #E5E7EB',background:'white',fontSize:22,cursor:'pointer'}}>{a}</button>)}</div></div>
        <button className="btn btn-primary" disabled={!name.trim()} onClick={()=>{onAdd(name.trim(),avatar); setName('')}}>Tambah Profil</button>
      </div>
    </div>}
    {profiles.length>=3 && <div className="muted">Sudah 3 profil. Hapus di Dashboard Orang Tua jika perlu.</div>}
  </div>
}
function MathGate({onClose,onSuccess}:{onClose:()=>void,onSuccess:()=>void}){
  const [q]=useState(()=>{
    const a=Math.floor(Math.random()*8)+2, b=Math.floor(Math.random()*8)+2, op=Math.random()>.5?'+':'x'
    const ans=op==='+'?a+b:a*b
    return {a,b,op,ans}
  })
  const [val,setVal]=useState(''); const [err,setErr]=useState('')
  return <div className="modal-overlay" onClick={onClose}>
    <div className="modal" onClick={e=>e.stopPropagation()}>
      <h3 style={{fontWeight:900}}>🔒 Area Orang Tua</h3><p className="muted">Jawab soal untuk masuk</p>
      <div style={{fontSize:'1.8rem',fontWeight:900,margin:'14px 0',textAlign:'center'}}>{q.a} {q.op} {q.b} = ?</div>
      <input type="number" placeholder="Jawaban" value={val} onChange={e=>setVal(e.target.value)} />
      {err && <div style={{color:'#EF4444',fontWeight:700}}>{err}</div>}
      <div className="flex" style={{marginTop:12}}>
        <button className="btn btn-ghost" onClick={onClose}>Batal</button>
        <button className="btn btn-primary" onClick={()=>{ if(parseInt(val)===q.ans) onSuccess(); else setErr('Jawaban salah, coba lagi')}}>Masuk</button>
      </div>
    </div>
  </div>
}
function ParentalDashboard({profiles,setProfiles,onBack,onUnlock,premium}:{profiles:Profile[],setProfiles:(p:Profile[])=>void,onBack:()=>void,onUnlock:()=>void,premium:boolean}){
  const prog=getProgress()
  const updateLimit=(id:string,v:number)=> setProfiles(profiles.map(p=>p.id===id?{...p,screenTimeLimit:v}:p))
  const remove=(id:string)=> setProfiles(profiles.filter(p=>p.id!==id))
  return <div className="stack">
    <button className="btn btn-ghost" style={{alignSelf:'flex-start'}} onClick={onBack}>← Kembali</button>
    <h2 className="kid-title">Dashboard Orang Tua 👨‍👩‍👧</h2>
    <div className="card" style={{cursor:'default'}}>
      <h3 style={{fontWeight:800}}>Freemium</h3><p className="muted">3 dunia tersedia. Premium membuka semua game tanpa batas.</p>
      {premium ? <div className="badge" style={{background:'#DCFCE7',marginTop:8}}>✅ Premium aktif</div> : <button className="btn btn-primary" style={{marginTop:8}} onClick={onUnlock}>Buka Premium (simulasi)</button>}
    </div>
    {profiles.length===0 && <div className="muted">Belum ada profil anak.</div>}
    {profiles.map(p=>{
      const pr=prog[p.id]||{}
      return <div key={p.id} className="card" style={{cursor:'default'}}>
        <div className="flex" style={{justifyContent:'space-between'}}><div className="flex"><span style={{fontSize:28}}>{p.avatar}</span><strong>{p.name}</strong></div><button className="btn btn-ghost" onClick={()=>remove(p.id)}>Hapus</button></div>
        <div className="stack" style={{marginTop:10}}>
          <div>Stiker: {p.stickers.join(' ')||'-'} ({p.stickers.length})</div>
          <div>Progress: {Object.keys(pr).length? Object.entries(pr).map(([k,v])=>k+':'+v).join(' • ') : 'Belum main'}</div>
          <label className="flex">Batas waktu layar (menit): <input type="number" value={p.screenTimeLimit} onChange={e=>updateLimit(p.id, parseInt(e.target.value)||0)} style={{maxWidth:100}} /></label>
          <div className="progress-bar"><div className="progress-fill" style={{width: Math.min(100,(Object.values(pr).reduce((a:number,b:number)=>a+b,0)/10)*100)+'% ',background:'var(--green)'}} /></div>
        </div>
      </div>
    })}
    <div className="card" style={{background:'#F9FAFB',cursor:'default'}}><strong>Tips</strong><p className="muted">Data tersimpan lokal (localStorage). Mode offline tetap bisa bermain. Atur batas waktu & pantau stiker harian.</p></div>
  </div>
}
function GameShell({title,children,onBack,score,lives,onSpeak}:{title:string,children:any,onBack:()=>void,score:number,lives?:number,onSpeak:()=>void}){
  return <div className="game-area">
    <div className="flex" style={{justifyContent:'space-between',flexWrap:'wrap'}}>
      <button className="btn btn-ghost" onClick={onBack}>← Keluar</button>
      <div className="flex"><span className="badge">⭐ {score}</span>{lives!==undefined && <span className="badge">❤️ {lives}</span>}<button className="btn btn-ghost" onClick={onSpeak}>🔊</button></div>
    </div>
    <h2 style={{fontWeight:900,textAlign:'center',marginTop:8}}>{title}</h2>
    <div style={{marginTop:12}}>{children}</div>
  </div>
}
function EndScreen({title,score,onBack,onRetry}:{title:string,score:number,onBack:()=>void,onRetry:()=>void}){
  return <div className="game-area" style={{textAlign:'center'}}>
    <h2 style={{fontWeight:900}}>{title}</h2><p style={{fontSize:48,margin:'10px 0'}}>🎉</p><p>Skor kamu: <strong>{score}</strong></p><p className="muted">Coba lagi untuk dapat stiker!</p>
    <div className="flex" style={{justifyContent:'center',marginTop:12}}><button className="btn btn-primary" onClick={onRetry}>Main Lagi</button><button className="btn btn-ghost" onClick={onBack}>Keluar</button></div>
  </div>
}
function shuffle<T>(a:T[]):T[]{ const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [b[i],b[j]]=[b[j],b[i]]} return b}

// --- Games ---
function GameCount({onBack,onReward,onScore,onSpeak}:{onBack:()=>void,onReward:(s:string)=>void,onScore:(n:number)=>void,onSpeak:(t:string)=>void}){
  const make=()=>{ const n=Math.floor(Math.random()*6)+1; const icons=['🍎','⭐','🐻','🚗']; const ic=icons[Math.floor(Math.random()*icons.length)]; const others=[1,2,3,4,5,6].filter(x=>x!==n).sort(()=>Math.random()-.5).slice(0,2); return {n,ic,choices:shuffle([n,...others])}}
  const [q,setQ]=useState(make)
  const [score,setScore]=useState(0); const [lives,setLives]=useState(3); const [msg,setMsg]=useState('')
  const pick=(v:number)=>{
    if(v===q.n){const ns=score+1; setScore(ns); setMsg('Benar! 🎉'); onSpeak('Benar!'); if(ns%3===0) onReward('⭐'); onScore(ns); setTimeout(()=>{setQ(make()); setMsg('')},600)} else {setLives(l=>l-1); setMsg('Coba lagi'); onSpeak('Coba lagi')}
  }
  if(lives<=0) return <EndScreen title="Hitung Benda" score={score} onBack={onBack} onRetry={()=>{setScore(0);setLives(3);setQ(make())}} />
  return <GameShell title="Hitung Benda 🔢" onBack={onBack} score={score} lives={lives} onSpeak={()=>onSpeak('Hitung berapa bendanya')}>
    <div style={{fontSize:48,textAlign:'center',margin:'10px 0'}}>{Array.from({length:q.n}).map((_,i)=><span key={i}>{q.ic}</span>)}</div>
    <p style={{textAlign:'center',fontWeight:800}}>Ada berapa {q.ic} ?</p>
    <div className="choice-grid" style={{marginTop:12}}>{q.choices.map(c=> <button key={c} className="choice-btn" onClick={()=>pick(c)}>{c}</button>)}</div>
    {msg && <div style={{textAlign:'center',fontWeight:800,marginTop:10}}>{msg}</div>}
  </GameShell>
}
function GameShape({onBack,onReward,onScore,onSpeak}:{onBack:()=>void,onReward:(s:string)=>void,onScore:(n:number)=>void,onSpeak:(t:string)=>void}){
  const shapes=[{e:'🔵',name:'lingkaran'},{e:'🟦',name:'persegi'},{e:'🔺',name:'segitiga'},{e:'⭐',name:'bintang'}]
  const [target,setTarget]=useState(()=>shapes[Math.floor(Math.random()*shapes.length)])
  const [score,setScore]=useState(0); const [msg,setMsg]=useState('')
  const pick=(s:any)=>{
    if(s.e===target.e){const ns=score+1; setScore(ns); setMsg('Hebat!'); onSpeak('Hebat'); if(ns%2===0) onReward('🔷'); onScore(ns); setTimeout(()=>{setTarget(shapes[Math.floor(Math.random()*shapes.length)]); setMsg('')},500)} else {setMsg('Bukan itu, coba lagi')}
  }
  return <GameShell title="Cocokkan Bentuk 🔷" onBack={onBack} score={score} onSpeak={()=>onSpeak('Pilih bentuk '+target.name)}>
    <div style={{textAlign:'center'}}><div style={{fontSize:64}}>{target.e}</div><p style={{fontWeight:800}}>Cari {target.name}!</p></div>
    <div className="choice-grid" style={{marginTop:12}}>{shapes.map(s=> <button key={s.e} className="choice-btn" onClick={()=>pick(s)} style={{fontSize:36}}>{s.e}</button>)}</div>
    {msg && <div style={{textAlign:'center',fontWeight:800,marginTop:10}}>{msg}</div>}
  </GameShell>
}
function GameLetter({onBack,onReward,onScore,onSpeak}:{onBack:()=>void,onReward:(s:string)=>void,onScore:(n:number)=>void,onSpeak:(t:string)=>void}){
  const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const [target,setTarget]=useState(()=>letters[Math.floor(Math.random()*letters.length)])
  const [score,setScore]=useState(0)
  const makeOpts=(t:string)=>{ const others=letters.filter(l=>l!==t).sort(()=>Math.random()-.5).slice(0,3); return shuffle([t,...others])}
  const [opts,setOpts]=useState(()=>makeOpts(target))
  useEffect(()=>{ onSpeak('Huruf '+target)},[]) 
  const pick=(l:string)=>{
    if(l===target){const ns=score+1; setScore(ns); onReward('🔤'); onScore(ns); onSpeak('Benar!'); const nt=letters[Math.floor(Math.random()*letters.length)]; setTarget(nt); setOpts(makeOpts(nt))} else onSpeak('Coba lagi')
  }
  return <GameShell title="Tebak Huruf 🔤" onBack={onBack} score={score} onSpeak={()=>onSpeak('Huruf '+target)}>
    <div style={{textAlign:'center'}}><button className="btn btn-secondary" onClick={()=>onSpeak('Huruf '+target)}>🔊 Dengar: {target}</button><p className="muted" style={{marginTop:8}}>Tap huruf yang kamu dengar</p></div>
    <div className="choice-grid" style={{marginTop:12}}>{opts.map(o=> <button key={o} className="choice-btn" onClick={()=>pick(o)}>{o}</button>)}</div>
  </GameShell>
}
function GameWord({onBack,onReward,onScore,onSpeak}:{onBack:()=>void,onReward:(s:string)=>void,onScore:(n:number)=>void,onSpeak:(t:string)=>void}){
  const words=['KUCING','BOLA','APEL','IKAN','RUMAH']
  const [idx,setIdx]=useState(0)
  const word=words[idx]
  const [shuf,setShuf]=useState(()=>shuffle(word.split('')))
  const [built,setBuilt]=useState<string[]>([])
  const [score,setScore]=useState(0)
  const tap=(i:number)=>{ const ch=shuf[i]; setBuilt([...built,ch]); setShuf(shuf.filter((_,j)=>j!==i))}
  useEffect(()=>{
    if(built.length===word.length && built.join('')===word){
      const ns=score+1; setScore(ns); onReward('🧩'); onScore(ns); onSpeak('Hebat! Kata '+word)
      setTimeout(()=>{const ni=(idx+1)%words.length; setIdx(ni); setShuf(shuffle(words[ni].split(''))); setBuilt([])},700)
    } else if(built.length===word.length && built.join('')!==word){
      setTimeout(()=>{ setShuf(shuffle(word.split(''))); setBuilt([])},700)
    }
  },[built])
  const reset=()=>{ setShuf(shuffle(word.split(''))); setBuilt([])}
  return <GameShell title="Susun Kata 🧩" onBack={onBack} score={score} onSpeak={()=>onSpeak('Susun kata '+word)}>
    <div style={{display:'flex',gap:8,justifyContent:'center',minHeight:56,marginTop:10}}>{Array.from({length:word.length}).map((_,i)=><span key={i} style={{width:48,height:48,display:'grid',placeItems:'center',border:'2px solid var(--primary)',borderRadius:12,fontWeight:900,background: built[i]?'#FFF':'#F9FAFB'}}>{built[i]||''}</span>)}</div>
    <div className="choice-grid" style={{marginTop:12}}>{shuf.map((c,i)=><button key={i} className="choice-btn" onClick={()=>tap(i)}>{c}</button>)}</div>
    <div className="flex" style={{justifyContent:'center',marginTop:10}}><button className="btn btn-ghost" onClick={reset}>Ulang</button><button className="btn btn-ghost" onClick={()=>onSpeak(word)}>🔊 Dengar</button></div>
  </GameShell>
}
function GameColor({onBack,onReward,onScore,onSpeak}:{onBack:()=>void,onReward:(s:string)=>void,onScore:(n:number)=>void,onSpeak:(t:string)=>void}){
  const colors=['#FF6B6B','#4ECDC4','#FFE66D','#A78BFA','#34D399','#FB923C']
  const [col,setCol]=useState(colors[0]); const [strokes,setStrokes]=useState(0)
  return <GameShell title="Mewarnai 🎨" onBack={onBack} score={strokes} onSpeak={()=>onSpeak('Pilih warna dan warnai gambar')}>
    <div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center'}}>{colors.map(c=> <button key={c} onClick={()=>setCol(c)} style={{width:48,height:48,borderRadius:12,background:c,border: col===c?'3px solid #111':'2px solid #E5E7EB',cursor:'pointer'}} aria-label={'warna '+c} />)}</div>
    <div className="canvas-wrap" style={{marginTop:12}}>
      <ColorCanvas color={col} onStroke={()=>{const ns=strokes+1; setStrokes(ns); if(ns%5===0) onReward('🎨'); onScore(ns)}} />
    </div>
    <p className="muted" style={{textAlign:'center',marginTop:6}}>Tap / drag untuk mewarnai. Ganti warna di atas.</p>
  </GameShell>
}
function ColorCanvas({color,onStroke}:{color:string,onStroke:()=>void}){
  const ref=useRef<HTMLCanvasElement>(null)
  const colorRef=useRef(color)
  useEffect(()=>{ colorRef.current=color},[color])
  useEffect(()=>{
    const c=ref.current; if(!c) return
    const ctx=c.getContext('2d')!; const dpr=window.devicePixelRatio||1
    const rect=c.getBoundingClientRect()
    c.width=rect.width*dpr; c.height=rect.height*dpr; ctx.scale(dpr,dpr)
    ctx.fillStyle='white'; ctx.fillRect(0,0,rect.width,rect.height)
    ctx.strokeStyle='#E5E7EB'; ctx.lineWidth=2; ctx.setLineDash([8,8])
    ctx.strokeRect(rect.width*0.25, rect.height*0.35, rect.width*0.5, rect.height*0.4)
    ctx.beginPath(); ctx.moveTo(rect.width*0.25, rect.height*0.35); ctx.lineTo(rect.width*0.5, rect.height*0.15); ctx.lineTo(rect.width*0.75, rect.height*0.35); ctx.closePath(); ctx.stroke()
    ctx.beginPath(); ctx.arc(rect.width*0.82, rect.height*0.22, 22, 0, Math.PI*2); ctx.stroke()
    ctx.setLineDash([])
    let drawing=false
    const pos=(e:any)=>{ const r=c.getBoundingClientRect(); const t=e.touches?e.touches[0]:e; return {x:t.clientX-r.left, y:t.clientY-r.top}}
    const down=(e:any)=>{ drawing=true; const p=pos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); e.preventDefault()}
    const move=(e:any)=>{ if(!drawing) return; const p=pos(e); ctx.strokeStyle=colorRef.current; ctx.lineWidth=10; ctx.lineCap='round'; ctx.lineTo(p.x,p.y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p.x,p.y); onStroke(); e.preventDefault()}
    const up=()=>{ drawing=false}
    c.addEventListener('mousedown',down); c.addEventListener('mousemove',move); window.addEventListener('mouseup',up)
    c.addEventListener('touchstart',down,{passive:false}); c.addEventListener('touchmove',move,{passive:false}); c.addEventListener('touchend',up)
    return()=>{ c.removeEventListener('mousedown',down); c.removeEventListener('mousemove',move); window.removeEventListener('mouseup',up); c.removeEventListener('touchstart',down); c.removeEventListener('touchmove',move); c.removeEventListener('touchend',up)}
  },[])
  return <canvas ref={ref} style={{width:'100%',height:280,display:'block',touchAction:'none'}} />
}
