// How to use - https://bitbucket.org/anshulbajpai/class/wiki/Home
// Source - https://bitbucket.org/anshulbajpai/class/raw/d85ab933ba2b/class.js
// Feel free to modify this code according to your changes.

var Class = function(body){
	return new _Class(body);
};

var _Class = function(body){
	this.constructor = body.constructor;
	delete body.constructor;
	this.body = body;
};

_Class.prototype.extend = function(extendClass){
	if(this.extendClass){
		throw new Exception("A class can only extends once!!");
	}
	this.extendClass = extendClass;
	return this;
};

_Class.prototype.implement = function(implementInterface){
	implementInterface.validate(this.body);
	return this;
},

_Class.prototype.create = function(){
	var that = this;	
	var klass = function(){
		that.constructor && that.constructor.apply(this, arguments);
		this.base = null;
	};	
	
	if(that.extendClass)
	{
		klass.prototype = that.extendClass.prototype;
		klass.prototype.constructor = klass;
		for(var aMethod in this.body){
			klass.prototype[aMethod] = this.body[aMethod];
		}
	}
	else
		klass.prototype = this.body;
	klass.prototype.base = function(){
		that.extendClass && that.extendClass.apply(this, arguments);
	};
	return klass;	
};

var Interface = function(interfaceBody){
	return new _Interface(interfaceBody);
};

var _Interface = Class({
	constructor : function(interfaceBody){
		this.interfaceBody = interfaceBody;
	},
	validate : function(classBody){
		var errorMessages = [];
		for(var interfaceMethod in this.interfaceBody){
			if(!classBody[interfaceMethod])
				errorMessages.push("This class should implement " + interfaceMethod);
		}
		if(errorMessages.length > 0)
			throw new Exception(errorMessages.join("/n"));
		}
}).create();

var Exception = function( errorMessage){
	this.errorMessage = errorMessage;
};

function namespace(namespaceString){
	var parts = namespaceString.split('.'),
			parent = window,
			currentPart = '';
	for(var i = 0, length = parts.length; i < length; i++) {
		currentPart = parts[i];
		parent[currentPart] = parent[currentPart] || {};
		parent = parent[currentPart];
	}
    return parent;
};
