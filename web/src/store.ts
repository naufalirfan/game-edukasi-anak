export type Profile={id:string,name:string,avatar:string,stickers:string[],progress:Record<string,number>,screenTimeLimit:number,createdAt:number}
const KEY='edu_profiles_v1'
const ACTIVE='edu_active_v1'
const PROGRESS='edu_progress_v1'
export const AVATARS=['🦊','🐻','🐰','🐼','🦁','🐨','🐯','🐵']
export function loadProfiles():Profile[]{
  try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}
}
export function saveProfiles(p:Profile[]){ localStorage.setItem(KEY, JSON.stringify(p)) }
export function getActiveId():string|null{ return localStorage.getItem(ACTIVE)}
export function setActiveId(id:string){ localStorage.setItem(ACTIVE,id)}
export function getProgress():Record<string,Record<string,number>>{
  try{return JSON.parse(localStorage.getItem(PROGRESS)||'{}')}catch{return{}}
}
export function saveProgress(v:Record<string,Record<string,number>>){ localStorage.setItem(PROGRESS, JSON.stringify(v))}
export function speak(text:string){
  try{
    if('speechSynthesis' in window){
      speechSynthesis.cancel()
      const u=new SpeechSynthesisUtterance(text)
      u.lang='id-ID'; u.rate=0.95
      speechSynthesis.speak(u)
    }
  }catch{}
}
export function uid(){ return Math.random().toString(36).slice(2,9)}
