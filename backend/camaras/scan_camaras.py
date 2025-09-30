import socket
from concurrent.futures import ThreadPoolExecutor

# Rango de IPs a escanear (ajusta según tu red)
IP_BASE = '192.168.1.'
PORTS = [80, 554, 8080]  # HTTP, RTSP, HTTP alternativo
TIMEOUT = 1


def scan_ip(ip):
    open_ports = []
    for port in PORTS:
        try:
            with socket.create_connection((ip, port), timeout=TIMEOUT):
                open_ports.append(port)
        except Exception:
            pass
    return (ip, open_ports) if open_ports else None


def buscar_camaras(rango=range(1, 255)):
    ips = [f"{IP_BASE}{i}" for i in rango]
    results = []
    with ThreadPoolExecutor(max_workers=50) as executor:
        for res in executor.map(scan_ip, ips):
            if res:
                results.append(res)
    return results

if __name__ == "__main__":
    encontrados = buscar_camaras()
    for ip, ports in encontrados:
        print(f"Cámara posible en {ip} (puertos abiertos: {ports})")
