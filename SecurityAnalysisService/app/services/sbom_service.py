def analyze_sbom(sbom: dict):
    components = sbom.get("components", [])

    packages = []

    risk_score = 0

    for component in components:

        package = {
            "name": component.get("name"),
            "version": component.get("version"),
            "purl": component.get("purl"),
            "type": component.get("type")
        }

        packages.append(package)

        if package["type"] == "library":
            risk_score += 5

    return {
        "componentCount": len(packages),
        "riskScore": risk_score,
        "packages": packages
    }