#!/usr/bin/env python3
"""Generate Flags/ and Coins/ imagesets from the web repo SVGs.

SVGs are converted to vector PDF with rsvg-convert (brew install librsvg), which
renders every feature the web SVGs use; asset catalogs keep them as vectors.

Usage: scripts/generate_icons.py [path/to/web/exchanger]   (default: ../exchanger)
"""
import json, shutil, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEB = Path(sys.argv[1] if len(sys.argv) > 1 else ROOT.parent / "exchanger").resolve()
ASSETS = ROOT / "Exchanger/Resources/Assets.xcassets"

CRYPTO = ("BTC ETH USDT USDC BNB SOL XRP TON ADA DOGE TRX DOT LTC LINK AVAX XLM XMR BCH ETC ATOM "
          "NEAR UNI SHIB PEPE SUI APT ARB OP DAI FIL ICP HBAR ALGO XTZ EOS ZEC DASH PAXG XAUT POL").split()
COIN_ALIASES = {"POL": "matic"}  # POL is the renamed MATIC


def write_folder(folder: Path):
    if folder.exists():
        shutil.rmtree(folder)
    folder.mkdir(parents=True)
    (folder / "Contents.json").write_text(json.dumps(
        {"info": {"author": "xcode", "version": 1}, "properties": {"provides-namespace": False}}, indent=2) + "\n")


def write_imageset(folder: Path, name: str, svg: Path):
    imageset = folder / f"{name}.imageset"
    imageset.mkdir()
    subprocess.run(["rsvg-convert", "-f", "pdf", "-o", str(imageset / f"{name}.pdf"), str(svg)], check=True)
    (imageset / "Contents.json").write_text(json.dumps({
        "images": [{"filename": f"{name}.pdf", "idiom": "universal"}],
        "info": {"author": "xcode", "version": 1},
        "properties": {"preserves-vector-representation": True, "template-rendering-intent": "original"},
    }, indent=2) + "\n")


def main():
    flags = ASSETS / "Flags"
    write_folder(flags)
    flag_map = json.loads((WEB / "src/utils/flagMap.json").read_text())
    for code, slug in sorted(flag_map.items()):
        write_imageset(flags, f"flag-{code.lower()}", WEB / "src/assets/flags" / f"{slug}.svg")

    coins = ASSETS / "Coins"
    write_folder(coins)
    missing = []
    for code in CRYPTO:
        svg = WEB / "node_modules/cryptocurrency-icons/svg/color" / f"{COIN_ALIASES.get(code, code.lower())}.svg"
        if svg.exists():
            write_imageset(coins, f"coin-{code.lower()}", svg)
        else:
            missing.append(code)
    print(f"flags: {len(flag_map)}, coins: {len(CRYPTO) - len(missing)}, no coin icon (letter badge): {' '.join(missing)}")


if __name__ == "__main__":
    main()
