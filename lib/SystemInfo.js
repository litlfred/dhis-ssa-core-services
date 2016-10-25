var SystemInfo = function(dhisScriptContext) {
    this.dhisScriptContext = dhisScriptContext;
    if (!dhisScriptContext instanceof Java.type("org.hisp.dhis.scriptlibrary.ExecutionContext")) {
	throw new Error("Invalid dhisScriptContext");
    }

    this.appContext = dhisScriptContext.getApplicationContext();
    if (! (this.appContext instanceof Java.type("org.springframework.context.ApplicationContext")) || this.appContext == null) {
	throw new Error("Invalid application context in dhisScriptContext");
    }
    this.nodeService = this.appContext.getBean("org.hisp.dhis.node.NodeService");
    this.systemService = this.appContext.getBean("org.hisp.dhis.system.SystemService");
}


SystemInfo.prototype.getData = function(format) {
    try {
	var node =  this.systemService.getSystemInfo();
	
	switch(format) {
	case 'string':
	    this.nodeService.serialize(node,'json',out);
	    return  out.toString();
	case 'string':
	    this.nodeService.serialize(node,'json',out);
	    return  JSON.parse(out.toString());
	default:
	    return node;
	}
    } catch (e) {
	throw new ErrorDHIS("Could not query for system info");
    }
}