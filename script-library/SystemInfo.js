var SystemInfo = function(dhisScriptContext) {
    this.dhisScriptContext = dhisScriptContext;
    if (!dhisScriptContext instanceof Java.type("org.hisp.dhis.scriptlibrary.ExecutionContextSE")) {
	throw new Error("Invalid dhisScriptContext");
    }

    this.appContext = dhisScriptContext.getApplicationContext();
    if (! (this.appContext instanceof Java.type("org.springframework.context.ApplicationContext")) || this.appContext == null) {
	throw new Error("Invalid application context in dhisScriptContext");
    }
}


SystemInfo.prototype.getData = function(format) {
    var SystemService = Java.type("org.hisp.dhis.system.SystemService");
    var DefaultSystemService = Java.type("org.hisp.dhis.system.DefaultSystemService");
    var DefaultNodeService = Java.type("org.hisp.dhis.node.DefaultNodeService");
    var nodeService = this.appContext.applicationContext.getBean(DefaultNodeService);
    var systemService = this.appContext.getBean(DefaultSystemService);
    try {
	var node =  systemService.getSystemInfo();
	
	switch(format) {
	case 'string':
	    nodeService.serialize(node,'json',out);
	    return  out.toString();
	case 'string':
	    nodeService.serialize(node,'json',out);
	    return  JSON.parse(out.toString());
	default:
	    return node;
	}
    } catch (e) {
	throw new ErrorDHIS("Could not query for system info");
    }
}