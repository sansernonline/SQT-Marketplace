# from diagram-figures/assets/mermaid-engine
"""Run the ELK layout engine (elkjs under Node) on a graph dict."""
import json, os, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
CFG = json.load(open(os.path.join(HERE, "figures.json"), encoding="utf-8"))
NODE_PATH = os.path.normpath(os.path.join(HERE, CFG["root"], CFG["node_modules"]))

# elkjs lives in a throw-away folder (not in git); reinstall the pinned version when it was cleaned up
if not os.path.isdir(os.path.join(NODE_PATH, "elkjs")):
    subprocess.run(["npm", "install", "--no-save", "--prefix", os.path.dirname(NODE_PATH), "elkjs@0.9.3"],
                   check=True, shell=(os.name == "nt"))

BASE = {
    "elk.algorithm": "layered",
    "elk.edgeRouting": "ORTHOGONAL",
    "elk.spacing.nodeNode": "44",
    "elk.layered.spacing.nodeNodeBetweenLayers": "64",
    "elk.spacing.edgeNode": "22",
    "elk.spacing.edgeEdge": "16",
    "elk.layered.spacing.edgeNodeBetweenLayers": "22",
    "elk.layered.spacing.edgeEdgeBetweenLayers": "16",
    "elk.spacing.edgeLabel": "6",
    "elk.spacing.labelNode": "8",
    "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
    "elk.layered.considerModelOrder.strategy": "NODES_AND_EDGES",
    "elk.edgeLabels.inline": "true",
    "elk.layered.cycleBreaking.strategy": "MODEL_ORDER",
    "elk.padding": "[top=0,left=0,bottom=0,right=0]",
}


def layout(graph, direction="DOWN", extra=None):
    g = dict(graph)
    g["layoutOptions"] = {**BASE, "elk.direction": direction, **(extra or {})}
    env = {**os.environ, "NODE_PATH": NODE_PATH}
    out = subprocess.run(["node", os.path.join(HERE, "elk_run.js")], input=json.dumps(g),
                         capture_output=True, text=True, env=env, check=True)
    return json.loads(out.stdout)
