#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = [
#   "yfinance>=0.2.40",
#   "pandas>=2.0.0",
#   "matplotlib>=3.8.0",
# ]
# ///
import yfinance as yf
import matplotlib.pyplot as plt
from pathlib import Path

symbols=["2313.TW","3037.TW","6770.TW"]
outdir=Path('/Users/kumax/.openclaw/workspace/charts')
outdir.mkdir(exist_ok=True)
for s in symbols:
    df=yf.download(s, period='1mo', interval='1d', progress=False, auto_adjust=False)
    if df.empty:
        print('EMPTY', s)
        continue
    close=df['Close'].squeeze()
    plt.figure(figsize=(8,4))
    plt.plot(df.index, close, label='Close', linewidth=1.8)
    plt.plot(df.index, close.rolling(5).mean(), label='MA5', linewidth=1.2)
    plt.plot(df.index, close.rolling(20).mean(), label='MA20', linewidth=1.2)
    plt.title(f'{s} 近1個月走勢')
    plt.legend(); plt.grid(alpha=0.25)
    p=outdir / f"{s.replace('.', '_')}_1mo.png"
    plt.tight_layout(); plt.savefig(p, dpi=160); plt.close()
    print(str(p))