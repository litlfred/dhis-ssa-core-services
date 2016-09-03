var UserDataStore = function(dhisScriptContext) {
    this.dhisScriptContext = dhisScriptContext;
    if (!dhisScriptContext instanceof Java.type("org.hisp.dhis.scriptlibrary.ExecutionContextSE")) {
	throw new Error("Invalid dhisScriptContext");
    }

    this.appContext = dhisScriptContext.getApplicationContext();
    if (! (this.appContext instanceof Java.type("org.springframework.context.ApplicationContext")) || this.appContext == null) {
	throw new Error("Invalid application context in dhisScriptContext");
    }
    this.keyJsonValueService =  this.appContext.applicationContext.getBean(Java.type("org.hisp.dhis.keyjsonvalue.KeyJsonValueService"));
    this.nodeService = this.appContext.applicationContext.getBean(Java.type("org.hisp.dhis.node.NodeService"));
    this.appManager = this.appContext.applicationContext.getBean(Java.type("org.hisp.dhis.appmanager"));
    this.renderService = this.appContext.applicationContext.getBean(Java.type("org.hisp.dhis.render.RenderService"));
}

UserDataStore.protoytype.hasAccess= function( namespace ) 
{
    var app = this.appManager.getAppByNamespace( namespace );
    return this.appManager.isAccessible( app );
}


UserDataStore.prototype.displayNode = function(node,format) {
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

}



UserDataStore.prototype.getNamespaces = function(format) {
    var namespaces = this.keyJsonValueService.getNamespaces();    	
    if (!namespaces instanceof Java.type("org.hisp.dhis.keyjsonvalue.KeyJsonValue")) {
	throw new ErrorDHIS("Invalid result");
    }
    return this.display(namespaces,format);
}



UserDataStore.prototype.getKeysInNamespaces = function(namespace,format) {
    if ( !this.keyJsonValueService.getNamespaces().contains( namespace ) )  {
        throw new Error("The namespace '" + namespace + "' was not found."  );
    }
    return this.display(this.keyJsonValueService.getKeysInNamespace( namespace ),format);
}

UserDataStore.prototype.deleteNamespace = function(namespace) {
    if ( !thishasAccess( namespace ) )   {
        throw new Error(  "The namespace '" + namespace +  "' is protected, and you don't have the right authority to access it."  );
    }
    if ( !this.keyJsonValueService.getNamespaces().contains( namespace ) ) {
        throw new Error( "The namespace '" + namespace + "' was not found." );
    }
    this.keyJsonValueService.deleteNamespace( namespace );
    return true;
}
UserDataStore.prototype.getKeyJsonValue = function(namespace, key,format) {
    if ( !this.hasAccess( namespace ) ) {
        throw new Error( "The namespace '" + namespace + "' is protected, and you don't have the right authority to access it." );
    }
    keyJsonValue = this.keyJsonValueService.getKeyJsonValue( namespace, key );
    if ( keyJsonValue == null )
    {
        throw new Error( "The key '" + key + "' was not found in the namespace '" + namespace + "'."  );
    }
    return this.display(keyJsonValue.getValue(),format);

}
UserDataStore.prototype.getKeyJsonValueMetaData = function(namespace, key,format) {
    if ( !this.hasAccess( namespace ) ) {
        throw new Error( "The namespace '" + namespace + "' is protected, and you don't have the right authority to access it." );
    }
    keyJsonValue = this.keyJsonValueService.getKeyJsonValue( namespace, key );
    if ( keyJsonValue == null )
    {
        throw new Error( "The key '" + key + "' was not found in the namespace '" + namespace + "'."  );
    }
    metaDataValue = new this.KeyJsonValue();
    BeanUtils = Java.type("org.apache.commons.beanutils.BeanUtils");
    BeanUtils.copyProperties( metaDataValue, keyJsonValue );
    metaDataValue.setValue( null );    
    return this.display(metaDataValue,format);
}

UserDataStore.prototype.addKeyJsonValue = function(namespace, key,body,encrypt) {
    if ( this.keyJsonValueService.getKeyJsonValue( namespace, key ) != null ) {
        throw new Error( "The key '" + key + "' already exists on the namespace '" + namespace + "'." );
    }
    if ( !this.renderService.isValidJson( body ) ){
        throw new Errpr( "The data is not valid JSON." ) ;
    }
    keyJsonValue = new KeyJsonValue();
    keyJsonValue.setKey( key );
    keyJsonValue.setNamespace( namespace );
    keyJsonValue.setValue( body );
    keyJsonValue.setEncrypted( encrypt );
    this.keyJsonValueService.addKeyJsonValue( keyJsonValue );
    return true;
}
UserDataStore.prototype.updateKeyJsonValue = function(namespace, key,body) {
    if ( this.keyJsonValueService.getKeyJsonValue( namespace, key ) != null ) {
        throw new Error( "The key '" + key + "' already exists on the namespace '" + namespace + "'." );
    }
    keyJsonValue = keyJsonValueService.getKeyJsonValue( namespace, key );
    if ( keyJsonValue == null ) {
	throw new Error( "The key '" + key + "' was not found in the namespace '" + namespace + "'." ) ;
    }
    if ( !this.renderService.isValidJson( body ) ){
        throw new Errpr( "The data is not valid JSON." ) ;
    }
    keyJsonValue.setValue( body );
    keyJsonValueService.updateKeyJsonValue( keyJsonValue );
    return true;

}
UserDataStore.prototype.deleteKeyJsonValue = function(namespace, key) {
    if ( this.keyJsonValueService.getKeyJsonValue( namespace, key ) != null ) {
        throw new Error( "The key '" + key + "' already exists on the namespace '" + namespace + "'." );
    }
    keyJsonValue = keyJsonValueService.getKeyJsonValue( namespace, key );
    if ( keyJsonValue == null ) {
	throw new Error( "The key '" + key + "' was not found in the namespace '" + namespace + "'." ) ;
    }
    keyJsonValueService.deleteKeyJsonValue( keyJsonValue );
    return true;
}


UserDataStore.prototype.getData = function(format) {
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