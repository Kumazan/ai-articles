import json
import os
from pathlib import Path

BASE = Path(__file__).resolve().parent
DATA = BASE / "data"
ENV = BASE / ".env"


def load_last_arbscan(day: str):
    p = DATA / f"arbscan-{day}.jsonl"
    if not p.exists():
        return None
    last = None
    with p.open() as f:
        for line in f:
            try:
                last = json.loads(line)
            except Exception:
                pass
    return last


def read_env():
    d = {}
    if not ENV.exists():
        return d
    for line in ENV.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        k, v = line.split('=', 1)
        d[k.strip()] = v.strip()
    return d


def write_env(d):
    # minimal patch: preserve unknown lines by appending if missing
    lines = []
    existing = set()
    if ENV.exists():
        for line in ENV.read_text().splitlines():
            if '=' in line and not line.strip().startswith('#'):
                k = line.split('=', 1)[0].strip()
                existing.add(k)
            lines.append(line)
    for k, v in d.items():
        if k in existing:
            # replace in lines
            new_lines = []
            for line in lines:
                if line.strip().startswith(k + '='):
                    new_lines.append(f"{k}={v}")
                else:
                    new_lines.append(line)
            lines = new_lines
        else:
            lines.append(f"{k}={v}")
    ENV.write_text('\n'.join(lines) + '\n')


def main():
    day = os.popen('date -u +%F').read().strip()
    last = load_last_arbscan(day)
    if not last:
        print('no arbscan yet')
        return

    env = read_env()
    conc = int(env.get('ARB_CONCURRENCY', '10') or '10')
    took = float(last.get('took_s') or 999)
    rate_limits = int(last.get('rate_limits') or 0)
    errors = int(last.get('errors') or 0)

    new_conc = conc
    if rate_limits > 0:
        new_conc = max(2, conc - 2)
    else:
        if took > 3.0 and errors < 10:
            new_conc = min(30, conc + 2)
        elif took < 1.2 and conc > 6:
            new_conc = max(6, conc - 1)

    if new_conc != conc:
        write_env({'ARB_CONCURRENCY': str(new_conc)})
        print(f"tuned ARB_CONCURRENCY {conc} -> {new_conc} (took_s={took}, errors={errors}, rate_limits={rate_limits})")
    else:
        print(f"no change (ARB_CONCURRENCY={conc}, took_s={took}, errors={errors}, rate_limits={rate_limits})")


if __name__ == '__main__':
    main()
