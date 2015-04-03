var pagination = namespace('com.pronet.pagination');

pagination.BootStrap = Class({
    constructor : function(element,options){
        this.elem = element;
        this.currentPage = options.currentPage;
        this.pages = options.pages;
        this.onclick = options.onPageClicked;
        this._init(element);
    },
    paginate: function(){
        this.elem.css('display',"");//enable display
    },
    _init:function(){
        this.headerPagination = '<li> <a href="#" aria-label="Previous"> <span aria-hidden="true">&laquo;</span> </a> </li>';
        this.footerPagination ='<li> <a href="#" aria-label="Next"> <span aria-hidden="true">&raquo;</span> </a> </li></ul>';
        this.elem.append(this.headerPagination);

        for(var i=1;i<=this.pages;i++){
        var paginationElement = '<li><a href="#" onclick="paginator.onclick(this)">'+i+'</a></li>'
        this.elem.append(paginationElement);
        }
        this.elem.append(this.footerPagination);
    },
    onclick:function(elem){
    }
}).create();
