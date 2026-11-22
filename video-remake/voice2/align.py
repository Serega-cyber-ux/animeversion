import json, subprocess, re, wave, sys
import numpy as np
S = json.load(open('script.json')); CH = json.load(open('chunks.json'))
SR = 48000
def load(fn):
    raw = subprocess.run(['ffmpeg','-v','error','-i',fn,'-ac','1','-ar',str(SR),'-f','s16le','-'],capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32)/32768
def pauses(x, thr_db=-38, minlen=0.18):
    win = int(SR*0.01); n = len(x)//win
    rms = np.sqrt((x[:n*win].reshape(n,win)**2).mean(1)+1e-12); db = 20*np.log10(rms)
    sil = db < thr_db; out=[]; i=0
    while i<n:
        if sil[i]:
            j=i
            while j<n and sil[j]: j+=1
            if (j-i)*0.01>=minlen: out.append((i*0.01, j*0.01))
            i=j
        else: i+=1
    return out
segs = {}
for k, idx in enumerate(CH):
    x = load(f'c{k}.mp3'); dur = len(x)/SR
    P = pauses(x)
    lead = P[0][1] if P and P[0][0] < 0.05 else 0.0
    tail = P[-1][0] if P and P[-1][1] > dur-0.05 else dur
    inner = [p for p in P if p[0] > lead+0.05 and p[1] < tail-0.05]
    chars = np.array([len(S[i][2]) for i in idx], float); cum = np.cumsum(chars)/chars.sum()
    exp = lead + (tail-lead)*cum[:-1]            # expected boundary times
    m = len(exp); q = len(inner)
    mids = np.array([(a+b)/2 for a,b in inner]); lens = np.array([b-a for a,b in inner])
    # DP: choose increasing pause indices for each boundary minimizing |mid-exp| - bonus for longer pauses
    INF=1e9; D=np.full((m+1,q+1),INF); D[0,:]=0; B=np.zeros((m+1,q+1),int)
    for i in range(1,m+1):
        for j in range(1,q+1):
            c = abs(mids[j-1]-exp[i-1]) - 0.8*lens[j-1]
            best = D[i-1,:j].min(); D[i,j] = best + c; B[i,j] = D[i-1,:j].argmin()
    j = int(D[m,1:].argmin())+1; chosen=[]
    for i in range(m,0,-1):
        chosen.append(j-1); j = B[i,j]
    chosen = chosen[::-1]
    OV = {1:[7.41,12.75,20.05,27.19,30.87,37.45,40.12,45.59,53.26], 2:[5.27,11.27,13.65,17.97,22.44,29.07,32.3,39.99,45.82,51.25], 3:[7.11,14.05,21.98,29.19,34.24,37.8,45.19,52.75,55.82,60.47]}
    if k in OV:
        chosen = [int(np.argmin([abs(a-v) for a,b in inner])) for v in OV[k]]
    bounds = [lead] + sum([[inner[c][0], inner[c][1]] for c in chosen], []) + [tail]
    for n_, i in enumerate(idx):
        segs[i] = dict(chunk=k, s=bounds[2*n_], e=bounds[2*n_+1])
    print(f'chunk {k}: dur {dur:.1f} lead {lead:.2f} tail {tail:.2f} pauses {q} -> err', np.round(mids[chosen]-exp,2).tolist())
# assemble
out=[]; t=0.15; segmap=[]; prev_old_end=None
audio = {k: load(f'c{k}.mp3') for k in range(len(CH))}
pad = 0.06
for i in range(len(S)):
    os_, oe_, txt = S[i]; g = segs[i]
    if prev_old_end is not None:
        old_gap = os_ - prev_old_end
        t += max(old_gap, 0.42)
    clip = audio[g['chunk']][int(max(0,g['s']-pad)*SR):int((g['e']+pad)*SR)]
    out.append((t-pad, clip))
    segmap.append([os_, oe_, round(t,3), round(t + (g['e']-g['s']),3)])
    t += g['e']-g['s']; prev_old_end = oe_
END_OLD = 284.85; total = t + (END_OLD - S[-1][1])
buf = np.zeros(int((total+0.5)*SR), np.float32)
for st, clip in out:
    a = int(st*SR); buf[a:a+len(clip)] += clip
buf = np.clip(buf, -1, 1)
with wave.open('voice_new.wav','wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((buf*32767).astype(np.int16).tobytes())
json.dump(dict(segmap=segmap, total=round(total,3), end_old=END_OLD), open('segmap.json','w'))
env=[]; per=SR//30
for f in range(len(buf)//per):
    env.append(float(np.sqrt((buf[f*per:(f+1)*per]**2).mean())))
mx=max(env); env=[round(v/mx,3) for v in env]
open('../assets/env2.js','w').write('window.ENV2='+json.dumps(env)+';window.SEGMAP='+json.dumps(segmap)+';window.NEWTOTAL='+str(round(total,3))+';')
print('total', round(total,2))
