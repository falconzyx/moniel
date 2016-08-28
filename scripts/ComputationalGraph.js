class ComputationalGraph{
	constructor() {
		this.initialize();
	}

	initialize() {
		this.graph = new dagreD3.graphlib.Graph({
			compound:true
		});
        this.graph.setGraph({});

		this.nodeCounter = {};

		this.nodeStack = [];
		this.previousNodeStack = [];

		this.scopeStack = new ScopeStack();
		this.scopeStack.initialize();

		this.defaultEdge = {
            arrowhead: "vee",
            lineInterpolate: "basis"
        }
	}

	enterScope(name) {
		let previousScopeId = this.scopeStack.currentScopeIdentifier();
		this.scopeStack.push(name);
		let currentScopeId = this.scopeStack.currentScopeIdentifier();

		this.graph.setNode(currentScopeId, {
			label: name,
			clusterLabelPos: "top",
            class: "Scope"
		});

		this.graph.setParent(currentScopeId, previousScopeId);
	}

	exitScope() {
		this.scopeStack.pop();
	}

	generateInstanceId(scope, type) {
		let typedId = [...scope, type].join("/");

		if (!this.nodeCounter.hasOwnProperty(typedId)) {
			this.nodeCounter[typedId] = 0;
		}
		
		this.nodeCounter[typedId] += 1;

		return [...scope, type].join("/") + this.nodeCounter[typedId];
	}

	addMain() {
		let id = this.scopeStack.currentScopeIdentifier();

		this.graph.setNode(id, {
			class: "Network"
		});
	}

	touchNode(id) {
		this.nodeStack.push(id);
		this.previousNodeStack.forEach(from => this.setEdge(from, id));
	}

	setNode(id, node) {
		this.touchNode(id);
		this.setParent(id, this.scopeStack.currentScopeIdentifier());
		return this.graph.setNode(id, node);
	}

	clearNodeStack() {
		this.previousNodeStack = [];
		this.nodeStack = [];
	}

	freezeNodeStack() {
		console.log(`Freezing node stack. Content: ${JSON.stringify(this.nodeStack)}`);
		this.previousNodeStack = [...this.nodeStack];
		this.nodeStack = [];
	}

	setParent(node1, node2) {
		return this.graph.setParent(node1, node2);
	}

	setEdge(from, to) {
		console.log(`Creating edge from "${from}" to "${to}".`)
		this.graph.setEdge(from, to, {...this.defaultEdge});
	}

	hasNode(id) {
		return this.graph.hasNode(id);
	}

	getGraph() {
		return this.graph;
	}

	graph() {
		return this.graph;
	}
}