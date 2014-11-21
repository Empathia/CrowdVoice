Class(CV, 'BackstoryRegistry')({
    _instance : null,
    _data : null,

    getInstance : function getInstance(attrs) {
        CV.BackstoryRegistry._instance = CV.BackstoryRegistry._instance || (new CV.BackstoryRegistry(attrs));

        return CV.BackstoryRegistry._instance;
    },

    prototype : {
        init : function init(config) {
            Object.keys(config || {}).forEach(function(propertyName) {
                this[propertyName] = config[propertyName];
            }, this);
        },

        set : function set(data) {
            this._data = data;
        },

        get : function get() {
            return this._data;
        }
    }
});
