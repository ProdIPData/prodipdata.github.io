# GeoIP Locations — free monthly IPv4 GeoIP datasets

**Country, ASN, RIR, WHOIS and risk attributes for the routed IPv4 Internet, published monthly as CSV, Parquet and MMDB — one record per `/24` prefix.** Open data under **CC BY 4.0**, by **ProdIPData**.

🌐 **Website:** https://geoiplocations.com  
📦 **Downloads:** https://geoiplocations.com/downloads.html  
🔎 **Prefix Lookup:** https://geoiplocations.com/prefix-lookup.html  
🤗 **Open dataset (Parquet):** https://huggingface.co/datasets/ProdIPData/geoip-locations

This repository hosts the public **GeoIP Locations** website (GitHub Pages). It is the home of a free, monthly **IP geolocation** dataset covering the routed IPv4 address space at **`/24`** granularity.

## What's in each `/24` prefix

- **Geolocation** — country, region (ISO 3166-2), city, latitude/longitude, time zone
- **Network / ASN** — ASN, name, organisation, type (ISP, hosting, business, education, government)
- **Ownership (WHOIS)** — company, net name, abuse contact
- **Registry (RIR)** — ARIN / RIPE / APNIC / LACNIC / AFRINIC, allocation date, status
- **Risk signals** — bogon, Tor, anonymisation, command-and-control indicators

## Formats

| Format | Best for |
| --- | --- |
| **CSV** | Quick loading anywhere; per-country packages |
| **Parquet** | Columnar analytics in DuckDB, pandas, Spark |
| **MMDB** | MaxMind-compatible binary for fast in-app IP lookups |

Special editions each release: **ALL** (full geolocated set), **BOG** (bogons), **GOV** (government), **EDU** (education).

## Browse it in your browser (no tracking, nothing sent to a server)

- **Prefix Lookup** — resolve any IPv4 address or `/24` to its full attribute record: https://geoiplocations.com/prefix-lookup.html
- **Coverage** — country-level and region (admin-1) maps of the published footprint: https://geoiplocations.com/coverage.html
- **Density map** — where IPv4 address space concentrates worldwide
- **Methodology** — how the data is built and validated: https://geoiplocations.com/methodology.html

## Coverage (current release)

- **14M+** routed `/24` prefixes · **240+** countries · **~3.7B** IPv4 addresses represented
- Coordinates spatially validated against public-domain Natural Earth boundaries (~99.97% country match)
- TLD reference catalog sourced live from the IANA Root Zone Database

## License

Published **datasets and metadata** are licensed under **Creative Commons Attribution 4.0 (CC BY 4.0)** — free to use, including commercially, with attribution to **ProdIPData (GeoIP Locations)**. See [`licensing.html`](https://geoiplocations.com/licensing.html) and `LICENSE-DATA.md`.

## Local preview

```bash
python -m http.server 8000   # then open http://localhost:8000
```

---

**Keywords:** IPv4 GeoIP, IP geolocation, IP-to-country, IP-to-ASN, IP address database, `/24` prefixes, GeoIP CSV, GeoIP Parquet, GeoIP MMDB, MaxMind-compatible, RIR, WHOIS, ASN data, free GeoIP database, monthly IP dataset, open data.
