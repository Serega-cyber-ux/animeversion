import json, wave, numpy as np
exec(open('align.py').read().split('segs = {}')[0])
S=json.load(open('script.json')); M=json.load(open('segmap.json'))['segmap']
V=load('voice_new.wav'); F=load('fix.mp3')
cut=lambda x,a,b: x[int(a*SR):int(b*SR)]
line=lambda i: cut(V, M[i][2], M[i][3])
fixb=[0,2.76,6.02,8.76,13.39,18.55,22.13,24.71,32.85,41.34,48.39]
fstart=[0,3.23,6.58,9.42,13.99,19.18,22.64,25.56,33.59,42.0]
fix=[cut(F,fstart[k],fixb[k+1]) for k in range(10)]
gap=lambda s: np.zeros(int(s*SR),np.float32)
clips=[line(i) for i in range(len(S))]
def split(i,at,pl): c=clips[i]; return c[:int(at*SR)], c[int((at+pl)*SR):]
a,b=split(4,2.76,.40); clips[4]=np.concatenate([fix[0],gap(.4),b])
a,b=split(11,2.01,.65); clips[11]=np.concatenate([a,gap(.45),fix[2]])
a,b=split(12,2.7,.67); clips[12]=np.concatenate([a,gap(.5),fix[3]])
a,b=split(17,1.13,.51); clips[17]=np.concatenate([a,gap(.4),fix[4]])
a,b=split(39,2.78,.66); clips[39]=np.concatenate([fix[5],gap(.45),b])
clips[6]=fix[1]; clips[54]=fix[6]; clips[64]=fix[7]; clips[65]=fix[8]; clips[66]=fix[9]
rep={4:'Но через три дня выходит ГТА шесть. И ты решаешься.',6:'А ты спокойно отвечаешь: «Играть в ГТА».',11:'На здании напротив висит баннер: до выхода ГТА шесть — три дня.',12:'У тебя есть план — свой игровой клуб. Люди будут приходить и играть в ГТА шесть на твоих приставках.',17:'Ты раскрываешь блокнот: две приставки, две копии ГТА, геймпады и телевизор.',39:'Дисков у ГТА шесть нет, только цифра. На каждую приставку своя копия — ещё сто шестьдесят.',54:'ГТА шесть — сто шестьдесят.',64:'А — реклама в соцсетях за триста долларов. Увидят тысячи, но платишь за показы, а не за клиентов.',65:'Б — ищешь клиентов сам: колледжи, дворы, знакомые. Сорок долларов, но два дня уйдут на улицу.',66:'В — первый час в ночь релиза бесплатно. Будет очередь, но выручки почти ноль.'}
for k,v in rep.items(): S[k][2]=v
json.dump(S,open('script.json','w'),ensure_ascii=False,indent=0)
t=0.15; out=[]; seg=[]; prev=None
for i in range(len(S)):
    os_,oe_,_=S[i]
    if prev is not None: t+=max(os_-prev,0.42)
    out.append((t,clips[i])); d=len(clips[i])/SR; seg.append([os_,oe_,round(t,3),round(t+d,3)]); t+=d; prev=oe_
total=t+(284.85-S[-1][1])
buf=np.zeros(int((total+.5)*SR),np.float32)
for st,c in out: a=int(st*SR); buf[a:a+len(c)]+=c
buf=np.clip(buf,-1,1)
with wave.open('voice_v3.wav','wb') as w: w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((buf*32767).astype(np.int16).tobytes())
json.dump(dict(segmap=seg,total=round(total,3),end_old=284.85),open('segmap.json','w'))
per=SR//30; env=[float(np.sqrt((buf[f*per:(f+1)*per]**2).mean())) for f in range(len(buf)//per)]; mx=max(env)
open('../assets/env2.js','w').write('window.ENV2='+json.dumps([round(v/mx,3) for v in env])+';window.SEGMAP='+json.dumps(seg)+';window.NEWTOTAL='+str(round(total,3))+';')
print('total',round(total,2))
